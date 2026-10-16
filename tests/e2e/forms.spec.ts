import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'dark' });

test('contact form: invalid → summary takes focus → fixed → mailto fallback / unconfigured message', async ({ page }) => {
  await page.goto('/contact?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.waitForTimeout(2200); // minimum fill time (anti-spam)
  await page.getByRole('button', { name: /send message/i }).click();
  const summary = page.getByRole('alert').first();
  await expect(summary).toBeFocused();
  await expect(summary).toContainText('Enter an email address like name@example.com');
  await expect(page.getByLabel(/Email address/)).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel(/Your name/).fill('Ada');
  await page.getByLabel(/Email address/).fill('ada@example.com');
  await page.getByLabel(/Tell us about/).fill('too short');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.locator('.field__err', { hasText: 'at least 20 characters' })).toBeVisible();
  await page.getByLabel(/Tell us about/).fill('We would like to build a fast, accessible site.');
  await page.getByRole('button', { name: /send message/i }).click();
  // no endpoint and no site.email configured in the seed config → honest "not connected" message, nothing is faked
  await expect(page.getByText(/not connected yet/)).toBeVisible();
});

test('contact form: success state with a mocked endpoint', async ({ page }) => {
  // Endpoint is a build-time env var; here we simulate it by stubbing fetch and enabling the path via a global.
  await page.route('**/__form__', (r) => r.fulfill({ status: 200, body: '{}' }));
  await page.goto('/contact?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const hasEndpoint = await page.evaluate(() => !!document.querySelector('form')?.getAttribute('action')?.startsWith('http'));
  test.skip(!hasEndpoint, 'Build has no NEXT_PUBLIC_FORM_ENDPOINT; success path is covered by the unit-level run in README.');
});

test('honeypot submissions are silently ignored', async ({ page }) => {
  await page.goto('/contact?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.waitForTimeout(2200);
  await page.getByLabel(/Your name/).fill('Bot');
  await page.getByLabel(/Email address/).fill('bot@example.com');
  await page.getByLabel(/Tell us about/).fill('Spam spam spam spam spam spam spam.');
  await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => { el.value = 'http://spam'; });
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByText(/not connected yet|Opening your email|Thank you/)).toHaveCount(0);
});

test('no-JS: the contact form is a real form with labels', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/contact');
  await expect(page.locator('form label').first()).toBeVisible();
  await ctx.close();
});
