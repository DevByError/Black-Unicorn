// Dev-mode hydration check: run the dev server on port 3100 first, then `node scripts/check-hydration.mjs`. Production builds do not log hydration mismatches.
import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const routes = ['/work', '/', '/services', '/studio', '/notes', '/contact', '/work/project-one'];
for (const r of routes) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); const errs = [];
  p.on('console', (m) => { if (m.type() === 'error' || /hydrat/i.test(m.text())) errs.push(m.text().slice(0, 140)); });
  p.on('pageerror', (e) => errs.push('pageerror ' + e.message.slice(0, 100)));
  await p.goto('http://localhost:3100' + r + '?intro=skip', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2500);
  console.log(r.padEnd(20), errs.length ? 'ERRORS ' + errs.join(' | ') : 'clean');
}
await b.close();
