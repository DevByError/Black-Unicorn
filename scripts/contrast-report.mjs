// WCAG 2.2 contrast table for every text/background token pair, both themes. Exits 1 if any pair fails.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const dark = { bg: '#0A0A10', raised: '#0F0F17', surface: '#14141E', surfaceHover: '#1D1D2A', strong: '#F4F2FA', text: '#B9B9CC', muted: '#8A8AA0', accent: '#D4A83A', accentContrast: '#0A0A10', border: '#3A3A4E', focus: '#E0BC5C', danger: '#FF6B6B', success: '#5BD69A' };
const light = { bg: '#FBFAF6', raised: '#FFFFFF', surface: '#FFFFFF', surfaceHover: '#F2F0E8', strong: '#0A0A10', text: '#2A2A3A', muted: '#5B5B73', accent: '#8F6C16', accentContrast: '#FFFFFF', border: '#CFCBB9', focus: '#6F5210', danger: '#B3261E', success: '#1B6B43' };

const pairs = (t) => [
  ['text on bg', t.text, t.bg, 4.5], ['text on surface', t.text, t.surface, 4.5], ['strong on bg', t.strong, t.bg, 4.5],
  ['muted on bg', t.muted, t.bg, 4.5], ['muted on surface', t.muted, t.surface, 4.5], ['muted on raised', t.muted, t.raised, 4.5],
  ['accent text on bg', t.accent, t.bg, 4.5], ['accent text on surface', t.accent, t.surface, 4.5],
  ['button: accent-contrast on accent', t.accentContrast, t.accent, 4.5],
  ['focus ring on bg (UI 3:1)', t.focus, t.bg, 3], ['border token vs bg (decorative separator only)', t.border, t.bg, 1.5], ['control border (muted) vs bg (UI 3:1)', t.muted, t.bg, 3],
  ['danger text on bg', t.danger, t.bg, 4.5], ['success text on bg', t.success, t.bg, 4.5],
];
let fail = 0;
for (const [name, theme] of [['dark', dark], ['light', light]]) {
  console.log(`\n${name} theme`);
  for (const [label, fg, bg, min] of pairs(theme)) {
    const r = ratio(fg, bg); const ok = r >= min; if (!ok) fail++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${label}   ${fg} on ${bg}`);
  }
}
process.exit(fail ? 1 : 0);
