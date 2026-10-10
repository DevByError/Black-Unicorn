import { Suspense } from 'react';
import { PageHead } from '@/components/ui/PageHead';
import { ProjectCard } from '@/components/work/ProjectCard';
import { WorkIndex } from '@/components/work/WorkIndex';
import { projects } from '@/content/projects';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Work', description: 'Selected BlackUnicorn projects across web, mobile, AI, games, automation and design.', path: '/work' });

export default function WorkPage() {
  return (
    <>
      <PageHead eyebrow="Work" title="Selected work" lead="Projects we have built, with the problem, the approach and the outcome." />
      {/* The fallback is the full, unfiltered list so the static HTML (and no-JS visitors) always get every project. */}
      <Suspense fallback={<div className="container work"><ul className="work-grid">{projects.map((p, i) => (<li key={p.slug} className="work-grid__item"><ProjectCard project={p} index={i} /></li>))}</ul></div>}>
        <WorkIndex projects={projects} />
      </Suspense>
    </>
  );
}
