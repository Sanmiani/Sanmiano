'use strict';

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'Punta-Cana-Trip-May30-Jun06.pdf');
const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
doc.pipe(fs.createWriteStream(OUT));

// ── PALETTE ──────────────────────────────────────────────────
const CORAL   = '#E8523A';
const TEAL    = '#1A7A8A';
const GOLD    = '#D4A017';
const SAND    = '#F5E6C8';
const DARK    = '#1C2526';
const WHITE   = '#FFFFFF';
const LTGRAY  = '#F2F4F4';
const MIDGRAY = '#7F8C8D';

const ML = 45;          // margin left
const MR = 45;          // margin right
const PW = 595;         // page width
const PH = 842;         // page height
const CW = PW - ML - MR; // content width = 505
const FOOTER_Y = 824;

// ── CURSOR ───────────────────────────────────────────────────
let cy = 0; // current Y

function nl(n) { cy += (n === undefined ? 10 : n); }

// ── PRIMITIVES ───────────────────────────────────────────────
function newPage() {
  doc.addPage();
  cy = 55;
}

function fillRect(x, y, w, h, color) {
  doc.save().fillColor(color).rect(x, y, w, h).fill().restore();
}

function hRule(y, color, lw) {
  doc.save().strokeColor(color || TEAL).lineWidth(lw || 0.5)
     .moveTo(ML, y).lineTo(PW - MR, y).stroke().restore();
}

function text(str, x, y, opts, font, size, color) {
  doc.save()
     .font(font || 'Helvetica')
     .fontSize(size || 10)
     .fillColor(color || DARK)
     .text(str, x, y, opts || {})
     .restore();
}

// ── COMPONENTS ───────────────────────────────────────────────
function pageHeader(title, bg) {
  fillRect(ML, 50, CW, 32, bg || TEAL);
  text(title, ML + 10, 58, { width: CW - 20 }, 'Helvetica-Bold', 15, WHITE);
  cy = 95;
}

function secBar(title) {
  if (cy > 760) { newPage(); }
  nl(4);
  fillRect(ML, cy, CW, 22, TEAL);
  text(title, ML + 8, cy + 5, { width: CW - 16 }, 'Helvetica-Bold', 11, WHITE);
  cy += 27;
}

function sub(title) {
  if (cy > 775) { newPage(); }
  nl(3);
  text(title, ML, cy, { width: CW }, 'Helvetica-Bold', 9.5, CORAL);
  cy += 13;
}

function bul(str, indent) {
  indent = indent || 0;
  if (cy > 778) { newPage(); }
  // measure height before drawing
  const measured = doc.heightOfString('- ' + str, {
    font: 'Helvetica', fontSize: 9,
    width: CW - 14 - indent, lineGap: 0
  });
  text('- ' + str, ML + 14 + indent, cy,
       { width: CW - 14 - indent, lineGap: 0 },
       'Helvetica', 9, DARK);
  cy += measured + 2;
}

function dayBanner(dayLabel, dateStr, theme) {
  if (cy > 700) { newPage(); }
  nl(5);
  fillRect(ML, cy, CW, 20, SAND);
  text(dayLabel + '  |  ' + dateStr + '  --  ' + theme,
       ML + 8, cy + 3, { width: CW - 16 }, 'Helvetica-Bold', 10, TEAL);
  cy += 24;
}

function tableRow(cols, heights, bg, sizes, colors, styles) {
  // cols: [{text, x, w}], heights: row height
  if (cy > 778) { newPage(); }
  fillRect(ML, cy, CW, heights, bg);
  cols.forEach(function(c) {
    text(c.t, c.x, cy + c.dy, { width: c.w, lineGap: 0 },
         c.style || 'Helvetica', c.size || 9, c.color || DARK);
  });
  cy += heights;
}

// ======================================================
// PAGE 1 -- COVER
// ======================================================
cy = 0;
// full-page teal background
fillRect(0, 0, PW, PH, TEAL);
// accent shapes
doc.save().fillColor(CORAL).opacity(0.28).ellipse(520, 95, 185, 108).fill().restore();
doc.save().fillColor(GOLD).opacity(0.20).ellipse(75, 750, 170, 92).fill().restore();

// Title
text('TRAVEL ITINERARY', 0, 168, { width: PW, align: 'center' }, 'Helvetica-Bold', 11, GOLD);
text('PUNTA CANA', 0, 190, { width: PW, align: 'center' }, 'Helvetica-Bold', 46, WHITE);
text('Dominican Republic', 0, 246, { width: PW, align: 'center' }, 'Helvetica', 20, SAND);

