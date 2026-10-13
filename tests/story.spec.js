import {test, expect} from '@playwright/test';

test('our story cycles through all three images and keeps captions and controls in sync', async ({page}) => {
  await page.clock.install();
  await page.goto('http://localhost:5173/about');
  const story = page.locator('.our-story');
  const photo = story.locator('.photo-slideshow');
  await story.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  for (const index of [1, 2, 0]) {
    await expect(photo).toHaveAttribute('data-playing', 'true');
    await page.clock.fastForward(5800);
    await expect(photo).toHaveAttribute('data-slide', String(index));
    await expect(story.locator('.story-chapters button').nth(index)).toHaveAttribute('aria-pressed', 'true');
    await expect(story.locator('.story-image-caption > span')).toContainText(`0${index + 1} / 03`);
  }
  await story.locator('.story-media').hover();
  await expect(photo).toHaveAttribute('data-playing', 'false');
  await page.clock.fastForward(7000);
  await expect(photo).toHaveAttribute('data-slide', '0');
  await page.getByRole('button', {name: 'Pause story slideshow'}).click();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(7000);
  await expect(photo).toHaveAttribute('data-slide', '0');
  await page.getByRole('button', {name: 'Next story image'}).click();
  await expect(photo).toHaveAttribute('data-slide', '1');
  await page.getByRole('button', {name: 'Previous story image'}).click();
  await expect(photo).toHaveAttribute('data-slide', '0');
  await page.getByRole('button', {name: 'Show story image 3: Belong'}).click();
  await expect(photo).toHaveAttribute('data-slide', '2');
  await expect(story.locator('h3')).toHaveText('Good company. Golden evenings.');
  await expect(story.getByRole('link', {name: 'Find your space'})).toHaveAttribute('href', '/rooms');
  await page.getByRole('button', {name: 'Show story image 1: Arrive'}).click();
  await expect(photo).toHaveAttribute('data-slide', '0');
  await story.screenshot({path: 'output/qa/our-story-desktop.png', animations: 'disabled'});
});

test('our story fits mobile and allows manual selection with reduced motion', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('http://localhost:5173/about');
  const story = page.locator('.our-story');
  const photo = story.locator('.photo-slideshow');
  await photo.scrollIntoViewIfNeeded();
  await expect(photo).toHaveAttribute('data-playing', 'false');
  await page.getByRole('button', {name: 'Show story image 2: Unwind'}).click();
  await expect(photo).toHaveAttribute('data-slide', '1');
  await expect(story.locator('h3')).toHaveText('Take the scenic way to nowhere.');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await story.screenshot({path: 'output/qa/our-story-mobile.png', animations: 'disabled'});
});
