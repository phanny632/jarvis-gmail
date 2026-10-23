const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
(async () => {
  console.log('Schritt 1/2: Laden');
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 820 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/fonts\.g/, r => r.abort());
  await p.goto(GAME); await p.waitForTimeout(1500);
  console.log('Schritt 2/2: Logik-Zeit pro Spielsekunde (ohne Rendern), je Waffe');
  const out = await p.evaluate(() => {
    const g = window.__armyRush, res = [];
    for (const w of ['pistol', 'minigun', 'shotgun', 'flamer', 'rocket', 'railgun']) {
      g.save.level = 12; Object.assign(g.save.up, { start: 15, rate: 10, dmg: 10, range: 4, income: 0 });
      let forced = false; const t0 = performance.now();
      const r = g.sim(api => { if (!forced) { g.setWeapon(w); forced = true; } api.steer(0); }, 40);
      res.push({ w, ms_per_s: ((performance.now() - t0) / r.t).toFixed(1), simT: r.t.toFixed(0), won: r.won, maxN: r.maxN });
    }
    return res;
  });
  console.log(out); console.log('JS-Fehler:', errs.length ? errs.join(' | ') : 'keine');
  await b.close();
})();