// Date banner
fillRect(125, 290, 345, 40, CORAL);
text('May 30 -- June 6, 2026', 125, 302, { width: 345, align: 'center' }, 'Helvetica-Bold', 16, WHITE);
text('Departing Toronto  |  8 Days / 7 Nights  |  All-Inclusive',
     0, 346, { width: PW, align: 'center' }, 'Helvetica', 11, SAND);

// Divider
doc.save().strokeColor(GOLD).lineWidth(1.5).moveTo(150, 378).lineTo(445, 378).stroke().restore();

// Highlight pills
const pills = ['Beaches', 'Food', 'Culture', 'Adventure', 'Nightlife'];
let px = 90;
pills.forEach(function(p) {
  doc.save().fillColor(GOLD).roundedRect(px, 392, 70, 24, 4).fill().restore();
  text(p, px, 399, { width: 70, align: 'center' }, 'Helvetica-Bold', 9, DARK);
  px += 80;
});

// Centre tagline
text('Sun. Sea. Culture. Adventure.', 0, 450, { width: PW, align: 'center' }, 'Helvetica-Bold', 15, SAND);

// Footer
text('Prepared for Matt Okewusi  |  Toronto, Canada  to  Punta Cana, DR',
     0, 768, { width: PW, align: 'center' }, 'Helvetica', 10, SAND);
text('Strongafter35afrimen  |  Live Well, Travel Well',
     0, 786, { width: PW, align: 'center' }, 'Helvetica', 9, GOLD);

// ======================================================
// PAGE 2 -- TRIP FACTS + GETTING AROUND + TIPPING
// ======================================================
newPage();
pageHeader('TRIP AT A GLANCE', TEAL);

const facts = [
  ['Destination',  'Punta Cana, La Altagracia Province, Dominican Republic'],
  ['Departure',    'Toronto Pearson International (YYZ) to Punta Cana (PUJ)'],
  ['Outbound',     'May 30, 2026  (approx. 4.5 hr direct flight)'],
  ['Return',       'June 6, 2026  (depart PUJ, arrive YYZ same day)'],
  ['Duration',     '8 days / 7 nights  --  All-Inclusive'],
  ['Currency',     'Dominican Peso (DOP) -- USD widely accepted for excursions and tips'],
  ['Language',     'Spanish  (English spoken in all tourist zones)'],
  ['Time Zone',    'AST, UTC-4  (1 hr ahead of Toronto in summer)'],
  ['Climate',      'High 30-32 C, Low 23-25 C -- warm Caribbean breezes'],
  ['Visas',        'Canadian passport: Tourist e-ticket card (~USD 10), no visa required'],
];
facts.forEach(function(r, i) {
  fillRect(ML, cy, CW, 18, i % 2 === 0 ? LTGRAY : WHITE);
  text(r[0].toUpperCase(), ML + 6, cy + 4, { width: 110 }, 'Helvetica-Bold', 8.5, TEAL);
  text(r[1], ML + 120, cy + 4, { width: CW - 126 }, 'Helvetica', 8.5, DARK);
  cy += 18;
});

secBar('GETTING AROUND');
bul('Airport transfers: Pre-book hotel shuttle -- approx. USD 25-35 each way.');
bul('Within resort zone: Taxis and golf buggies. Always agree price before getting in.');
bul('Excursions: Book through hotel concierge or Outback Adventures / Bavaro Adventures.');
bul('Local trips (Macao Beach, Bayahibe): Short taxi -- negotiate fare upfront (~USD 10-20).');

secBar('TIPPING GUIDE');
bul('Resort staff (bartenders, housekeeping, servers): USD 1-2 per round / USD 2-3 per day.');
bul('Tour guide on day excursions: USD 5-10 per person.');
bul('Taxi / driver: Round up or add USD 2-3 for good service.');
bul('Carry USD 1 and USD 5 bills -- makes tipping smooth all week.');

// ======================================================
// PAGE 3 -- DAY 1 & 2
// ======================================================
newPage();
pageHeader('DAY-BY-DAY ITINERARY', CORAL);

