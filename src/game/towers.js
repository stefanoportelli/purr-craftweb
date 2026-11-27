'use strict';

const G = {
  B: null, t: 0, gold: 0, lives: 20, maxLives: 20, wave: 0, slain: 0, level: 0, run: 1,
  towers: [], mons: [], men: [], arrows: [], shells: [], stuck: [], beams: [], hbars: [], phase: 'play',
};

const DNA_COSTS = [50, 30, 50, 80, 120];
const DNA_SCALES = [.86, 1.0, 1.15, 1.32, 1.50];

function catProfile(dna) {
  const n = dna ? dna.length : 0;
  let f = 0, e = 0;
  if (dna) for (let i = 0; i < n; i++) { if (dna[i] === 'fire') f++; else if (dna[i] === 'elec') e++; }
  const scale = DNA_SCALES[Math.min(4, n)];

  if (n === 0) {
    return {
      name: 'Gatto Graffiatore', tag: 'TERRA', model: 'base',
      air: false, ground: true, dmg: 10, rate: .67, range: 4.4, splash: 0, scale,
      light: 45, col: [1.0, .82, .55]
    };
  }
  // 2x2 Ibrido Bilanciato: Gatto Plasma (Solo ARIA, burst pesante 480 HP)
  if (f === 2 && e === 2) {
    return {
      name: 'Gatto Plasma', tag: 'ARIA', model: 'elec', plasma: true,
      air: true, ground: false, dmg: 480, rate: 2.0, range: 8.5, splash: 0, scale,
      light: 92, col: [.95, .48, 1.0]
    };
  }
  // 3x1 Dominanza Fuoco + 1 Elettrico: Magma Volt
  if (f === 3 && e === 1) {
    return {
      name: 'Magma Volt', tag: 'TERRA', model: 'fire', miniStun: true,
      air: false, ground: true, dmg: 135, rate: .4, range: 6.6, splash: 1.55, scale,
      light: 85, col: [1.0, .62, .25]
    };
  }
  // 3x1 Dominanza Elettrico + 1 Fuoco: Cyborg Pirotecnico
  if (e === 3 && f === 1) {
    return {
      name: 'Cyborg Pirotecnico', tag: 'ARIA', model: 'elec', burnBonus: true,
      air: true, ground: false, dmg: 175, rate: .38, range: 7.5, splash: 0, scale,
      light: 85, col: [.45, .88, 1.0]
    };
  }
  // Puro Fuoco (1-4x) o prevalenza Fuoco intermedia (es. 2F+1E)
  if (f > e) {
    const k = Math.min(4, n);
    const names = ['', 'Gatto Fuoco Lv 1', 'Gatto Fuoco Lv 2', 'Gatto Fuoco Lv 3', 'Gatto Vulcano'];
    return {
      name: e > 0 ? 'Gatto Fuoco (Ibrido)' : names[k], tag: 'TERRA', model: 'fire',
      air: false, ground: true,
      dmg: [0, 30, 65, 120, 220][k],
      rate: [0, .67, .5, .4, .286][k],
      range: [0, 5.2, 5.8, 6.4, 7.2][k],
      splash: [0, 1.0, 1.2, 1.5, 2.0][k],
      scale, light: [45, 55, 65, 75, 92][k], col: [1.0, .52, .22]
    };
  }
  // Puro Elettrico (1-4x) o prevalenza/parita Elettrico (es. 1F+1E, 1F+2E)
  const k = Math.min(4, n);
  const names = ['', 'Gatto Elettrico Lv 1', 'Gatto Elettrico Lv 2', 'Gatto Elettrico Lv 3', 'Gatto Cyborg'];
  return {
    name: f > 0 ? 'Gatto Laser (Ibrido)' : names[k], tag: 'ARIA', model: 'elec',
    air: true, ground: false,
    dmg: [0, 35, 80, 150, 260][k],
    rate: [0, .67, .5, .4, .286][k],
    range: [0, 5.8, 6.5, 7.3, 8.5][k],
    splash: 0, scale, light: [45, 56, 66, 78, 95][k], col: [.35, .82, 1.0]
  };
}

