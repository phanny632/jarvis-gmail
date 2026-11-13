const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
// Rendert mehrere Level (Theme + Boss) als Standbild: Menü aus, Kamera vorn bzw. am Boss
(async () => {
  const lvls = process.argv.slice(2).map(Number);
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errs = [];
  for (const lv of lvls) {
    const p = await b.newPage({ viewport: { width: 400, height: 820 } });
    p.on('pageerror', e => errs.push(lv + ': ' + e.message));
    await p.addInitScript(lv => localStorage.setItem('armyRush.v1', JSON.stringify({ level: lv, coins: 0, best: lv, up: { start: 10, rate: 0, dmg: 0, range: 0, income: 0 } })), lv);
    if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/fonts\.g/, r => r.abort());
    await p.goto(GAME); await p.waitForTimeout(2000);
    await p.click('#btnGo'); await p.waitForTimeout(300);
    await p.evaluate(() => { const g = window.__armyRush, L = g.L(); const e = L.events.find(q => q.type === 'barrel'); if (e) g.jump(e.z + 9); });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${OUTDIR}/look_${lv}_run.png` });
    await p.evaluate(() => { const g = window.__armyRush; g.jump(-1e9); });
    await p.waitForTimeout(5000);
    await p.screenshot({ path: `${OUTDIR}/look_${lv}_boss.png` });
    await p.close();
  }
  console.log('JS-Fehler:', errs.length ? errs.join(' | ') : 'keine');
  await b.close();
})();