dayBanner('DAY 1 -- SATURDAY', 'May 30, 2026', 'Arrival and First Sunset');
sub('Morning -- Departure from Toronto');
bul('Arrive at Toronto Pearson (YYZ) 3 hrs before departure for international check-in.');
bul('Air Canada or WestJet fly direct to Punta Cana (PUJ). Flight: approx. 4 hrs 30 mins.');
sub('Afternoon -- Arrival and Check-In');
bul('Clear customs at PUJ. Pay tourist card at airport if not purchased online (~USD 10).');
bul('Transfer to resort. Check in, change, and walk straight to the beach.');
sub('Evening');
bul('Dinner at resort. Try whatever looks most local on the buffet.');
bul('Sunset cocktail on the beach -- Presidente beer or a classic Pina Colada.');

nl(6);
dayBanner('DAY 2 -- SUNDAY', 'May 31, 2026', 'Beach Day and Town Exploration');
sub('Morning -- Bavaro Beach');
bul('Breakfast at resort, then spend the morning on Bavaro Beach -- a world top-10 beach.');
bul('Water activities: parasailing, jet skiing, and paddleboarding available from the beach.');
sub('Afternoon -- Bavaro Town');
bul('Walk or taxi into Bavaro town. Browse stalls -- Larimar jewellery, cigars, crafts.');
bul('Try a street chimichurri (Dominican beef burger with curtido slaw) from a local spot.');
sub('Evening');
bul('Jellyfish Beach Restaurant and Bar -- tables on the sand, great cocktails, good food.');
bul('Watch the sunset with a Mamajuana cocktail in hand.');

// ======================================================
// PAGE 4 -- DAY 3 & 4
// ======================================================
newPage();
cy = 55;

dayBanner('DAY 3 -- MONDAY', 'June 1, 2026', 'Isla Saona Full-Day Excursion');
sub('Full Day -- Isla Saona Island');
bul('Depart resort 8:00 AM. Join a group catamaran excursion (book 1 day ahead).');
bul('Speedboat to Isla Saona -- a UNESCO Biosphere Reserve.');
bul('Stop at the natural swimming pool -- a shallow sandbar scattered with starfish.');
bul('Arrive on Saona: white sand, palm trees, crystal-clear water. The postcard beach of the DR.');
bul('Lunch on the beach: grilled fish, lobster, rice and beans -- included on most tours.');
bul('Return by catamaran -- open bar, live music, dancing on deck (~3-4 hrs back).');
sub('Top Operators');
bul('Outback Adventures Punta Cana -- bilingual guides, highly rated.');
bul('Fun Cat Catamaran -- lively, popular with the 35+ crowd.');

nl(6);
dayBanner('DAY 4 -- TUESDAY', 'June 2, 2026', 'Culture Day -- Altos de Chavon');
sub('Morning -- Rest');
bul('Slow morning -- swim, spa, or lounge at the resort pool.');
sub('Afternoon -- Altos de Chavon, La Romana');
bul('2-hr transfer west to La Romana. Visit Altos de Chavon -- a recreated 16th-century village.');
bul('Walk cobblestone streets. Church of St. Stanislaus and the 5,000-seat open-air amphitheatre.');
bul('Regional Museum of Archaeology -- Taino artefacts and Dominican indigenous history.');
bul('Browse artisan galleries: leather goods, paintings, ceramics.');
sub('Evening');
bul('El Pulpo Cojo (Bavaro) -- local institution for grilled octopus and fresh fish.');

// ======================================================
// PAGE 5 -- DAY 5 & 6
// ======================================================
newPage();
cy = 55;

dayBanner('DAY 5 -- WEDNESDAY', 'June 3, 2026', 'Adventure Day');
sub('Morning -- ATV and Zipline');
bul('ATV jungle adventure: sugar cane fields, rivers, and local villages (~4 hrs).');
bul('Punta Cana Adventure Park or Bavaro Adventure Park -- ATV from USD 70/person.');
bul('Combo packages: ATV + zipline + buggy ride. Book as a morning block.');
sub('Afternoon -- Hoyo Azul, Blue Hole');
bul('Hoyo Azul at Scape Park, Cap Cana -- a natural cenote with vivid blue water.');
bul('Entry ~USD 109: includes beach club, zip-line, cave walk, and cenote swim.');
bul('40-metre-deep sinkhole. Cool, clear water. One of the Caribbean\'s iconic spots.');
sub('Evening');
bul("Onno's Bar and Grill (Bavaro strip) -- lively, open-air, good food.");
bul('Try the Mamajuana: rum, red wine, honey, and tree bark. Strong. Very DR.');

