const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();

  // Set viewport to exact flyer size
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

  const filePath = path.resolve(__dirname, 'ileya-flyer.html');
  await page.goto('file:///' + filePath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  // Wait for Google Fonts to load
  await new Promise(r => setTimeout(r, 1500));

  // Get actual content height so nothing is clipped
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: 1080, height: height, deviceScaleFactor: 2 });

  const outPath = path.resolve(__dirname, 'ileya-flyer.jpg');
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 95, fullPage: true });

  await browser.close();
  console.log('Saved:', outPath);
})();
