'use strict';

Object.assign(G, {
  press: 1, bountyMul: 1, dmgMul: 1, waveKills: 0, waveLeaks: 0, leaks: 0, leakTypes: {}, slowmo: 0, bossDown: false,
  queue: [], waveT: 0, nextIn: 0, spawning: false, bossWave: false, bossAlive: false, k: 0, phaseT: 0, banner: null, started: false, timeScale: 1, trickle: 0, clearT: 0, paused: true, speed: 1, best: 0, seen: {},
});

function waveNumber() { return G.level * 5 + (G.phase === 'rise' ? 1 : Math.max(1, G.k)); }

const ROSTER = {
  polipetto: [2.5, 5, 9, .26, 1, 5],
  abominio: [18, 1, 2, 1.4, 2, 2],
  tentacolo: [5.5, 3, 6, .38, 3, 2.5],
};
function waveMenu(k, level) {
  const menu = [];
  for (const ty in ROSTER) {
    const r = ROSTER[ty];
    if (k >= r[4] || level > 0) menu.push([ty, r[5]]);
  }
  return menu;
}
function bossType() { return 'amalgama'; }
function buildWave(k, level) {
  const q = [], hpMul = (1 + .12 * (k - 1)) * (1 + .25 * level) * (.85 + .15 * G.press);
  let t = .6;
  const addGroup = (type, count, gap) => {
    for (let i = 0; i < count; i++) { q.push({ t, type, hpMul }); t += gap * rr(.85, 1.15); }
    t += rr(1.0, 1.8);
  };
  const mult = 1 + Math.floor(level * .5);
  if (k === 1) {
    addGroup('polipetto', 8 * mult, .32);
    addGroup('polipetto', 12 * mult, .26);
  } else if (k === 2) {
    addGroup('polipetto', 10 * mult, .28);
    addGroup('abominio', 2 + (level > 0 ? 1 : 0), 1.6);
    addGroup('polipetto', 12 * mult, .24);
  } else if (k === 3) {
    addGroup('polipetto', 10 * mult, .28);
    addGroup('tentacolo', 6 * mult, .42);
    addGroup('polipetto', 8 * mult, .26);
    addGroup('tentacolo', 8 * mult, .38);
  } else if (k === 4) {
    addGroup('polipetto', 12 * mult, .25);
    addGroup('abominio', 2 + (level > 0 ? 1 : 0), 1.4);
    addGroup('tentacolo', 8 * mult, .38);
    addGroup('polipetto', 16 * mult, .22);
    addGroup('abominio', 2, 1.3);
  } else {
    q.push({ t: 2.0, type: 'amalgama', hpMul: (1 + .38 * level) * Math.pow(G.press, .4) });
    t = 4.5;
    addGroup('polipetto', 12 * mult, .26);
    addGroup('tentacolo', 6 * mult, .4);
  }
  q.sort((a, b) => a.t - b.t);
  return q;
}

