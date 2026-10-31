import { chromium } from '@playwright/test';

async function auditMobile() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const audit = await page.evaluate(() => {
    const heroSticky = document.querySelector('.stage-hero-sticky');
    const revealSticky = document.querySelector('.stage-reveal-sticky');
    const darkSticky = document.querySelector('.stage-dark-sticky');

    return {
      heroScrollHeight: heroSticky?.scrollHeight,
      heroClientHeight: heroSticky?.clientHeight,
      revealScrollHeight: revealSticky?.scrollHeight,
      revealClientHeight: revealSticky?.clientHeight,
      darkScrollHeight: darkSticky?.scrollHeight,
      darkClientHeight: darkSticky?.clientHeight,
    };
  });

  console.log('Mobile Heights Audit (390x844):', audit);
  await browser.close();
}
auditMobile();