nl(6);
dayBanner('DAY 6 -- THURSDAY', 'June 4, 2026', 'Golf, Local Beach and Nightlife');
sub('Morning -- Golf (Optional)');
bul('Corales Golf Club (Cap Cana) -- ranked #1 in the Caribbean. Oceanside holes. Book ahead.');
bul('La Cana Golf Club -- 27 holes, ocean views. Cocotal Golf -- best value, relaxed pace.');
bul('Non-golfers: mangrove kayak tour along the Yauya river or a lazy resort morning.');
sub('Afternoon -- Dominicus Beach');
bul('45-min drive south to Dominicus/Bayahibe -- quieter, less commercial, more local.');
bul('Snorkelling straight off the beach. Lunch at Pescador Restaurante: fresh fish with tostones.');
sub('Evening -- Nightlife');
bul('Coco Bongo Punta Cana -- Vegas-style show plus club. Book tickets early (~USD 75+).');
bul('Imagine Disco -- inside a real limestone cave. Mangu Night Club for bachata until dawn.');

// ======================================================
// PAGE 6 -- DAY 7 & 8
// ======================================================
newPage();
cy = 55;

dayBanner('DAY 7 -- FRIDAY', 'June 5, 2026', 'Snorkeling and Last Night Out');
sub('Morning -- Catamaran Snorkeling Tour');
bul('Half-day catamaran tour -- departs Bavaro beach 8:30 AM. Open bar included.');
bul('Snorkel reef gardens: tropical fish and sea turtles. Back by 1:00 PM.');
sub('Afternoon -- Shopping');
bul('Palma Real Shopping Village -- upscale mall, duty-free. San Juan Shopping Centre for deals.');
bul('Buy: Brugal or Barcelo rum, Mamajuana kits, handmade cigars, Larimar jewellery.');
sub('Evening -- Last Night Dinner');
bul('La Palapa Beach Club (Bavaro) -- tables on sand, fresh seafood and steaks.');
bul('Or splurge at Bana Restaurant, Tortuga Bay -- the most upscale dining in Punta Cana.');

nl(6);
dayBanner('DAY 8 -- SATURDAY', 'June 6, 2026', 'Departure Day');
sub('Morning');
bul('Set the alarm for 5:30 AM. One last sunrise on the beach. Worth every minute.');
bul('Breakfast at resort. Check out 11:00 AM -- ask for late checkout if flight allows.');
sub('Afternoon -- Airport');
bul('Allow 1.5-2 hrs before flight. PUJ duty-free has good rum and cigar prices -- last chance.');
bul('Return flight to Toronto Pearson -- arrive home same evening.');
bul('You land back in Toronto with a tan, a full reset, and a clear head. Welcome back, brother.');

// ======================================================
// PAGE 7 -- FOOD GUIDE
// ======================================================
newPage();
pageHeader('FOOD GUIDE -- WHERE TO EAT OUTSIDE THE RESORT', GOLD);
// swap text color for gold header
doc.save().fillColor(DARK).font('Helvetica-Bold').fontSize(15)
   .text('FOOD GUIDE -- WHERE TO EAT OUTSIDE THE RESORT', ML + 10, 58, { width: CW - 20 }).restore();

secBar('MUST-TRY DOMINICAN DISHES');
const dishes = [
  ['La Bandera',       'Rice, black beans, stewed chicken -- the national plate, eaten for lunch.'],
  ['Sancocho',         '7-meat stew with root vegetables. Rich, hearty, deeply local.'],
  ['Mangu',            'Mashed plantains topped with sauteed onions. Classic DR breakfast.'],
  ['Tostones',         'Twice-fried green plantain slices. Goes with everything. Addictive.'],
  ['Pescado al Coco',  'Fresh fish cooked in coconut milk. A Caribbean coastal staple.'],
  ['Chivo Guisado',    'Braised goat stew. Slow-cooked, fragrant, deeply flavourful.'],
  ['Chimichurri (DR)', 'Dominican beef burger in soft bread with curtido slaw. Not the sauce.'],
  ['Morir Sonando',    '"To die dreaming" -- orange juice and evaporated milk, chilled.'],
  ['Presidente Beer',  'The local beer. Ice cold. Pairs with everything in Punta Cana.'],
  ['Mamajuana',        'DR national drink: rum, red wine, honey, and herbs. Try it once.'],
];
dishes.forEach(function(r, i) {
  fillRect(ML, cy, CW, 18, i % 2 === 0 ? LTGRAY : WHITE);
  text(r[0], ML + 6, cy + 4, { width: 125 }, 'Helvetica-Bold', 8.5, CORAL);
  text(r[1], ML + 134, cy + 4, { width: CW - 140 }, 'Helvetica', 8.5, DARK);
  cy += 18;
});

