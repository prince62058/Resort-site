import {test, expect} from '@playwright/test';

test('every home photo sequence loads and cycles, including the closing banner', async ({page}) => {
  await page.clock.install();
  await page.goto('http://localhost:5173/');
  const sequences = page.locator('.home-slideshow');
  await expect(sequences).toHaveCount(15);
  for (let i = 0; i < await sequences.count(); i++) {
    const sequence = sequences.nth(i);
    await sequence.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const seen = new Set();
    for (let step = 0; step < 3; step++) {
      await expect(sequence).toHaveAttribute('data-playing', 'true');
      const current = Number(await sequence.getAttribute('data-slide'));
      seen.add(current);
      expect(await sequence.locator('.is-visible').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
      await page.clock.fastForward(6300);
      await expect(sequence).toHaveAttribute('data-slide', String((current + 1) % 3));
    }
    expect(seen.size).toBe(3);
  }
  const closing = page.locator('.closing-banner .home-slideshow');
  await page.locator('.closing-banner h2').hover();
  await expect(closing).toHaveAttribute('data-playing', 'true');
  const current = Number(await closing.getAttribute('data-slide'));
  await page.clock.fastForward(6300);
  await expect(closing).toHaveAttribute('data-slide', String((current + 1) % 3));
  await page.getByRole('button', {name: 'Pause all animations'}).click();
  await expect(page.locator('.home-slideshow[data-playing="true"]')).toHaveCount(0);
  await expect(closing.locator('.is-visible')).toHaveCSS('animation-play-state', 'paused');
  await page.locator('.closing-banner').screenshot({path: 'output/qa/home-closing-motion.png', animations: 'disabled'});
  await page.getByRole('button', {name: 'Plan your stay'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('home photos continue on hover and respect keyboard focus, pause and mobile motion preference', async ({page}) => {
  await page.clock.install();
  await page.goto('http://localhost:5173/');
  const card = page.locator('.signature-card').first();
  const photo = card.locator('.home-slideshow');
  await card.hover();
  await expect(photo).toHaveAttribute('data-playing', 'true');
  const current = Number(await photo.getAttribute('data-slide'));
  await page.clock.fastForward(5000);
  await expect(photo).toHaveAttribute('data-slide', String((current + 1) % 3));
  await card.focus();
  await expect(photo).toHaveAttribute('data-playing', 'false');
  await page.getByRole('button', {name: 'Pause all animations'}).click();
  await expect(photo.locator('.is-visible')).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', {name: 'Play all animations'}).click();
  await expect(photo).toHaveAttribute('data-playing', 'true');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('http://localhost:5173/');
  await expect(page.locator('.resort-carousel')).toHaveAttribute('data-playing', 'false');
  await expect(page.locator('.carousel-photograph.is-active img')).toHaveCSS('animation-name', 'none');
  await page.locator('.story-pictures').scrollIntoViewIfNeeded();
  await expect(page.locator('.story-wide .home-slideshow')).toHaveAttribute('data-playing', 'false');
  await expect(page.locator('.story-wide .is-visible')).toHaveCSS('animation-name', 'none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.story-pictures').screenshot({path: 'output/qa/home-mobile-motion.png', animations: 'disabled'});
});
