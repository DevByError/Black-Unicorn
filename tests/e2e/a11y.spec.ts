import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const ROUTES = ['/', '/work', '/work/signcraft', '/work/2d-spriteforge', '/services', '/studio', '/notes', '/notes/budget-milliseconds-first', '/contact', '/privacy', '/accessibility', '/does-not-exist'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function audit(page: Page, label: string) {
  const res = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const bad = res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${label}: ${v.id} (${v.impact}) ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
}

for (const theme of ['dark', 'light'] as const) {
  test.describe(`axe @ ${theme}`, () => {
    test.use({ colorScheme: theme, viewport: { width: 1440, height: 900 } });
    for (const route of ROUTES) {
      test(`${route}`, async ({ page }) => {
        await page.goto(`${route}${route.includes('?') ? '&' : '?'}intro=skip`);
        await page.waitForLoadState('networkidle');
        await audit(page, route);
      });
    }
  });
}

test.describe('axe on interactive states', () => {
  test.use({ colorScheme: 'dark', viewport: { width: 1440, height: 900 } });

  test('mega menu open', async ({ page }) => {
    await page.goto('/?intro=skip');
    await page.getByRole('button', { name: 'Work' }).click();
    await expect(page.locator('#menu-work')).toBeVisible();
    await page.waitForTimeout(700); // let the 260ms reveal finish: axe would otherwise read mid-fade colours
    await audit(page, 'mega');
  });
  test('search open', async ({ page }) => {
    await page.goto('/?intro=skip');
    await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
    await page.keyboard.press('/');
    await expect(page.getByRole('dialog', { name: 'Search BlackUnicorn' })).toBeVisible();
    await audit(page, 'search');
  });
  test('contact form errors', async ({ page }) => {
    await page.goto('/contact?intro=skip');
    await page.waitForTimeout(2200); // minimum fill time
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
    await audit(page, 'form-errors');
  });
  test('mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?intro=skip');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    await audit(page, 'mobile-menu');
  });
});