secBar('TOP RESTAURANTS TO VISIT');
const rests = [
  ['La Yola',             'Cap Cana Marina',   'Floating restaurant. Best octopus and lobster in Punta Cana. Reserve ahead.'],
  ['Jellyfish Restaurant','Bavaro Beach',      'Tables on the sand. Great for sunset. Grills, pasta, and fresh seafood.'],
  ['El Pulpo Cojo',       'Bavaro',            '"The lame octopus." Local institution. Casual, cheap, very good.'],
  ['La Palapa Beach Club','Bavaro',            'Palm-shaded terrace on the beach. Go for fresh fish at lunch or dinner.'],
  ['Bana Restaurant',     'Tortuga Bay Hotel', 'Most upscale dining in Punta Cana. Oscar de la Renta-designed hotel.'],
  ['Ristorante Pomodoro', 'Bavaro',            'Busy and lively. Lobster pasta is the local favourite.'],
  ['Pescador Restaurante','Bayahibe',          '45 min south -- freshest fish cooked to order on Bayahibe beach.'],
  ['Buen Sabor',          'Bavaro Town',       'Hole-in-the-wall: La Bandera, tostones, and cold Presidente.'],
];
rests.forEach(function(r, i) {
  fillRect(ML, cy, CW, 34, i % 2 === 0 ? LTGRAY : WHITE);
  text(r[0], ML + 6, cy + 4,  { width: 140 }, 'Helvetica-Bold', 9, TEAL);
  text(r[1], ML + 6, cy + 19, { width: 140 }, 'Helvetica',      8, MIDGRAY);
  text(r[2], ML + 152, cy + 10, { width: CW - 158, lineGap: 0 }, 'Helvetica', 8.5, DARK);
  cy += 34;
});

// ======================================================
// PAGE 8 -- ATTRACTIONS + NIGHTLIFE + WATER SPORTS
// ======================================================
newPage();
pageHeader('ATTRACTIONS, ACTIVITIES AND NIGHTLIFE', CORAL);

secBar('TOP ATTRACTIONS');
const attrs = [
  ['Isla Saona',             'Nature',     'UNESCO Biosphere Reserve. Natural pool, starfish, pristine beach. The #1 excursion.'],
  ['Hoyo Azul (Blue Hole)',  'Adventure',  '40-metre natural cenote in Scape Park. Vivid blue water in a limestone cliff.'],
  ['Bavaro Beach',           'Beach',      'World top-10 beach. 30 km of white sand and turquoise water at your doorstep.'],
  ['Altos de Chavon',        'Culture',    'Recreated 16th-century village. Cobblestone streets, amphitheatre, Taino museum.'],
  ['Indigenous Eyes Park',   'Eco',        '12 freshwater lagoons in jungle. Native wildlife and iguana trails. Puntacana Resort.'],
  ['Cap Cana Marina',        'Sport',      'Deep-sea fishing, yachts, La Yola restaurant, and boutique shopping.'],
  ['Cueva Fun Fun',          'Cave/Hike',  'Jungle hike, then abseil into a cave with underground pools. Taino rock art inside.'],
  ['Macao Beach',            'Beach/Surf', 'Wilder, less developed beach 20 min from Bavaro. Best kitesurfing in the DR.'],
  ['Corales Golf Club',      'Sport',      'PGA Tour host course. Caribbean\'s finest. Ocean-view holes. Book weeks ahead.'],
  ['Bavaro Lagoon',          'Nature',     'Mangrove kayak tours. Quiet, off-resort experience. Best at sunrise or sunset.'],
];
attrs.forEach(function(a, i) {
  fillRect(ML, cy, CW, 30, i % 2 === 0 ? LTGRAY : WHITE);
  text(a[0], ML + 6, cy + 4,  { width: 148 }, 'Helvetica-Bold', 9,   TEAL);
  text(a[1], ML + 6, cy + 18, { width: 148 }, 'Helvetica-Bold', 7.5, CORAL);
  text(a[2], ML + 158, cy + 9, { width: CW - 164, lineGap: 0 }, 'Helvetica', 8.5, DARK);
  cy += 30;
});

