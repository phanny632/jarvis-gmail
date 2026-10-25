// Integrationstest: echter Chromium/WebGL-Browser, isolierter Browser-Spielstand.
// Aufruf: node games/army-rush/tools/expansion-check.js
// Optional: CHROMIUM, THREE_JS (lokale Kopie der verwendeten Three.js-r128-Datei).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), assert = require('assert');
const GAME = path.resolve(__dirname, '../index.html');
const OUT = path.join(__dirname, 'out');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('Schritt 1/6: Chromium und isolierten Spielstand starten');
  const browser = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
    const three = process.env.THREE_JS || path.join(__dirname, 'three.min.js');
    if (fs.existsSync(three)) await page.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(three), contentType: 'application/javascript' }));
    await page.addInitScript(() => { window.__nativeRAF = window.requestAnimationFrame; window.requestAnimationFrame = () => 0; });
    await page.goto('file://' + GAME);
    await page.waitForFunction(() => window.__armyRush && window.__armyRush.L());
    await page.evaluate(() => document.getElementById('splash').remove());
    console.log('Schritt 2/6: Freischaltungen, Wellen und Bossfolge über 100 Level');
    const structure = await page.evaluate(() => {
      const g = window.__armyRush, bosses = new Set(), waves = new Set(), failures = [];
      let previous;
      for (let level = 1; level <= 100; level++) {
        const l = g.genLevel(level), type = l.boss.type;
        bosses.add(type);
        if (previous === type) failures.push('Boss wiederholt: ' + level);
        if ((g.BOSS_TYPES[type].from || 1) > level) failures.push('Boss zu früh: ' + level);
        previous = type;
        for (const e of l.events) {
          if (e.wave) waves.add(e.wave);
          if (e.type === 'barrel' && e.reward.t === 'weapon' && (!g.WEAPONS[e.reward.w] || g.WEAPONS[e.reward.w].from > level)) failures.push('Ungültige Waffe: ' + level);
          if (!Number.isFinite(e.z) || e.type === 'enemy' && (!Number.isFinite(e.count) || e.count < 1)) failures.push('Ungültiges Ereignis: ' + level);
        }
      }
      return { weapons: Object.keys(g.WEAPONS).length, bosses: [...bosses], waves: [...waves], failures };
    });
    assert.equal(structure.weapons, 18); assert.equal(structure.bosses.length, 8); assert.equal(structure.waves.length, 6); assert.deepEqual(structure.failures, []);
    console.log(JSON.stringify(structure));
    console.log('Schritt 3/6: Alle Waffen und Bossmodelle im Kampf prüfen, Schadensfaktoren messen');
    const combat = await page.evaluate(() => {
      const g = window.__armyRush, results = [], factors = {};
      const prepare = (level, w) => {
        g.save.level = level; g.save.fails = 0; Object.assign(g.save.up, {start:30,rate:5,dmg:5,range:4,income:0});
        g.menu(); g.start(); g.setWeapon(w); g.jump(g.L().boss.z + 22.01); g.step(1/30);
        g.L().events.filter(e => e.type === 'enemy').forEach(e => {e.dead = true;}); g.B().minions = 0; g.B().hit = 0;
      };
      g.tune.t = 100; g.tune.p = 0;
      for (const w of Object.keys(g.WEAPONS)) {
        prepare(1, w);
        const b = g.B(); let initial;
        for(let i=0; i<720; i++) {g.steer(b.x);g.step(1/60);if(i===239) initial=b.hp;}
        factors[w] = +(Math.max(0, initial-b.hp)/8/(g.N*g.stat.rate(5)*g.stat.dmg(5))).toFixed(3);
        g.render();
        results.push({weapon:w, damage:initial-b.hp, finite:Number.isFinite(b.hp), state:g.state});
      }
      g.tune.t = 1; g.tune.p = 1;
      const models=[];
      for(const level of [1,2,3,4,5,8,12,16]) {
        prepare(level,'pulse'); const b=g.B(); b.hit=2;
        for(let i=0; i<450 && g.state==='run'; i++) {const st=b.strikes[0]; g.steer(st ? (st.x > 0 ? -4 : 4) : 0);g.step(1/30);}
        g.render();
        models.push({level,type:b.type,children:b.mesh.children.length,finite:Number.isFinite(b.hp)&&Number.isFinite(b.maxHp),hp:b.hp,maxHp:b.maxHp});
      }
      return {results,factors,models};
    });
    for (const x of combat.results) { assert(x.finite, x.weapon); assert(x.damage > 0, x.weapon + ' verursacht keinen Schaden'); }
    for (const x of combat.models) { assert(x.finite, x.type); assert(x.children > 1, x.type + ' ohne Modell'); }
    console.log(JSON.stringify(combat));
    console.log('Schritt 4/6: Waffenwechsel, Kryoeffekt, Panzerphasen und Speicherstand');
    const mechanics = await page.evaluate(() => {
      const g=window.__armyRush; g.save.level=16; g.save.fails=0;g.save.up.start=30;g.menu();g.start();g.setWeapon('cryo');
      g.jump(g.L().boss.z+22.01);g.step(1/30);g.L().events.filter(e=>e.type==='enemy').forEach(e=>e.dead=true);g.B().hit=0;
      for(let i=0;i<40;i++)g.step(1/60);
      const before=g.projectiles.filter(b=>b.weapon==='cryo').length;
      g.setWeapon('plasma');g.step(1/60);
      const retained=g.projectiles.some(b=>b.weapon==='cryo');
      let slowed=false,open=false,closed=false;
      g.setWeapon('cryo');
      for(let i=0;i<520 && g.state==='run';i++) {g.steer(0);g.step(1/60);slowed ||= g.B().slowUntil>g.clock;open ||= g.B().exposed;closed ||= !g.B().exposed;}
      const target=g.L().events.find(e=>e.type==='enemy');
      target.dead=false;target.active=true;target.count=12;target.hpEach=100000;target.hp=1200000;target.speed=2;target.x=0;target.z=g.pz-16;target.minion=false;g.render();
      const oldZ=target.z;
      for(let i=0;i<60 && g.state==='run';i++){g.steer(0);g.step(1/60);}
      const enemySlowed=target.slowUntil>g.clock && target.slowFactor===0.45 && target.z-oldZ<2;
      g.menu();return {before,retained,slowed,open,closed,enemySlowed,save:JSON.parse(localStorage.getItem('armyRush.v1')||'null')};
    });
    assert(mechanics.before>0 && mechanics.retained, 'Geschosse wurden beim Waffenwechsel umgedeutet');
    assert(mechanics.slowed && mechanics.open && mechanics.closed && mechanics.enemySlowed, 'Kryoeffekt oder Bossphasen fehlen');
    await page.evaluate(()=>{window.__armyRush.save.level=4;window.__armyRush.menu();});
    await page.getByRole('tab',{name:'Arsenal',exact:true}).click();
    assert.equal(await page.locator('.weapon-card').count(),18);
    assert(await page.locator('.weapon-card.locked').count()>0);
    await page.screenshot({path:path.join(OUT,'ios-arsenal.png')});
    await page.getByRole('tab',{name:'Einstellungen',exact:true}).click();
    await page.screenshot({path:path.join(OUT,'ios-settings.png')});
    await page.getByRole('button',{name:'Grafik: Hoch'}).click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('armyRush.graphics')),'low');
    await page.reload(); await page.waitForFunction(()=>window.__armyRush && window.__armyRush.L());
    await page.getByRole('tab',{name:'Einstellungen',exact:true}).click();
    assert.equal(await page.getByRole('button',{name:'Grafik: Sparsam'}).getAttribute('aria-pressed'),'true');
    await page.getByRole('tab',{name:'Mission',exact:true}).click();
    await page.evaluate(()=>{document.getElementById('splash').remove();const pump=()=>{window.__armyRush.render();window.__nativeRAF(pump);};pump();});
    console.log('Schritt 5/6: Mobil-/Desktop-Layout und Screenshots');
    const layouts=[];
    for(const [width,height] of [[390,844],[320,568],[844,390],[1440,900]]) {
      await page.setViewportSize({width,height});
      await page.evaluate(()=>window.__armyRush.render());
      const layout=await page.evaluate(()=>{
        const button=document.getElementById('btnGo').getBoundingClientRect(),card=document.querySelector('#menu .card').getBoundingClientRect();
        return {width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,cardInside:card.left>=0&&card.right<=innerWidth&&card.top>=0&&card.bottom<=innerHeight,buttonWidth:button.width};
      }); layouts.push(layout); assert(!layout.overflow && layout.cardInside,JSON.stringify(layout));
      await page.screenshot({path:path.join(OUT,`design-${width}x${height}.png`)});
    }
    for(const [level,id] of [[8,'scorpion'],[12,'queen'],[16,'core']]) {
      await page.setViewportSize({width:390,height:844});
      await page.evaluate(level=>{const g=window.__armyRush;g.save.level=level;g.save.up.start=20;g.menu();g.start();g.jump(g.L().boss.z+22.01);g.step(1/30);for(let i=0;i<45;i++)g.render();},level);
      await page.screenshot({path:path.join(OUT,`boss-${id}.png`)});
    }
    console.log('Schritt 6/6: Echter Animationsloop, alter Spielstand und Fehleranzeige');
    const live = await browser.newPage({viewport:{width:390,height:844}});
    live.on('pageerror',e=>errors.push(e.message));
    await live.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
    if(fs.existsSync(three))await live.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync(three),contentType:'application/javascript'}));
    await live.addInitScript(()=>localStorage.setItem('armyRush.v1',JSON.stringify({level:12,coins:1234,best:15,fails:2,up:{start:10,rate:5,dmg:5,range:3,income:2}})));
    await live.goto('file://'+GAME);await live.waitForFunction(()=>window.__armyRush && window.__armyRush.L());
    const preserved=await live.evaluate(()=>{const s=window.__armyRush.save;return s.level===12&&s.coins===1234&&s.up.start===10&&s.best===15&&s.fails===2;});
    assert(preserved,'Bestehender Spielstand nicht erhalten');
    await live.locator('#splash').waitFor({state:'detached',timeout:10000});await live.getByRole('button',{name:/MISSION STARTEN/}).click();
    await live.waitForFunction(()=>window.__armyRush.pz < -2);
    await live.keyboard.down('ArrowRight');await live.waitForFunction(()=>window.__armyRush.x>1);await live.keyboard.up('ArrowRight');
    assert.equal(await live.evaluate(()=>window.__armyRush.state),'run');
    await live.screenshot({path:path.join(OUT,'live-mobile.png')});await live.close();
    const failure=await browser.newPage();await failure.route('**/three.min.js',r=>r.abort());await failure.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
    await failure.goto('file://'+GAME);await failure.locator('.err').waitFor();
    const errorVisible=await failure.evaluate(()=>{const e=document.querySelector('.err'),r=e.getBoundingClientRect();return document.elementFromPoint(r.width/2,r.height/2)===e;});
    assert(errorVisible,'Ladefehler wird vom Startbildschirm verdeckt');await failure.close();
    assert.deepEqual(errors,[]);
    const report={structure,combat,mechanics,layouts,errors,scope:'Desktop Chromium mit SwiftShader, isolierter Browser-Kontext; echte iPhone-Hardware nicht geprüft'};
    fs.writeFileSync(path.join(OUT,'expansion-check.json'),JSON.stringify(report,null,2));
    console.log('PASS: 18 Waffen, 8 Bosse, 6 Wellen, Mechaniken, 4 Layouts; keine JS-Fehler. Ergebnis: '+path.join(OUT,'expansion-check.json'));
  } finally {await browser.close();}
})().catch(e=>{console.error('FEHLER: '+e.stack);process.exitCode=1;});
