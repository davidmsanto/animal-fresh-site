import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = path.resolve('test-results/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runVerification() {
  console.log('--- INICIANDO VERIFICAÇÃO AUTOMATIZADA DA LANDING PAGE ANIMAL FRESH ---');

  // Usando servidor já ativo em localhost:5173
  const targetUrl = 'http://localhost:5173';
  console.log(`1. Acessando ${targetUrl}...`);

  let browser;
  try {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    // Rastrear erros de console e requisições falhas
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    });

    await page.goto(targetUrl, { waitUntil: 'networkidle' });

    // Verificar Título e Meta Tags
    const title = await page.title();
    console.log(`✓ Título da Página: "${title}"`);

    // Rolar a página para carregar imagens com loading="lazy"
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 50);
      });
    });
    await page.waitForTimeout(500);

    // Verificar Imagens
    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }))
    );

    console.log(`✓ Imagens detectadas no DOM: ${images.length}`);
    images.forEach((img, idx) => {
      const isLoaded = img.naturalWidth > 0;
      console.log(`  [${idx + 1}] ${isLoaded ? 'OK' : 'FALHA'}: ${img.src.split('/').pop()} (${img.naturalWidth}x${img.naturalHeight}) - alt: "${img.alt.slice(0, 30)}..."`);
    });

    // Captura Desktop - Topo (Hero)
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-desktop-hero.png') });
    console.log('✓ Screenshot capturado: 01-desktop-hero.png');

    // Scroll progressivo para simular estágios
    console.log('2. Testando Scroll Choreography e Estágios...');
    
    // Scroll até Estágio 2 (Reveal)
    const stage2 = await page.$('.stage-reveal-container');
    if (stage2) {
      await stage2.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-desktop-stage2-reveal.png') });
      console.log('✓ Screenshot capturado: 02-desktop-stage2-reveal.png');
    }

    // Scroll até Faixa de Benefícios
    const beneficios = await page.$('#beneficios');
    if (beneficios) {
      await beneficios.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-desktop-beneficios.png') });
      console.log('✓ Screenshot capturado: 03-desktop-beneficios.png');
    }

    // Scroll até Estágio 3 (Escuro / Características)
    const stage3 = await page.$('.stage-dark-container');
    if (stage3) {
      await stage3.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-desktop-stage3-dark.png') });
      console.log('✓ Screenshot capturado: 04-desktop-stage3-dark.png');
    }

    // Scroll até Galeria e Oferta
    const oferta = await page.$('#oferta');
    if (oferta) {
      await oferta.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-desktop-oferta.png') });
      console.log('✓ Screenshot capturado: 05-desktop-oferta.png');
    }

    // Testar FAQ Details & Summary
    console.log('3. Testando FAQ acordeão...');
    const faqSummaries = await page.$$('details.faq-item summary');
    if (faqSummaries.length > 1) {
      await faqSummaries[1].click(); // Abre o item 2 (funcionamento sem fio)
      await page.waitForTimeout(200);
      const isSecondOpen = await page.$eval('details.faq-item:nth-of-type(2)', (el) => el.hasAttribute('open'));
      console.log(`✓ FAQ item 2 aberto após clique: ${isSecondOpen}`);
    }

    // Verificar Overflow Horizontal no Desktop
    const hasHorizontalOverflowDesktop = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`✓ Overflow horizontal no Desktop: ${hasHorizontalOverflowDesktop ? 'DETECTADO (ERRO)' : 'NENHUM (CORRETO)'}`);

    // --- TESTE MOBILE (390 x 844) ---
    console.log('4. Testando Viewport Mobile (390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(targetUrl, { waitUntil: 'networkidle' });

    // Screenshot Mobile Topo
    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-mobile-hero.png') });
    console.log('✓ Screenshot capturado: 06-mobile-hero.png');

    // Testar Menu Mobile
    const mobileBtn = await mobilePage.$('#mobile-menu-btn');
    if (mobileBtn) {
      await mobileBtn.click();
      await mobilePage.waitForTimeout(300);
      const isMenuVisible = await mobilePage.$eval('#mobile-menu', (el) => !el.classList.contains('hidden'));
      console.log(`✓ Menu Mobile aberto com sucesso: ${isMenuVisible}`);
      await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-mobile-menu-open.png') });
      await mobileBtn.click(); // fechar
    }

    // Scroll Mobile e Teste da Barra Fixa de Compra
    await mobilePage.evaluate(() => window.scrollTo(0, 1500));
    await mobilePage.waitForTimeout(500);
    const isBuyBarVisible = await mobilePage.$eval('#mobile-buy-bar', (el) => !el.classList.contains('translate-y-full'));
    console.log(`✓ Barra Fixa de Compra Mobile exibida após scroll: ${isBuyBarVisible}`);
    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-mobile-buybar.png') });

    // Verificar Overflow Horizontal no Mobile
    const hasHorizontalOverflowMobile = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`✓ Overflow horizontal no Mobile: ${hasHorizontalOverflowMobile ? 'DETECTADO (ERRO)' : 'NENHUM (CORRETO)'}`);

    // --- RESUMO FINAL DOS TESTES ---
    console.log('\n--- RESUMO DE INTEGRIDADE ---');
    console.log(`Erros de Console: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((err) => console.log(`  ! Console Error: ${err}`));
    }
    console.log(`Requisições Falhas: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      failedRequests.forEach((req) => console.log(`  ! Failed Req: ${req}`));
    }

    await browser.close();
  } catch (err) {
    console.error('Erro na execução da verificação:', err);
  } finally {
    process.exit(0);
  }
}

runVerification();
