'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * On every client-side route change: announce the new title politely and move focus to the page <h1>
 * (tabindex -1), so keyboard and screen-reader users land at the top of the new content (Part 16.7).
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const h1 = document.querySelector<HTMLElement>('main h1');
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    const live = document.getElementById('live-region');
    if (live) live.textContent = document.title;
  }, [pathname]);
  return null;
}
