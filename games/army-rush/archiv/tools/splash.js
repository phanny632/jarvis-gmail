const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 820 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/fonts\.g/, r => r.abort());
  await p.goto(GAME, { waitUntil: 'commit' }); await p.waitForTimeout(300); console.log(await p.evaluate(() => { const s = document.getElementById('splash'); return s ? s.className + ' ' + getComputedStyle(s).display + ' ' + getComputedStyle(s).opacity + ' z' + getComputedStyle(s).zIndex : 'kein splash'; })); await p.screenshot({ path: OUTDIR + '/sp0.png' }); await p.waitForTimeout(1300);
  await p.screenshot({ path: OUTDIR + '/sp1.png' }); await p.waitForTimeout(2500); await p.screenshot({ path: OUTDIR + '/sp2.png' });
  console.log('JS-Fehler:', errs.length ? errs.join(' | ') : 'keine'); await b.close();
})();
