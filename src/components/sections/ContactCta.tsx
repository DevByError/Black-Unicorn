import Link from 'next/link';
import { site } from '@/content/site';
import { ContactForm } from './ContactForm';

/** Closing band: flat solid colour (accent in dark theme, ink with gold text in light). Compact form + link to /contact. */
export function ContactCta() {
  return (
    <section id="contact" className="cta defer-render" aria-labelledby="cta-h">
      <div className="container cta__inner">
        <div className="cta__copy">
          <h2 id="cta-h" className="h2" data-reveal>Have a project in mind?</h2>
          <p className="lead" data-reveal data-reveal-index={1}>Tell us what you are trying to build. We reply with honest next steps.</p>
          <p className="cta__links" data-reveal data-reveal-index={2}>
            <Link href="/contact" className="cta__link">Open the full form</Link>
            {site.email && <> · <a className="cta__link" href={`mailto:${site.email}`}>{site.email}</a></>}
          </p>
        </div>
        <div className="cta__form" data-reveal data-reveal-index={1}><ContactForm variant="compact" /></div>
      </div>
    </section>
  );
}
