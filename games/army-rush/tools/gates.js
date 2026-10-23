const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
(async () => {
  console.log('Schritt 1/2: Spiel laden');
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 820 } });
  if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/fonts\.g/, r => r.abort());
  await p.goto(GAME); await p.waitForTimeout(1500);
  console.log('Schritt 2/2: Tore messen (Level 3 und 6)');
  const out = await p.evaluate(() => {
    const g = window.__armyRush, res = [];
    for (const lv of [3, 6, 12, 19]) {
      g.save.level = lv; const u = Math.round(lv * 0.8); Object.assign(g.save.up, { start: u, rate: u, dmg: u, range: Math.min(8, u), income: 0 }); g.save.fails = 0;
      const seen = new Map(); let lastN = 0;
      g.sim(api => {
        const L = api.L();
        for (const e of L.events) if (e.type === 'gate') {
          const side = e.gates[1];   // Bot läuft immer rechts durch
          if (!seen.has(e)) seen.set(e, { z: Math.round(e.z), start: side.op + side.v, max: side.v, cap: side.maxV });
          const s = seen.get(e); if (!e.used) { s.max = side.v; s.Nbefore = api.N; } else if (s.after === undefined) { s.after = api.N; s.gain = api.N - s.Nbefore; }
        }
        api.steer(3);
      }, 120);
      res.push({ lv, gates: [...seen.values()].filter(s => s.after !== undefined) });
    }
    return res;
  });
  for (const r of out) { console.log('Level ' + r.lv); for (const s of r.gates) console.log(`  Tor z=${s.z}: Start ${s.start}, beim Durchlaufen ${s.max} (MAX ${s.cap}), Armee ${s.Nbefore} -> ${s.after} (Zuwachs ${s.gain})`); }
  await b.close();
})();
