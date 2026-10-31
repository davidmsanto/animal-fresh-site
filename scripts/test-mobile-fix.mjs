import { chromium } from '@playwright/test';

async function testMobileFix() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Apply responsive fix to stage-dark
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
        .stage-dark-container .aspect-\\[4\\/5\\] {
          aspect-ratio: 1 / 1 !important;
          max-width: 340px !important;
          margin: 1.5rem auto 0 auto !important;
        }
        .stage-dark-container .aspect-\\[4\\/5\\] img {
          object-fit: contain !important;
          padding: 1.25rem !important;
        }
      }
    `
  });

  // Scroll to especificacoes
  const darkSection = await page.$('#especificacoes');
  await darkSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Take screenshot of the top of the dark section
  await page.screenshot({ path: 'test-results/screenshots/fixed-mobile-dark-top.png' });

  // Scroll down a bit to see the features and image
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/screenshots/fixed-mobile-dark-middle.png' });

  // Scroll down more to see the complete product card and transition to next section
  await page.evaluate(() => window.scrollBy(0, 450));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/screenshots/fixed-mobile-dark-image-card.png' });

  console.log('Mobile fix screenshots taken successfully.');
  await browser.close();
}
testMobileFix();
