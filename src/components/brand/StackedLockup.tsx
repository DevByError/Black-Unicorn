import { LogoMark } from './LogoMark';

/** Stacked lockup: icon above the wordmark. Used in the footer and the OG image. One solid colour. */
export function StackedLockup({ className }: { className?: string }) {
  return (
    <div className={`stacked ${className ?? ''}`}>
      <LogoMark className="stacked__icon" />
      <span className="stacked__word font-display" aria-hidden="true">BlackUnicorn</span>
      <span className="visually-hidden">BlackUnicorn</span>
    </div>
  );
}
