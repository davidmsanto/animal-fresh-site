import { chromium } from '@playwright/test';

async function checkDesktopDark() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const section = await page.$('#especificacoes');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({ path: 'test-results/screenshots/desktop-dark-actual.png' });
  await browser.close();
  console.log('Desktop dark actual saved');
}
checkDesktopDark();
