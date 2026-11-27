'use strict';

const BAL = (function () {
  const DEFAULTS = {
    // Economia & Base (Calibrati Monte Carlo su Livello 1)
    startDna: 100,
    dnaPerSec: 1.3,
    baseHp: 100,
    sellRefund: 0.50,
    waveClearBonus: 0,
    earlyCallRate: 2.0,
    preSpawnCount: 0,
    useDynamicPress: 0,

    // Costi DNA [Base, 1° Slot, 2° Slot, 3° Slot, 4° Slot]
    cost0: 50,
    cost1: 30,
    cost2: 50,
    cost3: 80,
    cost4: 120,

    // Gatto Base (0 DNA - Terra)
    baseDmg: 10,
    baseRate: 0.67,
    baseRange: 4.4,

    // Gatto Fuoco Lv 1..4 (Terra + Splash)
    fireDmg1: 26,  fireDmg2: 55,  fireDmg3: 100, fireDmg4: 185,
    fireRate1: 0.67, fireRate2: 0.50, fireRate3: 0.40, fireRate4: 0.286,
    fireRange1: 5.2, fireRange2: 5.8, fireRange3: 6.4, fireRange4: 7.2,
    fireSplash1: 1.0, fireSplash2: 1.2, fireSplash3: 1.5, fireSplash4: 2.0,

    // Gatto Elettrico / Laser Lv 1..4 (Solo Aria)
    elecDmg1: 30,  elecDmg2: 68,  elecDmg3: 125, elecDmg4: 220,
    elecRate1: 0.67, elecRate2: 0.50, elecRate3: 0.40, elecRate4: 0.286,
    elecRange1: 5.8, elecRange2: 6.5, elecRange3: 7.3, elecRange4: 8.5,

    // Ibridi 4 DNA
    plasmaDmg: 480, plasmaRate: 2.0,  plasmaRange: 8.5,
    magmaDmg: 135,  magmaRate: 0.40,  magmaRange: 6.6, magmaSplash: 1.55,
    pyroDmg: 175,   pyroRate: 0.38,   pyroRange: 7.5,

    // Bestiario Cap. 1 (Calibrati per curva stelle 1-3 su Livello 1)
    poliHp: 85,   poliSpd: 1.90, poliBounty: 3,   poliLeak: 5,
    abomHp: 620,  abomSpd: 0.85, abomBounty: 16,  abomLeak: 15, abomArmor: 0.60,
    tentHp: 210,  tentSpd: 1.65, tentBounty: 8,   tentLeak: 10,
    amalHp: 6500, amalSpd: 0.62, amalBounty: 150, amalLeak: 100,

    // Composizione Ondate Livello 1 (Wave 1..5)
    w1Poli: 20,
    w2Poli: 22, w2Abom: 3,
    w3Poli: 18, w3Tent: 14,
    w4Poli: 28, w4Abom: 4, w4Tent: 12,
    w5Poli: 20, w5Tent: 12,

    // Carica Felina (Puntatore Laser - Segui Cursore)
    chargeCount: 16,
    chargeDur: 4.5,
    chargeDmg: 35,
    chargeRad: 2.8,
    chargeCd: 18.0,

    // Moltiplicatore globale HP ondate (1.00 = valori puri da tabella)
    waveHpMul: 1.00,
  };

  const STORAGE_KEY = 'purrcraft.balanceCfg.v2';
  const cfg = Object.assign({}, DEFAULTS);
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      for (const k in DEFAULTS) {
        if (typeof saved[k] === 'number' && isFinite(saved[k])) cfg[k] = saved[k];
      }
    }
  } catch (e) {}

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  function sync(scaleActiveMons) {
    if (typeof DNA_COSTS !== 'undefined') {
      DNA_COSTS[0] = Math.round(cfg.cost0);
      DNA_COSTS[1] = Math.round(cfg.cost1);
      DNA_COSTS[2] = Math.round(cfg.cost2);
      DNA_COSTS[3] = Math.round(cfg.cost3);
      DNA_COSTS[4] = Math.round(cfg.cost4);
    }
    if (typeof TOWER !== 'undefined' && TOWER.archer) {
      TOWER.archer.range = [cfg.baseRange, cfg.fireRange1, cfg.fireRange2, cfg.fireRange3, cfg.fireRange4];
      TOWER.archer.dmg   = [cfg.baseDmg, cfg.fireDmg1, cfg.fireDmg2, cfg.fireDmg3, cfg.fireDmg4];
      TOWER.archer.rate  = [cfg.baseRate, cfg.fireRate1, cfg.fireRate2, cfg.fireRate3, cfg.fireRate4];
      TOWER.archer.splash = [0, cfg.fireSplash1, cfg.fireSplash2, cfg.fireSplash3, cfg.fireSplash4];
    }
    if (typeof G !== 'undefined' && G.towers && typeof catProfile === 'function') {
      for (const t of G.towers) {
        if (!t.alive) continue;
        t.prof = catProfile(t.dna);
        if (t.em) {
          t.em.I = t.prof.light;
          t.em.r = t.prof.col[0]; t.em.g = t.prof.col[1]; t.em.b = t.prof.col[2];
        }
      }
    }
    if (typeof MON !== 'undefined') {
      const map = [
        ['polipetto', 'poliHp', 'poliSpd', 'poliBounty', 'poliLeak'],
        ['abominio',  'abomHp', 'abomSpd', 'abomBounty', 'abomLeak'],
        ['tentacolo', 'tentHp', 'tentSpd', 'tentBounty', 'tentLeak'],
        ['amalgama',  'amalHp', 'amalSpd', 'amalBounty', 'amalLeak'],
      ];
      for (const [id, hk, sk, bk, lk] of map) {
        const d = MON[id];
        if (!d) continue;
        const oldHp = d.hp || 1;
        d.hp = cfg[hk];
        d.spd = cfg[sk];
        d.bounty = Math.round(cfg[bk]);
        d.lives = Math.round(cfg[lk]);
        if (id === 'abominio') d.armor = cfg.abomArmor;
        if (scaleActiveMons && typeof G !== 'undefined' && G.mons && Math.abs(d.hp - oldHp) > 1e-4) {
          const ratio = d.hp / oldHp;
          for (const m of G.mons) {
            if (!m.dead && m.type === id) { m.maxHp *= ratio; m.hp *= ratio; }
          }
        }
      }
    }
    if (typeof G !== 'undefined' && G.maxLives !== Math.round(cfg.baseHp)) {
      const prevMax = G.maxLives || 100;
      G.maxLives = Math.max(1, Math.round(cfg.baseHp));
      if (G.lives > G.maxLives || prevMax === 20) G.lives = G.maxLives;
    }
  }

  function set(key, val) {
    if (!(key in DEFAULTS)) return;
    cfg[key] = +val;
    sync(true);
    save();
    refreshTTK();
  }

  function reset() {
    Object.assign(cfg, DEFAULTS);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    sync(true);
    if (typeof G !== 'undefined' && G.phase === 'play') restartBattle();
    syncUI();
  }

  function clearAllMonsters() {
    if (typeof G === 'undefined' || !G.mons) return;
    for (const m of G.mons) if (!m.dead && typeof removeMonster === 'function') removeMonster(m);
    G.mons.length = 0;
    G.shells.length = 0;
    G.beams.length = 0;
  }

  function restartBattle() {
    if (typeof G === 'undefined' || !G.B) return;
    clearAllMonsters();
    for (const t of G.towers) if (typeof t.clearModel === 'function') { t.clearModel(false); R.scene.remove(t.group); t.pad.tower = null; LT.emitters[t.idx] = null; }
    G.towers.length = 0;
    if (typeof clearDebris === 'function') clearDebris();
    if (typeof clearFX === 'function') clearFX();
    if (typeof CHARGE !== 'undefined' && CHARGE.reset) CHARGE.reset();
    G.paused = true;
    sync(false);
    if (typeof beginBattle === 'function') beginBattle(true);
    if (typeof UI !== 'undefined') UI.closeMenu();
  }

  function jumpToWave(wNum) {
    if (typeof G === 'undefined' || !G.B || typeof startWave !== 'function') return;
    clearAllMonsters();
    G.queue.length = 0;
    G.spawning = false;
    G.bossWave = false;
    G.bossAlive = false;
    G.phase = 'play';
    G.k = Math.max(0, Math.min(4, wNum - 1));
    startWave();
  }

  // =========================================================================
  // SIMULATORE MONTE CARLO HEADLESS (Usa la mappa 3D attiva G.B e BAL.cfg)
  // =========================================================================
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function mcPathAt(B, s, out) {
    const step = typeof PATH_STEP !== 'undefined' ? PATH_STEP : 0.25;
    const f = Math.max(0, Math.min(B.n - 1.001, s / step));
    const i = f | 0, u = f - i;
    out.x = B.px[i] + (B.px[i + 1] - B.px[i]) * u;
    out.z = B.pz[i] + (B.pz[i + 1] - B.pz[i]) * u;
    return out;
  }

  function simSingleRun(B, C, policy, seed) {
    const rand = mulberry32(seed);
    const rru = (a, b) => a + (b - a) * rand();
    let gold = C.startDna;
    const maxLives = Math.max(1, Math.round(C.baseHp));
    let lives = maxLives;
    const costs = [Math.round(C.cost0), Math.round(C.cost1), Math.round(C.cost2), Math.round(C.cost3), Math.round(C.cost4)];
    const step = typeof PATH_STEP !== 'undefined' ? PATH_STEP : 0.25;

    const padMeta = B.pads.map((p, idx) => {
      let cov = 0;
      for (let i = 0; i < B.n; i += 2) {
        const dx = p.x - B.px[i], dz = p.z - B.pz[i];
        if (dx * dx + dz * dz < 27.04) cov += step * 2;
      }
      return { idx, x: p.x, z: p.z, s: p.s, cov };
    });

    if (policy === 'casual') {
      padMeta.sort((a, b) => (b.cov + rru(-3, 3)) - (a.cov + rru(-3, 3)));
    } else {
      padMeta.sort((a, b) => (b.cov - Math.abs(b.s / B.L - 0.45) * 4) - (a.cov - Math.abs(a.s / B.L - 0.45) * 4));
    }

    const usedPads = new Uint8Array(B.pads.length);
    const towers = [], mons = [], shells = [];
    const dt = 0.12;
    let wave = 0, spawning = false, nextIn = 0.9, waveT = 0, queue = [], bossWave = false;
    let trickle = 6.0, trickleN = 0, aiCd = 0;
    const _pt = { x: 0, z: 0 };

    const mdefs = {
      polipetto: { hp: C.poliHp, spd: C.poliSpd, bty: Math.round(C.poliBounty), lk: Math.round(C.poliLeak), fly: false, rad: 0.24, arm: 1.0, boss: false },
      abominio:  { hp: C.abomHp, spd: C.abomSpd, bty: Math.round(C.abomBounty), lk: Math.round(C.abomLeak), fly: false, rad: 0.48, arm: C.abomArmor, boss: false },
      tentacolo: { hp: C.tentHp, spd: C.tentSpd, bty: Math.round(C.tentBounty), lk: Math.round(C.tentLeak), fly: true,  rad: 0.26, arm: 1.0, boss: false },
      amalgama:  { hp: C.amalHp, spd: C.amalSpd, bty: Math.round(C.amalBounty), lk: Math.round(C.amalLeak), fly: false, rad: 0.98, arm: 1.0, boss: true },
    };

    function makeWaveQueue(k) {
      const q = [], hm = C.waveHpMul;
      let t = 0.6;
      const grp = (ty, cnt, gap) => {
        const n = Math.max(0, Math.round(cnt));
        for (let i = 0; i < n; i++) { q.push({ t, ty, hm }); t += gap * rru(0.85, 1.15); }
        t += rru(1.0, 1.8);
      };
      if (k === 1) {
        const n1 = Math.floor(C.w1Poli / 2); grp('polipetto', n1, 0.32); grp('polipetto', C.w1Poli - n1, 0.26);
      } else if (k === 2) {
        const n1 = Math.floor(C.w2Poli / 2); grp('polipetto', n1, 0.28); grp('abominio', C.w2Abom, 1.6); grp('polipetto', C.w2Poli - n1, 0.24);
      } else if (k === 3) {
        const n1 = Math.floor(C.w3Poli / 2), a1 = Math.floor(C.w3Tent / 2);
        grp('polipetto', n1, 0.28); grp('tentacolo', a1, 0.42); grp('polipetto', C.w3Poli - n1, 0.26); grp('tentacolo', C.w3Tent - a1, 0.38);
      } else if (k === 4) {
        const n1 = Math.floor(C.w4Poli * 0.43), ab1 = Math.floor(C.w4Abom / 2);
        grp('polipetto', n1, 0.25); grp('abominio', ab1, 1.4); grp('tentacolo', C.w4Tent, 0.38); grp('polipetto', C.w4Poli - n1, 0.22); grp('abominio', C.w4Abom - ab1, 1.3);
      } else {
        q.push({ t: 2.0, ty: 'amalgama', hm }); t = 4.5;
        grp('polipetto', C.w5Poli, 0.26); grp('tentacolo', C.w5Tent, 0.40);
      }
      q.sort((a, b) => a.t - b.t);
      return q;
    }

    function spawnM(ty, hm, sInit) {
      const d = mdefs[ty];
      const s0 = sInit !== undefined ? sInit : ((B.cave ? B.cave.s : 0.7) + rru(0.1, 0.6));
      mcPathAt(B, s0, _pt);
      mons.push({
        ty, hp: d.hp * hm, spd: d.spd * rru(0.93, 1.07), bty: d.bty, lk: d.lk,
        fly: d.fly, rad: d.rad, arm: d.arm, boss: d.boss,
        s: s0, x: _pt.x, z: _pt.z, slowT: 0, slowF: 0
      });
    }

    function buildPad() {
      for (let i = 0; i < padMeta.length; i++) {
        const pm = padMeta[i];
        if (!usedPads[pm.idx]) {
          usedPads[pm.idx] = 1;
          gold -= costs[0];
          towers.push({ x: pm.x, z: pm.z, dna: [], prof: catProfile([]), cool: 0.75, stun: 0 });
          return true;
        }
      }
      return false;
    }

    function mutTw(tw, elem) {
      const c = costs[tw.dna.length + 1];
      gold -= c;
      tw.dna.push(elem);
      tw.prof = catProfile(tw.dna);
    }

    function decide() {
      const nTw = towers.length;
      let nElec = 0, unmut = null, canFree = false;
      for (let i = 0; i < padMeta.length; i++) if (!usedPads[padMeta[i].idx]) { canFree = true; break; }
      for (let i = 0; i < nTw; i++) {
        if (towers[i].prof.model === 'elec') nElec++;
        if (towers[i].dna.length === 0 && !unmut) unmut = towers[i];
      }
      let flyersNow = false;
      for (let i = 0; i < mons.length; i++) if (mons[i].fly) { flyersNow = true; break; }
      const airSoon = (wave >= 2 && !spawning && nextIn < 3.5) || wave >= 3 || flyersNow;

      if (policy === 'base_only') {
        if (gold >= costs[0] && canFree) buildPad();
        return;
      }
      if (policy === 'fire_only') {
        if (unmut && gold >= costs[1]) { mutTw(unmut, 'fire'); return; }
        if (nTw < 3 && gold >= costs[0] && canFree) { buildPad(); return; }
        let best = null;
        for (const tw of towers) if (tw.dna.length < 4 && (!best || tw.dna.length < best.dna.length)) best = tw;
        if (best && gold >= costs[best.dna.length + 1]) mutTw(best, 'fire');
        return;
      }
      if (policy === 'casual') {
        if (unmut && gold >= costs[1]) {
          const elem = (flyersNow && nElec < 2) ? 'elec' : ((wave >= 3 && nElec === 0 && rand() < 0.7) ? 'elec' : 'fire');
          mutTw(unmut, elem); return;
        }
        if (flyersNow && nElec === 0 && gold >= costs[0] + costs[1] && canFree) { buildPad(); return; }
        if (nTw < Math.min(5, wave + 1) && gold >= costs[0] && canFree && rand() < 0.55) { buildPad(); return; }
        const cands = [];
        for (const tw of towers) if (tw.dna.length < 4 && gold >= costs[tw.dna.length + 1]) cands.push(tw);
        if (cands.length) {
          const tw = cands[(rand() * cands.length) | 0];
          const elem = tw.prof.model === 'elec' ? 'elec' : ((flyersNow && rand() < 0.25) ? 'elec' : 'fire');
          mutTw(tw, elem);
        }
        return;
      }
      // policy === 'optimal'
      if (unmut && gold >= costs[1]) {
        const wantElec = airSoon && nElec < (wave >= 4 ? 2 : 1);
        mutTw(unmut, wantElec ? 'elec' : 'fire'); return;
      }
      if (airSoon && nElec < (wave >= 4 ? 2 : 1)) {
        if (gold >= costs[0] + costs[1] && canFree) { buildPad(); return; }
        let bestE = null;
        for (const tw of towers) if (tw.prof.model === 'elec' && tw.dna.length < 4 && (!bestE || tw.dna.length < bestE.dna.length)) bestE = tw;
        if (bestE && gold >= costs[bestE.dna.length + 1]) { mutTw(bestE, 'elec'); return; }
      }
      const wantPads = wave <= 1 ? 2 : (wave === 2 ? 3 : 4);
      if (nTw < wantPads && canFree && gold >= costs[0] + costs[1]) { buildPad(); return; }
      let best = null, bestPri = 99;
      for (const tw of towers) {
        if (tw.dna.length === 0 || tw.dna.length >= 4) continue;
        const pri = (airSoon && tw.prof.model === 'elec' && tw.dna.length < 2) ? tw.dna.length : (10 + tw.dna.length);
        if (pri < bestPri) { bestPri = pri; best = tw; }
      }
      if (best && gold >= costs[best.dna.length + 1]) {
        mutTw(best, best.prof.model === 'elec' ? 'elec' : 'fire');
      }
    }

    let qIdx = 0;
    for (let tTotal = 0; tTotal < 420; tTotal += dt) {
      gold += dt * C.dnaPerSec;
      aiCd -= dt;
      if (aiCd <= 0) { aiCd = policy === 'casual' ? 1.6 : 0.45; decide(); }

      if (spawning) {
        waveT += dt;
        while (qIdx < queue.length && queue[qIdx].t <= waveT) {
          const ev = queue[qIdx++];
          spawnM(ev.ty, ev.hm);
        }
        if (qIdx >= queue.length) {
          let bossAlive = false;
          for (let i = 0; i < mons.length; i++) if (mons[i].boss) { bossAlive = true; break; }
          if (bossWave && bossAlive) {
            trickle -= dt;
            if (trickle <= 0 && trickleN < 9) {
              trickleN++; trickle = rru(3.2, 4.6);
              const ty = rand() < 0.67 ? 'polipetto' : 'tentacolo';
              const nTr = ty === 'polipetto' ? 3 : 1;
              for (let j = 0; j < nTr; j++) queue.push({ t: waveT + j * 0.4, ty, hm: C.waveHpMul });
            }
          } else {
            spawning = false;
            gold += Math.round(C.waveClearBonus);
            nextIn = bossWave ? -1 : 6.5;
          }
        }
      } else if (bossWave) {
        if (mons.length === 0) return { win: true, lives, maxLives, wave: 5, gold };
      } else {
        nextIn -= dt;
        if (nextIn <= 0) {
          wave++; bossWave = (wave === 5); trickle = 6.0; trickleN = 0;
          queue = makeWaveQueue(wave); qIdx = 0; waveT = 0; spawning = true;
        }
      }

      const caveVis = (B.cave ? B.cave.s : 0.7) + 1.5;
      for (let i = mons.length - 1; i >= 0; i--) {
        const m = mons[i];
        if (m.slowT > 0) { m.slowT -= dt; if (m.slowT <= 0) m.slowF = 0; }
        m.s += m.spd * (1 - m.slowF) * dt;
        if (m.s >= B.L - 0.35) {
          lives -= m.lk;
          mons.splice(i, 1);
          if (lives <= 0) return { win: false, lives: 0, maxLives, wave: Math.max(1, wave), gold };
          continue;
        }
        mcPathAt(B, m.s, m);
      }

      for (let i = 0; i < towers.length; i++) {
        const tw = towers[i];
        if (tw.stun > 0) { tw.stun -= dt; continue; }
        tw.cool -= dt;
        if (tw.cool > 0) continue;
        const pr = tw.prof, r2 = pr.range * pr.range;
        let best = null, bp = -1;
        for (let j = 0; j < mons.length; j++) {
          const m = mons[j];
          if (m.s < caveVis) continue;
          if (m.fly ? !pr.air : !pr.ground) continue;
          const dx = tw.x - m.x, dz = tw.z - m.z;
          if (dx * dx + dz * dz <= r2) {
            const sc = m.s / B.L + (m.fly ? 2 : 0);
            if (sc > bp) { bp = sc; best = m; }
          }
        }
        if (!best) { tw.cool = 0.1; continue; }
        tw.cool = pr.rate * rru(0.94, 1.06);
        if (pr.model === 'base') best.hp -= pr.dmg * (best.arm < 1 ? best.arm : 1);
        else if (pr.model === 'elec') best.hp -= pr.dmg;
        else {
          const dist = Math.hypot(best.x - tw.x, best.z - tw.z);
          const T = Math.max(0.14, Math.min(0.65, dist / 10.0));
          const sAim = Math.min(B.L - 0.1, best.s + best.spd * (1 - best.slowF) * T);
          mcPathAt(B, sAim, _pt);
          shells.push({ t: T, tx: _pt.x, tz: _pt.z, dmg: pr.dmg, splash: pr.splash, stun: !!pr.miniStun });
        }
      }

      for (let i = shells.length - 1; i >= 0; i--) {
        const sh = shells[i]; sh.t -= dt;
        if (sh.t <= 0) {
          shells.splice(i, 1);
          for (let j = 0; j < mons.length; j++) {
            const m = mons[j];
            if (m.fly || m.hp <= 0) continue;
            if (Math.hypot(m.x - sh.tx, m.z - sh.tz) <= sh.splash + m.rad) {
              m.hp -= sh.dmg;
              if (sh.stun && !m.boss && rand() < 0.15) { m.slowF = Math.max(m.slowF, 0.95); m.slowT = Math.max(m.slowT, 1.2); }
            }
          }
        }
      }

      const splitChildren = [];
      for (let i = mons.length - 1; i >= 0; i--) {
        const m = mons[i];
        if (m.hp <= 0) {
          gold += m.bty;
          if (m.boss) {
            const sb = Math.max(0.5, m.s - 2.0);
            for (let c = 0; c < 4; c++) splitChildren.push(sb);
            let bestTw = null, bd = 27.04;
            for (const tw of towers) {
              const d2 = (tw.x - m.x) * (tw.x - m.x) + (tw.z - m.z) * (tw.z - m.z);
              if (d2 < bd) { bd = d2; bestTw = tw; }
            }
            if (bestTw) bestTw.stun = 3.0;
          }
          mons.splice(i, 1);
        }
      }
      for (let c = 0; c < splitChildren.length; c++) {
        spawnM('polipetto', 1.0, splitChildren[c]);
        const child = mons[mons.length - 1];
        child.slowF = 0.98; child.slowT = 1.0;
      }
    }
    return { win: false, lives, maxLives, wave, gold };
  }

  function runMonteCarlo(nPerPolicy = 125) {
    if (typeof G === 'undefined' || !G.B) return null;
    sync(false);
    const t0 = performance.now();
    const policies = [
      ['base_only', 'Solo Base (0 DNA)'],
      ['fire_only', 'Solo Fuoco (No AA)'],
      ['casual',    'Giocatore Casual'],
      ['optimal',   'Strategia Ottimale'],
    ];
    const report = [];
    let seedBase = (Date.now() & 0x7fffffff) ^ 0x13579bdf;
    for (const [pol, label] of policies) {
      let wins = 0, s3 = 0, s2 = 0, hpSum = 0;
      const failW = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (let i = 0; i < nPerPolicy; i++) {
        const r = simSingleRun(G.B, cfg, pol, seedBase++);
        if (r.win) {
          wins++;
          hpSum += r.lives;
          if (r.lives >= r.maxLives) s3++;
          if (r.lives >= r.maxLives * 0.8) s2++;
        } else {
          failW[r.wave] = (failW[r.wave] || 0) + 1;
        }
      }
      let topFail = '-';
      let maxF = 0;
      for (let w = 1; w <= 5; w++) if (failW[w] > maxF) { maxF = failW[w]; topFail = 'W' + w + ' (' + failW[w] + ')'; }
      report.push({
        pol, label, n: nPerPolicy,
        winPct: Math.round((wins / nPerPolicy) * 100),
        s3Pct: Math.round((s3 / nPerPolicy) * 100),
        s2Pct: Math.round((s2 / nPerPolicy) * 100),
        avgHp: wins ? Math.round(hpSum / wins) : 0,
        topFail,
      });
    }
    const ms = Math.round(performance.now() - t0);
    return { totalRuns: nPerPolicy * policies.length, ms, padCount: G.B.pads.length, roadLen: G.B.L.toFixed(1), report };
  }

  // --- PANNELLO DEBUG GAMEPLAY & BILANCIAMENTO [F8 / #balance / #debug] ---
  let dbgEl = null, dbgMini = false, curTab = 'mc', telTimer = null;

  function calcTTKSummary() {
    const hitsBasePoli = Math.ceil(cfg.poliHp / Math.max(1, cfg.baseDmg));
    const ttkBasePoli  = ((hitsBasePoli - 1) * cfg.baseRate).toFixed(2);
    const hitsFirePoli = Math.ceil(cfg.poliHp / Math.max(1, cfg.fireDmg1));
    const ttkFirePoli  = ((hitsFirePoli - 1) * cfg.fireRate1 + 0.25).toFixed(2);
    const hitsFire2Abom = Math.ceil(cfg.abomHp / Math.max(1, cfg.fireDmg2));
    const ttkFire2Abom  = ((hitsFire2Abom - 1) * cfg.fireRate2 + 0.25).toFixed(2);
    const hitsElecTent = Math.ceil(cfg.tentHp / Math.max(1, cfg.elecDmg1));
    const ttkElecTent  = ((hitsElecTent - 1) * cfg.elecRate1).toFixed(2);
    const dpsVulc = (cfg.fireDmg4 / cfg.fireRate4);
    const ttkBoss2Vulc = (cfg.amalHp / (dpsVulc * 2)).toFixed(1);

    return `
      <div>• <b>Base → Polipetto:</b> ${hitsBasePoli} colpi (${ttkBasePoli}s) <span class="dim">[GDD: 4-5 / ~2.7s]</span></div>
      <div>• <b>Fuoco Lv1 → Polipetto:</b> ${hitsFirePoli} colpi (${ttkFirePoli}s) <span class="dim">[GDD: 1-2 / ~1.0s]</span></div>
      <div>• <b>Fuoco Lv2 → Abominio:</b> ${hitsFire2Abom} colpi (${ttkFire2Abom}s) <span class="dim">[GDD: ~2.8s]</span></div>
      <div>• <b>Laser Lv1 → Tentacolo:</b> ${hitsElecTent} colpi (${ttkElecTent}s) <span class="dim">[GDD: 3-4 / ~2.0s]</span></div>
      <div>• <b>2× Vulcano → Boss:</b> ${ttkBoss2Vulc}s (${Math.round(dpsVulc)} DPS cad.)</div>
    `;
  }

  function refreshTTK() {
    const box = document.getElementById('bal-ttk');
    if (box) box.innerHTML = calcTTKSummary();
  }

  function renderMCResult(res) {
    const box = document.getElementById('bal-mc-out');
    if (!box || !res) return;
    const rows = res.report.map(r => {
      const col = r.winPct >= 85 ? '#86efac' : (r.winPct >= 45 ? '#fde68a' : '#fca5a5');
      return `<tr>
        <td><b>${r.label}</b></td>
        <td style="color:${col};font-weight:700;">${r.winPct}%</td>
        <td>${r.s3Pct}%</td>
        <td>${r.s2Pct}%</td>
        <td>${r.topFail}</td>
      </tr>`;
    }).join('');
    box.innerHTML = `
      <div class="mc-meta">Mappa attiva: <b>${res.padCount} piazzole</b> · Strada <b>${res.roadLen}u</b> · <b>${res.totalRuns} run</b> in <b>${res.ms} ms</b></div>
      <table class="mc-tbl">
        <thead><tr><th>Profilo</th><th>Win</th><th>3🐾</th><th>2🐾+</th><th>KO Wave</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function updateTelemetry() {
    if (!dbgEl || dbgEl.style.display === 'none' || dbgMini || typeof G === 'undefined') return;
    const el = document.getElementById('bal-tel');
    if (!el) return;
    let dpsG = 0, dpsA = 0;
    if (G.towers) {
      for (const t of G.towers) {
        if (!t.alive) continue;
        const d = t.prof.dmg / Math.max(0.05, t.prof.rate);
        if (t.prof.ground) dpsG += d;
        if (t.prof.air) dpsA += d;
      }
    }
    const wn = typeof waveNumber === 'function' ? waveNumber() : G.k;
    el.innerHTML = `
      <span>🧬 DNA: <b>${Math.floor(G.gold)}</b> (+${cfg.dnaPerSec.toFixed(1)}/s)</span>
      <span>❤️ Base: <b>${G.lives}/${G.maxLives}</b></span>
      <span>🌊 Wave: <b>${wn}</b> (${G.mons.length} vivi)</span>
      <span>⚔️ DPS T/A: <b>${Math.round(dpsG)}</b> / <b>${Math.round(dpsA)}</b></span>
    `;
  }

  function syncUI() {
    if (!dbgEl) return;
    dbgEl.querySelectorAll('input[data-bk]').forEach(inp => {
      const k = inp.dataset.bk, step = parseFloat(inp.step) || 1;
      const val = cfg[k];
      inp.value = val;
      const b = document.getElementById('bval-' + k);
      if (b) b.textContent = step < 1 ? val.toFixed(step < 0.05 ? 3 : 2) : Math.round(val);
    });
    refreshTTK();
  }

  function buildPanel() {
    if (dbgEl || typeof document === 'undefined') return;
    const st = document.createElement('style');
    st.textContent = `
      #pc-bal-dbg {
        position: fixed; top: 54px; left: 12px; width: 356px; max-height: calc(100vh - 70px);
        overflow-y: auto; z-index: 9998; background: rgba(11, 17, 28, 0.96);
        border: 1px solid #f59e0b; border-radius: 10px; padding: 10px 12px;
        color: #e6edf3; font: 11.5px/1.35 system-ui, -apple-system, sans-serif;
        box-shadow: 0 12px 32px rgba(0,0,0,0.7); user-select: none;
      }
      #pc-bal-dbg.mini { width: auto; padding: 6px 10px; overflow: hidden; }
      #pc-bal-dbg.mini .dbg-body { display: none; }
      #pc-bal-dbg .dbg-hd { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
      #pc-bal-dbg .dbg-title { font-weight: 700; color: #fbbf24; font-size: 12px; }
      #pc-bal-dbg .dbg-hbtns { display: flex; gap: 4px; }
      #pc-bal-dbg button {
        background: #1e293b; color: #e2e8f0; border: 1px solid #3b5273;
        border-radius: 5px; padding: 4px 7px; font-size: 10.5px; font-weight: 600; cursor: pointer;
      }
      #pc-bal-dbg button:hover { background: #2d3f59; border-color: #fbbf24; }
      #pc-bal-dbg button.act { background: #3b2a14; border-color: #f59e0b; color: #fde68a; }
      #pc-bal-dbg button.ok { background: #143628; border-color: #22c55e; color: #86efac; }
      #pc-bal-dbg button.mc-run {
        width: 100%; padding: 7px 10px; font-size: 11.5px; font-weight: 700;
        background: linear-gradient(135deg, #b45309, #f59e0b); border-color: #fde68a; color: #090d16; margin-top: 6px;
      }
      #pc-bal-dbg button.mc-run:hover { filter: brightness(1.08); }
      #pc-bal-dbg .tel {
        display: grid; grid-template-columns: 1fr 1fr; gap: 3px 8px;
        background: #080d16; border: 1px solid #1e2d42; border-radius: 6px;
        padding: 6px 8px; margin-top: 7px; font-size: 10.8px; color: #94a3b8;
      }
      #pc-bal-dbg .tel b { color: #f8fafc; }
      #pc-bal-dbg .qgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 6px; }
      #pc-bal-dbg .wgrid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-top: 4px; }
      #pc-bal-dbg .tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 8px; padding-top: 7px; border-top: 1px solid #1e2d42; }
      #pc-bal-dbg .pane { display: none; margin-top: 6px; }
      #pc-bal-dbg .pane.on { display: block; }
      #pc-bal-dbg .sec { margin-top: 7px; padding-top: 5px; border-top: 1px solid #1a2638; font-weight: 700; color: #7dd3fc; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.4px; }
      #pc-bal-dbg .r { margin-top: 4px; }
      #pc-bal-dbg .r label { display: flex; justify-content: space-between; color: #94a3b8; font-size: 10.8px; }
      #pc-bal-dbg .r label b { color: #fff; }
      #pc-bal-dbg input[type="range"] { width: 100%; height: 13px; accent-color: #f59e0b; cursor: pointer; margin-top: 1px; }
      #pc-bal-dbg .ttk, #pc-bal-dbg .mc-box {
        background: #080d16; border: 1px solid #1e2d42; border-radius: 6px;
        padding: 6px 8px; margin-top: 7px; font-size: 10.5px; line-height: 1.42; color: #cbd5e1;
      }
      #pc-bal-dbg .ttk .dim { color: #64748b; }
      #pc-bal-dbg .mc-meta { color: #94a3b8; margin-bottom: 5px; font-size: 10.2px; }
      #pc-bal-dbg .mc-meta b { color: #e2e8f0; }
      #pc-bal-dbg .mc-tbl { width: 100%; border-collapse: collapse; font-size: 10.5px; }
      #pc-bal-dbg .mc-tbl th { text-align: left; color: #94a3b8; border-bottom: 1px solid #1e2d42; padding: 2px 3px; font-weight: 600; }
      #pc-bal-dbg .mc-tbl td { padding: 3px 3px; border-bottom: 1px solid #121c2b; }
      #pc-bal-dbg .fbar { display: flex; gap: 5px; margin-top: 8px; padding-top: 7px; border-top: 1px solid #1e2d42; }
      #pc-bal-dbg .fbar button { flex: 1; padding: 5px 6px; }
    `;
    document.head.appendChild(st);

    const sl = (k, lbl, min, max, step = 1) => {
      const v = cfg[k], fmt = step < 1 ? v.toFixed(step < 0.05 ? 3 : 2) : Math.round(v);
      return `<div class="r"><label><span>${lbl}</span><b id="bval-${k}">${fmt}</b></label><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-bk="${k}" /></div>`;
    };

    dbgEl = document.createElement('div');
    dbgEl.id = 'pc-bal-dbg';
    dbgEl.innerHTML = `
      <div class="dbg-hd">
        <span class="dbg-title">⚖️ Balance &amp; Monte Carlo [F8]</span>
        <div class="dbg-hbtns">
          <button id="bal-aud" title="Apri Mixer Audio (F9)">🎵 F9</button>
          <button id="bal-mini" title="Minimizza">—</button>
          <button id="bal-close" title="Chiudi (F8)">✕</button>
        </div>
      </div>
      <div class="dbg-body">
        <div id="bal-tel" class="tel"></div>

        <div class="qgrid">
          <button data-bact="dna100">+100 DNA</button>
          <button data-bact="heal">Full HP</button>
          <button data-bact="kill">Kill Tutti</button>
          <button data-bact="restart">Reset Run</button>
        </div>
        <div class="wgrid">
          <button data-bwave="1">Wave 1</button>
          <button data-bwave="2">Wave 2</button>
          <button data-bwave="3">Wave 3</button>
          <button data-bwave="4">Wave 4</button>
          <button data-bwave="5">Boss W5</button>
        </div>

        <div class="tabs">
          <button class="act" data-btab="mc">Monte Carlo</button>
          <button data-btab="eco">Economia</button>
          <button data-btab="cats">Gatti</button>
          <button data-btab="mons">Mostri</button>
        </div>

        <div class="pane on" id="bpane-mc">
          <button id="bal-mc-btn" class="mc-run">🎲 Simula 500 Partite su questa Mappa</button>
          <div id="bal-mc-out" class="mc-box">Premi il pulsante per simulare 500 partite (4 profili giocatore × 125 seed) usando la geometria reale di questa mappa e gli slider attuali.</div>
          <div class="sec">Composizione Ondate Livello 1</div>
          ${sl('w1Poli', 'W1 · Polipetti (Sciame)', 6, 40, 2)}
          ${sl('w2Poli', 'W2 · Polipetti', 6, 40, 2)}
          ${sl('w2Abom', 'W2 · Abomini (Tank)', 0, 8, 1)}
          ${sl('w3Poli', 'W3 · Polipetti', 6, 40, 2)}
          ${sl('w3Tent', 'W3 · Tentacoli Alati (Aria)', 0, 28, 2)}
          ${sl('w4Poli', 'W4 · Polipetti', 8, 50, 2)}
          ${sl('w4Abom', 'W4 · Abomini', 0, 10, 1)}
          ${sl('w4Tent', 'W4 · Tentacoli Alati', 0, 28, 2)}
          ${sl('w5Poli', 'W5 Boss · Scorta Polipetti', 0, 36, 2)}
          ${sl('w5Tent', 'W5 Boss · Scorta Tentacoli', 0, 24, 2)}
        </div>

        <div class="pane" id="bpane-eco">
          <div class="sec">Risorse &amp; Base</div>
          ${sl('startDna', 'DNA Iniziale (GDD: 100)', 50, 500, 10)}
          ${sl('dnaPerSec', 'Rigenerazione DNA/sec (GDD: 2.0)', 0, 10, 0.2)}
          ${sl('baseHp', 'HP Base (GDD: 100)', 20, 250, 5)}
          ${sl('sellRefund', 'Rimborso Vendita (GDD: 0.50)', 0, 1, 0.05)}
          ${sl('waveClearBonus', 'Bonus Fine Ondata', 0, 80, 5)}
          ${sl('waveHpMul', 'Moltiplicatore HP Ondate', 0.5, 2.5, 0.05)}
          ${sl('useDynamicPress', 'Scaling Adattivo (0=Fisso, 1=Attivo)', 0, 1, 1)}
          <div class="sec">Costi DNA Piazzamento &amp; Slot</div>
          ${sl('cost0', 'Piazza Gatto Base (0 DNA)', 20, 120, 5)}
          ${sl('cost1', '1ª Fiala DNA (Lv 1)', 10, 100, 5)}
          ${sl('cost2', '2ª Fiala DNA (Lv 2)', 20, 150, 5)}
          ${sl('cost3', '3ª Fiala DNA (Lv 3)', 30, 200, 5)}
          ${sl('cost4', '4ª Fiala DNA (Lv 4 Max)', 50, 250, 5)}
        </div>

        <div class="pane" id="bpane-cats">
          <div class="sec">Gatto Base (Terra)</div>
          ${sl('baseDmg', 'Danno Graffio', 2, 40, 1)}
          ${sl('baseRate', 'Intervallo Colpo (s)', 0.2, 1.5, 0.02)}
          ${sl('baseRange', 'Raggio', 2.5, 8.0, 0.2)}
          <div class="sec">Gatto Fuoco Lv 1 → 4 (Splash Terra)</div>
          ${sl('fireDmg1', 'Danno Fuoco Lv 1', 10, 100, 5)}
          ${sl('fireDmg2', 'Danno Fuoco Lv 2', 20, 160, 5)}
          ${sl('fireDmg3', 'Danno Fuoco Lv 3', 40, 260, 5)}
          ${sl('fireDmg4', 'Danno Vulcano Lv 4', 80, 450, 10)}
          ${sl('fireSplash1', 'Splash Lv 1', 0.5, 2.5, 0.1)}
          ${sl('fireSplash4', 'Splash Vulcano Lv 4', 1.0, 3.5, 0.1)}
          <div class="sec">Gatto Laser Lv 1 → 4 &amp; Plasma (Aria)</div>
          ${sl('elecDmg1', 'Danno Laser Lv 1', 10, 100, 5)}
          ${sl('elecDmg2', 'Danno Laser Lv 2', 25, 180, 5)}
          ${sl('elecDmg3', 'Danno Laser Lv 3', 50, 300, 5)}
          ${sl('elecDmg4', 'Danno Cyborg Lv 4', 100, 500, 10)}
          ${sl('plasmaDmg', 'Danno Gatto Plasma (2F+2E)', 150, 900, 10)}
          <div class="sec">Carica Felina (Laser [Q])</div>
          ${sl('chargeCount', 'Gatti nell\'Orda', 6, 32, 2)}
          ${sl('chargeDur', 'Durata Laser (s)', 2, 8, 0.5)}
          ${sl('chargeDmg', 'Danno Impatto Gatto', 10, 90, 5)}
          ${sl('chargeRad', 'Raggio Frenesia', 1.4, 4.5, 0.2)}
          ${sl('chargeCd', 'Cooldown (s)', 5, 40, 1)}
        </div>

        <div class="pane" id="bpane-mons">
          <div id="bal-ttk" class="ttk"></div>
          <div class="sec">Polipetto di Melma (Sciame)</div>
          ${sl('poliHp', 'HP Polipetto', 10, 150, 5)}
          ${sl('poliSpd', 'Velocità Polipetto', 0.8, 3.5, 0.05)}
          ${sl('poliBounty', 'DNA Drop Polipetto', 1, 20, 1)}
          <div class="sec">Abominio di Roccia (Tank)</div>
          ${sl('abomHp', 'HP Abominio', 100, 1200, 10)}
          ${sl('abomSpd', 'Velocità Abominio', 0.4, 2.0, 0.05)}
          ${sl('abomBounty', 'DNA Drop Abominio', 5, 60, 1)}
          <div class="sec">Tentacolo Alato (Aria) &amp; Boss</div>
          ${sl('tentHp', 'HP Tentacolo', 30, 350, 5)}
          ${sl('tentSpd', 'Velocità Tentacolo', 0.8, 3.0, 0.05)}
          ${sl('tentBounty', 'DNA Drop Tentacolo', 3, 40, 1)}
          ${sl('amalHp', 'HP Boss Amalgama', 1000, 10000, 100)}
        </div>

        <div class="fbar">
          <button id="bal-copy">Copia JSON</button>
          <button id="bal-reset">Reset Calibrato</button>
        </div>
      </div>
    `;

    const stopProp = e => e.stopPropagation();
    ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'mousedown', 'mousemove', 'mouseup', 'wheel', 'touchstart', 'touchmove', 'touchend', 'click', 'dblclick', 'contextmenu', 'keydown', 'keyup'].forEach(ev => {
      dbgEl.addEventListener(ev, stopProp, { passive: false });
    });

    document.body.appendChild(dbgEl);
    refreshTTK();
    updateTelemetry();
    if (!telTimer) telTimer = setInterval(updateTelemetry, 250);

    document.getElementById('bal-mc-btn').onclick = () => {
      const btn = document.getElementById('bal-mc-btn');
      btn.textContent = '⏳ Simulazione in corso...';
      setTimeout(() => {
        const res = runMonteCarlo(125);
        renderMCResult(res);
        btn.textContent = '🎲 Rilancia 500 Partite (Monte Carlo)';
      }, 15);
    };

    dbgEl.querySelectorAll('input[data-bk]').forEach(inp => {
      inp.addEventListener('input', () => {
        const k = inp.dataset.bk, step = parseFloat(inp.step) || 1, v = +inp.value;
        set(k, v);
        const b = document.getElementById('bval-' + k);
        if (b) b.textContent = step < 1 ? v.toFixed(step < 0.05 ? 3 : 2) : Math.round(v);
      });
    });

    dbgEl.querySelectorAll('[data-btab]').forEach(btn => {
      btn.onclick = () => {
        curTab = btn.dataset.btab;
        dbgEl.querySelectorAll('[data-btab]').forEach(b => b.classList.toggle('act', b === btn));
        ['mc', 'eco', 'cats', 'mons'].forEach(id => {
          const p = document.getElementById('bpane-' + id);
          if (p) p.classList.toggle('on', id === curTab);
        });
      };
    });

    dbgEl.querySelectorAll('[data-bact]').forEach(btn => {
      btn.onclick = () => {
        const a = btn.dataset.bact;
        if (a === 'dna100') { G.gold += 100; UI.goldShown = G.gold; }
        else if (a === 'heal') { G.maxLives = Math.round(cfg.baseHp); G.lives = G.maxLives; }
        else if (a === 'kill') clearAllMonsters();
        else if (a === 'restart') restartBattle();
        updateTelemetry();
      };
    });

    dbgEl.querySelectorAll('[data-bwave]').forEach(btn => {
      btn.onclick = () => {
        jumpToWave(+btn.dataset.bwave);
        G.paused = false;
        updateTelemetry();
      };
    });

    document.getElementById('bal-aud').onclick = () => {
      if (typeof AU !== 'undefined' && AU.toggleDebug) AU.toggleDebug();
    };
    document.getElementById('bal-mini').onclick = () => {
      dbgMini = !dbgMini;
      dbgEl.classList.toggle('mini', dbgMini);
      document.getElementById('bal-mini').textContent = dbgMini ? '+' : '—';
    };
    document.getElementById('bal-close').onclick = () => toggleDebug(false);

    document.getElementById('bal-reset').onclick = () => reset();
    document.getElementById('bal-copy').onclick = () => {
      const out = {};
      for (const k in DEFAULTS) out[k] = Math.round(cfg[k] * 1000) / 1000;
      const txt = JSON.stringify(out, null, 2);
      const copyBtn = document.getElementById('bal-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(() => {
          copyBtn.textContent = 'Copiato!'; copyBtn.classList.add('ok');
          setTimeout(() => { copyBtn.textContent = 'Copia JSON'; copyBtn.classList.remove('ok'); }, 1400);
        });
      } else {
        window.prompt('Copia configurazione bilanciamento:', txt);
      }
    };
  }

  function toggleDebug(force) {
    if (!dbgEl) buildPanel();
    if (!dbgEl) return;
    const show = force !== undefined ? !!force : (dbgEl.style.display === 'none');
    dbgEl.style.display = show ? 'block' : 'none';
    if (show) { syncUI(); updateTelemetry(); }
  }

  if (typeof window !== 'undefined') {
    const checkHash = () => {
      const h = (location.hash || '') + (location.search || '');
      if (/debug|balance/i.test(h)) toggleDebug(true);
    };
    window.addEventListener('DOMContentLoaded', () => { sync(false); checkHash(); });
    window.addEventListener('load', () => { sync(false); checkHash(); });
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('keydown', e => {
      if (e.code === 'F8' || (e.altKey && e.code === 'KeyB')) {
        e.preventDefault();
        if (!dbgEl) { buildPanel(); dbgEl.style.display = 'block'; }
        else toggleDebug();
      }
    });
  }

  return { DEFAULTS, cfg, sync, set, reset, toggleDebug, restartBattle, jumpToWave, runMonteCarlo };
})();
