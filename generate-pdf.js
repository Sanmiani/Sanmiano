const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'strong-after-35-book1.html');
  await page.goto(`file:///${htmlPath}`, { waitUntil: 'networkidle0' });

  // Wait for Google Fonts to load
  await new Promise(r => setTimeout(r, 3000));

  await page.pdf({
    path: 'Who-You-Are-Now-MattOkewusi.pdf',
    format: 'A5',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });

  await browser.close();
  console.log('PDF created: Who-You-Are-Now-MattOkewusi.pdf');
})();
