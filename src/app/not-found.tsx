import Link from 'next/link';

export const metadata = { title: 'Page not found' };

/** Branded 404. The two halves of "404" drift 6px apart along the brand seam and settle once (skipped under reduced motion). */
export default function NotFound() {
  return (
    <section className="container nf">
      <p className="nf__num font-display" aria-hidden="true"><span className="nf__half nf__half--l">4</span><span className="nf__seam" /><span className="nf__half nf__half--r">04</span></p>
      <h1 className="h2">This page is not on the map.</h1>
      <p className="lead">The link may be old or mistyped. Try search, or head back to the work.</p>
      <p className="nf__actions">
        <Link href="/" className="btn btn--primary">Home</Link>
        <Link href="/work" className="btn btn--secondary">Work</Link>
      </p>
    </section>
  );
}
