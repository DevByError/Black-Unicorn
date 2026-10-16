import Link from 'next/link';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import type { TeamMember } from '@/types/content';

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** Team card. Photos are plain grayscale with a solid border (no duotone: that is a gradient map); flat initials ring when absent. */
export function TeamCard({ m }: { m: TeamMember }) {
  return (
    <article className="member" data-reveal>
      {m.photo?.src ? (
        <img className="member__photo" src={m.photo.src} alt={m.photo.alt} width={m.photo.width} height={m.photo.height} loading="lazy" decoding="async" />
      ) : (
        <span className="member__ring font-display" aria-hidden="true">{initials(m.name)}</span>
      )}
      <h3 className="h4">{m.name}{SHOW_PLACEHOLDER_BADGE && m.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</h3>
      <p className="eyebrow">{m.role}</p>
      <p className="muted">{m.bio}</p>
      {m.interest && <p className="member__interest muted">Currently interested in: {m.interest}</p>}
    </article>
  );
}

export function TeamPreview({ team }: { team: TeamMember[] }) {
  return (
    <section id="team" className="section container defer-render" aria-labelledby="team-h">
      <div className="sec-head sec-head--row">
        <div><p className="sec-head__tag mono" data-reveal><span>06</span> team</p><h2 id="team-h" className="h2" data-reveal data-reveal-index={1}>The people behind the commits</h2></div>
        <Link href="/studio#team" className="btn btn--secondary">Meet the team</Link>
      </div>
      <div className="team">{team.slice(0, 4).map((m) => (<TeamCard key={m.id} m={m} />))}</div>
    </section>
  );
}
