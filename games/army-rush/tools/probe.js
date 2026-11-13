// Zeigt für ein Level, wo der Held Herzen verliert und was dort auf der Strecke ist.
const { chromium } = require('playwright'); const path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');
(async () => {
  const LV = +process.argv[2] || 3;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage(); await p.route(/fonts\.g/, r => r.abort());
  await p.goto(GAME); await p.waitForTimeout(2000);
  const out = await p.evaluate(LV => {
    const g = window.__hellEscape; const s = g.save(); s.level = LV; s.up = { dmg: 3, rate: 2, hp: 0, stairs: 1, magnet: 1 }; g.setSave(s);
    const log = []; let lastH = null;
    const r = g.run(api => {
      const L = api.L(); if (lastH !== null && api.hearts < lastH) { const near = L.events.filter(e => Math.abs(e.z - api.pz) < 6).map(e => e.type + (e.kind ? ':' + e.kind + ' n' + e.count : '') + ' x' + (e.x || 0).toFixed(1) + (e.dead ? ' tot' : '')); log.push('pz ' + api.pz.toFixed(0) + ' x ' + api.x.toFixed(1) + ' Herzen ' + api.hearts + ' | ' + near.join(', ')); }
      lastH = api.hearts;
      const ahead = L.events.filter(e => !e.dead && !e.used && e.z < api.pz && api.pz - e.z < 14);
      for (const e of ahead) { if (e.type === 'saw' && api.pz - e.z < 9) return api.steer(e.x > 0 ? -4.8 : 4.8); if (e.type === 'lava') return api.steer(-e.x); if ((e.type === 'rock' || e.type === 'totem') && api.pz - e.z < 7 && Math.abs(e.x - api.x) < 2) return api.steer(e.x > 0 ? e.x - 2.6 : e.x + 2.6); }
      api.steer(0);
    }, 200);
    return { r, log, ev: g.L().events.slice(0, 14).map(e => Math.round(e.z) + ' ' + e.type + (e.kind ? ':' + e.kind + ' n' + e.count + ' hp' + e.hpEach.toFixed(1) : '') + (e.hp ? ' hp' + e.hp : '')) };
  }, LV);
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
