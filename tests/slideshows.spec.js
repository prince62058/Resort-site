import {test, expect} from '@playwright/test';

async function waitForFrames(slideshow) {
  await expect(slideshow.locator('img')).toHaveCount(2);
  await slideshow.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
}

test('stay photos autoplay, hover pauses, global motion controls all sections', async ({page}) => {
  await page.clock.install();
  await page.goto('http://localhost:5173/rooms');
  const photo = page.locator('.room-card .photo-slideshow').first();
  await photo.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await waitForFrames(photo);
  await expect(photo).toHaveAttribute('data-playing', 'true');
  await page.clock.fastForward(6700);
  await expect(photo).toHaveAttribute('data-slide', '1');
  await photo.hover();
  await expect(photo).toHaveAttribute('data-playing', 'false');
  await page.clock.fastForward(9000);
  await expect(photo).toHaveAttribute('data-slide', '1');
  await page.getByRole('button', {name: 'Pause all animations'}).click();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(10000);
  await expect(photo).toHaveAttribute('data-slide', '1');
  await page.getByRole('button', {name: 'Play all animations'}).click();
  // The rooms page docks motion controls in its toolbar; return to the photo
  // before checking playback, which intentionally pauses while off screen.
  await photo.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await photo.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await expect(photo).toHaveAttribute('data-playing', 'true');
  await page.clock.fastForward(6700);
  await expect(photo).toHaveAttribute('data-slide', '2');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(photo).toHaveAttribute('data-playing', 'false');
});

test('room autoplay keeps counter and thumbnails synchronized', async ({page}) => {
  await page.clock.install();
  await page.goto('http://localhost:5173/rooms/luxury-left-cottage');
  const photo = page.locator('.detail-image .photo-slideshow');
  await photo.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await waitForFrames(photo);
  await expect(photo).toHaveAttribute('data-playing', 'true');
  await page.clock.fastForward(6700);
  await expect(photo).toHaveAttribute('data-slide', '1');
  await expect(page.locator('.detail-image>span')).toHaveText(/^2 \/ /);
  await expect(page.locator('.thumbnails button').nth(1)).toHaveClass('selected');
  await page.getByRole('button', {name: 'Show room photo 4', exact: true}).click();
  await expect(photo).toHaveAttribute('data-slide', '3');
  await expect(page.locator('.detail-image>span')).toHaveText(/^4 \/ /);
});

test('gallery slideshow and reduced motion setting', async ({page}) => {
  await page.clock.install();
  await page.goto('http://localhost:5173/galleries/hall');
  await page.locator('.gallery-grid>button').first().click();
  await expect(page.getByRole('dialog')).toHaveAttribute('data-slide', '0');
  await page.mouse.move(0, 0);
  await page.clock.fastForward(6700);
  await expect(page.getByRole('dialog')).toHaveAttribute('data-slide', '1');
  await page.getByRole('button', {name: 'Pause gallery slideshow'}).click();
  await page.clock.fastForward(10000);
  await expect(page.getByRole('dialog')).toHaveAttribute('data-slide', '1');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('http://localhost:5173/about');
  await expect(page.getByRole('button', {name: 'Play all animations'})).toBeVisible();
  await expect(page.locator('.page-hero .photo-slideshow')).toHaveAttribute('data-playing', 'false');
});
