import { chromium } from '@playwright/test';

async function checkScroll() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll to when the dark section is partially scrolled
  // Let's find dark container offsetTop
  const top = await page.$eval('#especificacoes', el => el.offsetTop);
  console.log('Dark section offsetTop:', top);

  await page.evaluate((y) => window.scrollTo(0, y + 400), top);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/screenshots/mobile-dark-scroll-400.png' });

  await page.evaluate((y) => window.scrollTo(0, y + 675), top);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/screenshots/mobile-dark-scroll-675.png' });

  await browser.close();
  console.log('Screenshots saved.');
}
checkScroll();
