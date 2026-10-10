'use client';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { readLocal, writeLocal } from '@/lib/storage';

const KEY = 'bu:consent';
const TWELVE_MONTHS = 365 * 24 * 3600 * 1000;

interface Record { choice: 'accepted' | 'declined'; at: number }
function read(): Record | null {
  try {
    const r = JSON.parse(readLocal(KEY) ?? 'null') as Record | null;
    return r && Date.now() - r.at < TWELVE_MONTHS ? r : null;
  } catch { return null; }
}

/**
 * Privacy card. Analytics is off by default and this card does not exist at all while provider is 'none'
 * (Part 15.9). When enabled it appears only after the intro, never blocks content, and remembers the choice for 12 months.
 */
export function Consent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (site.analytics.provider === 'none') return;
    const show = () => { if (!read()) setVisible(true); };
    const reopen = () => setVisible(true);
    document.addEventListener('bu:consent:open', reopen);
    if (document.documentElement.getAttribute('data-intro') === 'done' || document.documentElement.getAttribute('data-intro') === 'skip') show();
    else document.addEventListener('bu:intro:done', show, { once: true });
    return () => { document.removeEventListener('bu:consent:open', reopen); document.removeEventListener('bu:intro:done', show); };
  }, []);
  if (site.analytics.provider === 'none' || !visible) return null;
  const choose = (choice: Record['choice']) => { writeLocal(KEY, JSON.stringify({ choice, at: Date.now() })); setVisible(false); };
  return (
    <section className="consent" aria-labelledby="consent-title">
      <h2 id="consent-title" className="h4">Your privacy choices</h2>
      <p>We only measure visits if you say yes. Nothing is shared with advertisers.</p>
      <div className="consent__row">
        <button type="button" className="btn btn--primary" onClick={() => choose('accepted')}>Accept analytics</button>
        <button type="button" className="btn btn--secondary" onClick={() => choose('declined')}>Decline</button>
        <a className="btn btn--ghost" href="/privacy">Manage</a>
      </div>
    </section>
  );
}

/** Footer link that reopens the card. Renders nothing while analytics is off. */
export function CookieSettings() {
  if (site.analytics.provider === 'none') return null;
  return <button type="button" className="footer__btn" onClick={() => document.dispatchEvent(new CustomEvent('bu:consent:open'))}>Cookie settings</button>;
}
