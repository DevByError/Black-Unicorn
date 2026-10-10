'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/brand/LogoMark';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { nav } from '@/content/nav';
import { site } from '@/content/site';
import { ThemeToggle } from './ThemeToggle';

/**
 * Full-screen menu dialog below 1024px. Native <dialog>: focus trapped, background inert, Escape closes.
 * Primary links are Cinzel; Work/Services/Studio expand to their sub-links (accordion).
 */
export function MobileMenu({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => onClose(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- close on route change only

  return (
    <Dialog open={open} onClose={onClose} label="Menu" className="mobile-menu">
      <div id="mobile-menu" className="mobile-menu__inner">
        <div className="mobile-menu__top">
          <span className="eyebrow">Menu</span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu"><Icon name="close" /></button>
        </div>
        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {nav.map((n) => (
              <li key={n.id}>
                <button type="button" className="mobile-menu__item h3" aria-expanded={expanded === n.id} aria-controls={`mm-${n.id}`}
                  onClick={() => setExpanded(expanded === n.id ? null : n.id)}>
                  {n.label}<Icon name="chevron" />
                </button>
                <div id={`mm-${n.id}`} className="accordion__panel" data-open={expanded === n.id}>
                  <ul className="accordion__inner mobile-menu__sub">
                    {n.links?.map((l) => (
                      <li key={l.href}><Link href={l.href} onClick={onClose} tabIndex={expanded === n.id ? 0 : -1}>{l.label}</Link></li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li><Link href="/notes" className="mobile-menu__item h3" onClick={onClose}>Notes</Link></li>
            <li><Link href="/contact" className="mobile-menu__item h3" onClick={onClose}>Contact</Link></li>
          </ul>
        </nav>
        <div className="mobile-menu__utils">
          <button type="button" className="btn btn--secondary" onClick={onSearch}><Icon name="search" />Search</button>
          <ThemeToggle />
        </div>
        {site.socials.length > 0 && (
          <ul className="mobile-menu__social">
            {site.socials.map((s) => (<li key={s.href}><a href={s.href} rel="noopener noreferrer">{s.label}</a></li>))}
          </ul>
        )}
        <LogoMark variant="simple" className="mobile-menu__pattern" />
      </div>
    </Dialog>
  );
}
