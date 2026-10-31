import { chromium } from '@playwright/test';

async function verifyVideo() {
  console.log('--- TESTANDO SEÇÃO DO VÍDEO NO SITE EM LOCALHOST:5173 ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Desktop Test (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();

  const consoleErrors = [];
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Check section existence and visibility
  const videoSection = await desktopPage.$('#video');
  if (!videoSection) {
    throw new Error('Section #video not found in DOM');
  }

  // Scroll to video section
  await videoSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(3000);

  // Take screenshot of desktop video section
  await desktopPage.screenshot({ path: 'test-results/screenshots/final-video-section-desktop.png' });
  console.log('[OK] final-video-section-desktop.png captured');

  // Check Wistia player status
  const playerMetrics = await desktopPage.evaluate(() => {
    const player = document.querySelector('wistia-player');
    const container = document.querySelector('.video-frame-container');
    const navLink = document.querySelector('a[href="#video"]');
    return {
      playerTag: player ? player.tagName : null,
      playerWidth: player?.clientWidth,
      playerHeight: player?.clientHeight,
      mediaId: player?.getAttribute('media-id'),
      aspect: player?.getAttribute('aspect'),
      containerWidth: container?.clientWidth,
      containerHeight: container?.clientHeight,
      navLinkText: navLink?.innerText.trim(),
    };
  });
  console.log('Desktop Player Metrics:', JSON.stringify(playerMetrics, null, 2));

  // 2. Mobile Test (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const mobileVideoSection = await mobilePage.$('#video');
  await mobileVideoSection.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(3000);

  // Take screenshot of mobile video section
  await mobilePage.screenshot({ path: 'test-results/screenshots/final-video-section-mobile.png' });
  console.log('[OK] final-video-section-mobile.png captured');

  // Test mobile menu navigation to #video
  const mobileMenuBtn = await mobilePage.$('#mobile-menu-btn');
  if (mobileMenuBtn) {
    await mobileMenuBtn.click();
    await mobilePage.waitForTimeout(300);
    const mobileLink = await mobilePage.$('#mobile-menu a[href="#video"]');
    console.log('[OK] Mobile menu link for #video found:', mobileLink !== null);
    await mobileLink.click();
    await mobilePage.waitForTimeout(500);
  }

  console.log(`Console errors detectados: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => console.log('  ! Error:', err));
  }

  await browser.close();
  console.log('--- VERIFICAÇÃO DO VÍDEO CONCLUÍDA COM SUCESSO ---');
}

verifyVideo().catch(err => {
  console.error('Falha no teste:', err);
  process.exit(1);
});
