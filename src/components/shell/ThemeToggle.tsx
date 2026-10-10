'use client';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { writeLocal } from '@/lib/storage';

/** Dark is the brand default. `aria-pressed` is true while the dark theme is active. */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.getAttribute('data-theme') !== 'light'), []);

  const toggle = () => {
    const root = document.documentElement;
    const next = dark ? 'light' : 'dark';
    root.classList.add('theme-fade'); // 150ms colour-only cross-fade, never layout
    root.setAttribute('data-theme', next);
    writeLocal('bu:theme', next);
    setDark(!dark);
    window.setTimeout(() => root.classList.remove('theme-fade'), 200);
  };

  return (
    <button type="button" className="icon-btn" aria-pressed={dark} onClick={toggle} data-track="shell.theme">
      <Icon name={dark ? 'moon' : 'sun'} />
      <span className="visually-hidden">Dark theme</span>
    </button>
  );
}
