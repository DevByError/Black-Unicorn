import type { ReactNode } from 'react';

/** Home/section wrapper: <section aria-labelledby>, eyebrow + heading + optional action. */
export function SectionHead({ id, eyebrow, title, children, as: H = 'h2' }: { id: string; eyebrow: string; title: string; children?: ReactNode; as?: 'h1' | 'h2' }) {
  return (
    <div className="section__head">
      <div>
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <H id={id} className="h2" data-reveal data-reveal-index={1}>{title}</H>
      </div>
      {children}
    </div>
  );
}
