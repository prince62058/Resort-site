import {test, expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.route('**/api/enquiries',route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,id:'ui-test'})}));});

test.use({viewport: {width: 320, height: 568}, reducedMotion: 'reduce', hasTouch: true, isMobile: true});
const base = 'http://localhost:5173';

test('every hero slide fits above touch controls on narrow phones', async ({page}) => {
  await page.goto(base);
  for (const width of [320, 390]) {
    await page.setViewportSize({width, height: 844});
    for (let slide = 1; slide <= 3; slide++) {
      await page.getByRole('button', {name: `Show resort photo ${slide}`}).click();
      const content = await page.locator('.carousel-content').boundingBox();
      const actions = await page.locator('.carousel-actions').boundingBox();
      const arrows = await page.locator('.carousel-prev').boundingBox();
      expect(content.x).toBeGreaterThanOrEqual(0);
      expect(content.x + content.width).toBeLessThanOrEqual(width);
      expect(content.y + content.height).toBeLessThanOrEqual(actions.y);
      expect(actions.y + actions.height).toBeLessThan(arrows.y);
    }
    await expect(page.locator('#root > .motion-toggle')).toBeHidden();
  }
});

async function expectFieldsToFit(container) {
  const issues = await container.evaluate(root => {
    const bounds = root.getBoundingClientRect();
    return [...root.querySelectorAll('input:not([aria-hidden="true"]), select, textarea')].flatMap(input => {
      const rect = input.getBoundingClientRect();
      const style = getComputedStyle(input);
      return rect.left < bounds.left || rect.right > bounds.right + 1 || rect.width < 200 ||
        rect.height < 44 || parseFloat(style.fontSize) < 16 ? [input.name || input.getAttribute('aria-label')] : [];
    });
  });
  expect(issues).toEqual([]);
  expect(await container.evaluate(root => root.scrollWidth <= root.clientWidth + 1)).toBeTruthy();
}

