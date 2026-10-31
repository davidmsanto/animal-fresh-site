import { chromium } from '@playwright/test';

async function verifyFixedMetrics() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
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
        .stage-dark-container .dark-image-card {
          aspect-ratio: 1 / 1 !important;
          max-width: 340px !important;
          margin: 2rem auto 0 auto !important;
        }
        .stage-dark-container .dark-image-card img {
          object-fit: contain !important;
          padding: 1.25rem !important;
        }
      }
    `
  });

  const imgCard = await page.$('.stage-dark-container .aspect-\\[4\\/5\\]');
  if (imgCard) {
    await imgCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await imgCard.boundingBox();
    const viewport = page.viewportSize();
    console.log('Card bounding box when scrolled into view:', box, 'Viewport:', viewport);
    
    // Screenshot of the card centered
    await page.screenshot({ path: 'test-results/screenshots/card-scrolled-into-view.png' });
  }

  await browser.close();
}
verifyFixedMetrics();
