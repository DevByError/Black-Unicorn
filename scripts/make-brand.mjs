// Generates the flat brand deliverables from the canonical geometry (src/lib/logo-geometry.ts).
// Run: node --experimental-strip-types scripts/make-brand.mjs
// Outputs SVG lockups (wordmark converted to outlines so no font is needed), favicon set, app icons and the OG image.
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { chromium } from '@playwright/test';
import { DOT, GAUGE_ARC, HORN_LEFT, HORN_RIGHT, MANES, RING, TICKS } from '../src/lib/logo-geometry.ts';

const out = path.resolve('public/brand');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(path.resolve('public/og'), { recursive: true });
const font = opentype.parse(fs.readFileSync('node_modules/@fontsource/cinzel/files/cinzel-latin-600-normal.woff').buffer.slice(0));
const INK = '#0A0A10', GOLD = '#D4A83A', WHITE = '#FFFFFF', BLACK = '#000000';

const icon = (c, simple = false) => simple
  ? `<path d="${RING}" fill="none" stroke="${c}" stroke-width="22"/><polygon points="196,16 150,262 196,281" fill="${c}"/><polygon points="204,16 250,262 204,281" fill="${c}"/><circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${c}"/>`
  : `<path d="${RING}" fill="none" stroke="${c}" stroke-width="14"/><path d="${GAUGE_ARC}" fill="none" stroke="${c}" stroke-width="3.5"/><path d="${TICKS}" fill="none" stroke="${c}" stroke-width="3"/><polygon points="${HORN_LEFT}" fill="${c}"/><polygon points="${HORN_RIGHT}" fill="${c}"/>${MANES.map((m) => `<path d="${m.d}" fill="none" stroke="${c}" stroke-width="${m.w}" stroke-linecap="round"/>`).join('')}<circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${c}"/>`;

/** BlackUnicorn as outlines, tracking 0.1em, mixed case (Cinzel renders lowercase as small capitals). */
function wordPath(size, c) {
  const track = size * 0.1;
  let x = 0; const d = [];
  for (const g of font.stringToGlyphs('BlackUnicorn')) {
    d.push(g.getPath(x, 0, size).toPathData(2));
    x += (g.advanceWidth * size) / font.unitsPerEm + track;
  }
  const width = x - track;
  const bb = font.getPath('B', 0, 0, size).getBoundingBox();
  return { svg: `<path d="${d.join(' ')}" fill="${c}"/>`, width, cap: -bb.y1 };
}
const svg = (w, h, inner, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${inner}</svg>\n`;
const write = (name, s) => fs.writeFileSync(path.join(out, name), s);

for (const [tone, c] of [['gold', GOLD], ['white', WHITE], ['black', BLACK]]) {
  write(`blackunicorn-icon-${tone}.svg`, svg(400, 420, icon(c), 'BlackUnicorn'));
  // Stacked: wordmark width = 1.45 x icon width, gap = 0.12 x icon height.
  const probe = wordPath(100, c); const size = (400 * 1.45 * 100) / probe.width; const w = wordPath(size, c);
  const gap = 0.12 * 420; const W = Math.round(w.width); const H = Math.round(420 + gap + w.cap + 6);
  write(`blackunicorn-stacked-${tone}.svg`, svg(W, H, `<g transform="translate(${(W - 400) / 2} 0)">${icon(c)}</g><g transform="translate(0 ${420 + gap + w.cap})">${w.svg}</g>`, 'BlackUnicorn'));
  // Horizontal: wordmark cap height = 0.42 x icon height, gap = 0.45 x icon height, centred on the ring centre.
  const p2 = wordPath(100, c); const s2 = (0.42 * 420 * 100) / p2.cap; const w2 = wordPath(s2, c);
  const gx = 0.45 * 420; const HW = Math.round(400 + gx + w2.width);
  write(`blackunicorn-logo-${tone}.svg`, svg(HW, 420, `<g>${icon(c)}</g><g transform="translate(${400 + gx} ${235 + w2.cap / 2})">${w2.svg}</g>`, 'BlackUnicorn'));
}
write('blackunicorn-mask-icon.svg', svg(400, 420, icon(BLACK, true), 'BlackUnicorn'));
fs.writeFileSync('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 420"><style>:root{color:${GOLD}}@media (prefers-color-scheme:light){:root{color:${INK}}}</style><g color="currentColor">${icon('currentColor', true)}</g></svg>\n`);

// Raster outputs rendered with the same geometry (Chromium is only a rasteriser here).
const stackedGold = fs.readFileSync(path.join(out, 'blackunicorn-stacked-gold.svg'), 'utf8');
const page = (bg, body, w, h) => `<html><body style="margin:0;background:${bg};width:${w}px;height:${h}px;display:grid;place-items:center;overflow:hidden">${body}</body></html>`;
const markSvg = (c, size, simple) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -10 440 440" width="${size}" height="${size}">${icon(c, simple)}</svg>`;
const shots = [
  ['apple-touch-icon.png', 180, 180, page(INK, markSvg(GOLD, 124, false), 180, 180)],
  ['icon-192.png', 192, 192, page(INK, markSvg(GOLD, 132, false), 192, 192)],
  ['icon-512.png', 512, 512, page(INK, markSvg(GOLD, 352, false), 512, 512)],
  // Maskable: all artwork inside the central 80% safe zone.
  ['icon-maskable-512.png', 512, 512, page(INK, markSvg(GOLD, 280, false), 512, 512)],
  ['favicon-16.png', 16, 16, page(INK, markSvg(GOLD, 14, true), 16, 16)],
  ['favicon-32.png', 32, 32, page(INK, markSvg(GOLD, 28, true), 32, 32)],
  ['favicon-48.png', 48, 48, page(INK, markSvg(GOLD, 42, true), 48, 48)],
  ['../og/default.png', 1200, 630, page(INK, `<div style="width:420px">${stackedGold.replace('<svg ', '<svg width="420" ')}</div>`, 1200, 630)],
];
const exe = '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath: fs.existsSync(exe) ? exe : undefined });
for (const [name, w, h, html] of shots) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html);
  await p.screenshot({ path: path.join(out, name) });
  await p.close();
}
await browser.close();
for (const f of ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png']) fs.copyFileSync(path.join(out, f), path.resolve('public', f));
// favicon.ico: PNG-compressed entries (16, 32, 48).
const pngs = [16, 32, 48].map((s) => fs.readFileSync(path.join(out, `favicon-${s}.png`)));
const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length; const dir = []; 
pngs.forEach((b, i) => { const e = Buffer.alloc(16); const s = [16, 32, 48][i]; e[0] = s; e[1] = s; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(b.length, 8); e.writeUInt32LE(offset, 12); offset += b.length; dir.push(e); });
fs.writeFileSync('public/favicon.ico', Buffer.concat([head, ...dir, ...pngs]));
console.log('brand assets written:', fs.readdirSync(out).length, 'files in public/brand');