function startWave() {
  G.k = G.k % 5 + 1; G.queue = buildWave(G.k, G.level); if (waveNumber() > G.best) { G.best = waveNumber(); try { localStorage.setItem('cinderwatch.best', '' + G.best); } catch (e) {} } G.waveT = 0; G.spawning = true; G.bossWave = G.k === 5; G.waveKills = 0; G.waveLeaks = 0; G.bossDown = false; G.trickle = 6; G.trickleN = 0;
  sfx(G.bossWave ? 'hornBoss' : 'horn', G.B.cave.x, G.B.cave.z, 1.1);
  UI.banner(G.bossWave ? 'Wave ' + waveNumber() + ' · ' + MON[bossType()].name : 'Wave ' + waveNumber(), G.bossWave ? 3.6 : 2.2, G.bossWave);
}
function endWave() {
  const l = G.waveLeaks;
  if (l === 0) G.press *= 1.17; else if (l >= 6) G.press *= .8; else if (l >= 3) G.press *= .9;
  if (G.lives <= 6) G.press *= .9;
  G.press = clamp(G.press, .6, 2.2);
  G.gold += 24 + 9 * G.k + 10 * G.level;
}
function updateWaves(dt) {
  if (G.phase !== 'play') return;
  if (G.spawning) {
    G.waveT += dt;
    while (G.queue.length && G.queue[0].t <= G.waveT) {
      if (G.mons.length > 84) break;
      const e = G.queue.shift(); spawnMonster(e.type, { hpMul: e.hpMul });
    }
    if (!G.queue.length) {
      G.bossAlive = G.mons.some(m => m.def.boss && !m.dead);
      if (G.bossWave && G.bossAlive) {
        G.trickle -= dt;
        if (G.trickle <= 0 && G.trickleN < 9) { G.trickleN++; G.trickle = rr(3.2, 4.6); const tm = waveMenu(5, G.level).filter(e => ROSTER[e[0]][0] < 13), ty = tm[Math.floor(rnd() * tm.length)][0], n = Math.max(1, Math.min(5, Math.round(8 / ROSTER[ty][0]))), hpMul = (1 + .5) * (1 + .22 * G.level); for (let i = 0; i < n; i++) G.queue.push({ t: G.waveT + i * .4, type: ty, hpMul }); }
      } else { G.spawning = false; endWave(); G.nextIn = G.bossWave ? -1 : 6.5; G.clearT = 0; }
    }
  } else if (G.bossWave) {
    G.clearT += dt;
    if (!G.mons.some(m => !m.dead) || G.clearT > 40) { setPhase('clear'); }
  } else {
    G.nextIn -= dt;
    if (G.nextIn <= 0) startWave();
  }
  if (G.lives <= 0 && G.phase === 'play') setPhase('defeat');
}
function callWaveEarly() { if (G.phase === 'play' && !G.spawning && !G.bossWave && G.nextIn > .4) { G.gold += Math.round(G.nextIn * 3); G.nextIn = .05; return true; } return false; }

function padCoverage(pad, range) {
  const B = G.B; let c = 0; const r2 = range * range;
  for (let i = 0; i < B.n; i += 2) if (dist2(pad.x, pad.z, B.px[i], B.pz[i]) < r2) c += PATH_STEP * 2;
  return c;
}
function buildTower(pad, kind, byPlayer) {
  const k = 'archer';
  if (pad.tower || G.gold < DNA_COSTS[0] || G.phase !== 'play') return null;
  G.gold -= DNA_COSTS[0]; UI.goldShown = Math.min(UI.goldShown, G.gold);
  const t = new Tower(pad, k, G.B.pads.indexOf(pad)); G.towers.push(t); UI.ping(pad.x, pad.y, pad.z, byPlayer); return t;
}
function mutateTower(t, elem, byPlayer) {
  if (!t || t.lvl >= 4 || t.state !== 'active' || G.phase !== 'play') return false;
  const c = DNA_COSTS[t.lvl + 1]; if (G.gold < c) return false;
  G.gold -= c; UI.goldShown = Math.min(UI.goldShown, G.gold);
  t.mutate(elem); UI.ping(t.x, t.y, t.z, byPlayer); return true;
}
function upgradeTower(t, byPlayer) { return mutateTower(t, 'fire', byPlayer); }
function sellTower(t) {
  if (!t || !t.alive || G.phase !== 'play') return false;
  const refund = Math.floor(t.spent * .5);
  G.gold += refund; t.sell(); const i = G.towers.indexOf(t); if (i >= 0) G.towers.splice(i, 1); return true;
}

