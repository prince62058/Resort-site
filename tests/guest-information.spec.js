import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('guest documents are readable across phones and desktop, with working contents links', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mkdir('output/guest-information', { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:5173/privacy-policy');
    await expect(page.locator('h1')).toHaveText('Your information,treated with care.');
    await expect(page).toHaveTitle('Privacy policy | The Nature Nest, Mhow');
    await expect(page.locator('.guest-document')).toContainText('info@thenaturenestresort.com');
    await expect(page.locator('.guest-document')).not.toContainText('{{');
    const header = await page.locator('.site-header').boundingBox();
    const breadcrumb = await page.locator('.guest-breadcrumb').boundingBox();
    expect(breadcrumb.y).toBeGreaterThanOrEqual(header.y + header.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([390, 1440].includes(width)) await page.screenshot({ path: `output/guest-information/privacy-${width}.png` });
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: /Your choices and privacy requests/ }).click();
    await expect(page.getByRole('heading', { name: 'Your choices and privacy requests', exact: true })).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test('contact, booking and subscription notices link to published policies', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/contact-us');
  await expect(page.locator('.contact-form').getByRole('link', { name: 'Privacy policy', exact: true })).toHaveAttribute('href', '/privacy-policy');
  await expect(page.getByRole('link', { name: 'Chat on WhatsApp', exact: true })).toHaveAttribute('href', 'https://wa.me/917777878822');
  await expect(page.locator('.guest-help-links a')).toHaveCount(5);
  await expect(page.locator('.nest-newsletter').getByRole('link', { name: 'Unsubscribe by email' })).toHaveAttribute('href', 'mailto:info@thenaturenestresort.com?subject=Unsubscribe');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('contentinfo').getByRole('button', { name: 'Book your escape', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('link', { name: 'Privacy policy', exact: true })).toHaveAttribute('href', '/privacy-policy');
  await expect(dialog.getByRole('link', { name: 'Booking terms', exact: true })).toHaveAttribute('href', '/terms-and-conditions');
  await expect(dialog.getByRole('link', { name: 'Cancellation & refunds', exact: true })).toHaveAttribute('href', '/cancellation-refund-policy');
  await dialog.getByRole('link', { name: 'Booking terms', exact: true }).click();
  await expect(page).toHaveURL(/terms-and-conditions$/);
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.guest-document')).toBeVisible();
});
