import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';

async function main() {
  const vite = spawn('npx', ['vite', 'preview', '--port', '4173'], { shell: true });
  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  // Galeria
  const galeria = await page.locator('#galeria');
  await galeria.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/screenshots/09-desktop-galeria.png' });

  // FAQ
  const duvidas = await page.locator('#duvidas');
  await duvidas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/screenshots/10-desktop-faq.png' });

  // Footer
  const footer = await page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/screenshots/11-desktop-footer.png' });

  // Full page screenshot
  await page.screenshot({ path: 'test-results/screenshots/12-desktop-fullpage.png', fullPage: true });

  console.log('Capturas adicionais concluídas com sucesso!');
  await browser.close();
  vite.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
