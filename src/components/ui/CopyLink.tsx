'use client';
import { useState } from 'react';
import { Icon } from './Icon';

/** Copies the page URL. No third-party share scripts. Announces the result politely. */
export function CopyLink() {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setDone(true); window.setTimeout(() => setDone(false), 2500); } catch { setDone(false); }
  };
  return (
    <>
      <button type="button" className="btn btn--ghost" onClick={copy}><Icon name="link" />Copy link</button>
      <span className="visually-hidden" role="status">{done ? 'Link copied' : ''}</span>
    </>
  );
}
