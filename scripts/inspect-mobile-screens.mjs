import { chromium } from '@playwright/test';

async function inspectMobileScreens() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Hero
  await page.screenshot({ path: 'test-results/screenshots/audit-01-hero.png' });

  // 2. Stage 2 (Reveal)
  const stage2 = await page.$('.stage-reveal-container');
  await stage2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/screenshots/audit-02-reveal.png' });

  // 3. Stage 3 (Dark section)
  const stage3 = await page.$('.stage-dark-container');
  await stage3.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/screenshots/audit-03-dark.png' });

  await browser.close();
  console.log('Mobile screenshots captured');
}
inspectMobileScreens();
