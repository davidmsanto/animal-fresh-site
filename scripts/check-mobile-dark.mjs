import { chromium } from '@playwright/test';

async function checkMobile() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll to #especificacoes
  const darkSection = await page.$('#especificacoes');
  await darkSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Take screenshot at this position
  await page.screenshot({ path: 'test-results/screenshots/mobile-dark-section-current.png' });

  const metrics = await page.evaluate(() => {
    const section = document.querySelector('#especificacoes');
    const sticky = document.querySelector('.stage-dark-sticky');
    const imgContainer = document.querySelector('.stage-dark-container .aspect-\\[4\\/5\\]') || document.querySelector('.stage-dark-container img')?.parentElement;
    const img = document.querySelector('.stage-dark-container img');

    return {
      sectionHeight: section?.clientHeight,
      stickyHeight: sticky?.clientHeight,
      stickyTop: sticky?.getBoundingClientRect().top,
      stickyBottom: sticky?.getBoundingClientRect().bottom,
      imgContainerRect: imgContainer?.getBoundingClientRect(),
      imgRect: img?.getBoundingClientRect(),
      windowHeight: window.innerHeight,
      windowScrollY: window.scrollY,
      imgNaturalWidth: img?.naturalWidth,
      imgNaturalHeight: img?.naturalHeight,
    };
  });

  console.log('Mobile Metrics:', JSON.stringify(metrics, null, 2));
  await browser.close();
}
checkMobile();
