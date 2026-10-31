import { chromium } from '@playwright/test';

async function previewDarkSectionOptions() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Test setup 1: Natural flow on mobile, aspect-[4/5] vs aspect-square
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

  const section = await page.$('#especificacoes');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Scroll so the entire product card is in view
  const card = await page.$('.stage-dark-container .lg\\:col-span-5');
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/screenshots/mobile-view-card-original-style.png' });

  // Now let's try with card refined: aspect-square, object-contain, clean framing
  await page.addStyleTag({
    content: `
      @media (max-width: 1023px) {
        .stage-dark-container .aspect-\\[4\\/5\\] {
          aspect-ratio: 1 / 1 !important;
          max-width: 340px !important;
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
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/screenshots/mobile-view-card-square-contain.png' });

  console.log('Screenshots captured: mobile-view-card-original-style.png and mobile-view-card-square-contain.png');
  await browser.close();
}
previewDarkSectionOptions();
