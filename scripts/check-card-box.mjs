import { chromium } from '@playwright/test';

async function checkCardBox() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  await page.addStyleTag({
    content: `
      @media (max-width: 1023px) {
        .stage-dark-container {
          height: auto !important;
          min-height: auto !important;
          position: relative !important;
          padding-top: 4rem !important;
          padding-bottom: 5rem !important;
        }
        .stage-dark-sticky {
          position: relative !important;
          height: auto !important;
          min-height: auto !important;
          top: auto !important;
          overflow: visible !important;
          padding: 0 !important;
          display: block !important;
        }
      }
    `
  });

  const img = await page.$('.stage-dark-container img');
  const box = await img.boundingBox();
  console.log('Original style box:', box);

  await page.addStyleTag({
    content: `
      @media (max-width: 1023px) {
        .stage-dark-container .aspect-\\[4\\/5\\] {
          aspect-ratio: 1 / 1 !important;
          max-width: 330px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .stage-dark-container .aspect-\\[4\\/5\\] img {
          object-fit: contain !important;
          padding: 1rem 1rem 3.5rem 1rem !important;
        }
      }
    `
  });

  const boxSquare = await img.boundingBox();
  console.log('Square contain box:', boxSquare);

  await browser.close();
}
checkCardBox();
