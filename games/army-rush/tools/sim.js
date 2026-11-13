// Balance-Simulation: Bot spielt Level 1 bis N, kauft Upgrades, Götter und Begleiter.
// Aufruf: node sim.js [bisLevel] [maxVersuche]
const { chromium } = require('playwright');
const path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');
(async () => {
  const UPTO = +process.argv[2] || 30, MAXT = +process.argv[3] || 150;
  console.log('Schritt 1/3: Browser starten');
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 820 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route(/fonts\.g/, r => r.abort());
  await p.addInitScript(() => localStorage.removeItem('hellEscape.v1'));
  await p.goto(GAME); await p.waitForTimeout(2500);
  console.log(`Schritt 2/3: Bot spielt bis Level ${UPTO} (höchstens ${MAXT} Versuche)`);
  const out = await p.evaluate(([UPTO, MAXT]) => {
    const g = window.__hellEscape, log = [];
    const bot = api => {
      const L = api.L(), B = api.B(), pz = api.pz, x = api.x;
      const strikes = (B ? B.strikes : []).filter(s => Math.hypot(s.x - x, s.z - pz) < s.r + 1.2);
      if (strikes.length) { const s = strikes[0]; return api.steer(s.x > x ? s.x - s.r - 1.5 : s.x + s.r + 1.5); }
      if (B && B.laser && B.laser.warn <= 0) return api.steer(B.laser.dir > 0 ? (B.laser.x > x ? -5 : 5) : (B.laser.x < x ? 5 : -5));
      const ahead = L.events.filter(e => !e.dead && !e.used && e.z < pz && pz - e.z < 14);
      for (const e of ahead) {
        if (e.type === 'saw' && pz - e.z < 9) return api.steer(e.x > 0 ? -4.8 : 4.8);
        if (e.type === 'lava') return api.steer(-e.x);
        if ((e.type === 'rock' || e.type === 'totem') && pz - e.z < 7 && Math.abs(e.x - x) < 2) return api.steer(e.x > 0 ? e.x - 2.6 : e.x + 2.6);
      }
      const gates = L.events.filter(e => !e.used && !e.dead && e.z < pz && pz - e.z < 30 && (e.type === 'craft' || e.type === 'sgate' || e.type === 'god'));
      const val = e => e.type === 'craft' ? (e.power > api.power ? (e.fill / e.need > 0.4 ? 3 : 1.5) : 0.2) : e.type === 'god' ? (api.stairs >= e.cost + 6 ? 2.5 : -1) : 1;
      gates.sort((a, c) => val(c) - val(a));
      if (gates.length && val(gates[0]) > 0) return api.steer(gates[0].x);
      const heart = L.events.find(e => e.type === 'heart' && !e.dead && e.z < pz && pz - e.z < 15); if (heart && api.hearts < 3) return api.steer(heart.x);
      api.steer(0);
    };
    const shop = () => {
      const s = g.save(); let changed = true;
      while (changed) {
        changed = false;
        const ups = [['dmg', 20, 1.28, 60], ['rate', 25, 1.3, 40], ['hp', 120, 2.2, 5], ['stairs', 30, 1.35, 30], ['magnet', 35, 1.4, 15]].map(([k, b0, gr, mx]) => ({ k, c: Math.round(b0 * Math.pow(gr, s.up[k])), mx }))
          .filter(u => s.up[u.k] < u.mx && u.c <= s.coins).sort((a, c) => a.c - c.c);
        if (ups.length) { s.coins -= ups[0].c; s.up[ups[0].k]++; changed = true; }
      }
      for (const [k, c] of [['ares', 25], ['artemis', 50], ['poseidon', 90], ['hades', 140]]) if (!s.gods[k] && s.gems >= c) { s.gems -= c; s.gods[k] = 1; s.god = k; }
      while (s.gems >= Math.round(15 * Math.pow(1.45, s.gods[s.god] - 1)) && s.gods[s.god] < 20) { s.gems -= Math.round(15 * Math.pow(1.45, s.gods[s.god] - 1)); s.gods[s.god]++; }
      for (const [k, c] of [['centaur', 40], ['minotaur', 120], ['reaper', 260]]) if (!s.comps[k] && s.souls >= c) { s.souls -= c; s.comps[k] = 1; s.comp = k; }
      g.setSave(s);
    };
    let tries = 0, total = 0, detail = [];
    while (g.save().level <= UPTO && total < MAXT) {
      const lv = g.save().level; const r = g.run(bot, 260); tries++; total++;
      detail.push(r.won ? 'S' : r.boss ? 'B' + Math.round(r.bossLeft * 100) : 'L' + Math.round(r.t));
      if (r.won) { const s = g.save(); log.push({ lv, tries, d: detail.join(' '), up: Object.values(s.up).join('/'), god: s.god + s.gods[s.god], comp: s.comp || '-', pw: r.power, st: Math.floor(r.stairs), xp: r.xpLvl, h: r.hearts }); tries = 0; detail = []; }
      shop();
    }
    if (detail.length) log.push({ lv: g.save().level, tries, d: detail.join(' ') + ' (offen)' });
    return { log, total };
  }, [UPTO, MAXT]);
  for (const l of out.log) console.log(`  Level ${String(l.lv).padStart(2)}: ${l.tries} Versuch(e) [${l.d}]` + (l.up ? `  Upg ${l.up}  Gott ${l.god}  Begl ${l.comp}  Waffe ${l.pw}  Treppen ${l.st}  XP-Lv ${l.xp}  Herzen ${l.h}` : ''));
  console.log(`Schritt 3/3: ${out.total} Versuche gesamt · JS-Fehler: ${errs.length ? errs.join(' | ') : 'keine'}`);
  console.log('  (S = Sieg, B = am Boss verloren mit % Rest-HP, L = auf der Strecke nach x s verloren)');
  await b.close();
})();
