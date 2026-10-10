import type { ReactNode } from 'react';

/** Standard page header: eyebrow, the page's single <h1>, lead sentence, optional extras. Sits below the fixed header. */
export function PageHead({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="page-head container">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="h1">{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </header>
  );
}
