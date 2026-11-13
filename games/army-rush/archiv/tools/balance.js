const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');   // Spiel relativ zu diesem Ordner
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
(async () => {
  console.log('Schritt 1/3: Browser starten');
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 820 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  if (fs.existsSync(path.join(__dirname, 'three.min.js'))) await p.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'three.min.js')), contentType: 'application/javascript' }));
  await p.route(/fonts\.g/, r => r.abort());
  await p.goto(GAME);
  await p.waitForTimeout(2000);
  console.log('Schritt 2/3: Simulation (Bot kauft immer das billigste Upgrade)');
  const out = await p.evaluate(() => {
    const g = window.__armyRush, log = [];
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
    const buy = () => { for (;;) { const bs = [...document.querySelectorAll('.buy:not(:disabled)')]; if (!bs.length) break; bs.sort((a,b)=>g.save.up[a.dataset.k]-g.save.up[b.dataset.k])[0].click(); } };
    let tries = 0, cur = g.save.level, total = 0;
    while (g.save.level <= 40 && total < 300) {
      const lv = g.save.level; const r = g.sim(bot); tries++; total++;
      if (r.won) { log.push({ lv, tries, maxN: r.maxN, up: Object.values(g.save.up).join('/') }); tries = 0; }
      buy();
    }
    return { log, total, level: g.save.level, up: g.save.up, coins: g.save.coins };
  });
  for (const l of out.log) console.log('  Level ' + String(l.lv).padStart(2) + ': ' + l.tries + ' Versuch(e), max Armee ' + l.maxN + ', Upgrades ' + l.up);
  console.log('  Gesamt-Versuche', out.total, 'erreicht Level', out.level);
  console.log('Schritt 3/3: JS-Fehler:', errs.length ? errs.join(' | ') : 'keine');
  await b.close();
})();
