import { chromium } from '@playwright/test';

async function testCardRendering() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="http://localhost:5173/src/style.css">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { background: #071F2A; padding: 20px 16px; font-family: 'Inter', sans-serif; }
        </style>
      </head>
      <body>
        <h2 style="color: white; font-size: 16px; margin-bottom: 8px;">Opção A: aspect-[4/5] object-cover (Atual)</h2>
        <div class="relative w-full max-w-sm aspect-[4/5] mx-auto rounded-[4px] overflow-hidden border border-[#C9DADF]/20 shadow-2xl bg-gradient-to-b from-[#10252D] to-[#071F2A] mb-8">
          <img
            src="http://localhost:5173/images/bebedouro-inox-top.webp"
            alt="Vista superior"
            class="w-full h-full object-cover p-4"
          />
          <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span class="px-3.5 py-1.5 bg-[#071F2A]/90 backdrop-blur-md border border-[#23B8CD]/50 text-[#23B8CD] text-[0.75rem] font-bold tracking-[0.12em] uppercase rounded-[2px]">
              FLOW WIRELESS • 4 L
            </span>
            <span class="text-[0.7rem] text-[#b9ccd4] font-medium tracking-wider uppercase">
              ACABAMENTO INOX
            </span>
          </div>
        </div>

        <h2 style="color: white; font-size: 16px; margin-bottom: 8px;">Opção B: aspect-square object-contain com padding refinado</h2>
        <div class="relative w-full max-w-[340px] aspect-square mx-auto rounded-[4px] overflow-hidden border border-[#C9DADF]/20 shadow-2xl bg-white mb-8">
          <img
            src="http://localhost:5173/images/bebedouro-inox-top.webp"
            alt="Vista superior"
            class="w-full h-full object-contain p-4 pb-12"
          />
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span class="px-3 py-1 bg-[#071F2A]/90 backdrop-blur-md border border-[#23B8CD]/50 text-[#23B8CD] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-[2px]">
              FLOW WIRELESS • 4 L
            </span>
            <span class="text-[0.65rem] text-[#07566B] font-bold tracking-wider uppercase">
              ACABAMENTO INOX
            </span>
          </div>
        </div>

        <h2 style="color: white; font-size: 16px; margin-bottom: 8px;">Opção C: aspect-[4/5] com fundo branco editorial e object-contain</h2>
        <div class="relative w-full max-w-sm aspect-[4/5] mx-auto rounded-[4px] overflow-hidden border border-[#C9DADF]/20 shadow-2xl bg-white mb-8">
          <img
            src="http://localhost:5173/images/bebedouro-inox-top.webp"
            alt="Vista superior"
            class="w-full h-full object-contain p-4 pb-14"
          />
          <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span class="px-3.5 py-1.5 bg-[#071F2A]/90 backdrop-blur-md border border-[#23B8CD]/50 text-[#23B8CD] text-[0.75rem] font-bold tracking-[0.12em] uppercase rounded-[2px]">
              FLOW WIRELESS • 4 L
            </span>
            <span class="text-[0.7rem] text-[#07566B] font-bold tracking-wider uppercase">
              ACABAMENTO INOX
            </span>
          </div>
        </div>
      </body>
    </html>
  `);

  await page.waitForTimeout(600);
  await page.screenshot({ path: 'test-results/screenshots/compare-options.png', fullPage: true });
  await browser.close();
  console.log('compare-options.png captured');
}
testCardRendering();
