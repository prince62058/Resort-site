import {test, expect} from '@playwright/test';
const base = 'http://localhost:5173';

test('home shows the getaway options and each button opens WhatsApp with its own message', async ({page}) => {
  await page.goto(base + '/');
  const section = page.locator('.getaway-section');
  await expect(section.getByRole('heading', {name: /Plan Your Perfect Getaway/})).toBeVisible();
  await expect(section.locator('.getaway-card')).toHaveCount(8);
  const wedding = section.getByRole('link', {name: /Check Availability: Wedding & Marriage Booking/});
  const href = decodeURIComponent(await wedding.getAttribute('href'));
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(href).toContain('Wedding & Marriage Booking');
  await expect(wedding).toHaveAttribute('target', '_blank');
  await expect(wedding).toHaveAttribute('rel', /noopener/);
});

test('header button opens the getaway page with all options and the footer', async ({page}) => {
  await page.goto(base + '/about');
  await page.getByRole('link', {name: 'Plan your perfect getaway'}).first().click();
  await expect(page).toHaveURL(/\/plan-your-getaway$/);
  await expect(page.getByRole('heading', {level: 1, name: /Plan Your Perfect Getaway/})).toBeVisible();
  await expect(page.locator('.getaway-card')).toHaveCount(8);
  await expect(page.getByRole('contentinfo')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('WhatsApp widget lists every booking point and links to WhatsApp', async ({page}) => {
  await page.goto(base + '/');
  await page.getByRole('button', {name: /whatsapp/i}).click();
  const panel = page.getByRole('dialog');
  await expect(panel.locator('.wa-options a')).toHaveCount(8);
  const href = decodeURIComponent(await panel.locator('.wa-options a').nth(1).getAttribute('href'));
  expect(href).toContain('Birthday & Private Party Booking');
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
});
