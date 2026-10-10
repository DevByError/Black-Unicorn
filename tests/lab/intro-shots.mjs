// Captures intro frames at storyboard checkpoints (run against a built + served site).
// usage: node tests/lab/intro-shots.mjs <baseUrl> <outDir> [width] [height] [speed]
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const [base = 'http://localhost:4173', out = 'shots', w = '1440', h = '900', speed = '4'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath: fs.existsSync(exe) ? exe : undefined });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, colorScheme: 'dark' });
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(`${base}/?intro=${speed === '1' ? 'force' : 'slow'}`, { waitUntil: 'commit' });
await page.waitForSelector('#intro[data-state="running"]', { timeout: 20000 });
const t0 = Date.now();
const marks = [0.3, 1.0, 1.8, 2.4, 3.2, 3.5, 3.8, 4.05, 4.5, 5.0, 5.4];
for (const m of marks) {
  const wait = m * 1000 * Number(speed) - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}/t${String(m).replace('.', '_')}.png` });
}
await page.waitForFunction(() => document.documentElement.getAttribute('data-intro') === 'done', null, { timeout: 60000 });
await page.screenshot({ path: `${out}/done.png` });
console.log('done in', ((Date.now() - t0) / 1000).toFixed(1), 's wall');
console.log(logs.join('\n') || 'no console output');
await browser.close();