secBar('NIGHTLIFE AND ENTERTAINMENT');
bul('Coco Bongo Punta Cana -- Vegas-style acrobat show plus club. Go Wed or Fri. Book early (~USD 75+).');
bul('Imagine Disco -- inside a real limestone cave. Packed on weekends. A unique experience.');
bul("Mangu Night Club (Bavaro) -- large venue, local crowd, merengue and bachata until dawn.");
bul("Onno's Bar and Grill -- open-air bar on the strip. Good for pre-club drinks and people watching.");
bul('Hard Rock Hotel Casino -- full casino, live bands, and cigar lounge for a relaxed evening out.');

secBar('WATER SPORTS AND ADVENTURES');
bul('Scuba diving: Dressel Divers (Bavaro) -- PADI certified, reef dives from USD 65.');
bul('Deep-sea fishing: Cap Cana Marina -- marlin, wahoo, mahi-mahi. Charters from USD 450/boat.');
bul('Kitesurfing: Macao Beach -- one of the Caribbean\'s best kite spots. Lessons available.');
bul('Parasailing: Daily from Bavaro beach. Great aerial views of the coastline.');
bul('Catamaran snorkeling: Half-day tours with open bar. Sea turtles and reef fish. Daily departures.');

// ======================================================
// PAGE 9 -- BACK COVER
// ======================================================
doc.addPage();
fillRect(0, 0, PW, PH, TEAL);
doc.save().fillColor(CORAL).opacity(0.25).ellipse(100, 195, 195, 145).fill().restore();
doc.save().fillColor(GOLD).opacity(0.18).ellipse(475, 615, 175, 215).fill().restore();

text('TRIP SUMMARY', 0, 182, { width: PW, align: 'center' }, 'Helvetica-Bold', 11, GOLD);
text('Your Punta Cana', 0, 208, { width: PW, align: 'center' }, 'Helvetica-Bold', 30, WHITE);
text('Adventure Awaits', 0, 246, { width: PW, align: 'center' }, 'Helvetica-Bold', 30, WHITE);

hRule(290, GOLD, 1.5);

const sum = [
  'Day 1  --  Arrive and settle in. First sunset on Bavaro Beach.',
  'Day 2  --  Beach day, Bavaro town, Jellyfish Restaurant.',
  'Day 3  --  Isla Saona full-day catamaran excursion.',
  'Day 4  --  Culture trip to Altos de Chavon, La Romana.',
  'Day 5  --  ATV adventure and Hoyo Azul Blue Hole cenote.',
  'Day 6  --  Golf, Dominicus Beach, Coco Bongo nightlife.',
  'Day 7  --  Catamaran snorkeling, shopping, last dinner out.',
  'Day 8  --  Sunrise on the beach, airport, home to Toronto.',
];
let sy = 303;
sum.forEach(function(s) {
  text('* ' + s, 90, sy, { width: 415, lineGap: 0 }, 'Helvetica', 10.5, SAND);
  sy += 22;
});

hRule(492, GOLD, 1.5);

text('"Travel is the only thing you buy that makes you richer."',
     0, 508, { width: PW, align: 'center' }, 'Helvetica', 11, SAND);
text('Safe travels, Brother.  Strongafter35afrimen',
     0, 545, { width: PW, align: 'center' }, 'Helvetica-Bold', 10, GOLD);
text('Prepared by AIOS  |  mattsanmiano@gmail.com  |  May 2026',
     0, 788, { width: PW, align: 'center' }, 'Helvetica', 9, '#aacccc');

// ======================================================
// FOOTERS on interior pages (pages 2-8)
// ======================================================
const total = doc.bufferedPageRange().count;
for (let i = 1; i <= total - 2; i++) {
  doc.switchToPage(i);
  fillRect(0, FOOTER_Y, PW, PH - FOOTER_Y, TEAL);
  text('Punta Cana  |  May 30 - June 6, 2026  |  All-Inclusive',
       ML, FOOTER_Y + 5, { width: 280 }, 'Helvetica', 7, WHITE);
  text('Page ' + (i + 1) + ' of ' + total,
       0, FOOTER_Y + 5, { width: PW - MR, align: 'right' }, 'Helvetica', 7, WHITE);
}

doc.end();
console.log('Done. Pages:', total, ' Output:', OUT);
