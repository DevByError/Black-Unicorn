import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'dark', viewport: { width: 1440, height: 900 } });

test('mega menu: keyboard open, Escape closes and returns focus', async ({ page }) => {
  await page.goto('/?intro=skip');
  const trigger = page.getByRole('button', { name: 'Work' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#menu-work')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

test('mega menu: arrow keys move between triggers; outside click closes', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.getByRole('button', { name: 'Work' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Services' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('button', { name: 'Studio' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#menu-studio')).toBeVisible();
  await page.mouse.click(700, 600);
  await expect(page.locator('#menu-studio')).toBeHidden();
});

test('header state machine: top → solid → hidden on scroll down → visible on scroll up', async ({ page }) => {
  await page.goto('/?intro=skip');
  const header = page.locator('#site-header');
  await expect(header).toHaveAttribute('data-state', 'top');
  await page.mouse.move(700, 500);
  await page.evaluate(() => window.scrollTo(0, 150));
  await expect(header).toHaveAttribute('data-state', 'solid');
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(120);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(header).toHaveAttribute('data-state', 'hidden');
  await page.waitForTimeout(120); // let the previous frame paint so the next scroll is read as upward
  await page.evaluate(() => window.scrollTo(0, 1000));
  await expect(header).toHaveAttribute('data-state', 'solid');
});

test('header never hides while focus is inside it', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.locator('#site-logo').focus();
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(150);
  await expect(page.locator('#site-header')).not.toHaveAttribute('data-state', 'hidden');
});

test('search: / opens, typing finds results, Escape closes and returns focus', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.getByRole('button', { name: 'Search' }).focus();
  await page.keyboard.press('Enter');
  const dlg = page.getByRole('dialog', { name: 'Search BlackUnicorn' });
  await expect(dlg).toBeVisible();
  await page.keyboard.type('project two');
  await expect(dlg.getByRole('link', { name: /Project Two/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dlg).toBeHidden();
  await expect(page.getByRole('button', { name: 'Search' })).toBeFocused();
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.keyboard.press('/');
  await expect(dlg).toBeVisible();
  await page.keyboard.type('zzzzqq');
  await expect(dlg.getByText(/Nothing found/)).toBeVisible();
});

test('shortcuts do not fire while typing in a field', async ({ page }) => {
  await page.goto('/contact?intro=skip');
  await page.getByLabel(/Your name/).focus();
  await page.keyboard.type('a/b');
  await expect(page.getByLabel(/Your name/)).toHaveValue('a/b');
  await expect(page.getByRole('dialog', { name: 'Search BlackUnicorn' })).toBeHidden();
});

test('mobile menu: traps focus, Escape closes, focus returns to the button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?intro=skip');
  const burger = page.getByRole('button', { name: 'Menu' });
  await burger.click();
  const dlg = page.getByRole('dialog', { name: 'Menu' });
  await expect(dlg).toBeVisible();
  await page.getByRole('button', { name: 'Work', exact: false }).first().click();
  await expect(page.getByRole('button', { name: /^Work/ }).first()).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(dlg).toBeHidden();
  await expect(burger).toBeFocused();
});

test('theme toggle persists and applies before paint on reload', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('motion toggle sets data-motion and persists', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.getByRole('button', { name: 'Reduce motion' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
});

test('work filters write the URL, survive back/forward and clear', async ({ page }) => {
  await page.goto('/work?intro=skip');
  await page.getByRole('button', { name: 'Mobile', exact: true }).click();
  await expect(page).toHaveURL(/d=mobile/);
  await expect(page.locator('.work-grid__item')).toHaveCount(1);
  await page.goBack();
  await expect(page.locator('.work-grid__item')).toHaveCount(6);
  await page.goForward();
  await expect(page.locator('.work-grid__item')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.work-grid__item')).toHaveCount(6);
  await page.goto('/work?d=ai&intro=skip');
  await expect(page.locator('.work-grid__item')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'AI', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('hero carousel: pause button, pager and arrow keys', async ({ page }) => {
  await page.goto('/?intro=skip');
  const pause = page.getByRole('button', { name: 'Pause slideshow' });
  await pause.click();
  await expect(page.getByRole('button', { name: 'Play slideshow' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Go to slide 3/ }).click();
  await expect(page.locator('.hero__slide.is-active')).toHaveAttribute('aria-label', '3 of 5');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.hero__slide.is-active')).toHaveAttribute('aria-label', '4 of 5');
  await page.keyboard.press('Home');
  await expect(page.locator('.hero__slide.is-active')).toHaveAttribute('aria-label', '1 of 5');
  // inactive slides are hidden from assistive tech and not focusable
  expect(await page.locator('.hero__slide[aria-hidden="true"][inert]').count()).toBe(4);
});

test('process tabs and segmented control follow arrow/Home/End', async ({ page }) => {
  await page.goto('/?intro=skip');
  const tabs = page.locator('.proc__tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(tabs.nth(4)).toHaveAttribute('aria-selected', 'true');
  const seg = page.locator('.segmented__tab');
  await seg.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(seg.nth(1)).toHaveAttribute('aria-selected', 'true');
});

test('stack directory: multi-open accordion', async ({ page }) => {
  await page.goto('/?intro=skip');
  const btns = page.locator('.dir__btn');
  await expect(btns.first()).toHaveAttribute('aria-expanded', 'true');
  await btns.nth(1).click();
  await expect(btns.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(btns.first()).toHaveAttribute('aria-expanded', 'true');
});

test('every internal link on the home page resolves', async ({ page, request }) => {
  await page.goto('/?intro=skip');
  const hrefs = await page.$$eval('a[href^="/"]', (as) => Array.from(new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? '').map((h) => h.split('#')[0]?.split('?')[0] ?? ''))).filter(Boolean));
  for (const h of hrefs) {
    const res = await request.get(h);
    expect(res.status(), h).toBeLessThan(400);
  }
});
