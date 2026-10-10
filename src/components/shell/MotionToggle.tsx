'use client';
import { useEffect, useState } from 'react';
import { readLocal, writeLocal } from '@/lib/storage';

/** Footer toggle that overrides the OS motion setting and persists (Part 12.4). `aria-pressed` = motion reduced. */
export function MotionToggle() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const o = readLocal('bu:motion');
    setReduced(o === 'reduce' || (o !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches));
  }, []);
  const toggle = () => {
    const next = reduced ? 'full' : 'reduce';
    writeLocal('bu:motion', next);
    const root = document.documentElement;
    root.setAttribute('data-motion', next);
    root.classList.toggle('js-reduced', next === 'reduce');
    root.classList.toggle('js-motion', next === 'full');
    document.dispatchEvent(new CustomEvent('bu:motion'));
    setReduced(!reduced);
  };
  return (
    <button type="button" className="footer__btn" aria-pressed={reduced} onClick={toggle}>
      Reduce motion
    </button>
  );
}
