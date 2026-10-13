import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.route('**/api/enquiries',route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,id:'ui-test'})}));});
test('pages, original assets and enquiry journey',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5173');
 await expect(page.getByRole('heading',{name:/Where life/})).toBeVisible();
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{})})));
 await page.screenshot({path:'tests/home-desktop.png',fullPage:true});
 await page.getByRole('link',{name:'Stay with us',exact:true}).click();
 await expect(page.locator('.room-card')).toHaveCount(12);
 await page.getByRole('button',{name:'Cottages',exact:true}).click();
 await expect(page.locator('.room-card')).toHaveCount(3);
 await page.locator('.room-card h3').first().click();
 await expect(page.locator('.detail-image .photo-frame.is-visible')).toBeVisible();
 await page.getByRole('button',{name:'Next room image'}).click();
 await expect(page.locator('.detail-image>span')).toContainText('2 /');
 await page.getByRole('button',{name:'Enquire about this stay'}).click();
 await page.getByLabel('Your name',{exact:true}).fill('Test Guest');
 await page.getByLabel('Phone number',{exact:true}).fill('9876543210');
 await page.locator('[name="in"]').fill('2027-01-10');
 await page.locator('[name="out"]').fill('2027-01-12');
 await page.getByRole('button',{name:'Send reservation enquiry'}).click();
 await expect(page.getByRole('link',{name:'Continue on WhatsApp'})).toHaveAttribute('href',/wa.me.*Test%20Guest/);
 await page.getByRole('button',{name:'Close reservation'}).click();
 await page.goto('http://localhost:5173/galleries');
 await page.locator('.gallery-grid>button').first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 for(const path of ['/','/rooms','/services','/galleries','/about','/contact-us','/blog','/rooms/luxury-left-cottage.html']){
  await page.goto('http://localhost:5173'+path);
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{})})));
  expect(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>i.src))).toEqual([]);
 }
 expect(errors).toEqual([]);
});
test('mobile navigation and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of ['/','/rooms','/rooms/luxury-left-cottage','/services','/galleries','/contact-us']){
  await page.goto('http://localhost:5173'+path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 }
 await page.goto('http://localhost:5173');
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{})})));
 await page.screenshot({path:'tests/home-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Open menu'}).click();
 await page.getByRole('link',{name:'Stay with us',exact:true}).click();
 await expect(page.locator('.room-card')).toHaveCount(12);
 await expect(page.locator('nav')).not.toHaveClass('open');
});
