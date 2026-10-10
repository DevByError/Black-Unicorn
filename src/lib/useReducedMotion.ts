'use client';
import { useEffect, useState } from 'react';
import { readLocal } from './storage';

/** True when the OS asks for reduced motion, unless the visitor chose "Full" with the footer toggle (or vice versa). */
export function isMotionReduced(): boolean {
  const override = readLocal('bu:motion');
  if (override === 'reduce') return true;
  if (override === 'full') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(isMotionReduced());
    read();
    mq.addEventListener('change', read);
    window.addEventListener('storage', read);
    document.addEventListener('bu:motion', read);
    return () => {
      mq.removeEventListener('change', read);
      window.removeEventListener('storage', read);
      document.removeEventListener('bu:motion', read);
    };
  }, []);
  return reduced;
}
