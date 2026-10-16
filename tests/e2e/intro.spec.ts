import { expect, test, type Page } from '@playwright/test';
import path from 'node:path';

/**
 * The intro is a video: "Gold Ribbons_Mobile.mp4" on portrait screens, "Gold Ribbons_PC.mp4" everywhere else.
 *
 * Playwright's bundled Chromium cannot decode H.264, so on a machine without it the real files cannot play. For those
 * runs set INTRO_WEBM_DIR to a folder holding "Gold Ribbons_PC.webm" and "Gold Ribbons_Mobile.webm" (same clips, any
 * resolution, e.g. `ffmpeg -i "Gold Ribbons_PC.mp4" -an -vf scale=640:-2 -c:v libvpx-vp9 "Gold Ribbons_PC.webm"`);
 * the tests then serve those in place of the mp4 requests. Without either, the "plays" tests are skipped and
 * the "cannot play" test checks what such a browser sees.
 */
const WEBM_DIR = process.env.INTRO_WEBM_DIR;
const VIDEO_URL = /Gold%20Ribbons_(PC|Mobile)\.mp4/;

const done = (page: Page, timeout = 15_000) =>
  page.waitForFunction(() => document.documentElement.getAttribute('data-intro') === 'done', null, { timeout });

async function canPlayMp4(page: Page) {
  return page.evaluate(() => document.createElement('video').canPlayType('video/mp4; codecs="avc1.64001f, mp4a.40.2"') !== '');
}

async function serveWebm(page: Page) {
  if (!WEBM_DIR) return;
  await page.route(VIDEO_URL, (route) => {
    const name = /Gold%20Ribbons_(PC|Mobile)/.exec(route.request().url())?.[1] ?? 'PC';
    return route.fulfill({ path: path.join(WEBM_DIR, `Gold Ribbons_${name}.webm`), contentType: 'video/webm' });
  });
}

async function playable(page: Page) {
  await page.goto('about:blank');
  return WEBM_DIR !== undefined || (await canPlayMp4(page));
}

for (const [name, vp, expected] of [
  ['wide screens get the PC video', { width: 1440, height: 900 }, 'PC'],
  ['portrait phones get the Mobile video', { width: 390, height: 844 }, 'Mobile'],
  ['phones turned sideways get the PC video', { width: 844, height: 390 }, 'PC'],
] as const) {
  test(name, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: 'dark' });
    const page = await ctx.newPage();
    await serveWebm(page);
    const req = page.waitForRequest(VIDEO_URL, { timeout: 10_000 });
    await page.goto('/?intro=force');
    expect(VIDEO_URL.exec((await req).url())?.[1]).toBe(expected);
    await ctx.close();
  });
}

test('the intro video plays muted, fills the screen, then hands over to the site', async ({ browser }) => {
  test.setTimeout(40_000);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  test.skip(!(await playable(page)), 'This browser cannot decode H.264 and INTRO_WEBM_DIR is not set.');
  await serveWebm(page);
  await page.goto('/?intro=force');
  const video = page.locator('#intro-video');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 8_000 }).toBeGreaterThan(1);
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  expect(await page.locator('body > header[inert], body > main[inert]').count()).toBe(2);
  const box = await video.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(1440);
  expect(box?.height).toBeGreaterThanOrEqual(900);
  await done(page, 20_000);
  expect(await page.evaluate(() => document.documentElement.classList.contains('is-intro'))).toBe(false);
  expect(await page.locator('body > header[inert], body > main[inert], body > footer[inert]').count()).toBe(0);
  await expect(page.locator('#intro')).toHaveCount(0);
  await expect(page.locator('#site-logo')).toBeVisible();
  await ctx.close();
});

test('a reload plays the full video again from the very start', async ({ browser }) => {
  test.setTimeout(60_000);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  test.skip(!(await playable(page)), 'This browser cannot decode H.264 and INTRO_WEBM_DIR is not set.');
  await serveWebm(page);
  await page.goto('/');
  await done(page, 25_000); // first visit: let the whole intro finish, as a real visitor would
  for (let i = 0; i < 2; i++) {
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-intro'))).toBe('full');
    const video = page.locator('#intro-video');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 8_000 }).toBeGreaterThan(0);
    expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(3); // started at 0, not seeked ahead
    await done(page, 25_000);
  }
  await ctx.close();
});

test('if the video cannot be loaded the site is shown instead, not a stuck black screen', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route(VIDEO_URL, (r) => r.fulfill({ status: 404, body: 'nope' }));
  const t0 = Date.now();
  await page.goto('/?intro=force');
  await done(page, 8_000);
  expect(Date.now() - t0).toBeLessThan(7_000);
  await expect(page.locator('#intro')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await ctx.close();
});

test('the intro shows no buttons at all, only the video', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await serveWebm(page);
  await page.goto('/?intro=force');
  await page.locator('#intro[data-state=running]').waitFor();
  await expect(page.locator('#intro-skip')).toHaveCount(0);
  await expect(page.locator('#intro-sound')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /skip intro|unmute|mute/i })).toHaveCount(0);
  await ctx.close();
});

test('Escape still ends the intro early and leaves a clean final state', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  test.skip(!(await playable(page)), 'This browser cannot decode H.264 and INTRO_WEBM_DIR is not set.');
  await serveWebm(page);
  await page.goto('/?intro=force');
  await page.locator('#intro[data-state=running]').waitFor();
  await page.keyboard.press('Escape');
  await done(page, 3_000);
  expect(await page.locator('body > header[inert], body > main[inert], body > footer[inert]').count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.classList.contains('is-intro'))).toBe(false);
  await expect(page.locator('#site-logo')).toBeVisible();
  await ctx.close();
});

test('a reload starts at the top of the page, not at the old scroll position', async ({ browser }) => {
  test.setTimeout(60_000);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await serveWebm(page);
  await page.goto('/?intro=force');
  await done(page, 25_000);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBeGreaterThan(500);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-nav'))).toBe('reload');
  expect(await page.evaluate(() => Math.round(scrollY))).toBe(0);
  await page.locator('#intro[data-state=running]').waitFor();
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => Math.round(scrollY))).toBe(0); // still at the top while the intro plays
  await done(page, 25_000);
  expect(await page.evaluate(() => Math.round(scrollY))).toBe(0); // and when the site appears
  await ctx.close();
});

test('a reload drops the #hash so the page really starts over', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await serveWebm(page);
  await page.goto('/?intro=skip#main');
  await page.reload();
  await done(page, 10_000);
  expect(await page.evaluate(() => location.hash)).toBe('');
  expect(await page.evaluate(() => Math.round(scrollY))).toBe(0);
  await ctx.close();
});

test('reduced motion shows the still final frame briefly and never loads the video', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const requests: string[] = [];
  page.on('request', (r) => { if (VIDEO_URL.test(r.url())) requests.push(r.url()); });
  const t0 = Date.now();
  await page.goto('/');
  await done(page, 4_000);
  expect(Date.now() - t0).toBeLessThan(3_000);
  expect(requests).toEqual([]);
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
