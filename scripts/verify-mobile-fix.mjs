import { chromium } from '@playwright/test';
import path from 'path';

async function verifyFix() {
  console.log('--- TESTANDO CORREÇÃO DO RECORTE DA IMAGEM NO MOBILE ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Mobile iPhone 12/13/14 (390 x 844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await mobileContext.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll to especificacoes section
  const darkSection = await page.$('#especificacoes');
  await darkSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Take screenshot of top of dark section
  await page.screenshot({ path: 'test-results/screenshots/final-mobile-dark-top.png' });

  // Scroll to feature 03 and 04 + card
  const imgCard = await page.$('.dark-image-card');
  await imgCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Take screenshot of product card fully in view
  await page.screenshot({ path: 'test-results/screenshots/final-mobile-dark-card.png' });

  // Inspect DOM metrics
  const metrics = await page.evaluate(() => {
    const section = document.querySelector('#especificacoes');
    const sticky = document.querySelector('.stage-dark-sticky');
    const card = document.querySelector('.dark-image-card');
    const img = card?.querySelector('img');
    const badge = card?.querySelector('span');

    const cardRect = card?.getBoundingClientRect();
    const imgRect = img?.getBoundingClientRect();

    return {
      sectionDisplay: window.getComputedStyle(section).display,
      sectionHeight: section?.offsetHeight,
      stickyPosition: window.getComputedStyle(sticky).position,
      stickyOverflow: window.getComputedStyle(sticky).overflow,
      cardWidth: cardRect?.width,
      cardHeight: cardRect?.height,
      imgWidth: imgRect?.width,
      imgHeight: imgRect?.height,
      imgNaturalWidth: img?.naturalWidth,
      imgNaturalHeight: img?.naturalHeight,
      imgObjectFit: window.getComputedStyle(img).objectFit,
      imgPadding: window.getComputedStyle(img).padding,
      isImgLoaded: (img?.naturalWidth ?? 0) > 0,
    };
  });

  console.log('Mobile (390x844) Metrics:', JSON.stringify(metrics, null, 2));

  // 2. Small Mobile (iPhone SE: 375 x 667)
  const smallContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const smallPage = await smallContext.newPage();
  await smallPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const smallCard = await smallPage.$('.dark-image-card');
  await smallCard.scrollIntoViewIfNeeded();
  await smallPage.waitForTimeout(400);
  await smallPage.screenshot({ path: 'test-results/screenshots/final-mobile-small-card.png' });
  console.log('iPhone SE screenshot captured.');

  // 3. Desktop (1440 x 900) - Verify desktop is untouched and still works as a stage
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const desktopSection = await desktopPage.$('#especificacoes');
  await desktopSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(400);
  await desktopPage.screenshot({ path: 'test-results/screenshots/final-desktop-dark.png' });

  const desktopMetrics = await desktopPage.evaluate(() => {
    const sticky = document.querySelector('.stage-dark-sticky');
    const card = document.querySelector('.dark-image-card');
    const img = card?.querySelector('img');
    return {
      stickyPosition: window.getComputedStyle(sticky).position,
      cardWidth: card?.clientWidth,
      cardHeight: card?.clientHeight,
      imgObjectFit: window.getComputedStyle(img).objectFit,
    };
  });
  console.log('Desktop (1440x900) Metrics:', JSON.stringify(desktopMetrics, null, 2));

  await browser.close();
  console.log('--- VERIFICAÇÃO CONCLUÍDA COM SUCESSO ---');
}

verifyFix().catch(err => {
  console.error('Erro na verificação:', err);
  process.exit(1);
});
