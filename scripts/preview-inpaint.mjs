import { chromium } from '@playwright/test';
import path from 'path';

async function previewInpaintComparison() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });

  const base = path.resolve('test-results/screenshots').replace(/\\/g, '/');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background: #1a1a1a; color: white; font-family: sans-serif; padding: 20px; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
          .card { background: #2a2a2a; border-radius: 6px; padding: 10px; text-align: center; }
          img { max-width: 100%; border: 1px solid #444; border-radius: 4px; }
          h3 { font-size: 14px; margin: 8px 0; color: #23B8CD; }
        </style>
      </head>
      <body>
        <h2>Comparativo de Retoque e Remoção do Logo</h2>
        <div class="grid">
          <div class="card">
            <h3>1. Original (com texto)</h3>
            <img src="file:///${base}/orig-logo-close.png" />
          </div>
          <div class="card">
            <h3>2. Patch anterior (com defeito)</h3>
            <img src="file:///${base}/diff-curr-crop.png" />
          </div>
          <div class="card">
            <h3>3. Máscara de Inpainting</h3>
            <img src="file:///${base}/text-mask.png" />
          </div>
          <div class="card">
            <h3>4. Inpainting Telea</h3>
            <img src="file:///${base}/inpaint-telea-close.png" />
          </div>
        </div>
      </body>
    </html>
  `);

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/screenshots/compare-retouch-methods.png' });
  await browser.close();
  console.log('Saved compare-retouch-methods.png');
}
previewInpaintComparison();
