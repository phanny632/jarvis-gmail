// Screenshots von Menü, Lauf, Perk-Auswahl, Treppe und Boss.
// Aufruf: node look.js [Level ...]   (Bilder landen in tools/out/)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const GAME = 'file://' + path.resolve(__dirname, '../index.html');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const levels = process.argv.slice(2).map(Number).filter(Boolean); if (!levels.length) levels.push(1, 5);
  const total = levels.length + 1; let step = 1;
  console.log(`Schritt ${step++}/${total}: Browser starten`);
  const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errs = [];
  for (const lv of levels) {
    console.log(`Schritt ${step++}/${total}: Level ${lv}`);
    const p = await b.newPage({ viewport: { width: 400, height: 820 } });
    p.on('pageerror', e => errs.push(lv + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts/.test(m.text())) errs.push(lv + ': ' + m.text()); });
    await p.route(/fonts\.g/, r => r.abort());
    await p.addInitScript(lv => localStorage.setItem('hellEscape.v1', JSON.stringify({ level: lv, coins: 500, gems: 60, souls: 50, god: 'zeus', gods: { zeus: 2 }, up: { dmg: Math.round(lv * 0.6), rate: Math.round(lv * 0.5), hp: 0, stairs: 1, magnet: 1 } })), lv);
    await p.goto(GAME); await p.waitForTimeout(3600);
    await p.screenshot({ path: `${OUT}/l${lv}_menu.png` });
    await p.click('#btnGo'); await p.waitForTimeout(2500);
    await p.screenshot({ path: `${OUT}/l${lv}_run1.png` });
    // Bot lenkt: Schmiede/Treppentor ansteuern, Hindernissen ausweichen
    await p.evaluate(() => setInterval(() => { const g = window.__hellEscape, L = g.L(); const nx = L.events.find(e => !e.dead && !e.used && e.z < g.pz && (e.type === 'craft' || e.type === 'sgate')); if (nx && g.pz - nx.z < 25) g.steer(nx.x); }, 100));
    await p.waitForTimeout(6000);
    await p.screenshot({ path: `${OUT}/l${lv}_run2.png` });
    const st = await p.evaluate(() => { const g = window.__hellEscape; return { state: g.state, pz: g.pz, hearts: g.hearts, stairs: g.stairs }; });
    console.log('   Zustand:', JSON.stringify(st));
    if (st.state === 'perk') { await p.screenshot({ path: `${OUT}/l${lv}_perk.png` }); await p.click('.perkCard'); }
    await p.evaluate(() => { const g = window.__hellEscape, L = g.L(); g.jump(-L.len + 25); });
    await p.waitForTimeout(5000);
    await p.screenshot({ path: `${OUT}/l${lv}_end1.png` });
    await p.waitForTimeout(5000);
    await p.screenshot({ path: `${OUT}/l${lv}_end2.png` });
    await p.close();
  }
  console.log('JS-Fehler:', errs.length ? errs.join(' | ') : 'keine'); console.log('Bilder in ' + OUT);
  await b.close();
})();
