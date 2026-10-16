'use client';
import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'capabilities', label: 'Capabilities' }, { id: 'work', label: 'Work' }, { id: 'process', label: 'Pipeline' },
  { id: 'notes', label: 'Radar' }, { id: 'team', label: 'Team' }, { id: 'contact', label: 'Contact' },
];

/** Small "On this page" quick menu: desktop only (hidden below 1024px by CSS). A disclosure, not a menu. */
export function OnThisPage() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="otp">
      <button type="button" className="otp__btn" aria-expanded={open} aria-controls="otp-list" onClick={() => setOpen(!open)}>On this page</button>
      <ul id="otp-list" className="otp__list" hidden={!open}>
        {SECTIONS.map((s) => (<li key={s.id}><a href={`#${s.id}`} onClick={() => setOpen(false)}>{s.label}</a></li>))}
      </ul>
    </div>
  );
}
