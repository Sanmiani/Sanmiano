const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const photoPath = path.resolve(__dirname, 'Cover page.jpeg');
  const photoBase64 = fs.readFileSync(photoPath).toString('base64');
  const photoDataURL = `data:image/jpeg;base64,${photoBase64}`;

  await page.setViewport({ width: 1600, height: 2560, deviceScaleFactor: 1 });

  const coverHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;1,700&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1600px;
    height: 2560px;
    overflow: hidden;
    background: #0A0F2C;
  }

  .cover {
    width: 1600px;
    height: 2560px;
    display: flex;
    flex-direction: column;
    background: #0A0F2C;
  }

  /* Photo panel - overflow hidden removes all edge bleed */
  .photo-panel {
    width: 1600px;
    height: 1530px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .photo-panel img {
    width: 1600px;
    height: 1600px;
    object-fit: cover;
    object-position: center 5%;
    display: block;
  }

  /* Gold divider line between photo and text */
  .panel-divider {
    width: 100%;
    height: 6px;
    background: #C9A84C;
    flex-shrink: 0;
  }

  /* Navy text panel */
  .text-panel {
    flex: 1;
    background: #0A0F2C;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 45px 100px 75px;
    text-align: center;
  }

  .series-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: 7px;
    color: #C9A84C;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .book-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 158px;
    font-weight: 800;
    color: #ffffff;
    line-height: 0.95;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 36px;
  }

  .gold-divider {
    width: 200px;
    height: 4px;
    background: #C9A84C;
    margin: 0 auto 36px auto;
  }

  .book-subtitle {
    font-family: 'Merriweather', serif;
    font-size: 40px;
    font-weight: 700;
    font-style: italic;
    color: #F5F0E8;
    margin-bottom: 52px;
    line-height: 1.4;
  }

  .author-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 10px;
    color: #C9A84C;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="cover">

    <div class="photo-panel">
      <img src="${photoDataURL}" alt="Matt Okewusi">
    </div>

    <div class="panel-divider"></div>

    <div class="text-panel">
      <p class="series-label">The Strong After 35 Series &nbsp;&middot;&nbsp; Book 1</p>
      <h1 class="book-title">WHO YOU<br>ARE NOW</h1>
      <div class="gold-divider"></div>
      <p class="book-subtitle">The African Man's<br>Recalibration at 35+</p>
      <p class="author-name">Matt Okewusi</p>
    </div>

  </div>
</body>
</html>`;

  await page.setContent(coverHTML, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({
    path: 'strong-after-35-cover-KDP.jpg',
    type: 'jpeg',
    quality: 100,
    clip: { x: 0, y: 0, width: 1600, height: 2560 }
  });

  await browser.close();
  console.log('KDP cover created: strong-after-35-cover-KDP.jpg (1600 x 2560 px)');
})();
