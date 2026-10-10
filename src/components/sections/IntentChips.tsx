import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';

const CHIPS = [
  { label: 'Start a project', href: '/contact' },
  { label: 'See case studies', href: '/work' },
  { label: 'Meet the team', href: '/studio#team' },
  { label: 'Read studio notes', href: '/notes' },
];
const TILES: { label: string; href: string; icon: IconName }[] = [
  { label: 'Work', href: '/work', icon: 'layers' },
  { label: 'Services', href: '/services', icon: 'compass' },
  { label: 'Process', href: '/studio#process', icon: 'flow' },
  { label: 'Studio', href: '/studio', icon: 'users' },
  { label: 'Notes', href: '/notes', icon: 'note' },
  { label: 'Contact', href: '/contact', icon: 'mail' },
];

/** Intent chips (links, not buttons) and the six "Start here" quick-link tiles. */
export function IntentChips() {
  return (
    <section className="section section--tight container" aria-labelledby="start-here">
      <h2 id="start-here" className="visually-hidden">Start here</h2>
      <p className="intent__prompt" data-reveal><em>What would you like to do?</em></p>
      <ul className="chip-row" data-reveal data-reveal-index={1}>
        {CHIPS.map((c, i) => (<li key={c.href}><Link href={c.href} className="chip" data-track={`home.intent.${i + 1}`}>{c.label}</Link></li>))}
      </ul>
      <ul className="tiles" aria-label="Quick links">
        {TILES.map((t, i) => (
          <li key={t.href} data-reveal data-reveal-index={i}>
            <Link href={t.href} className="tile" data-track={`home.quick.${i + 1}`}>
              <span className="tile__ring"><Icon name={t.icon} /></span>
              <span className="tile__label">{t.label}</span>
              <Icon name="arrow-right" className="icon tile__arrow" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
