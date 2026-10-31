import { chromium } from '@playwright/test';

async function verifyOnSite() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Mobile (390 x 844) - exactly like the user's view
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await mobileContext.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll to the Gallery card "02 • CUBA EM INOX"
  const galleryCard = await page.locator('text=02 • CUBA EM INOX').first();
  await galleryCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Take screenshot of the exact card
  const cardElement = await page.$('.aspect-square:has(img[src*="bebedouro-inox-top"])');
  if (cardElement) {
    const parentCard = await cardElement.evaluateHandle(el => el.closest('.group'));
    await parentCard.asElement().screenshot({ path: 'test-results/screenshots/verified-cuba-inox-gallery-card.png' });
    console.log('[OK] Captured verified-cuba-inox-gallery-card.png');
  }

  // Also take screenshot of the dark section product card
  const darkCard = await page.$('.dark-image-card');
  if (darkCard) {
    await darkCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await darkCard.screenshot({ path: 'test-results/screenshots/verified-dark-section-card.png' });
    console.log('[OK] Captured verified-dark-section-card.png');
  }

  await browser.close();
  console.log('Verification finished successfully.');
}

verifyOnSite().catch(err => {
  console.error(err);
  process.exit(1);
});
