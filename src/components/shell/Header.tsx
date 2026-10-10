'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Icon } from '@/components/ui/Icon';
import { nav, plainNav } from '@/content/nav';
import { MegaPanel } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderBehavior } from './useHeaderBehavior';

const HOVER_INTENT_MS = 120;
const CLOSE_GRACE_MS = 180;

/**
 * Site header. Accessibility contract: <nav aria-label="Primary">; Work/Services/Studio are disclosure buttons
 * (aria-expanded + aria-controls), not role=menu. Hover opens only for fine pointers; click/Enter/Space always work.
 * Escape closes and returns focus to the trigger. The scroll state never hides the header while focus is inside it.
 */
export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const timer = useRef<number>(0);
  const leavePoint = useRef<{ x: number; y: number } | null>(null);

  useHeaderBehavior(headerRef);

  const close = useCallback((returnFocus = false) => {
    window.clearTimeout(timer.current);
    setOpen((cur) => {
      if (cur && returnFocus) triggers.current[cur]?.focus();
      return null;
    });
  }, []);

  useEffect(() => close(), [pathname, close]); // route change closes menus
  useEffect(() => {
    document.documentElement.toggleAttribute('data-menu-open', open !== null || mobile);
  }, [open, mobile]);

  // Global shortcuts: "/" and Cmd/Ctrl+K open search, never while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.matches('input, textarea, select') || t.isContentEditable);
      if (e.key === 'Escape' && open) { e.preventDefault(); close(true); return; }
      if (typing) return;
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); setSearch(true); }
    };
    const onDown = (e: PointerEvent) => {
      if (open && !headerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    document.documentElement.dataset.ready = 'true'; // interaction handlers are attached (used by tests)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open, close]);

  // Safe triangle: while the pointer travels from a trigger toward the open panel, keep the panel open.
  const onBarMove = (e: React.PointerEvent) => {
    if (open === null || e.pointerType !== 'mouse' || !leavePoint.current) return;
    const panel = document.getElementById(`menu-${open}`);
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const a = leavePoint.current;
    const inTri = pointInTriangle({ x: e.clientX, y: e.clientY }, a, { x: r.left, y: r.top }, { x: r.right, y: r.top });
    if (inTri) window.clearTimeout(timer.current);
  };

  const hoverOpen = (id: string, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(id), open ? 0 : HOVER_INTENT_MS);
  };
  const hoverLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    leavePoint.current = { x: e.clientX, y: e.clientY };
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => close(), CLOSE_GRACE_MS);
  };
  const holdOpen = () => window.clearTimeout(timer.current);

  const onTriggerKey = (e: React.KeyboardEvent, i: number) => {
    const ids = nav.map((n) => n.id);
    const move = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? ids.length - 1 : null;
    if (move === null) return;
    e.preventDefault();
    const id = ids[(move + ids.length) % ids.length];
    if (id) triggers.current[id]?.focus();
  };

  return (
    <>
      <header ref={headerRef} id="site-header" className="site-header" data-state="top">
        <div className="site-header__bar container container--wide" onPointerMove={onBarMove}>
          <Logo />
          <nav aria-label="Primary" className="site-header__nav">
            <ul>
              {nav.map((n, i) => (
                <li key={n.id} onPointerEnter={(e) => hoverOpen(n.id, e)} onPointerLeave={hoverLeave}>
                  <button
                    ref={(el) => { triggers.current[n.id] = el; }}
                    type="button" className="nav-trigger" aria-expanded={open === n.id} aria-controls={`menu-${n.id}`} aria-haspopup="true"
                    aria-current={pathname.startsWith(n.href) ? 'page' : undefined}
                    onClick={() => setOpen(open === n.id ? null : n.id)} onKeyDown={(e) => onTriggerKey(e, i)}
                    data-track={`nav.${n.id}`}
                  >
                    {n.label}
                    <Icon name="chevron" className="icon nav-trigger__chev" />
                  </button>
                </li>
              ))}
              <li><Link href="/notes" className="nav-link" aria-current={pathname.startsWith('/notes') ? 'page' : undefined}>Notes</Link></li>
            </ul>
          </nav>
          <div className="site-header__utils">
            <button type="button" className="icon-btn" onClick={() => setSearch(true)} aria-keyshortcuts="/ Control+K Meta+K" data-track="shell.search">
              <Icon name="search" /><span className="visually-hidden">Search</span>
            </button>
            <ThemeToggle />
            <Link href={plainNav[1].href} className="btn btn--primary site-header__cta" data-track="shell.contact">Contact</Link>
            <button type="button" className="icon-btn site-header__burger" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobile(true)}>
              <Icon name="menu" /><span className="visually-hidden">Menu</span>
            </button>
          </div>
        </div>
        {nav.map((n) => (
          <div
            key={n.id} id={`menu-${n.id}`} role="group" aria-label={n.label} className="mega" hidden={open !== n.id}
            onPointerEnter={holdOpen} onPointerLeave={hoverLeave}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget) && !headerRef.current?.contains(e.relatedTarget)) close(); }}
          >
            <MegaPanel panel={n} onNavigate={() => close()} />
          </div>
        ))}
      </header>
      {open !== null && <div className="mega-scrim" onClick={() => close()} aria-hidden="true" />}
      <MobileMenu open={mobile} onClose={() => setMobile(false)} onSearch={() => { setMobile(false); setSearch(true); }} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}

type P = { x: number; y: number };
function pointInTriangle(p: P, a: P, b: P, c: P): boolean {
  const s = (p1: P, p2: P, p3: P) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const d1 = s(p, a, b), d2 = s(p, b, c), d3 = s(p, c, a);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}
