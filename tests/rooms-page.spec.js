import {test, expect} from '@playwright/test';
const url = 'http://localhost:5173/rooms';

test('stay filters and price sorting keep all original listings and open the selected enquiry', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto(url);
  const cards = page.locator('.room-card');
  await expect(cards).toHaveCount(12);
  await page.getByRole('button', {name: 'Cottages', exact: true}).click();
  await expect(cards).toHaveCount(3);
  await expect(page.getByRole('button', {name: 'Cottages', exact: true})).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', {name: 'Private villas', exact: true}).click();
  await expect(cards).toHaveCount(9);
  await page.getByLabel('Sort stays').selectOption('price-low');
  const prices = await cards.evaluateAll(elements => elements.map(element => Number(element.dataset.price)));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
  await expect(cards.first()).toHaveAttribute('data-room', 'private-villa-6');
  await cards.first().getByRole('button', {name: 'Enquire about Private Villa 6'}).click();
  await expect(page.locator('.booking-modal select[name="room"]')).toHaveValue('Private Villa 6');
  await page.getByRole('button', {name: 'Close reservation'}).click();
  await page.getByLabel('Sort stays').selectOption('price-high');
  await expect(cards.first()).toHaveAttribute('data-room', 'private-villa-1');
  await page.getByRole('button', {name: 'All stays', exact: true}).click();
  await expect(cards).toHaveCount(12);
  await cards.first().getByRole('link', {name: 'View stay'}).click();
  await expect(page).toHaveURL(/rooms\/private-villa-1$/);
});

test('room photo controls, inspiration slides and compact mobile toolbar work', async ({page}) => {
  await page.setViewportSize({width: 320, height: 568});
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto(url);
  const hero = page.locator('.stays-hero .photo-slideshow');
  await page.getByRole('button', {name: 'Next stay inspiration'}).click();
  await expect(hero).toHaveAttribute('data-slide', '1');
  await page.getByRole('button', {name: 'Previous stay inspiration'}).click();
  await expect(hero).toHaveAttribute('data-slide', '0');
  const first = page.locator('.room-card').first();
  await first.getByRole('button', {name: 'Next photo of Luxury Left Cottage'}).click();
  await expect(first.locator('.photo-slideshow')).toHaveAttribute('data-slide', '1');
  await first.getByRole('button', {name: 'Previous photo of Luxury Left Cottage'}).click();
  await expect(first.locator('.photo-slideshow')).toHaveAttribute('data-slide', '0');
  await expect(page.locator('.stays-motion-dock .motion-toggle')).toHaveCSS('position', 'static');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({width, height: 900});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(await page.locator('.stays-toolbar').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();
  }
  await page.setViewportSize({width: 390, height: 844});
  await page.getByRole('button', {name: 'Help me choose', exact: true}).click();
  await expect(page.locator('.booking-modal select[name="room"]')).toHaveValue('Help me choose');
});
