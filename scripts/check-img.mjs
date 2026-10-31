import fs from 'fs';
import path from 'path';

// Read image header or use sharp/canvas or Playwright to check
import { chromium } from '@playwright/test';

async function check() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const img = document.querySelector('.stage-dark-container img');
    return {
      src: img?.src,
      naturalWidth: img?.naturalWidth,
      naturalHeight: img?.naturalHeight,
      clientWidth: img?.clientWidth,
      clientHeight: img?.clientHeight,
      containerAspect: window.getComputedStyle(img?.parentElement).aspectRatio,
      containerHeight: img?.parentElement?.clientHeight,
      containerWidth: img?.parentElement?.clientWidth,
    };
  });
  console.log('Result:', data);
  await browser.close();
}
check();