const TOWER = {
  archer: {
    name: 'Gatto Graffiatore', short: 'Gatto Base', icon: 'archer', maxLvl: 4,
    cost: DNA_COSTS,
    range: [4.4, 5.2, 5.8, 6.4, 7.2],
    dmg: [10, 30, 65, 120, 220],
    rate: [.67, .67, .5, .4, .286],
    splash: [0, 1.0, 1.2, 1.5, 2.0],
    scale: DNA_SCALES,
    air: false, ground: true, light: [45, 55, 65, 75, 90],
    desc: ['0 DNA: Graffio rapido a terra.', 'Evolvibile: Fuoco (Terra) o Laser (Aria).']
  },
};
const TOWER_KINDS = ['archer'];

function blueprint(kind, lvl) {
  const pieces = [], mounts = {};
  const piece = (id, order, fn) => {
    const S = new Soup(); fn(S); if (!S.verts) return; let minY = 1e9; for (let i = 1; i < S.P.length; i += 3) minY = Math.min(minY, S.P[i]);
    for (let i = 1; i < S.P.length; i += 3) S.P[i] -= minY; pieces.push({ id, order, y: minY, soup: S });
  };
  const H = 0.34, R = 0.88, reach = 1.35;
  const metal = COL.iron, steel = COL.steel, dark = COL.stoneD;

  piece('base', 0, S => {
    S.cyl(R + .14, .16, 0, .08, 0, dark, { n: 10, l: L_METAL, rough: .5 });
    S.cyl(R, H, 0, H / 2, 0, metal, { n: 10, l: L_METAL, rt: .92 });
    for (let k = 0; k < 4; k++) {
      const a = k * HPI + PI / 4;
      S.box(.26, .22, .2, Math.cos(a) * (R + .04), .12, Math.sin(a) * (R + .04), steel, { l: L_METAL, r: [0, -a + HPI, 0] });
    }
  });

  mounts.flame = null;
  mounts.lightAt = [0, H + 1.0, 0];
  mounts.top = H + 1.5;
  mounts.H = H;
  mounts.reach = reach;
  mounts.catY = H + .08;
  pieces.sort((a, b) => a.order - b.order);
  return { pieces, mounts };
}

function scaffoldGeo(w, h) {
  const S = new Soup(), c = mulC(COL.woodL, .9), c2 = COL.wood;
  for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) S.seg([a * w, 0, b * w], [a * w, h, b * w], .04, .035, c, { l: L_WOOD, n: 4 });
  for (let y = .9; y < h; y += 1.05) for (let k = 0; k < 4; k++) { const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]], [a, b] = q[k], [cc, d] = q[(k + 1) % 4]; S.seg([a * w, y, b * w], [cc * w, y, d * w], .03, .03, c2, { l: L_WOOD, n: 4 }); if (k & 1) S.seg([a * w, y - .9, b * w], [cc * w, y, d * w], .022, .022, c, { l: L_WOOD, n: 3 }); }
  S.box(w * 1.2, .05, .34, 0, Math.min(h - .2, 1.95), w + .12, c2, { l: L_WOOD }); S.box(.34, .05, w * 1.2, -w - .12, Math.min(h - .25, .95), 0, c, { l: L_WOOD });
  return S.build();
}

let TOWER_STUN = false;
function findTarget(x, z, range, air, ground, minRange = 0) {
  if (G.phase !== 'play' || TOWER_STUN) return null;
  let best = null, bp = -1; const r2 = range * range, m2 = minRange * minRange;
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || !m.vis) continue; if (m.fly ? !air : !ground) continue;
    const d = dist2(x, z, m.x, m.z); if (d > r2 || d < m2) continue;
    const sc = m.prog + (m.fly ? 2 : 0); if (sc > bp) { bp = sc; best = m; }
  }
  return best;
}
function aimPoint(m, dt, out) {
  if (m.fly) { out.x = m.x + m.vx * dt; out.y = m.y; out.z = m.z + m.vz * dt; return out; }
  const B = G.B, adv = m.blocked ? 0 : m.spdNow * dt, s2 = Math.min(B.L - .1, m.s + adv);
  pathAt(B, s2, out); out.x += -out.tz * m.lat; out.z += out.tx * m.lat; out.y += m.hitH; return out;
}

const _tv = new THREE.Vector3(), _tq = new THREE.Quaternion(), _tm = new THREE.Matrix4(), _tz = new THREE.Vector3(0, 0, 1), _ts = new THREE.Vector3(1, 1, 1), _ap = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };

