import Link from 'next/link';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import type { Service } from '@/types/content';

/** Small animated drawings, one per capability. Pure SVG + CSS, decorative, still when motion is reduced. */
function Art({ id }: { id: string }) {
  const common = { viewBox: '0 0 200 110', 'aria-hidden': true, focusable: false, className: 'cap__svg' } as const;
  switch (id) {
    case 'web-engineering':
      return (
        <svg {...common}>
          <rect x="14" y="10" width="172" height="90" rx="6" className="cap-s" />
          <line x1="14" y1="28" x2="186" y2="28" className="cap-s" />
          <circle cx="26" cy="19" r="3" className="cap-f" /><circle cx="37" cy="19" r="3" className="cap-f cap-f--dim" /><circle cx="48" cy="19" r="3" className="cap-f cap-f--dim" />
          <rect x="26" y="40" width="70" height="8" className="cap-f cap-bar" style={{ '--d': '0s' } as React.CSSProperties} />
          <rect x="26" y="56" width="120" height="6" className="cap-f cap-f--dim cap-bar" style={{ '--d': '.25s' } as React.CSSProperties} />
          <rect x="26" y="68" width="96" height="6" className="cap-f cap-f--dim cap-bar" style={{ '--d': '.5s' } as React.CSSProperties} />
          <rect x="26" y="82" width="34" height="10" className="cap-f cap-bar" style={{ '--d': '.75s' } as React.CSSProperties} />
          <path d="M150 62 l0 22 l6-5 l5 11 l5-2 l-5-11 l8 0 z" className="cap-f cap-cursor" />
        </svg>
      );
    case 'mobile-apps':
      return (
        <svg {...common}>
          <rect x="72" y="6" width="56" height="98" rx="9" className="cap-s" />
          <line x1="90" y1="13" x2="110" y2="13" className="cap-s" />
          {[0, 1, 2, 3].map((i) => (<rect key={i} x="80" y={24 + i * 19} width="40" height="13" className="cap-f cap-row" style={{ '--d': `${i * 0.35}s` } as React.CSSProperties} />))}
          <rect x="24" y="30" width="30" height="8" className="cap-f cap-f--dim" /><rect x="146" y="64" width="30" height="8" className="cap-f cap-f--dim" />
          <rect x="24" y="44" width="20" height="8" className="cap-f cap-f--dim" /><rect x="156" y="78" width="20" height="8" className="cap-f cap-f--dim" />
        </svg>
      );
    case 'ai-integration':
      return (
        <svg {...common}>
          {[[30, 25], [30, 55], [30, 85], [100, 15], [100, 45], [100, 75], [100, 98], [170, 40], [170, 70]].map(([x = 0, y = 0], i) => (
            <rect key={i} x={x - 5} y={y - 5} width="10" height="10" className="cap-f cap-node" style={{ '--d': `${(i % 5) * 0.4}s` } as React.CSSProperties} />
          ))}
          {[[30, 25, 100, 45], [30, 55, 100, 15], [30, 55, 100, 75], [30, 85, 100, 45], [30, 85, 100, 98], [100, 45, 170, 40], [100, 15, 170, 40], [100, 75, 170, 70], [100, 98, 170, 70]].map(([a, b, c, d], i) => (
            <line key={i} x1={a} y1={b} x2={c} y2={d} className="cap-s cap-s--thin" />
          ))}
          <rect x="-4" y="-4" width="8" height="8" className="cap-f cap-travel" />
        </svg>
      );
    case 'automation':
      return (
        <svg {...common}>
          <rect x="10" y="38" width="42" height="34" rx="4" className="cap-s" /><rect x="79" y="38" width="42" height="34" rx="4" className="cap-s" /><rect x="148" y="38" width="42" height="34" rx="4" className="cap-s" />
          <line x1="52" y1="55" x2="79" y2="55" className="cap-s" /><line x1="121" y1="55" x2="148" y2="55" className="cap-s" />
          <rect x="20" y="50" width="22" height="10" className="cap-f cap-f--dim" /><rect x="89" y="50" width="22" height="10" className="cap-f cap-f--dim" /><rect x="158" y="50" width="22" height="10" className="cap-f cap-f--dim" />
          <rect x="-4" y="-4" width="8" height="8" className="cap-f cap-flow" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M20 85 C60 10, 120 120, 180 25" className="cap-s cap-curve" />
          <line x1="20" y1="85" x2="60" y2="40" className="cap-s cap-s--thin" /><line x1="180" y1="25" x2="140" y2="70" className="cap-s cap-s--thin" />
          <rect x="15" y="80" width="10" height="10" className="cap-f" /><rect x="175" y="20" width="10" height="10" className="cap-f" />
          <rect x="55" y="35" width="10" height="10" className="cap-f cap-f--dim cap-handle" /><rect x="135" y="65" width="10" height="10" className="cap-f cap-f--dim cap-handle cap-handle--b" />
        </svg>
      );
  }
}

export function Capabilities({ services }: { services: Service[] }) {
  return (
    <section id="capabilities" className="section container defer-render" aria-labelledby="cap-h">
      <div className="sec-head">
        <p className="sec-head__tag mono" data-reveal><span>01</span> capabilities</p>
        <h2 id="cap-h" className="h2" data-reveal data-reveal-index={1}>What we put in your hands</h2>
      </div>
      <ul className="cap">
        {services.slice(0, 5).map((s, i) => (
          <li key={s.id} className={`cap__tile cap__tile--${i + 1}`} data-reveal data-reveal-index={i}>
            <div className="cap__art"><Art id={s.id} /></div>
            <p className="mono cap__n">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="h4"><Link href={`/services#${s.id}`} className="cap__link">{s.name}</Link>{SHOW_PLACEHOLDER_BADGE && s.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</h3>
            <p className="muted">{s.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
