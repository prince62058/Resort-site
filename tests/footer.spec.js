import {test, expect} from '@playwright/test';

test('footer keeps resort information and provides working guest actions', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('http://localhost:5173');
  const footer = page.getByRole('contentinfo');
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.locator('address')).toContainText('736,738, Gram Badgonda');
  await expect(footer.locator('address')).toContainText('near Badgonda Balaji Temple');
  await expect(footer.locator('address')).toContainText('Dr. Ambedkar Nagar (Mhow), Indore, India 453441');
  await expect(footer.locator('a[href="tel:+917777878822"]')).toHaveText(/077778 78822/);
  await expect(footer.locator('a[href="mailto:info@thenaturenestresort.com"]')).toBeVisible();
  await expect(footer.getByRole('link', {name: /The Nature Nest on/})).toHaveCount(3);
  await footer.getByRole('button', {name: 'FAQ', exact: true}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('A few helpful answers.');
  await dialog.getByText('How do I book a stay?', {exact: true}).click();
  await expect(dialog.getByText(/Our team will confirm availability/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(footer.getByRole('button', {name: 'FAQ', exact: true})).toBeFocused();
  for (const [button, request] of [['Privacy', 'Request privacy policy'], ['Terms & conditions', 'Request booking terms']]) {
    await footer.getByRole('button', {name: button, exact: true}).click();
    await expect(page.getByRole('dialog').getByRole('link', {name: request})).toHaveAttribute('href', /^mailto:info@thenaturenestresort.com/);
    await page.getByRole('button', {name: 'Close guest information'}).click();
  }
  await footer.getByRole('button', {name: 'Book your escape', exact: true}).click();
  await expect(page.locator('.booking-modal')).toBeVisible();
  await page.getByRole('button', {name: 'Close reservation'}).click();
  await footer.getByRole('link', {name: 'Guest support', exact: true}).click();
  await expect(page).toHaveURL(/contact-us$/);
});

test('newsletter validates email and prepares an unsent request; mobile controls stay clear', async ({page}) => {
  await page.setViewportSize({width:390, height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('http://localhost:5173');
  const footer = page.getByRole('contentinfo');
  const email = footer.getByRole('textbox', {name:'Your email address'});
  await email.fill('invalid');
  await footer.getByRole('button', {name:'Prepare newsletter request'}).click();
  await expect(footer.getByRole('status')).toHaveCount(0);
  await email.fill('guest@example.com');
  await footer.getByRole('button', {name:'Prepare newsletter request'}).click();
  const send = footer.getByRole('link', {name:'Open email app to send'});
  await expect(send).toHaveAttribute('href', /mailto:info@thenaturenestresort.com.*guest%40example.com/);
  await expect(footer.getByRole('status')).toContainText('Your email request is ready.');
  await email.fill('another@example.com');
  await expect(footer.getByRole('status')).toHaveCount(0);
  const motion = footer.getByRole('button', {name:'Play all animations'});
  await expect(motion).toHaveCount(1);
  await expect(motion).toHaveCSS('position','static');
  await motion.click();
  await expect(footer.getByRole('button', {name:'Pause all animations'})).toBeVisible();
  await footer.getByRole('button', {name:'Back to top'}).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('.site-header .nav-brand')).toBeFocused();
  for(const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
