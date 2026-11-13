const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
(async () => {
  console.log('Schritt 1/2: Waffen-Screenshots (Level 10, Schwarm)');
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errs = [];
  for (const w of ['pistol', 'shotgun', 'flamer', 'minigun', 'rocket', 'tesla', 'railgun', 'grenade']) {
    const p = await b.newPage({ viewport: { width: 400, height: 820 } });
    p.on('pageerror', e => errs.push(w + ': ' + e.message));
    await p.addInitScript(() => localStorage.setItem('armyRush.v1', JSON.stringify({ level: 10, coins: 0, best: 10, up: { start: 25, rate: 6, dmg: 6, range: 3, income: 0 } })));
    if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
    await p.route(/fonts\.g/, r => r.abort());
    await p.goto(GAME); await p.waitForTimeout(1500);
    await p.click('#btnGo');
    await p.evaluate(w => { const g = window.__armyRush, L = g.L(); g.setWeapon(w); const e = L.events.filter(q => q.type === 'enemy' && !q.escort).sort((a, c) => c.count - a.count)[0]; g.jump(e.z + 22); g.steer(e.x); }, w);
    await p.waitForTimeout(2200);
    await p.screenshot({ path: `${OUTDIR}/w_${w}.png` }); await p.close();
  }
  console.log('Schritt 2/2: JS-Fehler:', errs.length ? errs.join(' | ') : 'keine');
  await b.close();
})();
