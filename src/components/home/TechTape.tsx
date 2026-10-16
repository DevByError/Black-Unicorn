import type { StackItem } from '@/types/content';

/**
 * Two slow tapes of the tools we use, moving in opposite directions. Text only (no third-party logos). The list is
 * read once by assistive tech; the second copy exists only to make the loop seamless. Pauses on hover and focus.
 */
export function TechTape({ items }: { items: StackItem[] }) {
  const names = Array.from(new Set(items.map((s) => s.name)));
  const half = Math.ceil(names.length / 2);
  const rows = [names.slice(0, half), names.slice(half)];
  return (
    <section className="tape" aria-label="Technologies we build with">
      <p className="visually-hidden">Technologies we build with: {names.join(', ')}.</p>
      {rows.map((row, r) => (
        <div key={r} className={`tape__row${r ? ' tape__row--rev' : ''}`} aria-hidden="true">
          <ul className="tape__track">
            {[...row, ...row, ...row, ...row].map((n, i) => (<li key={`${n}-${i}`} className="tape__item mono"><span className="tape__dot" />{n}</li>))}
          </ul>
        </div>
      ))}
    </section>
  );
}
