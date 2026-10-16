import { expect, test } from '@playwright/test';
import { projects } from '../../src/content/projects';
import { site } from '../../src/content/site';

// Expected counts come from the content file, so editing projects never breaks these tests.
const countFor = (d: string) => projects.filter((p) => p.disciplines.includes(d)).length;

test.use({ colorScheme: 'dark', viewport: { width: 1440, height: 900 } });

test('mega menu: keyboard open, Escape closes and returns focus', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
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
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
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
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
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
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.locator('#site-logo').focus();
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(150);
  await expect(page.locator('#site-header')).not.toHaveAttribute('data-state', 'hidden');
});

test('search: / opens, typing finds results, Escape closes and returns focus', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Search' }).focus();
  await page.keyboard.press('Enter');
  const dlg = page.getByRole('dialog', { name: 'Search BlackUnicorn' });
  await expect(dlg).toBeVisible();
  const target = projects[1]!.title; // content-driven: survives renaming a project in projects.ts
  await page.keyboard.type(target);
  await expect(dlg.getByRole('link', { name: new RegExp(target, 'i') }).first()).toBeVisible();
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
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.getByLabel(/Your name/).focus();
  await page.keyboard.type('a/b');
  await expect(page.getByLabel(/Your name/)).toHaveValue('a/b');
  await expect(page.getByRole('dialog', { name: 'Search BlackUnicorn' })).toBeHidden();
});

test('mobile menu: traps focus, Escape closes, focus returns to the button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
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
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('motion toggle sets data-motion and persists', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Reduce motion' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
});

test('work filters write the URL, survive back/forward and clear', async ({ page }) => {
  await page.goto('/work?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Mobile', exact: true }).click();
  await expect(page).toHaveURL(/d=mobile/);
  await expect(page.locator('.work-grid__item')).toHaveCount(countFor('mobile'));
  await page.goBack();
  await expect(page.locator('.work-grid__item')).toHaveCount(projects.length);
  await page.goForward();
  await expect(page.locator('.work-grid__item')).toHaveCount(countFor('mobile'));
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.work-grid__item')).toHaveCount(projects.length);
  await page.goto('/work?d=ai&intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await expect(page.locator('.work-grid__item')).toHaveCount(countFor('ai'));
  await expect(page.getByRole('button', { name: 'AI', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('home hero: visible h1, live terminal and rotating word', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText(site.tagline);
  const lines = () => page.locator('.term__line').count();
  const start = await lines();
  await expect.poll(lines, { timeout: 12_000 }).not.toBe(start); // the build log keeps typing
  await expect(page.getByRole('link', { name: 'Start a project' }).first()).toBeVisible();
});

test('home hero: terminal shows the finished log and nothing types when motion is reduced', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await expect(page.locator('.term__line--ok').first()).toBeVisible();
  const n = await page.locator('.term__line').count();
  await page.waitForTimeout(1500);
  expect(await page.locator('.term__line').count()).toBe(n);
  expect(n).toBeGreaterThan(5);
  await ctx.close();
});

test('home has no arrow icons and uses five capability tiles', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const arrows = await page.evaluate(() => [...document.querySelectorAll('main svg.icon path, main svg.btn__arrow')].map((p) => p.getAttribute('d') ?? '').filter((d) => /^M5 12h14M13 6l6 6-6 6|^M19 12H5M11 6l-6 6 6 6|^M12 19V5M6 11l6-6 6 6|^M7 17L17 7/.test(d)).length);
  expect(arrows).toBe(0);
  await expect(page.locator('.cap__tile')).toHaveCount(5);
  await expect(page.locator('.tape__item').first()).toBeAttached();
});

test('pipeline: tabs follow arrow/Home/End, and auto-advance stops on hover', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const tabs = page.locator('.pipe__node');
  await expect(tabs).toHaveCount(5);
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(tabs.nth(4)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  // auto-advance: with the section in view and the pointer elsewhere, it moves on by itself
  await page.locator('.pipe').scrollIntoViewIfNeeded();
  await page.mouse.move(5, 5);
  await tabs.first().click();
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); // focus inside also holds it
  await page.mouse.move(5, 5);
  await expect.poll(async () => tabs.nth(1).getAttribute('aria-selected'), { timeout: 12_000 }).toBe('true');
  // hovering the pipeline holds the stage
  await page.locator('.pipe__panel').hover();
  const held = await page.locator('.pipe__node[aria-selected="true"]').getAttribute('id');
  await page.waitForTimeout(6500);
  expect(await page.locator('.pipe__node[aria-selected="true"]').getAttribute('id')).toBe(held);
});

test('work segmented control follows arrow keys, and the tick pager jumps', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const seg = page.locator('.segmented__tab');
  await seg.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(seg.nth(1)).toHaveAttribute('aria-selected', 'true');
  await seg.first().click();
  await page.getByRole('button', { name: 'Pause automatic scrolling' }).click();
  const ticks = page.locator('.tick');
  await expect(ticks).toHaveCount(projects.filter((p) => p.featured).length - 2);
  await ticks.nth(2).click();
  await expect(ticks.nth(2)).toHaveAttribute('aria-current', 'true');
});

