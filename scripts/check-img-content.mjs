import { chromium } from '@playwright/test';

async function checkImgContent() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/images/bebedouro-inox-top.webp');
  await page.screenshot({ path: 'test-results/screenshots/raw-inox-top.png' });
  
  const imgBox = await page.evaluate(() => {
    const img = document.querySelector('img');
    return {
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    };
  });

  console.log('Raw image dimensions:', imgBox);
  await browser.close();
}
checkImgContent();
