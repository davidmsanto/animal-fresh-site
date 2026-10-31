import { chromium } from '@playwright/test';

async function testWistiaPlayer() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://fast.wistia.com/player.js" async></script>
        <script src="https://fast.wistia.com/embed/wldbkg0y24.js" async type="module"></script>
        <style>
          body {
            background-color: #F7FBFC;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 40px;
          }
          .video-card {
            width: 100%;
            max-width: 380px;
            background: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 40px -15px rgba(7, 31, 42, 0.15);
            border: 1px solid #C9DADF;
          }
          wistia-player[media-id='wldbkg0y24']:not(:defined) {
            background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/wldbkg0y24/swatch');
            display: block;
            filter: blur(5px);
            padding-top: 177.78%;
          }
        </style>
      </head>
      <body>
        <div class="video-card">
          <wistia-player media-id="wldbkg0y24" aspect="0.5625"></wistia-player>
        </div>
      </body>
    </html>
  `);

  console.log('Waiting for Wistia player to load...');
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'test-results/screenshots/test-wistia-render.png' });
  console.log('Saved test-wistia-render.png');

  const playerInfo = await page.evaluate(() => {
    const player = document.querySelector('wistia-player');
    return {
      defined: customElements.get('wistia-player') !== undefined,
      width: player?.clientWidth,
      height: player?.clientHeight,
    };
  });
  console.log('Player Info:', playerInfo);

  await browser.close();
}
testWistiaPlayer();
