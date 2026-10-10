'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { isMotionReduced } from '@/lib/useReducedMotion';

const SHOW_AFTER_VIEWPORTS = 1.5;

/** 48px circular button whose outline fills with scroll progress. Moves focus to #main after scrolling. */
export function BackToTop({ inline = false }: { inline?: boolean }) {
  const [show, setShow] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  useEffect(() => {
    let tick = false;
    const paint = () => {
      const y = window.scrollY;
      setShow(inline || y > window.innerHeight * SHOW_AFTER_VIEWPORTS);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - (max > 0 ? Math.min(1, y / max) : 0));
      tick = false;
    };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', on, { passive: true });
    paint();
    return () => window.removeEventListener('scroll', on);
  }, [inline]);

  const go = () => {
    window.scrollTo({ top: 0, behavior: isMotionReduced() ? 'auto' : 'smooth' });
    (document.getElementById('main') as HTMLElement | null)?.focus({ preventScroll: true });
  };
  if (!show) return null;
  return (
    <button type="button" className={`back-to-top ${inline ? 'back-to-top--inline' : ''}`} onClick={go}>
      <svg viewBox="0 0 48 48" aria-hidden="true" className="back-to-top__ring">
        <circle cx="24" cy="24" r="22" pathLength={1} ref={ring} />
      </svg>
      <Icon name="arrow-up" />
      <span className="visually-hidden">Back to top</span>
    </button>
  );
}
