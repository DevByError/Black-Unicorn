import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import { isRecent } from '@/lib/format';
import { labelFor } from '@/content/projects';
import type { Project } from '@/types/content';
import { ProjectThumb } from './ProjectThumb';
import { CardExpander } from './CardExpander';

interface Props {
  project: Project;
  /** `portrait` = 3:4 (home rail), `landscape` = 16:10 (work grid). */
  ratio?: 'portrait' | 'landscape';
  expandable?: boolean;
  track?: string;
  index?: number;
}

/**
 * Project card. Accessibility contract: one primary link (the title) stretched over the card, so the whole card is a
 * single tab stop. The optional expander button sits above the stretched link (z-index) with its own hit area.
 */
export function ProjectCard({ project: p, ratio = 'landscape', expandable = false, track = 'work.card', index = 0 }: Props) {
  const isNew = isRecent(p.published);
  return (
    <article className={`pcard pcard--${ratio}`} data-reveal data-reveal-index={index} data-track={track}>
      <div className="pcard__media">
        <ProjectThumb project={p} wide />
        <span className="pcard__seam" aria-hidden="true" />
        {(isNew || p.featured) && (
          <span className="pcard__badges">
            {isNew && <span className="badge">New</span>}
            {p.featured && <span className="badge badge--outline">Featured</span>}
          </span>
        )}
      </div>
      <div className="pcard__body">
        <p className="eyebrow">{p.disciplines.map(labelFor).join(' / ')}</p>
        <h3 className="pcard__title h4">
          <Link href={`/work/${p.slug}`} className="pcard__link">{p.title}</Link>
          {SHOW_PLACEHOLDER_BADGE && p.placeholder && <span className="ph-badge">PLACEHOLDER</span>}
        </h3>
        <p className="pcard__summary muted">{p.summary}</p>
        {expandable && <CardExpander id={`more-${p.slug}`}>{p.challenge}</CardExpander>}
        <p className="pcard__meta">
          <span className="mono muted">{p.year}</span>
          <span className="pcard__cta">Read the case study<Icon name="arrow-right" className="icon pcard__arrow" /></span>
        </p>
      </div>
    </article>
  );
}
