import { chromium } from '@playwright/test';

async function auditDesktop() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const audit = await page.evaluate(() => {
    const darkSticky = document.querySelector('.stage-dark-sticky');
    return {
      darkScrollHeight: darkSticky?.scrollHeight,
      darkClientHeight: darkSticky?.clientHeight,
    };
  });

  console.log('Desktop Heights Audit (1440x900):', audit);
  await browser.close();
}
auditDesktop();