test('studio page keeps the process tabs and the stack directory', async ({ page }) => {
  await page.goto('/studio?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const tabs = page.locator('.proc__tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(tabs.nth(4)).toHaveAttribute('aria-selected', 'true');
  const btns = page.locator('.dir__btn');
  await expect(btns.first()).toHaveAttribute('aria-expanded', 'true');
  await btns.nth(1).click();
  await expect(btns.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(btns.first()).toHaveAttribute('aria-expanded', 'true');
});

test('radar: shows developer reading with safe external links and an honest source line', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const items = page.locator('.feed__item');
  expect(await items.count()).toBeGreaterThanOrEqual(3);
  for (const rel of await items.evaluateAll((els) => els.map((e) => [e.getAttribute('rel'), e.getAttribute('target'), e.getAttribute('href')]))) {
    expect(rel[0]).toContain('noopener');
    expect(rel[1]).toBe('_blank');
    expect(rel[2]).toMatch(/^https:\/\//);
  }
  await expect(page.locator('.feed__note')).toContainText(/built|hand-picked/i);
});

test('every internal link on the home page resolves', async ({ page, request }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const hrefs = await page.$$eval('a[href^="/"]', (as) => Array.from(new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? '').map((h) => h.split('#')[0]?.split('?')[0] ?? ''))).filter(Boolean));
  for (const h of hrefs) {
    const res = await request.get(h);
    expect(res.status(), h).toBeLessThan(400);
  }
});

test('work grid cards are actually visible, before and after filtering', async ({ page }) => {
  await page.goto('/work?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  // Reveals play when a card scrolls into view, so bring each one into view before reading its opacity.
  const opaque = async () => page.evaluate(async () => {
    const cards = [...document.querySelectorAll<HTMLElement>('.work-grid .pcard')];
    for (const c of cards) { c.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 120)); }
    return cards.map((e) => Number(getComputedStyle(e).opacity));
  });
  await expect.poll(async () => (await opaque()).length).toBe(6);
  await expect.poll(async () => (await opaque()).every((o) => o === 1)).toBe(true);
  await page.getByRole('button', { name: 'Web', exact: true }).click();
  await expect(page.locator('p[role=status]')).toContainText(`Showing ${countFor('web')} web projects`);
  await expect.poll(async () => { const o = await opaque(); return o.length === countFor('web') && o.every((v) => v === 1); }).toBe(true);
});

test('navigating to another page lands at the top', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  for (const href of ['/work', '/studio', '/notes', '/contact', '/privacy']) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBeGreaterThan(300);
    await page.locator(`footer a[href="${href}"]`).first().evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(0);
  }
});

test('Services menu: "All services" opens the page at the top, from the home page and from Services itself', async ({ page }) => {
  await page.goto('/?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  const openAllServices = async () => {
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.evaluate(() => window.scrollTo(0, 380)); // scrolling up reveals the header
    await page.getByRole('button', { name: 'Services' }).click();
    await page.locator('#menu-services').getByRole('link', { name: /All services/ }).click();
  };
  await page.evaluate(() => window.scrollTo(0, 900));
  await openAllServices();
  await expect(page).toHaveURL(/\/services$/);
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(0);
  // Already on /services and scrolled down: the same link must still return to the top.
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBeGreaterThan(500);
  await openAllServices();
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(0);
});

test('mobile menu: Services reaches the Services page at the top', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/work?intro=skip');
  await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo(0, 650)); // scrolling up brings the header back
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menu = page.getByRole('dialog');
  await menu.getByRole('button', { name: 'Services' }).click();
  await menu.getByRole('link', { name: 'All services' }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(0);
});

test('"Next project" strip is always the flat brand tile, never the next project cover', async ({ page }) => {
  for (const slug of [projects[0]?.slug ?? 'signcraft', 'signcraft', projects[projects.length - 1]?.slug ?? 'signcraft']) {
    await page.goto(`/work/${slug}?intro=skip`);
    const strip = page.locator('a.next');
    await expect(strip).toHaveCount(1);
    await expect(strip.locator('img')).toHaveCount(0);
    await expect(strip.locator('.thumb-ph')).toHaveCount(1);
  }
});