const AI = { think: .15, wait: 0, last: '' };
function aiThink(dt) {
  if (G.phase !== 'play' || UI.playerActive()) return;
  AI.think -= dt; if (AI.think > 0) return; AI.think = .5;
  const B = G.B, towers = G.towers.filter(t => t.alive), empty = B.pads.filter(p => !p.tower), N = towers.length;
  let nFire = 0, nElec = 0;
  for (const t of towers) { if (t.prof.model === 'fire') nFire++; else if (t.prof.model === 'elec') nElec++; }
  const airNeed = (G.k >= 3 || G.level > 0 || G.mons.some(m => m.fly && !m.dead)) ? 1 : 0;
  const opts = [];

  if (empty.length) {
    const needBuild = Math.max(.35, (N < 3 ? 1.8 : 1.0) - N * .12);
    for (const pad of empty) {
      const cov = padCoverage(pad, 5.2) / 10.4;
      const rel = pad.s / B.L;
      let sc = needBuild * (.55 + cov * .55);
      if (N < 2) sc *= 1 - Math.abs(rel - .42) * .85;
      opts.push({ sc, cost: DNA_COSTS[0], act: 'build', pad });
    }
  }
  for (const t of towers) {
    if (t.state !== 'active' || t.lvl >= 4) continue;
    const c = DNA_COSTS[t.lvl + 1], use = sat(t.recent / 60);
    let elem = 'fire';
    if (t.prof.model === 'elec') elem = 'elec';
    else if (t.prof.model === 'base' && airNeed && nElec < Math.max(1, Math.floor(N / 2))) elem = 'elec';
    const sc = (.6 + use * .9 + (t.lvl === 0 ? .35 : 0)) * (N >= 2 ? 1.3 : .8) * (empty.length === 0 ? 1.6 : 1) * (95 / c);
    opts.push({ sc, cost: c, act: 'mut', t, elem });
  }
  if (!opts.length) return;
  opts.sort((a, b) => b.sc - a.sc);
  let pick = opts[0];
  if (pick.cost > G.gold) {
    AI.wait += .5;
    const aff = opts.find(o => o.cost <= G.gold && o.sc > pick.sc * (AI.wait > 9 ? .45 : .8));
    if (!aff) return; pick = aff;
  }
  AI.wait = 0;
  if (pick.act === 'build') buildTower(pick.pad, 'archer', false);
  else mutateTower(pick.t, pick.elem, false);
  AI.think = N < 3 ? .15 : .75;
}