class Tower {
  constructor(pad, kind, idx) {
    this.pad = pad; this.kind = 'archer'; this.idx = idx; this.lvl = 0; this.def = TOWER.archer;
    this.dna = []; this.prof = catProfile(this.dna);
    this.x = pad.x; this.y = pad.y; this.z = pad.z; this.yaw = pad.face; this.cs = Math.cos(this.yaw); this.sn = Math.sin(this.yaw);
    this.spent = DNA_COSTS[0]; this.state = 'build'; this.bt = 0; this.cool = rr(.2, .6); this.kills = 0; this.dealt = 0; this.alive = true; this.recent = 0;
    this.group = new THREE.Group(); this.group.position.set(this.x, this.y, this.z); this.group.rotation.y = this.yaw; R.scene.add(this.group);
    this.pieces = []; this.staticMesh = null; this.scaf = null; this.flame = null; this.flame2 = null; this.archers = []; this.men = [];
    this.monocle = null; this.aura = null;
    this.em = { x: this.x, y: this.y + 1.4, z: this.z, r: 1, g: .82, b: .55, I: 0, range: 12, on: 0, alive: true, seed: rnd() * 50, spot: true, dx: this.sn, dz: this.cs, fl: 1, _spot: 0 };
    LT.emitters[idx] = this.em; pad.tower = this;
    this.appear = 0;
    this.begin();
  }
  get range() { return this.prof.range; }
  w(l, out) { out.x = this.x + l[0] * this.cs + l[2] * this.sn; out.y = this.y + l[1]; out.z = this.z - l[0] * this.sn + l[2] * this.cs; return out; }
  begin() {
    const bp = blueprint(this.kind, this.lvl); this.bp = bp; this.mounts = bp.mounts; this.bt = 0; this.state = 'build';
    this.clearModel(true);
    const n = bp.pieces.length, gap = Math.min(.2, 1.2 / n);
    bp.pieces.forEach((p, i) => {
      const mesh = new THREE.Mesh(p.soup.build(), MAT.world); mesh.castShadow = mesh.receiveShadow = true; mesh.visible = false; mesh.position.y = p.y + 2.2;
      this.group.add(mesh); this.pieces.push({ mesh, y: p.y, t0: .25 + i * gap, landed: false, soup: p.soup });
    });
    this.tEnd = .25 + n * gap + .28;
    this.tPauseHold = this.tEnd - .23;
    this.scaf = new THREE.Mesh(scaffoldGeo(1.2, 1.9), MAT.world); this.scaf.castShadow = true; this.scaf.scale.set(1, .01, 1); this.group.add(this.scaf);
    fxDust(this.x, this.y + .1, this.z, 7, 1.0, { speed: 1.6 });
    sfx('hammer', this.x, this.z, .8, .3);
  }
  clearModel(keepLights) {
    for (const p of this.pieces) { this.group.remove(p.mesh); p.mesh.geometry.dispose(); } this.pieces.length = 0;
    for (const k of ['staticMesh', 'scaf', 'gantry']) if (this[k]) { this.group.remove(this[k]); this[k].traverse(o => { if (o.geometry) o.geometry.dispose(); }); this[k] = null; }
    for (const k of ['monocle', 'aura']) if (this[k]) {
      R.scene.remove(this[k]);
      this[k].traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      this[k] = null;
    }
    this.gantryRail = null; this.gantryPad = null;
    removeFlame(this.flame); removeFlame(this.flame2); this.flame = this.flame2 = null;
    this.em.on = keepLights ? this.em.on * .4 : 0;
    this.archers.length = 0; this.cat = null;
  }
  finish() {
    const M = new Soup(); for (const p of this.pieces) M.merge(p.soup, { p: [0, p.y, 0], ao: [0, 1.0, .72] });
    for (const p of this.pieces) { this.group.remove(p.mesh); p.mesh.geometry.dispose(); } this.pieces.length = 0;
    this.staticMesh = new THREE.Mesh(M.build(), MAT.world); this.staticMesh.castShadow = this.staticMesh.receiveShadow = true; this.group.add(this.staticMesh);
    if (this.scaf) { this.group.remove(this.scaf); this.scaf.geometry.dispose(); this.scaf = null; }
    const mt = this.mounts, pr = this.prof;
    const lp = this.w(mt.lightAt, {});
    this.em.x = lp.x; this.em.y = lp.y; this.em.z = lp.z;
    this.em.r = pr.col[0]; this.em.g = pr.col[1]; this.em.b = pr.col[2];
    this.em.I = pr.light; this.em.range = 12;

    this.makeGantry();
    this.monocle = makeHoloMonocle(); R.scene.add(this.monocle);
    this.aura = makeCyberAura(); R.scene.add(this.aura);

    const p = this.w([0, mt.catY, 0], {});
    this.cat = {
      yaw: this.yaw, pitch: 0, swipe: 0, pawSide: 1, cool: .25, hitDist: 1.4, hitDy: .2, ext: 0, holdT: 0, scaleCur: pr.scale, mutatePuff: 0,
      e: {
        scale: pr.scale, ph: rnd() * 6, swipe: 0, pawSide: 1, pitch: 0, hitDist: 1.4, hitDy: .2, mutatePuff: 0,
        x: p.x, y: p.y, z: p.z, yaw: this.yaw, flash: 0,
        eyePos: new THREE.Vector3(p.x, p.y + 1.0, p.z),
        monocle: this.monocle, aura: this.aura
      }
    };
    this.state = 'active'; this.appear = 0;
    fxDust(this.x, this.y + .2, this.z, 10, 1.3, { speed: 2.2 });
    sfx('buildDone', this.x, this.z, 1);
  }
  makeGantry() {
    const H = this.mounts.H, reach = this.mounts.reach, PAD_R = 0.58;
    const metal = COL.iron, steel = COL.steel, warnY = [.95, .78, .12];
    this.gantry = new THREE.Group();

    const SR = new Soup();
    SR.box(1.12, .12, reach, 0, H - .02, reach / 2, metal, { l: L_METAL, rough: .42 });
    SR.box(.94, .04, reach, 0, H + .055, reach / 2, steel, { l: L_METAL, rough: .35 });
    const nStripes = 4, sLen = reach / nStripes;
    for (const side of [-1, 1]) {
      for (let s = 0; s < nStripes; s++) {
        SR.box(.06, .1, sLen - .02, side * .58, H - .01, (s + .5) * sLen, (s & 1) ? COL.black : warnY, { jit: 0, emis: (s & 1) ? 0 : .08 });
      }
      SR.seg([side * .38, .1, .08], [side * .38, H - .04, reach], .065, .055, steel, { l: L_METAL, n: 5 });
    }
    this.gantryRail = new THREE.Mesh(SR.build(), MAT.world);
    this.gantryRail.castShadow = this.gantryRail.receiveShadow = true;
    this.gantryRail.scale.z = .01;
    this.gantryRail.visible = false;
    this.gantry.add(this.gantryRail);

    const SP = new Soup();
    SP.cyl(PAD_R + .06, .06, 0, H + .02, 0, metal, { n: 10, l: L_METAL, rough: .45 });
    SP.cyl(PAD_R, .08, 0, H + .05, 0, steel, { n: 10, l: L_METAL, rough: .35 });
    this.gantryPad = new THREE.Mesh(SP.build(), MAT.world);
    this.gantryPad.castShadow = this.gantryPad.receiveShadow = true;
    this.gantry.add(this.gantryPad);

    this.group.add(this.gantry);
  }
  mutate(elem = 'fire') {
    if (this.dna.length >= 4 || !this.alive) return false;
    this.dna.push(elem);
    this.lvl = this.dna.length;
    this.spent += DNA_COSTS[this.lvl];
    this.prof = catProfile(this.dna);
    const pr = this.prof;
    this.em.I = pr.light;
    this.em.r = pr.col[0]; this.em.g = pr.col[1]; this.em.b = pr.col[2];
    const extZ = this.cat ? this.cat.ext * this.mounts.reach : 0;
    const p = this.w([0, this.mounts.catY + .35, extZ], _ap);
    const mp = clamp((this.lvl - 1) / 3, 0, 1);
    if (elem === 'elec') {
      fxSparks(p.x, p.y, p.z, 12 + this.lvl * 4, 4.2, .4, 2.0, 3.2, { size: .06, grav: 3 });
      fxTimed(2, p.x, p.y, p.z, 2.0 + this.lvl * .25, 2.0 + this.lvl * .25, .4, 1.8, 3.0, .9, .24);
      sfx('catMut', p.x, p.z, .85, mp);
    } else {
      fxSparks(p.x, p.y, p.z, 12 + this.lvl * 4, 4.2, 3.0, 1.4, .3, { size: .06, grav: 4 });
      fxTimed(5, p.x, p.y, p.z, 1.8 + this.lvl * .25, 1.8 + this.lvl * .25, 3.0, 1.4, .3, .9, .24);
      sfx('catMut', p.x, p.z, .85, mp);
    }
    if (this.cat) this.cat.mutatePuff = 1.0;
    return true;
  }
  upgrade(elem = 'fire') { return this.mutate(elem); }
  sell() {
    this.alive = false; this.em.alive = false; this.em.on = 0; LT.emitters[this.idx] = null; this.pad.tower = null;
    for (let i = 0; i < 12; i++) { _tm.compose(_tv.set(this.x + rr(-.6, .6), this.y + rr(.3, 1.8), this.z + rr(-.6, .6)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(.9, .9, .9)); addDebris(KIT.rubble, _tm, null, rr(-2, 2), rr(1, 4), rr(-2, 2), rr(3, 9), rr(2, 3.2)); }
    fxDust(this.x, this.y + .4, this.z, 14, 1.5, { speed: 2.4 }); sfx('sell', this.x, this.z, 1);
    this.clearModel(false); R.scene.remove(this.group);
  }
  updatePaused(rdt) {
    if (this.state !== 'active') {
      const hold = this.tPauseHold || (this.tEnd - .23);
      if (this.bt < hold) {
        this.bt = Math.min(hold, this.bt + rdt);
        const bt = this.bt;
        if (this.scaf) this.scaf.scale.y = bt < this.tEnd - .22 ? easeOutBack(bt / .26) : Math.max(.01, 1 - (bt - (this.tEnd - .22)) / .22);
        for (const p of this.pieces) {
          const u = (bt - p.t0) / .22;
          if (u < 0) continue;
          p.mesh.visible = true;
          if (u < 1) p.mesh.position.y = p.y + (1 - u * u) * 2.0;
          else {
            p.mesh.position.y = p.y;
            const sq = clamp((u - 1) / .45, 0, 1);
            p.mesh.scale.y = 1 - .1 * Math.sin(sq * PI) * (1 - sq);
            if (!p.landed) {
              p.landed = true;
              fxDust(this.x + rr(-.4, .4), this.y + p.y + .1, this.z + rr(-.4, .4), 3, .5, { speed: 1.2, a: .4 });
              sfx('hammer', this.x, this.z, .7, rnd());
            }
          }
        }
      }
      this.em.on = damp(this.em.on, 0, 4, rdt);
      return;
    }
    const c = this.cat;
    if (!c) return;
    const pr = this.prof, lvl = this.lvl, isElec = pr.model === 'elec';
    this.appear = Math.min(1, this.appear + rdt * 2.4);
    this.em.on = damp(this.em.on, this.stun > 0 ? .12 : 1, 3, rdt);
    c.scaleCur = damp(c.scaleCur, pr.scale, 10, rdt);
    c.mutatePuff = Math.max(0, c.mutatePuff - rdt * 2.8);
    const p = this.w([0, this.mounts.catY, c.ext * this.mounts.reach], _ap), e = c.e;
    e.x = p.x; e.y = p.y - (1 - easeOut(this.appear)) * .35; e.z = p.z;
    this.em.x = p.x; this.em.z = p.z;
    e.scale = c.scaleCur * (.35 + .65 * this.appear);
    e.yaw = c.yaw; e.pitch = c.pitch; e.swipe = c.swipe; e.pawSide = c.pawSide;
    e.hitDist = c.hitDist; e.hitDy = c.hitDy; e.mutatePuff = c.mutatePuff;
    if (isElec) rigGattoElettrico(e, lvl);
    else {
      if (this.monocle) this.monocle.visible = false;
      if (this.aura) this.aura.visible = false;
      if (pr.model === 'fire') rigGattoFuoco(e, lvl);
      else rigGattoGraffiatore(e);
    }
  }
  update(dt) {
    this.recent = Math.max(0, this.recent - dt * .25);
    if (this.state !== 'active') {
      this.bt += dt; const bt = this.bt;
      if (this.scaf) this.scaf.scale.y = bt < this.tEnd - .22 ? easeOutBack(bt / .26) : Math.max(.01, 1 - (bt - (this.tEnd - .22)) / .22);
      for (const p of this.pieces) {
        const u = (bt - p.t0) / .22;
        if (u < 0) continue; p.mesh.visible = true;
        if (u < 1) p.mesh.position.y = p.y + (1 - u * u) * 2.0;
        else { p.mesh.position.y = p.y; const sq = clamp((u - 1) / .45, 0, 1); p.mesh.scale.y = 1 - .1 * Math.sin(sq * PI) * (1 - sq);
          if (!p.landed) { p.landed = true; fxDust(this.x + rr(-.4, .4), this.y + p.y + .1, this.z + rr(-.4, .4), 3, .5, { speed: 1.2, a: .4 }); sfx('hammer', this.x, this.z, .7, rnd()); } }
      }
      this.em.on = damp(this.em.on, 0, 4, dt);
      if (bt >= this.tEnd) this.finish();
      return;
    }
    this.appear = Math.min(1, this.appear + dt * 2.4);
    TOWER_STUN = this.stun > 0;
    if (TOWER_STUN) {
      this.stun -= dt; const k = Math.min(1, this.stun * 2);
      FX.add.push(this.x, this.y + 1.5, this.z, 4.0, 5.0, 0, 0, .2, .5, 1.2, .3 * k, 2, 0, 0, 0);
      if (rnd() < dt * 5) { const a = rnd() * TAU, h = rr(.6, 2.2); fxBolt([this.x + Math.cos(a) * .7, this.y + h, this.z + Math.sin(a) * .7], [this.x + Math.cos(a + 1.2) * .7, this.y + h + rr(-.4, .4), this.z + Math.sin(a + 1.2) * .7], .12, [.5, .85, 1.5], .03); }
      if (rnd() < dt * 16) fxPart(this.x + rr(-.6, .6), this.y + rr(.4, 2.2), this.z + rr(-.6, .6), 0, rr(-.5, .1), 0, rr(.4, .9), rr(.05, .08), .6, 1.1, 2.0, { drag: .5 });
    }
    this.em.on = damp(this.em.on, TOWER_STUN ? .12 : 1, TOWER_STUN ? 8 : 3, dt);
    this.updCat(dt);
    TOWER_STUN = false;
  }

  updCat(dt) {
    const c = this.cat;
    if (!c) return;
    const pr = this.prof, lvl = this.lvl, isBase = pr.model === 'base', isElec = pr.model === 'elec';
    const tgt = findTarget(this.x, this.z, pr.range, pr.air, pr.ground);

    if (isBase && tgt) c.holdT = 1.2;
    else c.holdT = (!isBase || TOWER_STUN) ? 0 : Math.max(0, c.holdT - dt);

    const wantExt = (isBase && c.holdT > 0) ? 1 : 0;
    c.ext = damp(c.ext, wantExt, wantExt ? 12 : 5.5, dt);

    if (this.gantryRail) {
      this.gantryRail.visible = c.ext > .02;
      this.gantryRail.scale.z = Math.max(.01, c.ext);
    }
    if (this.gantryPad) this.gantryPad.position.z = c.ext * this.mounts.reach;

    const p = this.w([0, this.mounts.catY, c.ext * this.mounts.reach], _ap), e = c.e;
    c.scaleCur = damp(c.scaleCur, pr.scale, 10, dt);
    c.mutatePuff = Math.max(0, c.mutatePuff - dt * 2.8);
    e.x = p.x; e.y = p.y - (1 - easeOut(this.appear)) * .35; e.z = p.z;
    this.em.x = p.x; this.em.z = p.z;
    e.scale = c.scaleCur * (.35 + .65 * this.appear);
    c.swipe = Math.max(0, c.swipe - dt * (isElec ? 5.2 : 4.5));
    c.cool -= dt;

    if (tgt) {
      const dx = tgt.x - p.x, dz = tgt.z - p.z, hDist = Math.max(.35, Math.hypot(dx, dz));
      const dy = (tgt.y + tgt.hitH) - (p.y + .9 * e.scale);
      c.yaw = angDamp(c.yaw, Math.atan2(dx, dz), 15, dt);
      c.pitch = damp(c.pitch, isElec ? -Math.atan2(dy, hDist) : .12, 10, dt);
      c.hitDist = hDist;
      c.hitDy = (tgt.y + tgt.hitH) - p.y;
    } else {
      c.yaw = angDamp(c.yaw, this.yaw + Math.sin(G.t * .7 + this.idx) * .55, 2.4, dt);
      c.pitch = damp(c.pitch, Math.sin(G.t * 1.2 + this.idx) * .06, 4, dt);
      if (c.cool < .12) c.cool = .12;
    }

    e.yaw = c.yaw; e.pitch = c.pitch; e.swipe = c.swipe; e.pawSide = c.pawSide;
    e.hitDist = c.hitDist; e.hitDy = c.hitDy; e.mutatePuff = c.mutatePuff;

    if (isElec) {
      rigGattoElettrico(e, lvl);
      // Particelle energetiche azzurrine leggere al Lv 4 (Gatto Cyborg)
      if (lvl >= 4 && !TOWER_STUN && rnd() < dt * 11) {
        const a = rnd() * TAU, rad = rr(.48, .85) * e.scale;
        fxPart(e.x + Math.cos(a) * rad, e.y + rr(.1, .7), e.z + Math.sin(a) * rad, rr(-.12, .12), rr(.6, 1.3), rr(-.12, .12), rr(.45, .85), rr(.04, .065), .35, 1.6, 2.4, { drag: .4, rise: .4 });
      }
    } else {
      if (this.monocle) this.monocle.visible = false;
      if (this.aura) this.aura.visible = false;
      if (pr.model === 'fire') rigGattoFuoco(e, lvl);
      else rigGattoGraffiatore(e);
    }

    if (!tgt) return;
    const ready = !isBase || c.ext > .75;
    if (c.cool > 0 || !ready) return;

    c.cool = pr.rate * rr(.94, 1.06);
    c.swipe = 1;
    c.pawSide = (pr.model === 'fire' && lvl < 3) ? 1 : -c.pawSide;

    if (isBase) {
      const hx = tgt.x, hy = tgt.y + tgt.hitH, hz = tgt.z;
      const cs = Math.cos(c.yaw), sn = Math.sin(c.yaw), dir = c.pawSide;
      for (let k = -1; k <= 1; k++) {
        const ox = cs * k * .11, oz = -sn * k * .11, oy = k * .06;
        FX.segs.push(
          hx - cs * .26 * dir + ox, hy + .22 + oy, hz + sn * .26 * dir + oz, .048,
          hx + cs * .26 * dir + ox, hy - .22 + oy, hz - sn * .26 * dir + oz, .012,
          1.6, 1.6, 1.6, .95
        );
      }
      fxSparks(hx, hy, hz, 6, 3.2, 1.5, 1.5, 1.5, { size: .045, grav: 4 });
      sfx('catClaw', hx, hz, .75, rnd());
      hitMonster(tgt, pr.dmg, 'claw', sn, cs, this);
    } else if (isElec) {
      // Attacco Laser istantaneo dal monocolo olografico!
      const sx = e.eyePos.x, sy = e.eyePos.y, sz = e.eyePos.z;
      const hx = tgt.x, hy = tgt.y + tgt.hitH, hz = tgt.z;
      const col = pr.plasma ? [2.8, .75, 2.4] : (pr.burnBonus ? [1.6, 2.2, 1.0] : [.45, 2.1, 3.0]);
      G.beams.push({ x0: sx, y0: sy, z0: sz, x1: hx, y1: hy, z1: hz, life: .15, max: .15, rad: pr.plasma ? .095 : (.042 + lvl * .009), col });
      fxTimed(2, sx, sy, sz, .55, .55, col[0], col[1], col[2], .9, .12);
      fxTimed(2, hx, hy, hz, pr.plasma ? 1.8 : 1.0, pr.plasma ? 1.8 : 1.0, col[0], col[1], col[2], .95, .14);
      fxSparks(hx, hy, hz, pr.plasma ? 12 : 6, pr.plasma ? 4.5 : 3.2, col[0], col[1], col[2], { size: .05, grav: 2 });
      if (pr.plasma) lightFlash(hx, hy, hz, 0xe879f9, 360, .18, 12);
      if (pr.plasma) sfx('catPlasma', sx, sz, .85, .5);
      else if (pr.burnBonus) sfx('catPyro', sx, sz, .78, .7);
      else sfx('catLaser', sx, sz, .78, clamp((lvl - 1) / 3, 0, 1));
      const l = Math.hypot(hx - sx, hz - sz) || 1;
      hitMonster(tgt, pr.dmg, 'bolt', (hx - sx) / l, (hz - sz) / l, this);
    } else {
      // Gatto Fuoco / Magma Volt -> Palla di Fuoco balistica con Splash
      const cs = Math.cos(c.yaw), sn = Math.sin(c.yaw), sc = e.scale;
      const side = lvl >= 3 ? c.pawSide : 1;
      const lx = side * .20 * sc, lz = .72 * sc;
      const sx = p.x + lx * cs + lz * sn, sy = p.y + .34 * sc, sz = p.z - lx * sn + lz * cs;
      const dist = Math.hypot(tgt.x - sx, tgt.z - sz), T = clamp(dist / 10.0, .14, .65);
      const q = aimPoint(tgt, T, _ap2), gy = G.B.heightAt(q.x, q.z);
      G.shells.push({
        x0: sx, y0: sy, z0: sz,
        tx: q.x, ty: Math.max(gy, q.y - tgt.hitH) + .05, tz: q.z,
        t: 0, T, dmg: pr.dmg, splash: pr.splash, tower: this,
        x: sx, y: sy, z: sz, sm: 0, arc: .48 + dist * .12, fire: true, lvl, miniStun: !!pr.miniStun
      });
      fxTimed(3, sx, sy, sz, .55, .55, 3.5, 2.0, .6, .9, .14);
      fxSparks(sx, sy, sz, 4, 2.8, 3.0, 1.5, .4, { size: .04, grav: 3 });
      sfx('catFire', sx, sz, .75, clamp((lvl - 1) / 3, 0, 1));
    }
  }
  dispose() { this.alive = false; this.em.alive = false; LT.emitters[this.idx] = null; this.clearModel(false); R.scene.remove(this.group); this.pad.tower = null; }
}
const _ap2 = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };

