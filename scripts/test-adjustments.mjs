import { chromium } from '@playwright/test';

async function testAdjustments() {
  console.log('[TEST] Checking Animal Fresh Landing Page at http://localhost:5173...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Desktop Test (1440px)
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const desktopPage = await desktopContext.newPage();

  const consoleErrors = [];
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Verify price & checkout
  const priceMatches = await desktopPage.locator('text=R$ 399,90').count();
  const freeShippingMatches = await desktopPage.locator('text=Frete Grátis').count();
  
  // Verify buy buttons and links
  const checkoutLinks = await desktopPage.$$eval('a[href*="pay.kaiross.com.br"]', links => 
    links.map(a => ({ id: a.id, href: a.href, target: a.target, text: a.innerText.trim() }))
  );

  // Verify Typography & CSS on Desktop
  const typographyReport = await desktopPage.evaluate(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    const h1 = document.querySelector('h1');
    const h1Style = h1 ? window.getComputedStyle(h1) : null;
    const h2 = document.querySelector('h2');
    const h2Style = h2 ? window.getComputedStyle(h2) : null;
    const p = document.querySelector('p');
    const pStyle = p ? window.getComputedStyle(p) : null;
    const label = document.querySelector('.editorial-label');
    const labelStyle = label ? window.getComputedStyle(label) : null;
    
    // Dark section items
    const darkSection = document.querySelector('#tecnologia');
    const darkItem = darkSection ? darkSection.querySelector('.dark-feature-item') : null;
    const darkItemStyle = darkItem ? window.getComputedStyle(darkItem) : null;
    const darkItemTitle = darkItem ? darkItem.querySelector('h3') : null;
    const darkItemTitleStyle = darkItemTitle ? window.getComputedStyle(darkItemTitle) : null;
    const darkItemP = darkItem ? darkItem.querySelector('p') : null;
    const darkItemPStyle = darkItemP ? window.getComputedStyle(darkItemP) : null;

    // Italic highlight in hero or headline
    const italicEm = document.querySelector('h1 em, h2 em');
    const italicStyle = italicEm ? window.getComputedStyle(italicEm) : null;

    return {
      body: {
        fontFamily: bodyStyle.fontFamily,
        fontSize: bodyStyle.fontSize,
        lineHeight: bodyStyle.lineHeight,
        fontWeight: bodyStyle.fontWeight,
      },
      h1: h1Style ? {
        fontFamily: h1Style.fontFamily,
        fontSize: h1Style.fontSize,
        fontWeight: h1Style.fontWeight,
        lineHeight: h1Style.lineHeight,
        letterSpacing: h1Style.letterSpacing,
      } : null,
      h2: h2Style ? {
        fontFamily: h2Style.fontFamily,
        fontSize: h2Style.fontSize,
        fontWeight: h2Style.fontWeight,
      } : null,
      p: pStyle ? {
        color: pStyle.color,
        maxWidth: pStyle.maxWidth,
      } : null,
      label: labelStyle ? {
        fontSize: labelStyle.fontSize,
        fontWeight: labelStyle.fontWeight,
        letterSpacing: labelStyle.letterSpacing,
        textTransform: labelStyle.textTransform,
      } : null,
      darkItem: darkItemStyle ? {
        opacity: darkItemStyle.opacity,
      } : null,
      darkItemTitle: darkItemTitleStyle ? {
        color: darkItemTitleStyle.color,
        fontWeight: darkItemTitleStyle.fontWeight,
      } : null,
      darkItemP: darkItemPStyle ? {
        color: darkItemPStyle.color,
        fontWeight: darkItemPStyle.fontWeight,
      } : null,
      italic: italicStyle ? {
        color: italicStyle.color,
        fontWeight: italicStyle.fontWeight,
        fontStyle: italicStyle.fontStyle,
      } : null,
    };
  });

  console.log('--- RELATÓRIO DESKTOP ---');
  console.log(`Preço R$ 399,90 ocorrências: ${priceMatches}`);
  console.log(`Frete Grátis ocorrências: ${freeShippingMatches}`);
  console.log(`Links para Kaiross Checkout (${checkoutLinks.length} encontrados):`);
  checkoutLinks.forEach((l, i) => console.log(`  [${i+1}] #${l.id || 'sem-id'} -> ${l.href} (${l.text})`));
  console.log('Tipografia computada:', JSON.stringify(typographyReport, null, 2));

  // 2. Mobile Test (390px)
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const mobileReport = await mobilePage.evaluate(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    const p = document.querySelector('p');
    const pStyle = p ? window.getComputedStyle(p) : null;
    const mobileBuyBar = document.querySelector('#mobile-buy-bar');
    const mobileBuyBarVisible = mobileBuyBar ? (window.getComputedStyle(mobileBuyBar).display !== 'none') : false;
    const mobileCheckoutLink = mobileBuyBar ? mobileBuyBar.querySelector('a')?.href : null;

    return {
      bodyFontSize: bodyStyle.fontSize,
      pFontSize: pStyle ? pStyle.fontSize : null,
      mobileBuyBarVisible,
      mobileCheckoutLink,
    };
  });

  console.log('--- RELATÓRIO MOBILE (390px) ---');
  console.log('Mobile Report:', JSON.stringify(mobileReport, null, 2));

  console.log(`Console Errors detectados: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => console.log('ERR:', err));
  }

  await browser.close();
  console.log('[TEST CONCLUÍDO COM SUCESSO]');
}

testAdjustments().catch(err => {
  console.error('[TEST ERROR]', err);
  process.exit(1);
});
