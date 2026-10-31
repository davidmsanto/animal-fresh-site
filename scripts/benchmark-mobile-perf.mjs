import { chromium } from '@playwright/test';

async function benchmark() {
  console.log('--- EXECUTANDO AUDITORIA DE PERFORMANCE MOBILE ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });

  const page = await context.newPage();

  // Track network transfer
  let initialBytes = 0;
  const requests = [];
  page.on('response', async res => {
    try {
      const buffer = await res.body();
      initialBytes += buffer.length;
      requests.push({
        url: res.url().split('/').pop().slice(0, 40),
        status: res.status(),
        size: buffer.length,
      });
    } catch {}
  });

  const start = Date.now();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - start;

  // Measure Web Vitals via Performance API
  const metrics = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
        const nav = performance.getEntriesByType('navigation')[0];

        // LCP
        let lcp = 0;
        entries.forEach(e => {
          if (e.entryType === 'largest-contentful-paint') {
            lcp = e.startTime;
          }
        });

        resolve({
          fcp: Math.round(fcp),
          lcp: Math.round(lcp || fcp),
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
          domInteractive: Math.round(nav.domInteractive - nav.startTime),
          duration: Math.round(nav.duration),
        });
      }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      // Fallback timeout
      setTimeout(() => {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
        const nav = performance.getEntriesByType('navigation')[0];
        resolve({
          fcp: Math.round(fcp),
          lcp: Math.round(fcp),
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
          domInteractive: Math.round(nav.domInteractive - nav.startTime),
          duration: Math.round(nav.duration),
        });
      }, 2000);
    });
  });

  // Check if Wistia is NOT loaded yet on initial top view
  const wistiaLoadedInitial = await page.evaluate(() => {
    return !!window.Wistia || !!document.querySelector('script[src*="fast.wistia.com/player.js"]');
  });

  console.log(`Initial Load Time: ${loadTime}ms`);
  console.log('Web Vitals Metrics:', JSON.stringify(metrics, null, 2));
  console.log(`Wistia loaded initially at top of page: ${wistiaLoadedInitial} (CORRETO: deve ser false)`);
  console.log(`Initial payload transfer: ${(initialBytes / 1024).toFixed(1)} KB`);

  // Now scroll towards #video and verify on-demand loading
  console.log('Scrolling towards #video section...');
  const videoSec = await page.$('#video');
  await videoSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const wistiaLoadedAfterScroll = await page.evaluate(() => {
    return !!document.querySelector('script[src*="fast.wistia.com/player.js"]');
  });
  console.log(`Wistia loaded on-demand after scroll: ${wistiaLoadedAfterScroll} (CORRETO: deve ser true)`);

  // Check Clarity and FBQ
  const trackingStatus = await page.evaluate(() => {
    return {
      fbqActive: typeof window.fbq === 'function',
      clarityActive: typeof window.clarity === 'function',
    };
  });
  console.log('Tracking Status:', trackingStatus);

  await browser.close();
  console.log('--- AUDITORIA DE PERFORMANCE FINALIZADA COM SUCESSO ---');
}

benchmark().catch(err => {
  console.error(err);
  process.exit(1);
});
