import { test, expect } from '@playwright/test';
import seed from '../shared/seed.json' with { type: 'json' };

async function prepare(page, change = () => {}) {
  const content = structuredClone(seed);
  change(content.reels);
  await page.route('**/api/content', route => route.fulfill({ json: { content, redirects: {} } }));
  // Third-party playback is outside our control. Test our navigation with a
  // deterministic embed response, not a claim that Instagram played a video.
  await page.route('https://www.instagram.com/**', route => route.fulfill({ contentType: 'text/html', body: '<p>Instagram embed test fixture</p>' }));
  await page.goto('http://localhost:5173/');
}

test('reel cards load Instagram only on tap, browse in one dialog and restore focus', async ({ page }) => {
  const instagramRequests = [];
  page.on('request', request => { if (request.url().startsWith('https://www.instagram.com/')) instagramRequests.push(request.url()); });
  await prepare(page);
  const first = page.getByRole('button', { name: 'Watch reel: ' + seed.reels.items[0].title });
  await expect(first).toBeVisible();
  expect(instagramRequests).toHaveLength(0);
  await first.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.reel-player-stage iframe')).toHaveAttribute('src', seed.reels.items[0].url + 'embed/');
  await page.getByRole('button', { name: 'Next reel', exact: true }).click();
  await expect(page.locator('.reel-player-stage iframe')).toHaveCount(1);
  await expect(page.locator('.reel-player-stage iframe')).toHaveAttribute('src', seed.reels.items[1].url + 'embed/');
  await expect(page.getByRole('link', { name: 'Open Instagram', exact: true })).toHaveAttribute('href', seed.reels.items[1].url);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(first).toBeFocused();
  await page.getByRole('button', { name: 'Minimize reels' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: /Watch our reels/ })).toBeVisible();
  await page.getByRole('button', { name: /Watch our reels/ }).click();
  await expect(first).toBeVisible();
});

test('reels fit small phones and hide behind booking', async ({ page }) => {
  await prepare(page);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator('.reel-dock')).toBeVisible();
    const dock = await page.locator('.reel-dock').boundingBox();
    expect(dock.x).toBeGreaterThanOrEqual(0);
    expect(dock.x + dock.width).toBeLessThanOrEqual(width);
    await page.getByRole('button', { name: 'Watch reel: ' + seed.reels.items[0].title }).click();
    await expect(page.locator('.reel-dock')).not.toBeVisible();
    const box = await page.getByRole('dialog').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(await page.getByRole('dialog').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await page.getByRole('button', { name: 'Close reel player' }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Find your escape', exact: true }).click();
  await expect(page.locator('.booking-modal')).toBeVisible();
  await expect(page.locator('.reel-dock')).toHaveCount(0);
});

test('disabled and invalid reels stay hidden; a disabled widget makes no embed requests', async ({ page }) => {
  await prepare(page, reels => { reels.items[0].enabled = false; reels.items[1].url = 'https://evil.example/reel/test/'; });
  await expect(page.locator('.reel-dock')).toHaveCount(0);
  await prepare(page, reels => { reels.enabled = false; });
  await expect(page.locator('.reel-dock')).toHaveCount(0);
});

test('a failed native video falls back to the Instagram player', async ({ page }) => {
  await page.route('https://media.example.test/nest.mp4', route => route.abort());
  await prepare(page, reels => { reels.items[0].videoUrl = 'https://media.example.test/nest.mp4'; });
  await page.getByRole('button', { name: 'Watch reel: ' + seed.reels.items[0].title }).click();
  await expect(page.locator('.reel-player-stage iframe')).toHaveAttribute('src', seed.reels.items[0].url + 'embed/');
  await expect(page.getByRole('link', { name: 'Open Instagram' })).toBeVisible();
});

test('native preview plays muted, respects pause motion and uses the larger native player', async ({ page }) => {
  // A tiny synthetic clip avoids an external video dependency in this test.
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 96;
    const context = canvas.getContext('2d'); const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];
    const finished = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.ondataavailable = event => chunks.push(event.data);
    recorder.start();
    for (let i = 0; i < 6; i++) { context.fillStyle = i % 2 ? '#284932' : '#9ba879'; context.fillRect(0, 0, 64, 96); await new Promise(resolve => setTimeout(resolve, 100)); }
    recorder.stop(); await finished; stream.getTracks().forEach(track => track.stop());
    return [...new Uint8Array(await new Blob(chunks).arrayBuffer())];
  });
  await page.route('https://media.example.test/nest.webm', route => route.fulfill({ contentType: 'video/webm', body: Buffer.from(bytes) }));
  await prepare(page, reels => { reels.items[0].videoUrl = 'https://media.example.test/nest.webm'; });
  const preview = page.locator('.reel-preview video');
  await expect.poll(() => preview.evaluate(el => !el.paused && el.currentTime > 0 && el.muted)).toBe(true);
  await page.locator('#welcome').scrollIntoViewIfNeeded();
  const dock = await page.locator('.reel-dock').boundingBox();
  const motion = await page.locator('.motion-toggle').boundingBox();
  expect(dock.x + dock.width <= motion.x || dock.y + dock.height <= motion.y || motion.y + motion.height <= dock.y).toBe(true);
  await page.getByRole('button', { name: 'Pause all animations' }).click();
  await expect.poll(() => preview.evaluate(el => el.paused)).toBe(true);
  await page.getByRole('button', { name: 'Watch reel: ' + seed.reels.items[0].title }).click();
  await expect(page.locator('.reel-player-stage video')).toHaveAttribute('controls', '');
  await expect(page.locator('.reel-player-stage iframe')).toHaveCount(0);
  await expect.poll(() => page.locator('.reel-player-stage video').evaluate(el => !el.paused && el.currentTime > 0)).toBe(true);
});
