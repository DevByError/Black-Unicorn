import Link from 'next/link';
import { LogoMark } from './LogoMark';

/**
 * Horizontal lockup used in the header. The node and its ids are stable: the intro measures
 * `#site-logo-icon` and `#site-logo-word` as dock targets (Part 13.4). Swap colours with a class on
 * <header>, never by replacing this node.
 */
export function Logo() {
  return (
    <Link id="site-logo" href="/" className="logo" aria-label="BlackUnicorn home" data-track="shell.logo">
      <LogoMark id="site-logo-icon" className="logo__icon" progress />
      <span id="site-logo-word" className="logo__word font-display" aria-hidden="true">
        BlackUnicorn
      </span>
    </Link>
  );
}