function setPhase(p) {
  G.phase = p; G.phaseT = 0;
  if (p === 'clear') { G.advance = true; UI.banner('The pass holds', 3.2, false); UI.closeMenu(); }
  if (p === 'defeat') { UI.banner('The beacon is out', 4.2, true); UI.closeMenu(); sfx('beaconOut', G.B.beacon.x, G.B.beacon.z, 1.2); fxEmbers(G.B.beacon.x, G.B.beacon.y, G.B.beacon.z, 60, .8); for (let i = 0; i < 14; i++) fxSmoke(G.B.beacon.x + rr(-.4, .4), G.B.beacon.y + rr(0, 1), G.B.beacon.z + rr(-.4, .4), rr(-.3, .3), rr(.8, 2), rr(-.3, .3), rr(2, 4), 1, 2, .2, .2, .22, .6, { drag: .5, rise: .2 }); }
  if (p === 'crumble') startCrumble();
  if (p === 'rise') startRise();
}
function startCrumble() {
  const B = G.B;
  for (const m of G.mons) if (!m.dead) { shatter(e => rigMonster(e), m, [0, 1, 0], { spread: 1.2, life: 1 }); removeMonster(m); }
  for (const f of G.men) if (!f.dead) { f.weapon = KIT.item.blade; shatter(e => rigHuman(KIT.foot, SPEC.foot, e), f, [0, 1, 0], { spread: 1, life: 1 }); f.dead = f.gone = true; f.alive = false; if (f.flame) removeFlame(f.flame); }
  G.mons.length = 0; G.men.length = 0; G.arrows.length = 0; G.shells.length = 0; G.stuck.length = 0; G.beams.length = 0;
  for (const t of G.towers) {
    t.em.alive = false; LT.emitters[t.idx] = null; removeFlame(t.flame); removeFlame(t.flame2); t.flame = t.flame2 = null; t.archers.length = 0; t.alive = false; t.state = 'gone';
    if (t.monocle) t.monocle.visible = false;
    if (t.aura) t.aura.visible = false;
    let best = null, bd = 1e9; for (const p of B.pieces) if (p.kind === 'chunk') { const d = dist2(p.cx, p.cz, t.x, t.z); if (d < bd) { bd = d; best = p; } }
    if (best) best.mesh.attach(t.group);
  }
  for (const f of B.flames) removeFlame(f); B.flames.length = 0;
  for (const p of B.pieces) { p.t = 0; p.delay = .25 + rnd() * .9 + sat((36 - (p.cx + p.cz)) / 72) * 1.3 + (p.kind !== 'chunk' ? .2 : 0); p.vy = 0; }
  FX.groundAt = () => -500; clearFX(); setBoardCasting(B, true);
  sfx('crumble', 0, 0, 1.3); FX.shake = 1.2;
}
function startRise() {
  if (G.B) { for (const t of G.towers) { t.clearModel(false); } G.towers.length = 0; clearDebris(); disposeBoard(G.B); }
  for (let i = 0; i < LT.emitters.length; i++) LT.emitters[i] = null;
  const B = G.B = buildBoard(G.boardSeed++, G.boardIndex++);
  R.scene.add(B.group); activateBoard(B, false);
  setBoardCasting(B, true);
  for (const p of B.pieces) { p.t = 0; p.delay = sat((p.cx + p.cz + 36) / 72) * 1.7 + rnd() * .25 + (p.kind === 'chunk' ? 0 : 2.0 + rnd() * .3); p.mesh.visible = false; }
  sfx('rise', 0, 0, 1.2); UI.banner(B.bio.name, 3.6, false);
}
function activateBoard(B, lit) {
  B.flames = [];
  const b = B.beacon;
  B.beaconFlame = addFlame({ x: b.x, y: b.y - .12, z: b.z, size: 2.3, layers: 3, embers: 2.6, glow: 1.1, smoke: 5, on: lit ? 1 : 0 }); B.flames.push(B.beaconFlame);
  for (const f of B.fires) B.flames.push(addFlame(Object.assign({ x: f.x, y: f.y, z: f.z, size: f.size, embers: .5, glow: .8, on: lit ? 1 : 0 }, f.fx)));
  LT.beaconPos = b; LT.beaconOn = lit ? 1 : 0; LT.beaconLevel = 1; LT.envSrc = B.env.slice(0, LT.env.length); LT.envK = lit ? 1 : 0; setBiomeLook(B, lit);
  FX.groundAt = B.heightAt;
  G.padCov = null;
}
function beginBattle(first) {
  const B = G.B;
  G.lives = G.maxLives; G.gold = 300 + 80 * G.level; G.bountyMul = 1 + .18 * G.level; G.dmgMul = 1.55 + .2 * G.level; G.press = lerp(G.press, 1, .5); UI.goldShown = G.gold; G.k = 0; G.leaks = 0; G.leakTypes = {}; G.spawning = false; G.bossWave = false; G.nextIn = first ? .9 : 1.6; G.queue = []; AI.think = .15; AI.wait = 0;
  const n = 4 + Math.min(3, G.level);
  for (let i = 0; i < n; i++) spawnMonster('polipetto', { s: B.cave.s + 2.2 + i * 1.15, lat: rr(-.7, .7), hpMul: 1 + .22 * G.level });
  G.phase = 'play'; G.phaseT = 0;
}
function updatePhase(dt) {
  G.phaseT += dt; const B = G.B, t = G.phaseT;
  updateBiomeLook(dt); LT.envK = damp(LT.envK, G.phase === 'crumble' ? 0 : (G.phase === 'rise' && t < 2.4 ? 0 : 1), 2, dt); LT.beaconMul = damp(LT.beaconMul, B.bio.beacon || 1, 2, dt);
  const want = G.phase === 'defeat' ? 0 : (G.phase === 'rise' ? (t > B.igniteAt ? 1 : 0) : 1);
  LT.beaconOn = damp(LT.beaconOn, want, want ? 3 : 1.6, dt);
  LT.beaconLevel = damp(LT.beaconLevel, G.lives / G.maxLives, 3, dt);
  if (B.beaconFlame) { const f = B.beaconFlame, lv = LT.beaconLevel; f.on = LT.beaconOn; f.size = 2.35 * (.42 + .58 * lv) * (1 - .32 * LT.beaconGutter); f.embers = 1 + 2 * lv + 6 * LT.beaconGutter; }
  for (let i = 1; i < B.flames.length; i++) B.flames[i].on = LT.beaconOn;
  if (G.phase === 'clear') { if (t > 2.6) setPhase('crumble'); }
  else if (G.phase === 'defeat') {
    for (const tw of G.towers) { tw.em.on = damp(tw.em.on, 0, 1.5 + tw.idx * .15, dt); }
    if (t > 4.4) { G.level = 0; G.press = Math.max(.8, G.press * .85); G.run++; setPhase('crumble'); }
  } else if (G.phase === 'crumble') {
    let done = true;
    for (const p of B.pieces) {
      const u = t - p.delay;
      if (u < 0) { p.mesh.position.set(p.cx + rr(-.03, .03) * sat(t * 2), p.cy, p.cz + rr(-.03, .03) * sat(t * 2)); done = false; continue; }
      const y = p.cy - 9 * u * u - u * 1.2; p.mesh.position.set(p.cx, y, p.cz); p.mesh.rotation.set(p.spin.x * u * .5, p.spin.y * u * .25, p.spin.z * u * .5);
      if (!p.dusted) { p.dusted = true; fxDust(p.cx, 0, p.cz, 5, 2.2, { speed: 2.5, life: 1.4 }); FX.shake = Math.min(1, FX.shake + .12); }
      if (y > -60) done = false; else p.mesh.visible = false;
    }
    if (done || t > 5.2) { if (G.advance) { G.level++; G.advance = false; } setPhase('rise'); }
  } else if (G.phase === 'rise') {
    let done = true;
    for (const p of B.pieces) {
      const u = (t - p.delay) / (p.kind === 'chunk' ? 1.15 : .8);
      if (u < 0) { done = false; continue; }
      p.mesh.visible = true;
      if (u >= 1) { p.mesh.position.set(p.cx, p.cy, p.cz); p.mesh.rotation.set(0, 0, 0); if (!p.set) { p.set = true; if (p.kind !== 'chunk') { fxDust(p.cx, p.cy + .2, p.cz, 12, 2.2, { speed: 3 }); FX.shake = Math.min(1, FX.shake + .3); sfx('hammer', p.cx, p.cz, 1, .1); } } continue; }
      done = false; const e = easeOut(u), k = 1 - e;
      if (p.kind === 'chunk') { p.mesh.position.set(p.cx, p.cy - 30 * k, p.cz); p.mesh.rotation.set(p.spin.x * k * .7, p.spin.y * k * .5, p.spin.z * k * .7); }
      else { const d = 1 - u * u; p.mesh.position.set(p.cx, p.cy + 16 * d, p.cz); p.mesh.rotation.set(0, 0, 0); }
    }
    if (done && !B.igniteAt) { B.igniteAt = t + .25; }
    if (B.igniteAt && t > B.igniteAt && !B.lit) { B.lit = true; sfx('ignite', B.beacon.x, B.beacon.z, 1.3, 1); lightFlash(B.beacon.x, B.beacon.y + 1, B.beacon.z, 0xffa050, 2600, .7, 60); fxEmbers(B.beacon.x, B.beacon.y, B.beacon.z, 50, .6); FX.shake = .5; }
    if (B.lit && t > B.igniteAt + .7) { setBoardCasting(B, false); beginBattle(false); }
  }
}
