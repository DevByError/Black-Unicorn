// Loads pages with the enforced CSP from out/_headers applied and reports any violations. Needs `npx serve out -l 4173` running.
import fs from 'node:fs';
import { chromium } from '@playwright/test';
const blocks = fs.readFileSync('out/_headers', 'utf8').split(/\n\n+/);
const csp = new Map();
for (const b of blocks) {
  const lines = b.split('\n'); const h = lines.find((l) => /Content-Security-Policy/.test(l)); if (!h) continue;
  const value = h.slice(h.indexOf(':') + 1).trim();
  for (const l of lines) if (l.startsWith('/')) csp.set(l.trim(), value);
}
const base = 'http://localhost:4173';
const routes = ['/', '/work', '/work/project-one', '/services', '/studio', '/notes', '/notes/note-one', '/contact', '/privacy', '/accessibility', '/nope'];
const exe = '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath: fs.existsSync(exe) ? exe : undefined });
let bad = 0;
for (const r of routes) {
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  const problems = [];
  page.on('console', (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) problems.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => problems.push('pageerror ' + e.message.slice(0, 120)));
  await page.route((u) => u.origin + u.pathname === base + r, async (route) => {
    const res = await route.fetch(); const headers = { ...res.headers() };
    const v = csp.get(r) ?? csp.get(r + '/') ?? csp.get('/404.html');
    if (v) headers['content-security-policy'] = v;
    await route.fulfill({ response: res, headers });
  });
  await page.goto(base + r + '?intro=skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const hydrated = await page.evaluate(() => document.documentElement.dataset.ready === 'true');
  console.log(r.padEnd(20), problems.length ? 'VIOLATIONS' : 'ok', hydrated ? 'hydrated' : 'NOT hydrated', ...problems);
  if (problems.length || (!hydrated && r !== '/nope')) bad++;
  await ctx.close();
}
await browser.close(); process.exit(bad ? 1 : 0);
