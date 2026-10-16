import Link from 'next/link';
import { projects } from '@/content/projects';
import type { NavPanel } from '@/types/content';
import { ProjectThumb } from '@/components/work/ProjectThumb';

/**
 * Content of one disclosure panel. Contract: a labelled group (not role=menu), reachable by Tab, closes with
 * Escape (handled by the header). Columns are separated by the brand seam.
 */
export function MegaPanel({ panel, onNavigate }: { panel: NavPanel; onNavigate: () => void }) {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const recent = [...projects].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3);

  return (
    <div className="mega__inner container container--wide">
      <div className="mega__col" style={{ ['--i' as string]: 0 }}>
        <p className="eyebrow">{panel.id === 'work' ? 'By discipline' : panel.label}</p>
        <ul className="mega__list">
          {panel.links?.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={onNavigate} className="mega__link" data-track={`nav.${panel.id}.${l.label.toLowerCase()}`}>
                <span>
                  <span className="mega__link-title">{l.label}</span>
                  {l.description && <span className="mega__link-desc">{l.description}</span>}
                </span>
                <span className="dot-mark" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {panel.id === 'work' && featured && (
        <>
          <div className="seam-v mega__seam" aria-hidden="true" />
          <div className="mega__col" style={{ ['--i' as string]: 1 }}>
            <p className="eyebrow">Recent projects</p>
            <ul className="mega__recent">
              {recent.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} onClick={onNavigate} className="mega__recent-link">
                    <ProjectThumb project={p} size={44} />
                    <span>{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="seam-v mega__seam" aria-hidden="true" />
          <div className="mega__col mega__feature" style={{ ['--i' as string]: 2 }}>
            <p className="eyebrow">Featured</p>
            <Link href={`/work/${featured.slug}`} onClick={onNavigate} className="mega__feature-card">
              <ProjectThumb project={featured} size={160} wide />
              <span className="h4">{featured.title}</span>
              <span className="muted">{featured.summary}</span>
            </Link>
          </div>
        </>
      )}
      {panel.quote && (
        <>
          <div className="seam-v mega__seam" aria-hidden="true" />
          <figure className="mega__col mega__quote" style={{ ['--i' as string]: 1 }}>
            <blockquote className="h3">{panel.quote}</blockquote>
          </figure>
        </>
      )}
    </div>
  );
}
