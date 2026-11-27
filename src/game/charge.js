'use strict';

const CHARGE = (() => {
  const PALETTE = [
    [1.00, 0.68, 0.25], // Arancione tigrato
    [0.34, 0.40, 0.48], // Grigio ardesia
    [0.94, 0.91, 0.85], // Bianco crema
    [0.86, 0.46, 0.16], // Rosso fulvo
    [0.64, 0.70, 0.78], // Argento
    [0.54, 0.32, 0.18], // Cioccolato
  ];

  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _v = new THREE.Vector3();
  const _s = new THREE.Vector3();
  const _o = new THREE.Vector3();
  const _d = new THREE.Vector3();

  const S = {
    state: 'ready', // 'ready' | 'armed' | 'active' | 'cooling'
    x: 0, z: 0,
    px: 0, pz: 0, hasPreview: false,
    timer: 0,
    cd: 0,
    cats: [],
    meowQueue: [],
    meowCd: 0,
    ringPh: 0,
  };

  function cfg() {
    const C = (typeof BAL !== 'undefined' && BAL.cfg) ? BAL.cfg : null;
    return {
      count: Math.max(4, Math.round(C && C.chargeCount ? C.chargeCount : 16)),
      dur: C && C.chargeDur ? C.chargeDur : 4.5,
      dmg: C && C.chargeDmg ? C.chargeDmg : 35,
      rad: C && C.chargeRad ? C.chargeRad : 2.8,
      cooldown: C && C.chargeCd ? C.chargeCd : 18.0,
    };
  }

  function init() {
    if (typeof KIT === 'undefined' || typeof PartBatch === 'undefined') return;
    KIT.chargeCat = new PartBatch(B => {
      const fur = [1, 1, 1];
      const belly = [0.95, 0.92, 0.88];
      const eye = [1.0, 0.92, 0.35];
      const earIn = [0.96, 0.62, 0.72];
      // Corpo
      B.box(0.46, 0.36, 0.76, 0, 0.30, 0, fur, { l: L_CLOTH, rough: 0.85 });
      B.box(0.32, 0.16, 0.54, 0, 0.18, 0.04, belly, { l: L_CLOTH, rough: 0.9 });
      // Testa
      B.box(0.44, 0.38, 0.42, 0, 0.54, 0.36, fur, { l: L_CLOTH, rough: 0.85 });
      // Orecchie & Occhi luminosi
      for (const sd of [-1, 1]) {
        B.cone(0.11, 0.22, sd * 0.14, 0.82, 0.38, fur, { n: 4, l: L_CLOTH });
        B.box(0.06, 0.10, 0.04, sd * 0.14, 0.78, 0.43, earIn, { jit: 0 });
        B.box(0.08, 0.08, 0.04, sd * 0.11, 0.56, 0.57, eye, { jit: 0, emis: 0.75 });
        // Zampette
        B.box(0.11, 0.22, 0.13, sd * 0.16, 0.11, 0.26, belly, { l: L_CLOTH });
        B.box(0.11, 0.22, 0.13, sd * 0.16, 0.11, -0.26, fur, { l: L_CLOTH });
      }
      // Coda alzata da corsa
      B.box(0.10, 0.10, 0.50, 0, 0.52, -0.46, fur, { l: L_CLOTH, r: [0.55, 0, 0] });
    }, 40, { rad: 0.45 });
  }

  function screenToWorld(mx, my) {
    if (!G.B || !R.cam) return null;
    _o.set(mx / R.dw * 2 - 1, 1 - my / R.dh * 2, -1).unproject(R.cam);
    R.cam.getWorldDirection(_d);
    if (Math.abs(_d.y) < 1e-4) return null;
    let yEst = 0.5, x = 0, z = 0;
    for (let it = 0; it < 2; it++) {
      const t = (yEst - _o.y) / _d.y;
      x = _o.x + _d.x * t;
      z = _o.z + _d.z * t;
      yEst = G.B.heightAt(x, z);
    }
    const lim = (typeof BH !== 'undefined' ? BH : 18) - 1.2;
    return { x: clamp(x, -lim, lim), z: clamp(z, -lim, lim), y: G.B.heightAt(clamp(x, -lim, lim), clamp(z, -lim, lim)) };
  }

  function arm() {
    if (G.phase !== 'play') return false;
    if (S.state === 'ready') {
      S.state = 'armed';
      S.hasPreview = false;
      if (typeof UI !== 'undefined') UI.closeMenu();
      sfx('uiHover', CAM.x, CAM.z, 0.85);
      return true;
    }
    if (S.state === 'armed') {
      S.state = 'ready';
      S.hasPreview = false;
      sfx('uiClick', CAM.x, CAM.z, 0.5);
      return true;
    }
    return false;
  }

  function cancel() {
    if (S.state === 'armed') {
      S.state = 'ready';
      S.hasPreview = false;
    }
  }

  function moveTo(x, z) {
    const lim = (typeof BH !== 'undefined' ? BH : 18) - 1.2;
    const cx = clamp(x, -lim, lim), cz = clamp(z, -lim, lim);
    if (S.state === 'armed') {
      S.px = cx; S.pz = cz; S.hasPreview = true;
    } else if (S.state === 'active') {
      S.x = cx; S.z = cz;
    }
  }

  function trigger(x, z) {
    if (S.state !== 'armed' || G.phase !== 'play' || !G.B) return false;
    const C = cfg();
    const lim = (typeof BH !== 'undefined' ? BH : 18) - 1.2;
    S.x = clamp(x, -lim, lim);
    S.z = clamp(z, -lim, lim);
    S.state = 'active';
    S.timer = C.dur;
    S.hasPreview = false;
    if (G.paused) G.paused = false;

    const gy = G.B.heightAt(S.x, S.z);
    sfx('laserClick', S.x, S.z, 0.9);
    fxSparks(S.x, gy + 0.25, S.z, 10, 3.8, 3.2, 0.35, 0.5, { size: 0.06, grav: 4 });
    fxTimed(4, S.x, gy + 0.1, S.z, C.rad * 2.1, C.rad * 2.1, 3.0, 0.3, 0.45, 0.8, 0.35, { ground: true });
    lightFlash(S.x, gy + 0.9, S.z, 0xff2244, 420, 0.25, 10);

    // Genera l'orda di gatti dai 4 bordi della mappa
    const edgeDist = (typeof BH !== 'undefined' ? BH : 18) + 3.2;
    for (let i = 0; i < C.count; i++) {
      const edge = i % 4;
      const spread = rr(-edgeDist * 0.82, edgeDist * 0.82);
      let sx = 0, sz = 0;
      if (edge === 0) { sx = -edgeDist - rr(0, 5); sz = spread; }
      else if (edge === 1) { sx = edgeDist + rr(0, 5); sz = spread; }
      else if (edge === 2) { sx = spread; sz = -edgeDist - rr(0, 5); }
      else { sx = spread; sz = edgeDist + rr(0, 5); }

      S.cats.push({
        x: sx, z: sz,
        vx: 0, vz: 0,
        yaw: Math.atan2(S.x - sx, S.z - sz),
        spd: 12.8 + rr(0, 4.4),
        hopPh: rnd() * TAU,
        orbAng: (i / C.count) * TAU + rr(-0.3, 0.3),
        orbDir: rnd() < 0.5 ? 1 : -1,
        orbRad: 0.35 + rnd() * (C.rad * 0.78),
        tint: PALETTE[i % PALETTE.length],
        scale: rr(0.92, 1.12),
        leaving: false,
        exitX: sx * 1.18, exitZ: sz * 1.18,
        atkCd: 0,
      });
    }
    S.meowQueue = [0.02, 0.18, 0.36];
    S.meowCd = 0.42;
    return true;
  }

  function reset() {
    S.state = 'ready';
    S.timer = 0;
    S.cd = 0;
    S.hasPreview = false;
    S.cats.length = 0;
    S.meowQueue.length = 0;
    S.meowCd = 0;
  }

  function drawLaserFX(x, z, rad, alpha) {
    if (!G.B) return;
    const gy = G.B.heightAt(x, z);
    const pulse = 1 + 0.18 * Math.sin(S.ringPh * 10);
    // Puntino rosso centrale luminoso + alone
    FX.add.push(x, gy + 0.14, z, 0.75 * pulse, 0.75 * pulse, 0, 0, 3.6, 0.25, 0.35, 1.0 * alpha, 0, 0, 0, 0);
    FX.add.push(x, gy + 0.10, z, 2.2 * pulse, 2.2 * pulse, 0, 0, 2.6, 0.18, 0.30, 0.65 * alpha, 2, 0, 0, 0);
    // Anello d'area frenesia a terra
    FX.add.push(x, gy + 0.08, z, rad * 2.0, rad * 2.0, 0, 0, 2.8, 0.25, 0.40, 0.50 * alpha, 4, 0, 0.55, 1);
  }

  function drawCats() {
    if (!KIT.chargeCat || !G.B) return;
    const lim = (typeof BH !== 'undefined' ? BH : 18) + 2.5;
    for (let i = 0; i < S.cats.length; i++) {
      const c = S.cats[i];
      const gy = (Math.abs(c.x) < lim && Math.abs(c.z) < lim) ? G.B.heightAt(c.x, c.z) : 0;
      const hopY = Math.abs(Math.sin(c.hopPh)) * 0.46;
      _q.setFromAxisAngle(_upv, c.yaw);
      _m.compose(_v.set(c.x, gy + hopY, c.z), _q, _s.set(c.scale, c.scale, c.scale));
      KIT.chargeCat.put(_m, 0, c.tint);
    }
  }

  function update(dt) {
    S.ringPh += dt;
    const C = cfg();

    if (S.meowQueue.length) {
      for (let i = S.meowQueue.length - 1; i >= 0; i--) {
        S.meowQueue[i] -= dt;
        if (S.meowQueue[i] <= 0) {
          S.meowQueue.splice(i, 1);
          sfx('catMeow', S.x, S.z, 1.0, rnd());
        }
      }
    }
    if (S.state === 'active' && S.cats.length) {
      S.meowCd -= dt;
      if (S.meowCd <= 0) {
        // Sceglie un gatto casuale vicino al puntino (o il piu vicino se stai trascinando veloce)
        let pick = null, bestD = 1e9;
        const near = [];
        const nearR = C.rad + 5.5;
        for (let i = 0; i < S.cats.length; i++) {
          const c = S.cats[i];
          if (c.leaving) continue;
          const d = Math.hypot(c.x - S.x, c.z - S.z);
          if (d <= nearR) near.push(c);
          if (d < bestD) { bestD = d; pick = c; }
        }
        const src = near.length ? near[(rnd() * near.length) | 0] : pick;
        const mx = src ? src.x : S.x, mz = src ? src.z : S.z;
        sfx('catMeow', mx, mz, rr(0.95, 1.25), rnd());
        S.meowCd = rr(0.18, 0.36);
      }
    }

    if (S.state === 'armed' && S.hasPreview) {
      drawLaserFX(S.px, S.pz, C.rad, 0.65);
    }

    if (S.state === 'active') {
      S.timer -= dt;
      drawLaserFX(S.x, S.z, C.rad, 1.0);
      if (S.timer <= 0) {
        S.timer = 0;
        S.state = 'cooling';
        S.cd = C.cooldown;
        for (const c of S.cats) c.leaving = true;
      }
    } else if (S.state === 'cooling') {
      S.cd -= dt;
      if (S.cd <= 0) {
        S.cd = 0;
        S.state = 'ready';
      }
    }

    const exitLim = (typeof BH !== 'undefined' ? BH : 18) + 7.5;
    for (let i = S.cats.length - 1; i >= 0; i--) {
      const c = S.cats[i];
      if (c.atkCd > 0) c.atkCd -= dt;
      let tx, tz;
      if (c.leaving) {
        tx = c.exitX; tz = c.exitZ;
      } else {
        c.orbAng += c.orbDir * dt * 5.2;
        tx = S.x + Math.cos(c.orbAng) * c.orbRad;
        tz = S.z + Math.sin(c.orbAng) * c.orbRad;
      }
      const dx = tx - c.x, dz = tz - c.z, dist = Math.hypot(dx, dz) || 0.001;
      const dvx = (dx / dist) * c.spd, dvz = (dz / dist) * c.spd;
      const steer = c.leaving ? 6.0 : 10.5;
      const k = Math.min(1, dt * steer);
      c.vx += (dvx - c.vx) * k;
      c.vz += (dvz - c.vz) * k;
      c.x += c.vx * dt;
      c.z += c.vz * dt;
      if (Math.hypot(c.vx, c.vz) > 0.2) c.yaw = Math.atan2(c.vx, c.vz);
      c.hopPh += dt * 19;

      // Danno ai mostri a terra travolti dall'orda
      if (!c.leaving && c.atkCd <= 0 && G.phase === 'play') {
        for (let j = G.mons.length - 1; j >= 0; j--) {
          const m = G.mons[j];
          if (m.dead || m.hp <= 0 || m.fly || !m.vis) continue;
          const md = Math.hypot(m.x - c.x, m.z - c.z);
          if (md < m.rad + 0.68) {
            c.atkCd = 0.28;
            const lx = (m.x - c.x) / (md || 1), lz = (m.z - c.z) / (md || 1);
            const hy = m.y + m.hitH;
            FX.segs.push(
              m.x - lz * 0.22, hy + 0.18, m.z + lx * 0.22, 0.04,
              m.x + lz * 0.22, hy - 0.18, m.z - lx * 0.22, 0.012,
              2.2, 1.4, 0.9, 0.9
            );
            fxSparks(m.x, hy, m.z, 4, 3.0, 2.2, 1.6, 0.8, { size: 0.045, grav: 5 });
            if (rnd() < 0.35) sfx('catClaw', m.x, m.z, 0.55, rnd());
            hitMonster(m, C.dmg, 'claw', lx, lz, null);
            break;
          }
        }
      }

      if (c.leaving && (Math.abs(c.x) > exitLim || Math.abs(c.z) > exitLim)) {
        swapRemove(S.cats, i);
      }
    }

    drawCats();
  }

  function drawPaused(rdt) {
    S.ringPh += rdt;
    const C = cfg();
    if (S.state === 'armed' && S.hasPreview) drawLaserFX(S.px, S.pz, C.rad, 0.65);
    else if (S.state === 'active') drawLaserFX(S.x, S.z, C.rad, 1.0);
    drawCats();
  }

  return Object.assign(S, { init, arm, cancel, moveTo, trigger, reset, update, drawPaused, screenToWorld, cfg });
})();
