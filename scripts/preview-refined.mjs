import { chromium } from '@playwright/test';
import path from 'path';

async function previewRefinedComparison() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
  const base = path.resolve('test-results/screenshots').replace(/\\/g, '/');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background: #071F2A; color: white; font-family: sans-serif; padding: 30px; text-align: center; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 800px; margin: 0 auto; }
          .card { background: #10252D; border: 1px solid #23B8CD44; border-radius: 8px; padding: 15px; }
          img { width: 100%; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
          h3 { font-size: 15px; margin-bottom: 12px; color: #eaf4f7; }
          .highlight { border-color: #23B8CD; }
        </style>
      </head>
      <body>
        <h2 style="color: #23B8CD; margin-bottom: 24px;">Correção do Retoque do Logo na Imagem</h2>
        <div class="grid">
          <div class="card">
            <h3>1. Original (com Logo)</h3>
            <img src="file:///${base}/orig-logo-close.png" />
          </div>
          <div class="card">
            <h3 style="color: #ff6b6b">2. Patch Anterior (Bordas e Blur Visíveis)</h3>
            <img src="file:///${base}/diff-curr-crop.png" />
          </div>
          <div class="card highlight">
            <h3 style="color: #23B8CD">3. Novo Retoque (Inpainting Perfeito)</h3>
            <img src="file:///${base}/refined-inpaint-close.png" />
          </div>
        </div>
      </body>
    </html>
  `);

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/screenshots/refined-comparison-result.png' });
  await browser.close();
  console.log('Saved refined-comparison-result.png');
}
previewRefinedComparison();
