import { chromium } from '@playwright/test';

async function checkAllImagesMobile() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll through entire page slowly and check image visibility and bounding boxes
  const allImages = await page.$$eval('img', imgs => {
    return imgs.map(img => {
      const rect = img.getBoundingClientRect();
      return {
        src: img.src.split('/').pop(),
        alt: img.alt.slice(0, 30),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0,
      };
    });
  });

  console.log('Mobile images check:', JSON.stringify(allImages, null, 2));
  await browser.close();
}
checkAllImagesMobile();
