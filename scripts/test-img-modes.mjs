import { chromium } from '@playwright/test';

async function testImgRendering() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  await page.setContent(`
    <html>
      <body style="background: #071F2A; margin: 40px; display: flex; gap: 40px;">
        <div style="width: 320px; border: 1px solid red;">
          <p style="color: white">Original aspect-[4/5] object-cover p-4</p>
          <div style="aspect-ratio: 4/5; border: 1px solid cyan; overflow: hidden; position: relative;">
            <img src="http://localhost:5173/images/bebedouro-inox-top.webp" style="width: 100%; height: 100%; object-fit: cover; padding: 16px;" />
          </div>
        </div>

        <div style="width: 320px; border: 1px solid green;">
          <p style="color: white">aspect-[4/5] or aspect-square object-contain</p>
          <div style="aspect-ratio: 4/5; border: 1px solid yellow; overflow: hidden; position: relative; background: #10252D;">
            <img src="http://localhost:5173/images/bebedouro-inox-top.webp" style="width: 100%; height: 100%; object-fit: contain; padding: 16px;" />
          </div>
        </div>

        <div style="width: 320px; border: 1px solid purple;">
          <p style="color: white">aspect-square object-contain p-4</p>
          <div style="aspect-ratio: 1/1; border: 1px solid magenta; overflow: hidden; position: relative; background: #10252D;">
            <img src="http://localhost:5173/images/bebedouro-inox-top.webp" style="width: 100%; height: 100%; object-fit: contain; padding: 16px;" />
          </div>
        </div>
      </body>
    </html>
  `);

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/screenshots/test-img-modes.png' });
  await browser.close();
  console.log('test-img-modes.png rendered');
}
testImgRendering();
