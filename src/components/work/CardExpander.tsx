'use client';
import { useState, type ReactNode } from 'react';

/** "Read more / Read less" in place. aria-expanded + aria-controls; sits above the stretched card link. */
export function CardExpander({ id, children }: { id: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pcard__more">
      <div id={id} className="accordion__panel" data-open={open}>
        <p className="accordion__inner muted">{children}</p>
      </div>
      <button type="button" className="pcard__expander" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {open ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
}
