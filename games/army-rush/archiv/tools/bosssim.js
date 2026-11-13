const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
(async () => {
  const T = +process.argv[2] || 1, P = +process.argv[3] || 1;
  console.log(`Schritt 1/3: Browser starten (Tuning t=${T}, p=${P})`);
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 820 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/fonts\.g/, r => r.abort());
  await p.goto(GAME); await p.waitForTimeout(1500);
  console.log('Schritt 2/3: Level 1-25, je 3 Läufe');
  const out = await p.evaluate(([T, P]) => {
    const g = window.__armyRush; g.tune.t = T; g.tune.p = P; const res = [];
    const bot = api => {
      const L = api.L(), B = api.B(), pz = api.pz, N = api.N;
      const st = B.strikes[0]; if (st) return api.steer(st.x > api.x ? Math.max(-5, st.x - 5) : Math.min(5, st.x + 5));
      const saw = L.events.find(e => e.type === 'saw' && e.z < pz && pz - e.z < 14);
      if (saw) return api.steer(saw.x > 0 ? -4.6 : 4.6);
      const nx = L.events.find(e => (e.type === 'gate' && !e.used || e.type === 'barrel' && !e.taken) && e.z < pz);
      if (!nx) return api.steer(0);
      if (nx.type === 'barrel') {
        const row = L.events.filter(q => q.type === 'barrel' && q.row === nx.row);
        const val = q => q.reward.t === 'weapon' ? (api.wDps(q.reward.w) > api.wDps(api.weapon) * 1.1 ? 1e9 : 0) : q.reward.t === 'troops' ? q.reward.v : 1;
        return api.steer(row.sort((a, b) => val(b) - val(a))[0].x);
      }
      const val = q => api.gateResult(N,q);
      api.steer(val(nx.gates[0]) >= val(nx.gates[1]) ? -3 : 3);
    };

    for (let lv = 1; lv <= 25; lv++) {
      const u = Math.round(lv * 0.7);
      const row = { lv, runs: [] };
      for (let k = 0; k < 3; k++) {
        g.save.level = lv; g.save.fails = 0; Object.assign(g.save.up, { start: u, rate: u, dmg: u, range: Math.min(8, Math.round(u / 2)), income: 0 });
        const r = g.sim(bot, 200);
        row.type = r.bossType;
        row.runs.push(r.won ? 'S' + Math.round(r.t) : r.boss ? 'B' + Math.round(r.bossLeft * 100) : 'L');
      }
      res.push(row);
    }
    return res;
  }, [T, P]);
  const agg = {};
  for (const r of out) { console.log('  Level ' + String(r.lv).padStart(2) + ' ' + r.type.padEnd(6) + ' ' + r.runs.join(' ')); const a = agg[r.type] = agg[r.type] || { w: 0, n: 0 }; for (const x of r.runs) { a.n++; if (x[0] === 'S') a.w++; } }
  console.log('Schritt 3/3: Siegquote je Boss: ' + Object.entries(agg).map(([k, a]) => k + ' ' + Math.round(a.w / a.n * 100) + '%').join(', ') + ' | JS-Fehler: ' + (errs.length ? errs.join(' | ') : 'keine'));
  console.log('  (S=Sieg nach x s, B=am Boss verloren mit x % Rest-HP, L=vor dem Boss verloren)');
  await b.close();
})();
