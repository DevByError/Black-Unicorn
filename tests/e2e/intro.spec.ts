import { expect, test } from '@playwright/test';

const done = (page: import('@playwright/test').Page, timeout = 15_000) =>
  page.waitForFunction(() => document.documentElement.getAttribute('data-intro') === 'done', null, { timeout });

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`dock hand-off lands within 1px of the header icon @ ${vp.width}x${vp.height}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      // Poll every frame: record rects the first frame after `is-intro` disappears (the hand-off frame).
      const w = window as unknown as { __handoff?: { clone: DOMRect; header: DOMRect } };
      let seen = false;
      const tick = () => {
        const on = !document.documentElement.classList.contains('intro-handoff') && document.documentElement.classList.contains('is-intro');
        if (on) seen = true;
        if (seen && !on && !w.__handoff) {
          const c = document.getElementById('intro-mark-wrap');
          const h = document.getElementById('site-logo-icon');
          if (c && h) w.__handoff = { clone: c.getBoundingClientRect(), header: h.getBoundingClientRect() };
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.goto('/?intro=force');
    await done(page);
    const r = await page.evaluate(() => (window as unknown as { __handoff: { clone: DOMRect; header: DOMRect } }).__handoff);
    expect(Math.abs(r.clone.left - r.header.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.clone.top - r.header.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.clone.width - r.header.width)).toBeLessThanOrEqual(1);
    await ctx.close();
  });
}

test('same-session reload skips the intro', async ({ page }) => {
  await page.goto('/?intro=force');
  await done(page);
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-intro'))).toMatch(/skip|done/);
  await expect(page.locator('#intro')).toHaveCount(0);
});

test('skip button fast-forwards to a clean final state', async ({ page }) => {
  await page.goto('/?intro=force');
  await page.locator('#intro-skip').click();
  await done(page, 6_000);
  expect(await page.locator('body > header[inert], body > main[inert], body > footer[inert]').count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.classList.contains('is-intro'))).toBe(false);
  await expect(page.locator('#site-logo')).toBeVisible();
});

test('reduced motion plays only a short cross-fade', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto('/');
  await done(page, 4_000);
  expect(Date.now() - t0).toBeLessThan(2_500);
  await ctx.close();
});

test('with JavaScript disabled the page is usable immediately', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('#intro')).toBeHidden();
  await expect(page.locator('h1')).toBeVisible();
  await ctx.close();
});

test('watchdog / fallback: overlay clears even if the intro script is blocked', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.route('**/_next/static/**/*.js', (r) => r.abort());
  await page.goto('/?intro=force');
  await expect(page.locator('#intro')).toBeHidden({ timeout: 8_000 });
  await ctx.close();
});
