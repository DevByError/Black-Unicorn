import Link from 'next/link';
import { ContactForm } from '@/components/sections/ContactForm';
import { PageHead } from '@/components/ui/PageHead';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Contact', description: 'Start a project with BlackUnicorn. Tell us what you are trying to build.', path: '/contact' });

export default function ContactPage() {
  return (
    <>
      <PageHead eyebrow="Contact" title="Start a project" lead="Tell us what you are trying to build. We reply with honest next steps." />
      <div className="container contact">
        <aside className="contact__info" aria-label="Contact details">
          <dl className="meta meta--stack">
            {site.email && <div><dt>Email</dt><dd><a className="link-inline" href={`mailto:${site.email}`}>{site.email}</a></dd></div>}
            {site.location && <div><dt>Location</dt><dd>{site.location}</dd></div>}
            {site.responseTime && <div><dt>Reply time</dt><dd>{site.responseTime}</dd></div>}
          </dl>
          {site.socials.length > 0 && (<ul className="chip-row">{site.socials.map((s) => (<li key={s.href}><a className="chip" href={s.href} rel="noopener noreferrer">{s.label}</a></li>))}</ul>)}
          <p className="muted">Not ready to write? Look at the <Link className="link-inline" href="/work">work</Link> first.</p>
        </aside>
        <div className="contact__form"><ContactForm variant="full" /></div>
      </div>
    </>
  );
}
