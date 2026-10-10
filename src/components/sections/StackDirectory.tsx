'use client';
import { useId, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { StackItem } from '@/types/content';

/**
 * Collapsible directory grouped by category. Multi-open; the first group starts open. Items are names (text), never
 * full-colour third-party logos. External links open in the same tab.
 */
export function StackDirectory({ items, standalone = false }: { items: StackItem[]; standalone?: boolean }) {
  const uid = useId();
  const groups = items.reduce<Record<string, StackItem[]>>((acc, it) => { (acc[it.category] ??= []).push(it); return acc; }, {});
  const names = Object.keys(groups);
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ [names[0] ?? '']: true }));
  const Wrapper = standalone ? 'div' : 'section';
  return (
    <Wrapper id="stack" className={standalone ? '' : 'section container defer-render'} {...(standalone ? {} : { 'aria-labelledby': 'stack-h' })}>
      <div className="section__head"><div><p className="eyebrow" data-reveal>Stack and partners</p><h2 id="stack-h" className="h2" data-reveal data-reveal-index={1}>What we build with</h2></div></div>
      <div className="dir">
        {names.map((g, gi) => (
          <div key={g} className="dir__group">
            <h3 className="dir__head">
              <button type="button" className="dir__btn" aria-expanded={!!open[g]} aria-controls={`${uid}-${gi}`} onClick={() => setOpen({ ...open, [g]: !open[g] })}>
                <span className="font-display">{g}</span>
                <span className="mono muted">{groups[g]?.length}</span>
                <Icon name="chevron" className="icon dir__chev" />
              </button>
            </h3>
            <div id={`${uid}-${gi}`} role="region" aria-labelledby={undefined} aria-label={g} className="accordion__panel" data-open={!!open[g]}>
              <div className="accordion__inner"><ul className="dir__grid">
                {groups[g]?.map((it) => (
                  <li key={it.name} className="dir__item">
                    {it.url ? (
                      <a href={it.url} className="dir__link" tabIndex={open[g] ? 0 : -1} rel="noopener noreferrer">
                        <span><span className="dir__name">{it.name}</span><span className="dir__blurb muted">{it.blurb}</span></span>
                        <Icon name="external" className="icon dir__ext" />
                      </a>
                    ) : (
                      <div className="dir__link dir__link--static"><span><span className="dir__name">{it.name}</span><span className="dir__blurb muted">{it.blurb}</span></span></div>
                    )}
                  </li>
                ))}
              </ul></div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
