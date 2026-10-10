// usage: node tests/lab/page-shots.mjs <url> <out.png> [width] [height] [theme] [fullPage]
import { chromium } from '@playwright/test';
const [url, out, w = '1440', h = '900', theme = 'dark', full = '1'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, colorScheme: theme });
const p = await ctx.newPage();
const logs = [];
p.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`[${m.type()}] ${m.text()}`));
p.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
if (full === '1') { // full-page capture: disable content-visibility and mark reveals as shown
  await p.addStyleTag({ content: '.defer-render{content-visibility:visible !important}' });
  await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in')));
  await p.waitForTimeout(1200);
}
await p.screenshot({ path: out, fullPage: full === '1' });
console.log(logs.join('\n') || 'clean console');
await b.close();
