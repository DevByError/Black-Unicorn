import { PageHead } from '@/components/ui/PageHead';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Privacy', description: 'Exactly what the BlackUnicorn website stores and what the contact form sends.', path: '/privacy' });

const KEYS: [string, string, string][] = [
  ['bu:theme', 'Your light or dark theme choice.', 'Until you clear site data'],
  ['bu:motion', 'Whether you chose to reduce or allow motion.', 'Until you clear site data'],
  ['bu:consent', 'Your analytics choice. Only created if analytics is ever switched on.', '12 months'],
];

export default function PrivacyPage() {
  const analytics = site.analytics.provider !== 'none';
  return (
    <>
      <PageHead eyebrow="Legal" title="Privacy statement" lead="Plain language, accurate to what this site actually does." />
      <div className="container prose legal">
        <h2 className="h3">Analytics</h2>
        <p>{analytics ? `This site can measure visits with ${site.analytics.provider}, but only after you say yes. Nothing is shared with advertisers.` : 'This site uses no analytics. It does not track you, set advertising cookies or load third-party scripts.'}</p>
        <h2 className="h3">What the site stores on your device</h2>
        <p>These are first-party, non-identifying settings. They never leave your browser.</p>
        <div className="table-wrap"><table>
          <caption className="visually-hidden">Items stored by this site</caption>
          <thead><tr><th scope="col">Key</th><th scope="col">Purpose</th><th scope="col">Kept</th></tr></thead>
          <tbody>{KEYS.map(([k, p, t]) => (<tr key={k}><th scope="row"><code>{k}</code></th><td>{p}</td><td>{t}</td></tr>))}</tbody>
        </table></div>
        <h2 className="h3">The contact form</h2>
        <p>If you send the form, your name, email address, optional company, project type, budget range and message are sent to the form service BlackUnicorn configures, or opened in your email app if none is configured. Retention period: [to be confirmed].</p>
        <h2 className="h3">Your rights and requests</h2>
        <p>You can ask what we hold about you, ask us to correct or delete it, or withdraw consent at any time. We follow the principles of purpose limitation and data minimisation, consistent with Malaysia&apos;s PDPA and GDPR.{' '}
          {site.email ? <>Write to <a className="link-inline" href={`mailto:${site.email}`}>{site.email}</a>.</> : <>Contact point: [to be confirmed].</>}</p>
      </div>
    </>
  );
}
