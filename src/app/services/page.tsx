import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { PageHead } from '@/components/ui/PageHead';
import { services } from '@/content/services';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Services', description: 'What BlackUnicorn builds: web engineering, mobile apps, AI integration, automation and product design.', path: '/services' });

export default function ServicesPage() {
  return (
    <>
      <PageHead eyebrow="Services" title="What we do" lead="Five service lines. Each one ends in working software, not a slide deck." />
      <div className="container services">
        {services.map((s, i) => (
          <section key={s.id} id={s.id} className="service" aria-labelledby={`${s.id}-h`} data-reveal>
            <span className="mono service__num">{String(i + 1).padStart(2, '0')}</span>
            <div className="service__main">
              <h2 id={`${s.id}-h`} className="h3">{s.name}{SHOW_PLACEHOLDER_BADGE && s.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</h2>
              <p className="lead">{s.summary}</p>
            </div>
            <ul className="service__bullets">{s.bullets.map((b) => (<li key={b}>{b}</li>))}</ul>
          </section>
        ))}
        <p><Link href="/contact" className="btn btn--primary">Start a project<Icon name="arrow-right" className="icon btn__arrow" /></Link></p>
      </div>
    </>
  );
}