test('case-study hero: single cover, or a working slider when heroImages has several', async ({ page }) => {
  for (const p of projects) {
    await page.goto(`/work/${p.slug}?intro=skip`);
    await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
    const many = (p.heroImages?.length ?? 0) > 1;
    // While a project is a draft (placeholder) it always shows the slider with its empty slots visible.
    if (p.placeholder) expect(many, `${p.slug} should have a hero slider`).toBe(true);
    if (!many) { await expect(page.locator('.phero')).toHaveCount(0); continue; }
    const n = p.heroImages!.length;
    const count = page.locator('.phero__count');
    await expect(count).toContainText(`01 / ${String(n).padStart(2, '0')}`);
    await page.getByRole('button', { name: 'Next image' }).click();
    await expect(count).toContainText(`02 / ${String(n).padStart(2, '0')}`);
    await page.getByRole('button', { name: new RegExp(`Show image ${n}:`) }).click();
    await expect(count).toContainText(`${String(n).padStart(2, '0')} / ${String(n).padStart(2, '0')}`);
    await page.getByRole('button', { name: 'Next image' }).click();
    await expect(count).toContainText(`01 / ${String(n).padStart(2, '0')}`);
    await page.locator('.phero__track').focus();
    await page.keyboard.press('End');
    await expect(count).toContainText(`${String(n).padStart(2, '0')} / ${String(n).padStart(2, '0')}`);
  }
});

test.describe('home work carousel', () => {
  const visibleTitles = (page: import('@playwright/test').Page) => page.evaluate(() => {
    const rail = document.querySelector('.rail') as HTMLElement;
    const r = rail.getBoundingClientRect();
    return [...rail.querySelectorAll<HTMLElement>('.rail__item')]
      .filter((el) => { const b = el.getBoundingClientRect(); return b.left >= r.left - 2 && b.right <= r.right + 2; })
      .map((el) => el.querySelector('h3')?.textContent?.replace(/placeholder/i, '').trim() ?? '');
  });

  test('shows three cards, has no scrollbar, and the arrows move one card at a time', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?intro=skip');
    await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
    const rail = page.locator('.rail');
    await rail.scrollIntoViewIfNeeded();
    const featured = projects.filter((p) => p.featured);
    expect(await visibleTitles(page)).toHaveLength(3);
    // no visible scrollbar: the box is as tall as its content area
    expect(await rail.evaluate((el) => (el as HTMLElement).offsetHeight - el.clientHeight)).toBe(0);
    await page.getByRole('button', { name: 'Pause automatic scrolling' }).click(); // keep the test deterministic
    const first = await visibleTitles(page);
    await page.getByRole('button', { name: 'Next projects' }).click();
    await expect.poll(async () => (await visibleTitles(page))[0]).toBe(featured[1]?.title.trim());
    expect((await visibleTitles(page)).slice(0, 2)).toEqual(first.slice(1, 3));
    // wraps around instead of dead-ending
    for (let i = 0; i < featured.length - 3; i++) await page.getByRole('button', { name: 'Next projects' }).click();
    await expect.poll(async () => (await visibleTitles(page))[0]).toBe(featured[0]?.title.trim());
  });

  test('advances every 5 seconds, and stops while a card is hovered', async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?intro=skip');
    await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
    await page.locator('.rail').scrollIntoViewIfNeeded();
    const start = (await visibleTitles(page))[0];
    // hovering a card holds the carousel for well over 5 seconds
    await page.locator('.rail__item').first().hover();
    await page.waitForTimeout(6500);
    expect((await visibleTitles(page))[0]).toBe(start);
    // moving the mouse away lets it run again
    await page.mouse.move(5, 5);
    await expect.poll(async () => (await visibleTitles(page))[0], { timeout: 9000 }).not.toBe(start);
  });
});

test.describe('closing band animation', () => {
  const embers = (page: import('@playwright/test').Page) => page.evaluate(() => {
    const cv = document.querySelector('.cta__fx canvas') as HTMLCanvasElement;
    const d = cv.getContext('2d')!.getImageData(0, 0, cv.width, cv.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) n++;
    return n;
  });

  test('the gauge sweeps and embers rise while the band is on screen', async ({ page }) => {
    await page.goto('/?intro=skip');
    await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const needle = () => page.locator('.cta__needle').evaluate((el) => getComputedStyle(el).transform);
    const a = await needle();
    await page.waitForTimeout(1200);
    expect(await needle()).not.toBe(a);
    await expect.poll(() => embers(page), { timeout: 6000 }).toBeGreaterThan(0);
  });

  test('nothing moves for visitors who prefer reduced motion', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/?intro=skip');
    await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(await embers(page)).toBe(0);
    const a = await page.locator('.cta__needle').evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(1000);
    expect(await page.locator('.cta__needle').evaluate((el) => getComputedStyle(el).transform)).toBe(a);
    await ctx.close();
  });

  test('form labels are readable on the band (contrast)', async ({ page }) => {
    await page.goto('/?intro=skip');
    await page.locator('html[data-ready=true]').waitFor({ state: 'attached' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const label = page.locator('.cta__form label').first();
    const [fg, bg] = await Promise.all([
      label.evaluate((el) => getComputedStyle(el).color),
      page.locator('.cta__panel').evaluate((el) => getComputedStyle(el).backgroundColor),
    ]);
    const lum = (c: string) => {
      const m = (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * (m[0] ?? 0) + 0.7152 * (m[1] ?? 0) + 0.0722 * (m[2] ?? 0);
    };
    const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x) as [number, number];
    expect((l1 + 0.05) / (l2 + 0.05)).toBeGreaterThanOrEqual(4.5);
  });
});
