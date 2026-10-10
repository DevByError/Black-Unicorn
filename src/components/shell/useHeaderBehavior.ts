'use client';
import { useEffect } from 'react';
import { isMotionReduced } from '@/lib/useReducedMotion';

type HeaderState = 'top' | 'solid' | 'hidden';
const SOLID_AT = 80; // px scrolled before the header gets a solid background
const HIDE_AFTER = 400; // px scrolled before scrolling down hides it
const DELTA = 6; // ignore sub-6px jitter

/**
 * Header scroll state machine (Part 15.2 / A.2) plus the logo's scroll-progress ring.
 * Writes data-state straight to the element: no React re-render per scroll frame.
 * The header never hides while focus is inside it, while hovered, or while a menu is open.
 */
export function useHeaderBehavior(headerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const root = document.documentElement;
    const ring = el.querySelector<SVGCircleElement>('.logo-progress');
    let last = window.scrollY;
    let ticking = false;
    let state: HeaderState = 'top';

    const set = (s: HeaderState) => {
      if (s !== state) {
        state = s;
        el.dataset.state = s;
      }
    };
    const mustStayVisible = () => el.contains(document.activeElement) || el.matches(':hover') || root.hasAttribute('data-menu-open');

    const paint = () => {
      const y = window.scrollY;
      const dy = y - last;
      if (y < SOLID_AT) set('top');
      else if (Math.abs(dy) > DELTA) {
        if (dy > 0 && y > HIDE_AFTER && !mustStayVisible()) set('hidden');
        else if (dy < 0) set('solid');
        else if (state === 'top') set('solid');
      } else if (state === 'top') set('solid');
      last = y;
      if (ring) {
        const max = root.scrollHeight - window.innerHeight;
        const p = isMotionReduced() || max <= 0 ? 0 : Math.min(1, y / max);
        ring.style.strokeDashoffset = String(1 - p);
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(paint);
      }
    };
    const reveal = () => set(window.scrollY < SOLID_AT ? 'top' : 'solid');
    window.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('focusin', reveal);
    paint();
    return () => {
      window.removeEventListener('scroll', onScroll);
      el.removeEventListener('focusin', reveal);
    };
  }, [headerRef]);
}
