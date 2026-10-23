const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
(async () => {
  console.log('Schritt 1/2: Laden');
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 820 } });
  if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/fonts\.g/, r => r.abort());
  await p.goto(GAME); await p.waitForTimeout(1500);
  console.log('Schritt 2/2: Echter Boss-Schaden je Waffe (Anteil der theoretischen Armee-DPS)');
  const out = await p.evaluate(() => {
    const g = window.__armyRush, res = {};
    g.tune.p = 0; g.tune.t = 50;
    for (const w of Object.keys(g.WEAPONS)) {
      const f = [];
      for (const [lv, bt] of [[6, 'brute'], [7, 'tank'], [8, 'heli'], [10, 'mech'], [5, 'necro']]) {
        g.save.level = lv; g.save.fails = 0; Object.assign(g.save.up, { start: 30, rate: 5, dmg: 5, range: 4, income: 0 });
        let st = null, h0 = 0, N0 = 0, done = false;
        g.sim(api => {
          const B = api.B(), L = api.L();
          if (api.weapon !== w) g.setWeapon(w);
          if (L.boss && api.pz > L.boss.z + 23) { api.jump(L.boss.z + 22.5); return; }
          api.steer(B.x);
          if (api.pz <= L.boss.z + 22.01 && !done) {
            st = (st || 0) + 1 / 30;
            for (const e of L.events) if (e.type === 'enemy') { e.dead = true; }
            B.minions = 0;
            if (st >= 4 && !h0) { h0 = B.hp; N0 = api.N; }
            if (st >= 12) { done = true; f.push((h0 - B.hp) / 8 / (N0 * g.stat.rate(5) * g.stat.dmg(5))); B.hp = 0; }
          }
        }, 120);
      }
      res[w] = f.map(x => x.toFixed(2)).join(' ') + '  Ø ' + (f.reduce((a, c) => a + c, 0) / f.length).toFixed(2) + '  (Wertung ' + g.wDps(w).toFixed(2) + ')';
    }
    return res;
  });
  for (const k in out) console.log('  ' + k.padEnd(9) + out[k]);
  await b.close();
})();
