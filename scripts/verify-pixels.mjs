import { chromium } from '@playwright/test';

async function verifyTracking() {
  console.log('--- TESTANDO META PIXEL E MICROSOFT CLARITY ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  // Track network requests to Facebook and Clarity
  const trackedRequests = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('facebook.net') || url.includes('facebook.com/tr')) {
      trackedRequests.push(`Meta Pixel: ${url.slice(0, 80)}...`);
    } else if (url.includes('clarity.ms')) {
      trackedRequests.push(`Clarity: ${url.slice(0, 80)}...`);
    }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Verify globals
  const status = await page.evaluate(() => {
    return {
      hasFbq: typeof window.fbq === 'function',
      hasClarity: typeof window.clarity === 'function',
      fbqQueue: window.fbq?.q || window._fbq?.queue,
      clarityQueue: window.clarity?.q,
    };
  });
  console.log('Tracking Globals:', JSON.stringify(status, null, 2));

  // Test InitiateCheckout tracking on buy button click
  const checkoutCall = await page.evaluate(() => {
    let capturedCall = null;
    const originalFbq = window.fbq;
    window.fbq = function(...args) {
      if (args[0] === 'track' && args[1] === 'InitiateCheckout') {
        capturedCall = args;
      }
      originalFbq.apply(this, args);
    };

    // Trigger click on primary button
    const btn = document.getElementById('btn-checkout-primary');
    btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    return capturedCall;
  });

  console.log('InitiateCheckout Event Triggered:', checkoutCall);
  console.log('Tracked network requests count:', trackedRequests.length);

  await browser.close();
  console.log('--- TESTE CONCLUÍDO COM SUCESSO ---');
}

verifyTracking().catch(err => {
  console.error(err);
  process.exit(1);
});
