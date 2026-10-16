import Link from 'next/link';
import { PageHead } from '@/components/ui/PageHead';
import { ProcessTabs } from '@/components/sections/ProcessTabs';
import { StackDirectory } from '@/components/sections/StackDirectory';
import { TeamCard } from '@/components/sections/TeamPreview';
import { process } from '@/content/process';
import { stack } from '@/content/stack';
import { studio } from '@/content/studio';
import { team } from '@/content/team';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Studio', description: 'Who BlackUnicorn is, what we value, who is on the team, how we work and what we build with.', path: '/studio' });

export default function StudioPage() {
  return (
    <>
      <PageHead eyebrow={studio.eyebrow} title={studio.title} lead={studio.lead} />
      <section className="container story section--tight" aria-labelledby="story-h">
        <h2 id="story-h" className="h3">Story</h2>
        <div className="story__cols">
          <div className="prose">{studio.story.map((t) => (<p key={t}>{t}</p>))}</div>
          <blockquote className="pull font-display">{studio.pullQuote}</blockquote>
        </div>
      </section>
      <section className="container section--tight" aria-labelledby="values-h">
        <h2 id="values-h" className="h3">Values</h2>
        <ol className="values">
          {studio.values.map((v, i) => (
            <li key={v.title}><span className="mono values__n">{String(i + 1).padStart(2, '0')}</span><div><h3 className="h4">{v.title}</h3><p className="muted">{v.body}</p></div></li>
          ))}
        </ol>
      </section>
      <section id="team" className="container section--tight" aria-labelledby="team-h">
        <h2 id="team-h" className="h2">Team</h2>
        <div className="team">{team.map((m) => (<TeamCard key={m.id} m={m} />))}</div>
      </section>
      <ProcessTabs stages={process} />
      <div className="container section--tight"><StackDirectory items={stack} standalone /></div>
      <section className="container section--tight closing" aria-labelledby="close-h">
        <h2 id="close-h" className="h2">Want to build something?</h2>
        <p className="lead">Tell us what you are trying to make.</p>
        <p><Link href="/contact" className="btn btn--primary">Start a project</Link></p>
      </section>
    </>
  );
}