test('small-phone search and reservation remain usable after rotation', async ({page}) => {
  await page.goto(base);
  const search = page.locator('.search-stay');
  await expectFieldsToFit(search);
  await search.getByLabel('Check in', {exact: true}).fill('2027-06-10');
  await search.getByLabel('Check out', {exact: true}).fill('2027-06-12');
  await search.getByRole('combobox').selectOption('4');
  await search.getByRole('button').click();
  const booking = page.locator('.booking-modal');
  await expect(booking).toBeVisible();
  await expectFieldsToFit(booking);
  await expect(booking.locator('[name="in"]')).toHaveValue('2027-06-10');
  await expect(booking.locator('[name="out"]')).toHaveValue('2027-06-12');
  await expect(booking.locator('[name="guests"]')).toHaveValue('4');
  await booking.getByLabel('Your name', {exact: true}).fill('Mobile Guest');
  await booking.getByLabel('Phone number', {exact: true}).fill('9876543210');
  await booking.getByRole('button', {name: 'Send reservation enquiry'}).click();
  await expect(booking.getByRole('link', {name: 'Continue on WhatsApp'})).toHaveAttribute('href', /Mobile%20Guest/);
  await page.setViewportSize({width: 568, height: 320});
  await expectFieldsToFit(booking);
  expect((await booking.boundingBox()).height).toBeLessThanOrEqual(300);
  await booking.getByRole('button', {name: 'Close reservation'}).click();
  await expect(booking).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('mobile menu scrolls to every link and closes correctly across orientation changes', async ({page}) => {
  await page.goto(base + '/about');
  for (const selector of ['.nav-toggle', '.nav-book']) {
    const bounds = await page.locator(selector).boundingBox();
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeGreaterThanOrEqual(44);
  }
  await page.getByRole('button', {name: 'Open menu'}).click();
  const menu = page.getByRole('navigation', {name: 'Main navigation'});
  for (const viewport of [{width: 320, height: 568}, {width: 375, height: 667}, {width: 390, height: 844}, {width: 430, height: 932}]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.nav-actions .nav-book')).toBeHidden();
    const bounds = await menu.boundingBox();
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(await menu.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
    for (const target of [menu.getByRole('link', {name: 'Contact', exact: true}), menu.getByRole('link', {name: /Plan your perfect getaway/}), menu.locator('.mobile-nav-contact a')]) {
      const rect = await target.boundingBox();
      expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height);
    }
  }
  await page.setViewportSize({width: 568, height: 320});
  expect((await menu.boundingBox()).height).toBeGreaterThan(240);
  await menu.getByRole('link', {name: 'Contact', exact: true}).click();
  await expect(page).toHaveURL(/contact-us$/);
  await expect(menu).toBeHidden();
  await expect(page.locator('main')).not.toHaveAttribute('inert');
  await page.setViewportSize({width: 390, height: 844});
  await page.getByRole('button', {name: 'Open menu'}).click();
  await menu.getByRole('link', {name: /Plan your perfect getaway/}).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/plan-your-getaway$/);
  await expect(page.getByRole('heading', {level: 1, name: /Plan Your Perfect Getaway/})).toBeVisible();
  await page.getByRole('button', {name: 'Open menu'}).click();
  await menu.getByRole('link', {name: 'Stay with us', exact: true}).click();
  await expect(page.locator('.room-card')).toHaveCount(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('contact form prepares enquiry with readable fields on the smallest layout', async ({page}) => {
  await page.goto(base + '/contact-us');
  const form = page.locator('.contact-form');
  await expectFieldsToFit(form);
  await form.getByLabel('Your name').fill('Mobile Guest');
  await form.getByLabel('Email address').fill('guest@example.com');
  await form.getByLabel('Phone number').fill('9876543210');
  await form.getByLabel('What do you have in mind?').fill('Please help plan a weekend stay.');
  await form.getByRole('button', {name: 'Send enquiry'}).click();
  await expect(form.getByRole('status')).toContainText('Your enquiry has been sent');
  await expect(form.getByLabel('Your name')).toHaveValue('');
});

test('landscape gallery reserves room for controls and supports touch swipes', async ({page}) => {
  await page.setViewportSize({width: 844, height: 390});
  await page.goto(base + '/galleries/hall');
  await page.locator('.gallery-grid > button').first().click();
  const viewer = page.getByRole('dialog', {name: 'Photo viewer'});
  const image = viewer.locator(':scope > img');
  await image.evaluate(img => img.decode());
  const imageBounds = await image.boundingBox();
  const statusBounds = await viewer.locator('.lightbox-status').boundingBox();
  const closeBounds = await viewer.getByRole('button', {name: 'Close photo viewer'}).boundingBox();
  expect(imageBounds.y).toBeGreaterThan(closeBounds.y + closeBounds.height);
  expect(imageBounds.y + imageBounds.height).toBeLessThan(statusBounds.y);
  for (const name of ['Previous photo', 'Next photo', 'Close photo viewer', 'Play gallery slideshow']) {
    const button = await viewer.getByRole('button', {name, exact: true}).boundingBox();
    expect(button.height).toBeGreaterThanOrEqual(44);
    expect(button.width).toBeGreaterThanOrEqual(44);
  }
  await image.dispatchEvent('pointerdown', {pointerType: 'touch', isPrimary: true, clientX: 400, clientY: 150});
  await image.dispatchEvent('pointerup', {pointerType: 'touch', isPrimary: true, clientX: 280, clientY: 152});
  await expect(viewer).toHaveAttribute('data-slide', '1');
  await viewer.getByRole('button', {name: 'Previous photo'}).click();
  await expect(viewer).toHaveAttribute('data-slide', '0');
  await page.setViewportSize({width: 320, height: 568});
  const portraitImage = await image.boundingBox();
  expect(portraitImage.x).toBeGreaterThanOrEqual(0);
  expect(portraitImage.x + portraitImage.width).toBeLessThanOrEqual(320);
  await viewer.getByRole('button', {name: 'Close photo viewer'}).click();
  await expect(viewer).toHaveCount(0);
});
