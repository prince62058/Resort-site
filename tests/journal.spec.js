import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('blog navigation, category filters, search and articles work together', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:5173/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Blog', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stories for aslower kind of life.');
  await expect(page.locator('.journal-feature h2')).toContainText('What makes a resort feel like an escape?');
  await expect(page.locator('.journal-story-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Stay stories', exact: true }).click();
  await expect(page.locator('.journal-story-card')).toHaveCount(1);
  await expect(page.locator('.journal-story-card')).toContainText('A cottage or a villa?');
  await page.getByRole('button', { name: 'All stories', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search stories' }).fill('nothing-matches-this-story');
  await expect(page.getByRole('heading', { name: 'A different path, perhaps?' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await expect(page.locator('.journal-story-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Stay stories', exact: true }).click();
  await expect(page.locator('.journal-story-card')).toHaveCount(1);
  await page.locator('.journal-story-card').getByRole('link').click();
  await expect(page).toHaveURL(/\/blog\/cottage-or-private-villa-choose-your-stay-mhow$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A cottage or a villa? Find your kind of stay.');
  await expect(page.locator('.journal-prose')).toContainText('Start with your people');
  await page.getByRole('navigation', { name: 'Story sections' }).getByRole('link', { name: 'Look beyond the starting rate' }).click();
  await expect(page.getByRole('heading', { name: 'Look beyond the starting rate' })).toBeInViewport();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/blog\/cottage-or-private-villa-choose-your-stay-mhow$/);
  await expect(page.locator('.journal-related .journal-story-card')).toHaveCount(3);
  await page.getByRole('link', { name: 'Explore all stories', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test('blog and story layouts fit small phones, tablets and desktop without covering the header', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mkdir('output/journal', { recursive: true });
  for (const width of [320, 390, 768, 1100, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('http://localhost:5173/blog');
    await expect(page.locator('.journal-feature-photo img').first()).toBeVisible();
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.locator('.journal-intro h1').boundingBox();
    expect(title.y).toBeGreaterThanOrEqual(header.y + header.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const selector of ['.journal-story-grid', '.journal-invitation']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator(selector).locator('img').evaluateAll(imgs => imgs.length > 0 && imgs.every(img => img.naturalWidth > 0))).toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    if ([390, 1440].includes(width)) await page.screenshot({ path: `output/journal/blog-${width}.png`, fullPage: true });
    if (width === 390) {
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Blog/ }).click();
      await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeVisible();
    }
    await page.goto('http://localhost:5173/blog/slow-weekend-getaway-mhow-near-indore');
    await expect(page.locator('.journal-prose')).toBeVisible();
    await expect.poll(() => page.locator('.journal-article-cover img').first().evaluate(img => img.naturalWidth > 0)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([390, 1440].includes(width)) await page.screenshot({ path: `output/journal/article-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});
