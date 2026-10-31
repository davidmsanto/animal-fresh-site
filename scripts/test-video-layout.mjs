import { chromium } from '@playwright/test';

async function testVideoSectionLayout() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  // Desktop
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Add the draft section dynamically to inspect visually
  await desktopPage.evaluate(() => {
    const galeria = document.getElementById('galeria');
    const videoSection = document.createElement('section');
    videoSection.id = 'video';
    videoSection.className = 'bg-[#EAF3F5] py-20 sm:py-28 px-5 sm:px-8 border-y border-[#C9DADF]';
    videoSection.innerHTML = `
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <!-- Coluna Esquerda: Texto Editorial e Destaques -->
          <div class="lg:col-span-7">
            <span class="editorial-label text-[#07566B] mb-3 inline-block">DEMONSTRAÇÃO DO PRODUTO</span>
            <h2 class="headline-display text-3xl sm:text-4xl md:text-5xl text-[#0b2a36] font-medium mb-6 leading-tight">
              Veja o Bebedouro Flow Wireless<br />
              <span class="italic font-medium text-[#07566B]">em funcionamento real.</span>
            </h2>
            <p class="text-base sm:text-lg text-[#2f4a56] font-normal leading-relaxed mb-8 max-w-[62ch]">
              Assista à demonstração em vídeo e confira o fluxo contínuo de água, a operação silenciosa e a praticidade do design sem fios no dia a dia.
            </p>

            <!-- Lista de Destaques Visuais -->
            <div class="space-y-4 mb-8">
              <div class="flex items-start gap-3.5">
                <div class="w-6 h-6 rounded-full bg-[#07566B]/10 text-[#07566B] flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-[#0b2a36]">Circulação Suave & Oxigenação Contínua</h4>
                  <p class="text-sm text-[#2f4a56] mt-0.5">Água sempre corrente e fresca que estimula a hidratação natural de cães e gatos.</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div class="w-6 h-6 rounded-full bg-[#07566B]/10 text-[#07566B] flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-[#0b2a36]">Motor Ultra Silencioso</h4>
                  <p class="text-sm text-[#2f4a56] mt-0.5">Bomba d'água projetada para ruído imperceptível, ideal para ambientes de descanso.</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div class="w-6 h-6 rounded-full bg-[#07566B]/10 text-[#07566B] flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-[#0b2a36]">Autonomia Sem Fios</h4>
                  <p class="text-sm text-[#2f4a56] mt-0.5">Bateria recarregável integrada que elimina fios soltos pelo chão da sua casa.</p>
                </div>
              </div>
            </div>

            <!-- Botão de Ação -->
            <div class="flex items-center gap-4">
              <a href="#oferta" class="inline-flex items-center justify-center px-8 py-4 text-xs font-bold tracking-[0.12em] uppercase text-white bg-[#07566B] hover:bg-[#23B8CD] transition-all duration-300 rounded-[2px] shadow-sm hover:shadow-md">
                QUERO O MEU BEBEDOURO
              </a>
            </div>
          </div>

          <!-- Coluna Direita: Vídeo Player em Moldura Editorial -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="w-full max-w-[360px] bg-white p-3 sm:p-4 rounded-[12px] border border-[#C9DADF] shadow-xl">
              <div class="relative rounded-[8px] overflow-hidden bg-black/5">
                <wistia-player media-id="wldbkg0y24" aspect="0.5625"></wistia-player>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs text-[#2f4a56] px-1">
                <span class="font-semibold uppercase tracking-wider text-[#07566B]">VÍDEO DE EXPOSIÇÃO</span>
                <span class="font-mono text-[0.7rem]">ANIMAL FRESH 4L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject scripts for Wistia
    const s1 = document.createElement('script');
    s1.src = 'https://fast.wistia.com/player.js';
    s1.async = true;
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.src = 'https://fast.wistia.com/embed/wldbkg0y24.js';
    s2.async = true;
    s2.type = 'module';
    document.head.appendChild(s2);

    const style = document.createElement('style');
    style.innerHTML = `wistia-player[media-id='wldbkg0y24']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/wldbkg0y24/swatch'); display: block; filter: blur(5px); padding-top:177.78%; }`;
    document.head.appendChild(style);

    // Insert before Galeria
    galeria.parentNode.insertBefore(videoSection, galeria);
  });

  await desktopPage.waitForTimeout(4000);
  const videoEl = await desktopPage.$('#video');
  await videoEl.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: 'test-results/screenshots/test-video-section-desktop.png' });
  console.log('Desktop video section captured');

  // Mobile
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Do the same on mobile
  await mobilePage.evaluate(() => {
    const galeria = document.getElementById('galeria');
    const videoSection = document.createElement('section');
    videoSection.id = 'video';
    videoSection.className = 'bg-[#EAF3F5] py-16 px-5 border-y border-[#C9DADF]';
    videoSection.innerHTML = `
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7">
            <span class="editorial-label text-[#07566B] mb-2 inline-block">DEMONSTRAÇÃO DO PRODUTO</span>
            <h2 class="headline-display text-3xl text-[#0b2a36] font-medium mb-4 leading-tight">
              Veja o Bebedouro Flow Wireless<br />
              <span class="italic font-medium text-[#07566B]">em funcionamento real.</span>
            </h2>
            <p class="text-base text-[#2f4a56] font-normal leading-relaxed mb-6">
              Assista à demonstração em vídeo e confira o fluxo contínuo de água, a operação silenciosa e a praticidade sem fios no dia a dia.
            </p>
          </div>

          <div class="lg:col-span-5 flex justify-center">
            <div class="w-full max-w-[340px] bg-white p-3 rounded-[12px] border border-[#C9DADF] shadow-xl">
              <div class="relative rounded-[8px] overflow-hidden bg-black/5">
                <wistia-player media-id="wldbkg0y24" aspect="0.5625"></wistia-player>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs text-[#2f4a56] px-1">
                <span class="font-semibold uppercase tracking-wider text-[#07566B]">VÍDEO DE EXPOSIÇÃO</span>
                <span class="font-mono text-[0.7rem]">ANIMAL FRESH 4L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const s1 = document.createElement('script');
    s1.src = 'https://fast.wistia.com/player.js';
    s1.async = true;
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.src = 'https://fast.wistia.com/embed/wldbkg0y24.js';
    s2.async = true;
    s2.type = 'module';
    document.head.appendChild(s2);

    const style = document.createElement('style');
    style.innerHTML = `wistia-player[media-id='wldbkg0y24']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/wldbkg0y24/swatch'); display: block; filter: blur(5px); padding-top:177.78%; }`;
    document.head.appendChild(style);

    galeria.parentNode.insertBefore(videoSection, galeria);
  });

  await mobilePage.waitForTimeout(4000);
  const mobileVideo = await mobilePage.$('#video');
  await mobileVideo.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: 'test-results/screenshots/test-video-section-mobile.png' });
  console.log('Mobile video section captured');

  await browser.close();
}
testVideoSectionLayout();