function updateProjectiles(dt) {
  const B = G.B;
  // Raggi laser istantanei del Gatto Elettrico / Cyborg / Plasma
  const Bm = G.beams;
  for (let i = Bm.length - 1; i >= 0; i--) {
    const b = Bm[i]; b.life -= dt;
    if (b.life <= 0) { swapRemove(Bm, i); continue; }
    const f = b.life / b.max, c = b.col;
    FX.segs.push(b.x0, b.y0, b.z0, b.rad * 1.45 * f, b.x1, b.y1, b.z1, b.rad * 1.15 * f, c[0], c[1], c[2], .7 * f);
    FX.segs.push(b.x0, b.y0, b.z0, b.rad * .55 * f, b.x1, b.y1, b.z1, b.rad * .45 * f, 2.6, 2.6, 2.6, .95 * f);
  }

  const Sh = G.shells;
  for (let i = Sh.length - 1; i >= 0; i--) {
    const s = Sh[i]; s.t += dt; const u = Math.min(1, s.t / s.T);
    s.x = lerp(s.x0, s.tx, u); s.z = lerp(s.z0, s.tz, u); s.y = lerp(s.y0, s.ty, u) + s.arc * 4 * u * (1 - u);
    const fsc = .72 + (s.lvl || 1) * .16;
    _tm.compose(_tv.set(s.x, s.y, s.z), _tq.setFromAxisAngle(_tz, s.t * 10), _ts.set(fsc, fsc, fsc));
    KIT.gattoFuoco.fireball.put(_tm, 0, null);
    FX.add.push(s.x, s.y, s.z, .55 * fsc, .55 * fsc, 0, 0, 3.2, 1.3, .25, 1, 0, 0, 0, 0);
    s.sm += dt * 36;
    while (s.sm > 1) { s.sm -= 1; fxPart(s.x + rr(-.06, .06), s.y + rr(-.06, .06), s.z + rr(-.06, .06), rr(-.4, .4), rr(.1, .7), rr(-.4, .4), rr(.2, .45), .055, 2.8, 1.1, .2, { drag: 1.5, rise: .5 }); }
    if (u >= 1) { swapRemove(Sh, i); explodeAt(s.tx, s.ty, s.tz, s.dmg, s.splash, s.tower, s.miniStun, s.lvl || 1); }
  }
}

function explodeAt(x, y, z, dmg, splash, tower, miniStun = false, lvl = 1) {
  const sc = splash / 1.55;
  fxExplosion(x, y, z, sc);
  FX.decals.add(G.B.heightAt, x, z, splash * 1.15, .016, .013, .011, .55, 20);
  if (miniStun) sfx('catMagma', x, z, .78, .7);
  else sfx('catBoom', x, z, .78, clamp((lvl - 1) / 3, 0, 1));
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || m.fly || !m.vis) continue;
    const d = Math.hypot(m.x - x, m.z - z); if (d > splash + m.rad) continue;
    const l = d || 1;
    hitMonster(m, dmg, 'blast', (m.x - x) / l, (m.z - z) / l, tower);
    if (miniStun && !m.def.boss && rnd() < .15) slowMonster(m, .95, 1.2);
  }
}
