/**
 * First focusable elements on every page (Part 15.1). "Skip intro" is the intro's own button, which is
 * focused programmatically while the intro runs; this link serves everyone afterwards.
 */
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a className="skip-link" href="#main">Skip to main content</a>
    </div>
  );
}
