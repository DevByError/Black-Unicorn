import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { nav, plainNav } from '@/content/nav';

export function Header() {
  return (
    <header id="site-header" className="site-header" data-state="top">
      <div className="site-header__bar container container--wide">
        <Logo />
        <nav aria-label="Primary" className="site-header__nav">
          <ul>
            {nav.map((n) => (<li key={n.id}><Link href={n.href}>{n.label}</Link></li>))}
            {plainNav.map((n) => (<li key={n.href}><Link href={n.href}>{n.label}</Link></li>))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
