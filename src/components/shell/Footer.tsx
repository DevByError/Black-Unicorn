import Link from 'next/link';
import { StackedLockup } from '@/components/brand/StackedLockup';
import { LogoMark } from '@/components/brand/LogoMark';
import { nav } from '@/content/nav';
import { site } from '@/content/site';
import { BackToTop } from './BackToTop';
import { CookieSettings } from './Consent';
import { MotionToggle } from './MotionToggle';

const YEAR = new Date().getFullYear(); // evaluated at build time

export function Footer() {
  const work = nav.find((n) => n.id === 'work')?.links ?? [];
  const services = nav.find((n) => n.id === 'services')?.links ?? [];
  const studio = nav.find((n) => n.id === 'studio')?.links ?? [];
  return (
    <footer className="site-footer">
      <LogoMark variant="simple" className="footer__pattern footer__pattern--l" />
      <LogoMark variant="simple" className="footer__pattern footer__pattern--r" />
      <div className="container container--wide footer__top">
        <div className="footer__brand">
          <Link href="/" aria-label="BlackUnicorn home"><StackedLockup /></Link>
          <p className="lead">{site.tagline}</p>
        </div>
        <div className="footer__cols">
          <nav aria-label="Footer: Work"><h2 className="eyebrow">Work</h2><ul>{work.map((l) => (<li key={l.href}><Link href={l.href}>{l.label}</Link></li>))}</ul></nav>
          <nav aria-label="Footer: Services"><h2 className="eyebrow">Services</h2><ul>{services.map((l) => (<li key={l.href}><Link href={l.href}>{l.label}</Link></li>))}</ul></nav>
          <nav aria-label="Footer: Studio"><h2 className="eyebrow">Studio</h2><ul>{studio.map((l) => (<li key={l.href}><Link href={l.href}>{l.label}</Link></li>))}<li><Link href="/notes">Notes</Link></li></ul></nav>
          <nav aria-label="Footer: Contact">
            <h2 className="eyebrow">Contact</h2>
            <ul>
              <li><Link href="/contact">Start a project</Link></li>
              {site.email && <li><a href={`mailto:${site.email}`}>{site.email}</a></li>}
              {site.socials.map((s) => (<li key={s.href}><a href={s.href} rel="noopener noreferrer">{s.label}</a></li>))}
            </ul>
          </nav>
        </div>
        <BackToTop inline />
      </div>
      <div className="seam-h" aria-hidden="true" />
      <div className="container container--wide footer__bottom">
        <p className="muted">© {YEAR} BlackUnicorn. All rights reserved.</p>
        <ul className="footer__legal">
          <li><Link href="/privacy">Privacy</Link></li>
          <li><Link href="/accessibility">Accessibility</Link></li>
          <li><CookieSettings /></li>
          <li><MotionToggle /></li>
        </ul>
      </div>
      <BackToTop />
    </footer>
  );
}
