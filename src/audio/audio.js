'use strict';

const AU = (function () {
  const DEFAULTS = {
    master: 0.50,
    music: 0.52,
    labDetails: 0.65,
    labHum: 0.55,
    tensionBase: 0.25,
    wind: 0.00,
    sfx: 1.00,
    claw: 0.85,
    fire: 0.85,
    volcano: 0.58,
    laser: 0.82,
    hybrid: 0.80,
    mut: 0.85,
    monster: 0.85,
  };
  const STORAGE_KEY = 'purrcraft.audioCfg';
  const cfg = Object.assign({}, DEFAULTS);
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      for (const k in DEFAULTS) if (typeof saved[k] === 'number' && isFinite(saved[k])) cfg[k] = Math.max(0, Math.min(1.5, saved[k]));
    }
  } catch (e) {}

  const api = {
    ready: false, muted: false, cfg: cfg,
    unlock: unlock, setMuted: setMuted, setPaused: setPaused,
    play: play, setAmbience: setAmbience, update: update,
    setCfg: setCfg, resetCfg: resetCfg, toggleDebug: toggleDebug
  };

  let ctx = null, sr = 44100;
  let nMaster = null, nMute = null, nSfx = null, nAmb = null, nMusic = null, nRevIn = null;
  let bufWhite = null, bufPink = null, bufBrown = null;
  let V = null;
  const shapeCurves = {};
  const ends = [];
  const last = {};
  let lastVolcanoBoomT = -9;
  const tgt = { fire: 0, wind: 0, tension: 0 }, cur = { labD: 0, labH: 0, wind: 0, tension: 0 };
  const bed = { windG: null, gustG: null, windLP: [], whG: null, whF: null, labG: null, labF: null, popBus: null, droneG: null, droneLP: null, timer: 0, popAcc: 0 };
  const mus = { nextChord: 0, chord: 0, lastNote: -1, timpAt: 0, timpN: 0 };

  const rnd = Math.random;
  const rr = (a, b) => a + (b - a) * rnd();
  const cl = (x, a, b) => (x < a ? a : x > b ? b : x);
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function saveCfg() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch (e) {}
  }
  function applyMixerImmediate() {
    if (!ctx) return;
    const now = ctx.currentTime;
    if (nMaster) nMaster.gain.setTargetAtTime(cfg.master, now, 0.06);
    if (nSfx) nSfx.gain.setTargetAtTime(cfg.sfx, now, 0.06);
    if (nMusic) nMusic.gain.setTargetAtTime(cfg.music, now, 0.08);
  }
  function setCfg(key, val) {
    if (!(key in DEFAULTS)) return;
    cfg[key] = cl(+val || 0, 0, 1.5);
    applyMixerImmediate();
    saveCfg();
  }
  function resetCfg() {
    Object.assign(cfg, DEFAULTS);
    applyMixerImmediate();
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function gn(dest, v) { const g = ctx.createGain(); g.gain.value = v === undefined ? 0 : v; if (dest) g.connect(dest); return g; }
  function flt(dest, type, f, q) { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q !== undefined) b.Q.value = q; if (dest) b.connect(dest); return b; }
  function panNode(pan, dest) {
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = cl(pan, -1, 1); if (dest) p.connect(dest); return p; }
    return gn(dest, 1);
  }
  function shape(dest, drive) {
    const ws = ctx.createWaveShaper();
    let c = shapeCurves[drive];
    if (!c) { c = new Float32Array(1024); const n = Math.tanh(drive); for (let i = 0; i < 1024; i++) c[i] = Math.tanh(drive * (i / 511.5 - 1)) / n; shapeCurves[drive] = c; }
    ws.curve = c; ws.oversample = '2x'; if (dest) ws.connect(dest); return ws;
  }
  function keep(src, e) { if (V && e > V.lastT) { V.last = src; V.lastT = e; } }
  function osc(type, f, t, dur, dest) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; if (dest) o.connect(dest);
    const e = t + dur + 0.03; o.start(t); o.stop(e); keep(o, e); return o;
  }
  function noi(t, dur, dest, buf, rate) {
    const s = ctx.createBufferSource(); s.buffer = buf || bufWhite; s.loop = true; if (rate) s.playbackRate.value = rate; if (dest) s.connect(dest);
    const e = t + dur + 0.03; s.start(t, rnd() * (s.buffer.duration - 0.1)); s.stop(e); keep(s, e); return s;
  }
  function loopSrc(buf, dest, rate) {
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; if (rate) s.playbackRate.value = rate; s.connect(dest);
    s.start(ctx.currentTime, rnd() * (buf.duration - 0.1)); return s;
  }
  function loopOsc(type, f, dest) { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; if (dest) o.connect(dest); o.start(); return o; }

  function ad(param, t, peak, a, d) { param.setValueAtTime(0.0001, t); param.linearRampToValueAtTime(Math.max(0.0002, peak), t + a); param.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function sw(param, t, f0, f1, dur) { param.setValueAtTime(Math.max(1, f0), t); param.exponentialRampToValueAtTime(Math.max(1, f1), t + dur); }

  function grains(dest, t, n, span, peak, dMin, dMax, f0, f1, q, shp) {
    const g = gn(dest, 0), f = flt(g, 'bandpass', (f0 + f1) * 0.5, q || 4);
    const ts = [];
    for (let i = 0; i < n; i++) { let u = rnd(); if (shp === 1) u = u * u; else if (shp === 2) u = 1 - u * u; ts.push(u * span); }
    ts.sort((a, b) => a - b);
    let end = t + 0.01;
    g.gain.setValueAtTime(0, t);
    for (let i = 0; i < n; i++) {
      const ti = t + ts[i], room = i < n - 1 ? ts[i + 1] - ts[i] - 0.004 : 9;
      if (room < 0.004) continue;
      const d = Math.min(rr(dMin, dMax), room), a = peak * rr(0.35, 1) * (shp === 1 ? 1 - 0.6 * ts[i] / span : 1);
      f.frequency.setValueAtTime(rr(f0, f1), ti);
      g.gain.setValueAtTime(0.0001, ti);
      g.gain.linearRampToValueAtTime(Math.max(0.0002, a), ti + 0.0015);
      g.gain.exponentialRampToValueAtTime(0.0001, ti + 0.0015 + d);
      end = ti + 0.0015 + d;
    }
    noi(t, end - t + 0.02, f);
    return end;
  }

  function voice(pan, gain, send, bus) {
    const out = gn(null, gain);
    const tail = panNode(pan, bus || nSfx); out.connect(tail);
    let wet = null;
    if (send > 0) { wet = gn(nRevIn, send); tail.connect(wet); }
    return { out: out, tail: tail, wet: wet, last: null, lastT: 0 };
  }
  function finishVoice(v) {
    const done = () => { try { v.out.disconnect(); v.tail.disconnect(); if (v.wet) v.wet.disconnect(); } catch (e) {} };
    if (v.last) v.last.onended = done; else done();
    if (V === v) V = null;
  }

  function makeBuffers() {
    const mk = (secs, fill) => {
      const len = (sr * secs) | 0, fade = (sr * 0.06) | 0, x = new Float32Array(len + fade);
      fill(x);
      let pk = 0; for (let i = 0; i < x.length; i++) pk = Math.max(pk, Math.abs(x[i]));
      const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0), k = 1 / (pk || 1);
      for (let i = 0; i < len; i++) d[i] = x[i] * k;
      for (let i = 0; i < fade; i++) { const u = i / fade; d[i] = (x[i] * u + x[len + i] * (1 - u)) * k; }
      return b;
    };
    bufWhite = mk(2, (x) => { for (let i = 0; i < x.length; i++) x[i] = rnd() * 2 - 1; });
    bufPink = mk(5, (x) => {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < x.length; i++) {
        const w = rnd() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        x[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362; b6 = w * 0.115926;
      }
    });
    bufBrown = mk(5, (x) => { let b = 0; for (let i = 0; i < x.length; i++) { b = (b + 0.02 * (rnd() * 2 - 1)) / 1.02; x[i] = b; } });
  }
  function makeImpulse() {
    const len = (sr * 2.9) | 0, b = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let lp = 0;
      const e1 = 0.17 + ch * 0.021, e2 = 0.31 - ch * 0.027;
      for (let i = 0; i < len; i++) {
        const t = i / sr, w = rnd() * 2 - 1;
        const a = cl(0.2 + t * 0.42, 0, 0.94);
        lp += (w - lp) * (1 - a);
        let env = Math.exp(-t * 2.5) * (t < 0.022 ? t / 0.022 : 1);
        if (t > e1 && t < e1 + 0.02) env += 0.5 * Math.exp(-(t - e1) * 160);
        if (t > e2 && t < e2 + 0.025) env += 0.32 * Math.exp(-(t - e2) * 130);
        d[i] = lp * env * (1 + a * 2.2);
      }
    }
    return b;
  }

  function ding(d, t, f, peak) {
    const g = gn(d); osc('sine', f, t, 0.3, g); ad(g.gain, t, peak, 0.002, 0.2);
    const g2 = gn(d); osc('sine', f * 2.42, t, 0.15, g2); ad(g2.gain, t, peak * 0.3, 0.001, 0.06);
  }
  function whoomp(d, t, peak, len) {
    const w = gn(d), wf = flt(w, 'lowpass', 300, 1.2); noi(t, len + 0.2, wf);
    wf.frequency.setValueAtTime(180, t); wf.frequency.exponentialRampToValueAtTime(1100, t + len * 0.25); wf.frequency.exponentialRampToValueAtTime(320, t + len);
    ad(w.gain, t, peak, len * 0.18, len * 0.9);
    const g = gn(d), o = osc('sine', 70, t, len * 0.7, g); sw(o.frequency, t, 62, 115, len * 0.5); ad(g.gain, t, peak * 0.6, len * 0.15, len * 0.5);
  }
  function hornNote(d, t, f, dur, peak, bright) {
    const env = gn(d), body = flt(env, 'peaking', 480, 1.0); body.gain.value = 5;
    const lp = flt(body, 'lowpass', 300, 0.8), cents = [-8, 0, 7], oscs = [], vib = gn(null, 0);
    for (let i = 0; i < 3; i++) { const o = osc('sawtooth', f, t, dur + 0.6, gn(lp, 0.33)); o.detune.value = cents[i]; vib.connect(o.detune); oscs.push([o, f]); }
    const sub = osc('triangle', f / 2, t, dur + 0.6, gn(lp, 0.25)); vib.connect(sub.detune); oscs.push([sub, f / 2]);
    osc('sine', 5.3, t, dur + 0.6, vib); vib.gain.setValueAtTime(0, t + dur * 0.35); vib.gain.linearRampToValueAtTime(9, t + dur * 0.8);
    const a = Math.min(0.28, dur * 0.25);
    env.gain.setValueAtTime(0.0001, t); env.gain.linearRampToValueAtTime(peak * 0.6, t + a); env.gain.linearRampToValueAtTime(peak, t + dur * 0.75); env.gain.setTargetAtTime(0.0001, t + dur, 0.11);
    lp.frequency.setValueAtTime(260, t); lp.frequency.linearRampToValueAtTime(900 * bright, t + a); lp.frequency.linearRampToValueAtTime(1700 * bright, t + dur * 0.75); lp.frequency.setTargetAtTime(350, t + dur, 0.14);
    const n = gn(env, 0.03), nf = flt(n, 'bandpass', 1300, 1); noi(t, dur + 0.5, nf);
    return oscs;
  }

  const S = {};
  // --- NUOVI SUONI GATTI PURR-CRAFT (Progressione DNA Lv 1 -> 4) ---
  const pToLvl = p => cl(Math.round(p * 3) + 1, 1, 4);

  S.catClaw = (d, t) => {
    const k = rr(0.92, 1.12);
    const w = gn(d), wf = flt(w, 'bandpass', 2500 * k, 1.8); noi(t, 0.09, wf);
    sw(wf.frequency, t, 1400 * k, 4600 * k, 0.06); ad(w.gain, t, 0.44, 0.004, 0.065);
    const g = gn(d), o = osc('triangle', 460 * k, t + 0.015, 0.08, g);
    sw(o.frequency, t + 0.015, 600 * k, 135 * k, 0.055); ad(g.gain, t + 0.015, 0.48, 0.002, 0.055);
  };

  S.laserClick = (d, t) => {
    const g = gn(d), o = osc('sine', 1400, t, 0.09, g);
    sw(o.frequency, t, 1400, 2650, 0.06);
    ad(g.gain, t, 0.34, 0.003, 0.08);
  };

  S.catMeow = (d, t, p) => {
    const base = (510 + (p || 0.5) * 210) * rr(0.94, 1.06);
    const g = gn(d), f = flt(g, 'bandpass', 1350, 3.0);
    const o = osc('sawtooth', base * 0.85, t, 0.27, f);
    o.frequency.setValueAtTime(base * 0.85, t);
    o.frequency.exponentialRampToValueAtTime(base * 1.28, t + 0.08);
    o.frequency.exponentialRampToValueAtTime(base * 0.72, t + 0.25);
    ad(g.gain, t, 0.26, 0.025, 0.24);
  };

  S.catFire = (d, t, p) => {
    const lvl = pToLvl(p);
    const pitchMul = [0, 1.22, 1.04, 0.88, 0.74][lvl] * rr(0.96, 1.04);
    const durL = [0, 0.14, 0.16, 0.17, 0.16][lvl];
    const lPeak = [0, 0.44, 0.48, 0.46, 0.36][lvl];
    const w = gn(d), wf = flt(w, 'bandpass', 850 * pitchMul, 1.1); noi(t, durL, wf, bufPink);
    sw(wf.frequency, t, 1500 * pitchMul, 300 * pitchMul, durL * 0.85);
    ad(w.gain, t, lPeak, 0.005, durL * 0.85);

    const g = gn(d), o = osc('sine', 210 * pitchMul, t, durL, g);
    sw(o.frequency, t, 260 * pitchMul, 68 * pitchMul, durL * 0.75);
    ad(g.gain, t, lPeak * 0.88, 0.003, durL * 0.8);

    if (lvl >= 3) {
      const w2 = gn(d), wf2 = flt(w2, 'bandpass', 620, 1.3); noi(t + 0.035, 0.13, wf2, bufPink);
      sw(wf2.frequency, t + 0.035, 1100, 260, 0.11);
      ad(w2.gain, t + 0.035, lvl >= 4 ? 0.20 : 0.28, 0.005, 0.11);
    }
  };

  S.catBoom = (d, t, p) => {
    const lvl = pToLvl(p);
    const dtPrev = t - lastVolcanoBoomT;
    if (lvl >= 4) lastVolcanoBoomT = t;
    // Anti-accumulo in raffica sul Lv 4 Vulcano
    const rafDuck = (lvl >= 4 && dtPrev < 0.38) ? 0.68 : 1.0;

    const drive  = [0, 1.1, 1.35, 1.55, 1.65][lvl];
    const sh = shape(d, drive);
    const expDur = [0, 0.22, 0.29, 0.35, 0.38][lvl];
    const baseF  = [0, 135, 105, 82, 62][lvl] * rr(0.95, 1.05);
    const ePeak  = [0, 0.52, 0.58, 0.62, 0.48][lvl] * rafDuck;

    const eg = gn(sh), eo = osc('sine', baseF, t, expDur, eg);
    sw(eo.frequency, t, baseF * 1.32, 28, expDur * 0.75);
    ad(eg.gain, t, ePeak, 0.003, expDur * 0.82);

    const bn = gn(sh), bf = flt(bn, 'lowpass', 1750 + lvl * 320, 0.8);
    noi(t, expDur * 0.85, bf);
    sw(bf.frequency, t, 2100 + lvl * 300, 160, expDur * 0.68);
    ad(bn.gain, t, ePeak * 0.74, 0.002, expDur * 0.75);

    if (lvl >= 2) {
      const subPeak = [0, 0, 0.20, 0.26, 0.24][lvl] * rafDuck;
      const rg = gn(d), rf = flt(rg, 'lowpass', 155);
      noi(t + 0.02, expDur * 0.95, rf, bufBrown);
      ad(rg.gain, t + 0.02, subPeak, 0.04, expDur * 0.8);
    }
    if (lvl >= 4) {
      grains(d, t + 0.05, 8, 0.28, 0.11 * rafDuck, 0.008, 0.025, 900, 2800, 4, 1);
    }
  };

  S.catLaser = (d, t, p) => {
    const lvl = pToLvl(p);
    const lp = flt(d, 'lowpass', 6200 + lvl * 600);
    const dur = [0, 0.085, 0.11, 0.14, 0.18][lvl];
    const fStart = [0, 2350, 2150, 1950, 1750][lvl] * rr(0.97, 1.03);
    const fEnd   = [0, 680,  480,  320,  190][lvl];

    const g1 = gn(lp), o1 = osc(lvl >= 3 ? 'sawtooth' : 'triangle', fStart, t, dur, g1);
    sw(o1.frequency, t, fStart, fEnd, dur * 0.9);
    ad(g1.gain, t, 0.36 + lvl * 0.05, 0.002, dur * 0.9);

    if (lvl >= 2) {
      const g2 = gn(lp), o2 = osc('sine', fStart * 1.5, t, dur * 0.85, g2);
      sw(o2.frequency, t, fStart * 1.5, fEnd * 1.5, dur * 0.8);
      ad(g2.gain, t, 0.14 + lvl * 0.04, 0.001, dur * 0.78);
    }
    if (lvl >= 3) {
      const sp = gn(lp), sf = flt(sp, 'bandpass', 4200, 3.5);
      noi(t, 0.055, sf);
      ad(sp.gain, t, 0.16 + (lvl - 3) * 0.12, 0.001, 0.045);
    }
    if (lvl >= 4) {
      const sh = shape(d, 1.6);
      const sg = gn(sh), so = osc('sine', 145, t, 0.19, sg);
      sw(so.frequency, t, 175, 48, 0.15);
      ad(sg.gain, t, 0.52, 0.002, 0.16);
    }
  };

  S.catPlasma = (d, t) => {
    const sh = shape(d, 2.1);
    const g = gn(sh), o = osc('sawtooth', 1050, t, 0.3, flt(g, 'lowpass', 2600, 2.2));
    sw(o.frequency, t, 1450, 120, 0.25); ad(g.gain, t, 0.56, 0.004, 0.26);
    const sub = gn(sh), o2 = osc('sine', 165, t, 0.35, sub);
    sw(o2.frequency, t, 190, 42, 0.25); ad(sub.gain, t, 0.76, 0.003, 0.3);
    grains(d, t + 0.02, 9, 0.22, 0.24, 0.005, 0.02, 2200, 5600, 4, 1);
  };

  S.catMagma = (d, t) => {
    S.catBoom(d, t, 0.67);
    const sp = gn(d), sf = flt(sp, 'bandpass', 3200, 3); noi(t, 0.14, sf); ad(sp.gain, t, 0.42, 0.002, 0.12);
  };

  S.catPyro = (d, t) => {
    S.catLaser(d, t, 0.67);
    const w = gn(d), wf = flt(w, 'bandpass', 1100, 1.5); noi(t + 0.02, 0.16, wf);
    sw(wf.frequency, t + 0.02, 1600, 450, 0.14); ad(w.gain, t + 0.02, 0.34, 0.004, 0.14);
  };

  S.catMut = (d, t, p) => {
    const lvl = pToLvl(p);
    const notes = [0, 523.25, 659.25, 783.99, 1046.5];
    const f = notes[lvl];
    const g = gn(d), o = osc('triangle', f * 0.5, t, 0.24, g);
    sw(o.frequency, t, f * 0.5, f, 0.14); ad(g.gain, t, 0.35, 0.01, 0.2);
    const g2 = gn(d); osc('sine', f, t + 0.08, 0.26, g2); ad(g2.gain, t + 0.08, 0.28 + lvl * 0.04, 0.003, 0.22);
    if (lvl === 4) {
      const g3 = gn(d); osc('sine', f * 1.5, t + 0.12, 0.32, g3); ad(g3.gain, t + 0.12, 0.24, 0.004, 0.28);
    }
  };

  // --- EFFETTI ORIGINALI (Mostri, Eventi, UI) ---
  S.bow = (d, t) => {
    const k = rr(0.92, 1.1);
    const g = gn(d), bp = flt(g, 'bandpass', 900 * k, 1.1);
    const o = osc('triangle', 210 * k, t, 0.2, bp); sw(o.frequency, t, 230 * k, 118 * k, 0.11);
    const o2 = osc('sawtooth', 425 * k, t, 0.12, gn(bp, 0.25)); sw(o2.frequency, t, 470 * k, 240 * k, 0.08);
    ad(g.gain, t, 0.9, 0.002, 0.14);
  };
  S.arrowHit = (d, t) => {
    const k = rr(0.85, 1.2);
    const g = gn(d), o = osc('sine', 170 * k, t, 0.12, g); sw(o.frequency, t, 190 * k, 70 * k, 0.07); ad(g.gain, t, 0.55, 0.002, 0.08);
    const n = gn(d), nf = flt(n, 'bandpass', 520 * k, 5); noi(t, 0.08, nf); ad(n.gain, t, 0.5, 0.001, 0.05);
  };
  S.cannon = (d, t, p) => {
    const k = rr(0.9, 1.08) * (1 - 0.18 * p), sh = shape(d, 2.2);
    const g = gn(sh), o = osc('sine', 120 * k, t, 0.9, g); sw(o.frequency, t, 125 * k, 33 * k, 0.4); ad(g.gain, t, 1.0, 0.003, 0.7);
    const b = gn(sh), bf = flt(b, 'lowpass', 1200, 0.7); noi(t, 0.7, bf); sw(bf.frequency, t, 1600, 140, 0.45); ad(b.gain, t, 0.7, 0.002, 0.5);
  };
  S.explode = (d, t, p) => {
    const k = rr(0.88, 1.12) * (1 - 0.25 * p), L = 1 + 0.4 * p, sh = shape(d, 1.7);
    const g = gn(sh), o = osc('sine', 90 * k, t, 0.55 * L, g); sw(o.frequency, t, 95 * k, 30 * k, 0.3 * L); ad(g.gain, t, 0.85, 0.003, 0.42 * L);
    const b = gn(sh), bf = flt(b, 'lowpass', 2500, 0.8); noi(t, 0.6 * L, bf); sw(bf.frequency, t, 2800, 180, 0.38 * L); ad(b.gain, t, 0.68, 0.002, 0.42 * L);
    const r = gn(d), rf = flt(r, 'lowpass', 180); noi(t + 0.05, 0.9 * L, rf, bufBrown); ad(r.gain, t + 0.05, 0.35, 0.08, 0.75 * L);
  };
  S.charge = (d, t) => {
    const k = rr(0.94, 1.06), D = 0.55, lp = flt(d, 'lowpass', 3200), g = gn(lp);
    const o = osc('sine', 380 * k, t, D, g); sw(o.frequency, t, 380 * k, 1500 * k, D);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.11, t + D * 0.85); g.gain.exponentialRampToValueAtTime(0.0001, t + D);
  };
  S.zap = (d, t, p) => {
    const k = rr(0.9, 1.1), lp = flt(d, 'lowpass', 7500);
    const c = gn(lp), cf = flt(c, 'highpass', 1700); noi(t, 0.1, cf); ad(c.gain, t, 0.8, 0.0005, 0.045);
    const z = gn(lp, 0), zf = flt(z, 'bandpass', 2100 * k, 2.2), zo = osc('sawtooth', 96 * k, t, 0.24, zf); sw(zo.frequency, t, 130 * k, 70 * k, 0.2);
    z.gain.setValueAtTime(0, t);
    for (let i = 0; i < 9; i++) z.gain.setValueAtTime(rnd() < 0.7 ? rr(0.15, 0.4) : 0.02, t + 0.002 + i * 0.022);
    z.gain.linearRampToValueAtTime(0, t + 0.23);
    const r = gn(d), rf = flt(r, 'lowpass', 170); noi(t, 1.0, rf, bufBrown); ad(r.gain, t + 0.01, 0.55 + 0.25 * p, 0.03, 0.8);
  };
  S.clash = (d, t) => {
    const f0 = rr(1500, 2300), lp = flt(d, 'lowpass', 7000);
    const R = [1, 1.48, 2.08, 2.57], A = [0.3, 0.22, 0.2, 0.13];
    for (let i = 0; i < 4; i++) { const g = gn(lp); osc(i % 2 ? 'sine' : 'triangle', f0 * R[i], t, 0.35, g); ad(g.gain, t, A[i], 0.001, 0.24 / (1 + i * 0.4)); }
  };
  S.slash = (d, t) => {
    const k = rr(0.85, 1.2), t1 = t + 0.03;
    const c = gn(d), cf = flt(c, 'bandpass', 800 * k, 1.4); noi(t1, 0.14, cf); sw(cf.frequency, t1, 900 * k, 280 * k, 0.08); ad(c.gain, t1, 0.7, 0.002, 0.08);
  };
  S.ratSqueal = (d, t) => {
    const k = rr(0.85, 1.2), lp = flt(d, 'lowpass', 4800), bp = flt(lp, 'bandpass', 2700 * k, 2.5);
    const g = gn(bp), o = osc('sawtooth', 2100 * k, t, 0.16, g);
    o.frequency.setValueAtTime(2000 * k, t); o.frequency.exponentialRampToValueAtTime(3100 * k, t + 0.04); o.frequency.exponentialRampToValueAtTime(1700 * k, t + 0.13);
    ad(g.gain, t, 0.16, 0.008, 0.11);
  };
  S.boneRattle = (d, t) => {
    grains(d, t, 8, 0.38, 0.5, 0.012, 0.04, 600, 1900, 11, 1);
    const g = gn(d), o = osc('sine', 210, t, 0.08, g); sw(o.frequency, t, 230, 130, 0.05); ad(g.gain, t, 0.3, 0.002, 0.05);
  };
  S.squelch = (d, t, p) => {
    const k = rr(0.8, 1.2) * (1 - 0.3 * p);
    const g = gn(d), f = flt(g, 'lowpass', 500, 7); noi(t, 0.35, f);
    f.frequency.setValueAtTime(320 * k, t); f.frequency.exponentialRampToValueAtTime(1500 * k, t + 0.07); f.frequency.exponentialRampToValueAtTime(260 * k, t + 0.26);
    ad(g.gain, t, 0.5, 0.008, 0.26);
    const b = gn(d), o = osc('sine', 170 * k, t, 0.3, b);
    o.frequency.setValueAtTime(190 * k, t); o.frequency.exponentialRampToValueAtTime(85 * k, t + 0.09); o.frequency.exponentialRampToValueAtTime(230 * k, t + 0.2);
    ad(b.gain, t, 0.4, 0.005, 0.2);
  };
  S.batScreech = (d, t) => {
    const k = rr(0.88, 1.15), lp = flt(d, 'lowpass', 5200), bp = flt(lp, 'bandpass', 3300 * k, 3.5);
    for (let i = 0; i < 2; i++) {
      const ti = t + i * rr(0.06, 0.085), g = gn(bp), o = osc('square', 3600 * k, ti, 0.07, g);
      sw(o.frequency, ti, 3900 * k, 2500 * k, 0.055); ad(g.gain, ti, 0.07, 0.004, 0.05);
    }
  };
  S.roar = (d, t, p) => {
    const k = rr(0.92, 1.06) * (1 - 0.15 * p), D = 1.25;
    const env = gn(d), am = gn(env, 0.65);
    osc('sawtooth', rr(22, 28), t, D + 0.3, gn(am.gain, 0.35));
    const f1 = flt(am, 'bandpass', 380, 4), f2 = flt(gn(am, 0.4), 'bandpass', 1050, 6), f3 = flt(gn(am, 0.9), 'lowpass', 170);
    const pre = shape(f1, 3); pre.connect(f2); pre.connect(f3);
    const src = gn(pre, 0.5), base = [80 * k, 81.3 * k, 40 * k];
    const os = [osc('sawtooth', base[0], t, D + 0.2, src), osc('sawtooth', base[1], t, D + 0.2, src), osc('square', base[2], t, D + 0.2, gn(src, 0.5))];
    for (let i = 0; i < 3; i++) {
      const b = base[i], fr = os[i].frequency;
      fr.setValueAtTime(b * 0.85, t); fr.linearRampToValueAtTime(b * 1.3, t + 0.3); fr.linearRampToValueAtTime(b * 1.1, t + 0.7); fr.linearRampToValueAtTime(b * 0.65, t + D);
    }
    env.gain.setValueAtTime(0.0001, t); env.gain.linearRampToValueAtTime(0.85, t + 0.12); env.gain.linearRampToValueAtTime(0.7, t + 0.7); env.gain.exponentialRampToValueAtTime(0.0001, t + D + 0.15);
  };
  S.bossStep = (d, t, p) => {
    const k = rr(0.9, 1.1) * (1 - 0.2 * p), sh = shape(d, 1.6);
    const g = gn(sh), o = osc('sine', 60 * k, t, 0.5, g); sw(o.frequency, t, 66 * k, 29 * k, 0.26); ad(g.gain, t, 1.0, 0.004, 0.36);
    const n = gn(sh), nf = flt(n, 'lowpass', 150); noi(t, 0.4, nf, bufBrown); ad(n.gain, t, 0.9, 0.004, 0.25);
  };
  S.bossDie = (d, t) => {
    const D = 1.5, k = rr(0.95, 1.05);
    const env = gn(d), am = gn(env, 0.7); osc('sawtooth', 19, t, D + 0.3, gn(am.gain, 0.3));
    const f1 = flt(am, 'bandpass', 420, 4), f3 = flt(gn(am, 0.8), 'lowpass', 170);
    const pre = shape(f1, 2.5); pre.connect(f3);
    const src = gn(pre, 0.5), a = osc('sawtooth', 92 * k, t, D + 0.2, src), b = osc('sawtooth', 93.5 * k, t, D + 0.2, src);
    sw(a.frequency, t, 100 * k, 36 * k, D); sw(b.frequency, t, 101.6 * k, 37 * k, D);
    env.gain.setValueAtTime(0.0001, t); env.gain.linearRampToValueAtTime(0.8, t + 0.1); env.gain.exponentialRampToValueAtTime(0.0001, t + D + 0.2);
    const tc = t + 1.15, sh = shape(d, 2);
    const g = gn(sh), o = osc('sine', 75, tc, 0.9, g); sw(o.frequency, tc, 80, 24, 0.5); ad(g.gain, tc, 1.0, 0.004, 0.7);
    grains(d, tc + 0.1, 16, 1.1, 0.28, 0.02, 0.07, 300, 1800, 5, 1);
  };
  S.coin = (d, t, p) => {
    const f = 1560 * Math.pow(2, (p * 5 + rr(-0.4, 0.4)) / 12), lp = flt(d, 'lowpass', 6500);
    const g = gn(lp); osc('sine', f, t, 0.15, g); ad(g.gain, t, 0.2, 0.002, 0.09);
    ding(lp, t + 0.055, f * 1.498, 0.2);
  };
  S.hammer = (d, t, p) => {
    const k = rr(0.82, 1.22) * (1 + 0.3 * (p - 0.5));
    const n = gn(d), nf = flt(n, 'bandpass', 760 * k, 9); noi(t, 0.07, nf); ad(n.gain, t, 1.0, 0.001, 0.035);
    const g = gn(d), o = osc('sine', 200 * k, t, 0.08, g); sw(o.frequency, t, 215 * k, 140 * k, 0.05); ad(g.gain, t, 0.45, 0.001, 0.05);
  };
  S.buildDone = (d, t) => {
    const g = gn(d), o = osc('sine', 125, t, 0.25, g); sw(o.frequency, t, 130, 58, 0.14); ad(g.gain, t, 0.8, 0.003, 0.18);
    whoomp(d, t + 0.1, 0.5, 0.5);
  };
  S.sell = (d, t) => {
    grains(d, t, 9, 0.42, 0.7, 0.03, 0.07, 280, 900, 6, 1);
    const lp = flt(d, 'lowpass', 6500);
    for (let i = 0; i < 3; i++) ding(lp, t + 0.26 + i * 0.085, 1500 * Math.pow(2, (i * 2) / 12), 0.16);
  };
  S.horn = (d, t) => {
    const f = 146.83 * rr(0.985, 1.015);
    const os = hornNote(d, t, f, 1.5, 0.5, 1);
    for (let i = 0; i < os.length; i++) { const fr = os[i][0].frequency, b = os[i][1]; fr.setValueAtTime(b, t + 0.52); fr.exponentialRampToValueAtTime(b * 1.4983, t + 0.6); }
  };
  S.hornBoss = (d, t) => {
    const f = 73.42 * rr(0.99, 1.01);
    hornNote(d, t, f, 1.25, 0.55, 0.8);
    hornNote(d, t + 1.45, f * 0.7937, 1.9, 0.6, 0.85);
  };
  S.leak = (d, t) => {
    const f = 196 * rr(0.97, 1.03), lp = flt(d, 'lowpass', 1900);
    const R = [0.5, 1, 1.19, 1.56, 2], A = [0.35, 0.5, 0.3, 0.2, 0.14], D = [1.3, 1.1, 0.8, 0.6, 0.45];
    for (let i = 0; i < 5; i++) { const g = gn(lp); osc('sine', f * R[i], t, D[i] + 0.1, g); ad(g.gain, t, A[i] * 0.6, 0.006, D[i]); }
  };
  S.footmanDie = (d, t) => {
    const k = rr(0.9, 1.1);
    const g = gn(d), o = osc('sine', 115 * k, t, 0.25, g); sw(o.frequency, t, 120 * k, 50 * k, 0.14); ad(g.gain, t, 0.75, 0.003, 0.17);
  };
  S.uiHover = (d, t) => {
    const g = gn(d); osc('sine', rr(1250, 1400), t, 0.05, g); ad(g.gain, t, 0.07, 0.002, 0.03);
  };
  S.uiClick = (d, t) => {
    const g = gn(d), o = osc('triangle', 900, t, 0.09, g); sw(o.frequency, t, 880, 1320, 0.035); ad(g.gain, t, 0.18, 0.002, 0.06);
    const w = gn(d); osc('sine', 300, t, 0.06, w); ad(w.gain, t, 0.15, 0.001, 0.035);
  };
  S.uiDeny = (d, t) => {
    const lp = flt(d, 'lowpass', 700);
    for (let i = 0; i < 2; i++) {
      const ti = t + i * 0.11, g = gn(lp); osc('triangle', i ? 128 : 158, ti, 0.1, g);
      ad(g.gain, ti, 0.3, 0.008, 0.08);
    }
  };
  S.crumble = (d, t) => {
    const D = 3.0;
    const r = gn(d), rf = flt(r, 'lowpass', 130, 0.6); noi(t, D + 0.4, rf, bufBrown); sw(rf.frequency, t, 170, 60, D);
    r.gain.setValueAtTime(0.0001, t); r.gain.linearRampToValueAtTime(1.0, t + 0.35); r.gain.exponentialRampToValueAtTime(0.0001, t + D + 0.3);
    grains(d, t + 0.1, 22, D - 0.3, 0.48, 0.05, 0.2, 180, 700, 3, 0);
  };
  S.rise = (d, t) => {
    const D = 3.0;
    const r = gn(d), rf = flt(r, 'lowpass', 70, 0.7); noi(t, D + 0.5, rf, bufBrown); sw(rf.frequency, t, 55, 240, D * 0.9);
    r.gain.setValueAtTime(0.0001, t); r.gain.exponentialRampToValueAtTime(0.9, t + D * 0.85); r.gain.exponentialRampToValueAtTime(0.0001, t + D + 0.35);
    grains(d, t + 0.5, 14, D - 0.5, 0.5, 0.05, 0.12, 240, 720, 8, 2);
  };
  S.beaconOut = (d, t) => {
    const lw = gn(d), lf = flt(lw, 'lowpass', 400); noi(t, 1.6, lf, bufBrown); sw(lf.frequency, t, 500, 70, 1.4); ad(lw.gain, t, 0.6, 0.2, 1.3);
    const td = t + 0.7, dr = gn(d), dl = flt(dr, 'lowpass', 500);
    osc('sine', 55, td, 2.8, gn(dl, 0.6)); osc('sine', 82.6, td, 2.8, gn(dl, 0.35));
    dr.gain.setValueAtTime(0.0001, td); dr.gain.linearRampToValueAtTime(0.5, td + 1.0); dr.gain.exponentialRampToValueAtTime(0.0001, td + 2.7);
  };
  S.ignite = (d, t, p) => {
    whoomp(d, t, 0.75, 0.7 + 0.3 * p);
    grains(d, t + 0.12, 10, 0.8, 0.14, 0.004, 0.02, 1800, 5200, 3, 1);
  };
  S.splash = (d, t) => {
    const k = rr(0.85, 1.15);
    const g = gn(d), f = flt(g, 'bandpass', 1300 * k, 0.8); noi(t, 0.4, f); sw(f.frequency, t, 900 * k, 2200 * k, 0.12); ad(g.gain, t, 0.45, 0.012, 0.28);
  };

  // [fn, minCooldown, reverbSend, capTier, voiceDur, baseGain, cfgGroup]
  const DEF = {
    catClaw:   [S.catClaw,   0.045, 0.15, 1, 0.16, 0.75, 'claw'],
    catFire:   [S.catFire,   0.055, 0.20, 1, 0.25, 0.75, 'fire'],
    catBoom:   [S.catBoom,   0.055, 0.32, 2, 0.55, 0.80, 'fire'],
    catLaser:  [S.catLaser,  0.045, 0.22, 1, 0.24, 0.78, 'laser'],
    catPlasma: [S.catPlasma, 0.10,  0.38, 2, 0.45, 0.85, 'hybrid'],
    catMagma:  [S.catMagma,  0.06,  0.35, 2, 0.55, 0.82, 'hybrid'],
    catPyro:   [S.catPyro,   0.05,  0.26, 2, 0.30, 0.80, 'hybrid'],
    catMut:    [S.catMut,    0.06,  0.30, 2, 0.45, 0.85, 'mut'],
    laserClick:[S.laserClick,0.05,  0.14, 2, 0.12, 0.72, 'laser'],
    catMeow:   [S.catMeow,   0.06,  0.24, 2, 0.30, 0.74, 'claw'],

    bow: [S.bow, 0.05, 0.18, 1, 0.3, 0.55],
    arrowHit: [S.arrowHit, 0.045, 0.12, 0, 0.15, 0.5],
    cannon: [S.cannon, 0.09, 0.45, 2, 1.6, 0.9],
    explode: [S.explode, 0.08, 0.5, 2, 1.5, 0.85],
    charge: [S.charge, 0.12, 0.3, 0, 0.6, 0.6],
    zap: [S.zap, 0.09, 0.45, 1, 1.1, 0.7],
    clash: [S.clash, 0.06, 0.25, 1, 0.4, 0.55],
    slash: [S.slash, 0.06, 0.15, 1, 0.2, 0.55],
    ratSqueal: [S.ratSqueal, 0.09, 0.2, 0, 0.3, 0.5, 'monster'],
    boneRattle: [S.boneRattle, 0.07, 0.2, 1, 0.45, 0.6, 'monster'],
    squelch: [S.squelch, 0.08, 0.2, 1, 0.45, 0.6, 'monster'],
    batScreech: [S.batScreech, 0.09, 0.3, 0, 0.2, 0.5, 'monster'],
    roar: [S.roar, 0.6, 0.5, 3, 1.5, 0.85, 'monster'],
    bossStep: [S.bossStep, 0.12, 0.35, 2, 0.6, 0.9, 'monster'],
    bossDie: [S.bossDie, 1.0, 0.5, 3, 2.6, 0.9, 'monster'],
    coin: [S.coin, 0.035, 0.15, 0, 0.35, 0.5],
    hammer: [S.hammer, 0.05, 0.2, 0, 0.12, 0.5],
    buildDone: [S.buildDone, 0.12, 0.3, 1, 0.8, 0.65],
    sell: [S.sell, 0.15, 0.25, 1, 0.8, 0.6],
    horn: [S.horn, 1.0, 0.6, 3, 2.2, 0.75],
    hornBoss: [S.hornBoss, 1.5, 0.65, 3, 4.0, 0.8],
    leak: [S.leak, 0.15, 0.45, 2, 1.4, 0.7],
    footmanDie: [S.footmanDie, 0.09, 0.25, 1, 0.5, 0.6],
    uiHover: [S.uiHover, 0.04, 0, 2, 0.06, 0.6],
    uiClick: [S.uiClick, 0.04, 0.05, 3, 0.1, 0.7],
    uiDeny: [S.uiDeny, 0.1, 0.05, 3, 0.25, 0.7],
    crumble: [S.crumble, 1.0, 0.5, 3, 3.4, 0.9, 'monster'],
    rise: [S.rise, 1.0, 0.5, 3, 3.5, 0.85],
    beaconOut: [S.beaconOut, 1.5, 0.6, 3, 3.6, 0.85],
    ignite: [S.ignite, 0.15, 0.35, 2, 1.2, 0.7],
    splash: [S.splash, 0.09, 0.3, 0, 0.5, 0.5],
  };
  const CAP = [16, 22, 28, 34];

  function play(name, pan, gain, p) {
    if (!api.ready) return;
    const df = DEF[name];
    if (!df) return;
    const g = gain === undefined ? 1 : +gain;
    const pv = cl(+p || 0, 0, 1);
    let mul = df[6] ? cfg[df[6]] : 1;
    // Moltiplicatore dedicato per il Vulcano Lv 4 (sia lancio che esplosione)
    if ((name === 'catFire' || name === 'catBoom') && pToLvl(pv) >= 4) mul *= cfg.volcano;
    const finalG = cl(g, 0, 1.5) * df[5] * mul;
    if (!(finalG > 0.003)) return;

    const now = ctx.currentTime;
    if (now - (last[name] === undefined ? -9 : last[name]) < df[1]) return;
    let c = 0;
    for (let i = ends.length - 1; i >= 0; i--) { if (ends[i] <= now) { ends[i] = ends[ends.length - 1]; ends.pop(); } else c++; }
    if (c >= CAP[df[3]]) return;
    last[name] = now;
    const t = now + 0.006 + rnd() * 0.014;
    const v = voice(+pan || 0, finalG, df[2], nSfx);
    V = v;
    try { df[0](v.out, t, pv); } catch (e) {}
    finishVoice(v);
    ends.push(t + df[4]);
  }

  function startBeds() {
    // 1. Vento opzionale (0% di default)
    bed.windG = gn(nAmb, 0); bed.windG.connect(gn(nRevIn, 0.12));
    bed.gustG = gn(bed.windG, 0.7);
    for (let i = 0; i < 2; i++) {
      const lf = flt(flt(panNode(i ? 0.55 : -0.55, bed.gustG), 'highpass', 110, 0.5), 'lowpass', 420, 0.4);
      loopSrc(bufPink, gn(lf, 2.6), 0.8 + i * 0.13); bed.windLP.push(lf);
    }
    bed.whG = gn(bed.gustG, 0); bed.whF = flt(bed.whG, 'bandpass', 800, 7); loopSrc(bufPink, gn(bed.whF, 3), 1.0);

    // 2. Dettagli Laboratorio Segreto (gocciolio, spike elettrici, bolle — zero fruscio continuo)
    bed.popBus = gn(nAmb, cfg.labDetails);
    bed.popBus.connect(gn(nRevIn, 0.42));

    // 3. Ronzio caldo armonico Laboratorio (55Hz / 110Hz)
    bed.labG = gn(nAmb, cfg.labHum);
    bed.labG.connect(gn(nRevIn, 0.25));
    bed.labF = flt(bed.labG, 'lowpass', 260, 0.8);
    loopOsc('sine', 55.0, gn(bed.labF, 0.16));
    loopOsc('triangle', 110.0, gn(bed.labF, 0.055));
    loopOsc('sine', 0.18, gn(bed.labF.frequency, 45));

    // 4. Drone tensione battaglia
    bed.droneG = gn(nMusic, 0); bed.droneG.connect(gn(nRevIn, 0.3));
    bed.droneLP = flt(bed.droneG, 'lowpass', 320, 0.6);
    const dv = gn(null, 4); loopOsc('sine', 4.9, dv);
    [[73.42, -5, 0.45], [73.42, 6, 0.45], [36.71, 0, 0.25], [110.0, 3, 0.10]].forEach((a) => {
      const o = loopOsc('sawtooth', a[0], gn(bed.droneLP, a[2])); o.detune.value = a[1]; dv.connect(o.detune);
    });
  }

  function labEvent() {
    const t = ctx.currentTime + rnd() * 0.08, pan = rr(-0.78, 0.78);
    const v = voice(pan, 1.0, 0.35, bed.popBus); V = v;
    const r = rnd();
    if (r < 0.42) {
      const f0 = rr(680, 1150), g = gn(v.out), o = osc('sine', f0, t, 0.13, g);
      sw(o.frequency, t, f0, f0 * rr(1.75, 2.25), 0.075); ad(g.gain, t, rr(0.16, 0.28), 0.003, 0.095);
      if (rnd() < 0.35) {
        const t2 = t + rr(0.11, 0.22), f2 = f0 * rr(1.1, 1.35);
        const g2 = gn(v.out), o2 = osc('sine', f2, t2, 0.1, g2);
        sw(o2.frequency, t2, f2, f2 * 1.9, 0.06); ad(g2.gain, t2, rr(0.08, 0.15), 0.002, 0.07);
      }
    } else if (r < 0.76) {
      const lp = flt(v.out, 'lowpass', 6800), nPulses = rnd() < 0.45 ? 3 : 2;
      for (let i = 0; i < nPulses; i++) {
        const ti = t + i * rr(0.025, 0.055), cg = gn(lp), cf = flt(cg, 'bandpass', rr(2400, 4800), 3.2);
        noi(ti, 0.03, cf); ad(cg.gain, ti, rr(0.14, 0.28), 0.0006, rr(0.012, 0.024));
      }
      const zg = gn(lp), zf = flt(zg, 'bandpass', rr(1600, 2600), 5);
      const zo = osc('sawtooth', rr(110, 165), t, 0.09, zf);
      sw(zo.frequency, t, 150, 95, 0.08); ad(zg.gain, t, 0.14, 0.002, 0.075);
    } else {
      const count = 3 + ((rnd() * 3) | 0);
      let ti = t;
      for (let i = 0; i < count; i++) {
        const f0 = rr(240, 460) * (1 + i * 0.08), g = gn(v.out), o = osc('sine', f0, ti, 0.08, g);
        sw(o.frequency, ti, f0, f0 * rr(1.5, 2.0), 0.055); ad(g.gain, ti, rr(0.11, 0.22), 0.004, 0.055);
        ti += rr(0.055, 0.11);
      }
    }
    finishVoice(v);
  }

  function setAmbience(fire, wind, tension) {
    tgt.fire = cl(+fire || 0, 0, 1);
    tgt.wind = cl(+wind || 0, 0, 1);
    tgt.tension = cl(+tension || 0, 0, 1);
  }

  const CH = [
    { n: [38, 45, 50, 53, 57], m: [62, 65, 69, 72, 74, 76], to: [1, 2, 4, 3] },
    { n: [34, 41, 50, 53, 58], m: [62, 65, 70, 74, 69], to: [2, 0, 4] },
    { n: [31, 43, 46, 50, 55], m: [62, 67, 70, 74, 69], to: [0, 3, 1] },
    { n: [33, 40, 45, 48, 52], m: [64, 69, 72, 76, 67], to: [0, 1] },
    { n: [29, 41, 45, 48, 53], m: [60, 65, 69, 72, 77, 67], to: [2, 0, 1] },
  ];
  function padChord(t, c, dur) {
    const v = voice(0, 1, 0.5, nMusic); V = v;
    const env = gn(v.out), hp = flt(env, 'highpass', 50), sides = [], open = rr(560, 700);
    for (let s = 0; s < 2; s++) {
      const l = flt(panNode(s ? 0.4 : -0.4, hp), 'lowpass', 380, 0.5);
      l.frequency.setValueAtTime(380, t); l.frequency.linearRampToValueAtTime(open, t + dur * 0.5); l.frequency.linearRampToValueAtTime(400, t + dur + 4);
      sides.push(l);
    }
    const vib = gn(null, rr(2.5, 4)); osc('sine', rr(4.4, 5.2), t, dur + 7, vib);
    for (let i = 0; i < c.n.length; i++) {
      const f = mtof(c.n[i]);
      for (let s = 0; s < 2; s++) { const o = osc('sawtooth', f, t, dur + 7, gn(sides[s], i === 0 ? 0.05 : 0.036)); o.detune.value = (s ? 1 : -1) * rr(4, 8); vib.connect(o.detune); }
    }
    env.gain.setValueAtTime(0.0001, t); env.gain.linearRampToValueAtTime(1, t + 3.5); env.gain.setTargetAtTime(0.0001, t + dur, 1.3);
    finishVoice(v);
  }
  function pianoNote(t, m, vel) {
    const f = mtof(m), v = voice(rr(-0.3, 0.3), 1, 0.8, nMusic); V = v;
    const lp = flt(v.out, 'lowpass', 2200, 0.4);
    lp.frequency.setValueAtTime(Math.min(3200, f * 5), t); lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.3), t + 2.2);
    const dec = 3.6 * Math.pow(440 / f, 0.35), H = [[1, 1, 1], [2.002, 0.3, 0.55], [3.006, 0.1, 0.35], [4.012, 0.04, 0.22]];
    for (let i = 0; i < H.length; i++) { const h = H[i], g = gn(lp); osc('sine', f * h[0], t, dec * h[2] + 0.1, g); ad(g.gain, t, vel * 0.11 * h[1], 0.007, dec * h[2]); }
    finishVoice(v);
  }
  function timp(t, vel) {
    const v = voice(rr(-0.15, 0.15), 1, 0.65, nMusic); V = v;
    const sh = shape(v.out, 1.4);
    const g = gn(sh), o = osc('sine', 92.5, t, 1.25, g); sw(o.frequency, t, 118, 73.4, 0.09); ad(g.gain, t, vel * 1.35, 0.004, 1.05);
    const g2 = gn(sh), o2 = osc('triangle', 146.8, t, 0.85, g2); sw(o2.frequency, t, 175, 110.0, 0.07); ad(g2.gain, t, vel * 0.65, 0.003, 0.7);
    const n = gn(v.out), nf = flt(n, 'lowpass', 340); noi(t, 0.14, nf); ad(n.gain, t, vel * 0.85, 0.002, 0.09);
    finishVoice(v);
  }
  function pickNote(c) {
    let m = c.m[(rnd() * c.m.length) | 0];
    if (m === mus.lastNote) m = c.m[(c.m.indexOf(m) + 1) % c.m.length];
    mus.lastNote = m; return m;
  }
  function musicTick(now) {
    if (now > mus.nextChord - 0.3) {
      const t = Math.max(mus.nextChord, now + 0.05), c = CH[mus.chord], dur = rr(11, 15);
      padChord(t, c, dur);
      if (rnd() < 0.75) {
        const t1 = t + rr(3, 6.5); pianoNote(t1, pickNote(c), rr(0.6, 1));
        if (rnd() < 0.35) pianoNote(t1 + rr(2.4, 4.2), pickNote(c), rr(0.45, 0.8));
      }
      mus.nextChord = t + dur - 1.0;
      mus.chord = c.to[(rnd() * c.to.length) | 0];
    }
    if (cur.tension > 0.08) {
      if (mus.timpAt < now - 1) mus.timpAt = now + 0.4;
      if (now > mus.timpAt - 0.2) {
        const t = Math.max(mus.timpAt, now + 0.03);
        const vel = (0.28 + 0.45 * cur.tension) * (mus.timpN % 4 === 0 ? 1.15 : 0.85);
        timp(t, vel);
        if (cur.tension > 0.45 && mus.timpN % 2 === 1) timp(t + 0.38, vel * 0.68);
        mus.timpN++; mus.timpAt = t + Math.max(1.15, 2.1 - cur.tension * 0.9);
      }
    }
  }

  function sync() { api.ready = !!ctx && ctx.state === 'running'; }
  function build() {
    sr = ctx.sampleRate;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -8; lim.knee.value = 4; lim.ratio.value = 16; lim.attack.value = 0.002; lim.release.value = 0.18;
    lim.connect(ctx.destination);
    const sh = (dest, type, f, g, q) => { const b = flt(dest, type, f, q); b.gain.value = g; return b; };
    nMaster = gn(sh(sh(sh(flt(flt(lim, 'highpass', 32, 0.7), 'highpass', 32, 0.7), 'highshelf', 3000, 1.5), 'peaking', 1200, 1.0, 0.7), 'lowshelf', 180, -8), 0);
    nMaster.gain.setValueAtTime(0.0001, ctx.currentTime);
    nMaster.gain.linearRampToValueAtTime(cfg.master, ctx.currentTime + 0.6);
    nMute = gn(nMaster, api.muted ? 0 : 1);
    nSfx = gn(nMute, cfg.sfx); nAmb = gn(nMute, 0.9); nMusic = gn(nMute, cfg.music);
    makeBuffers();
    const conv = ctx.createConvolver(); conv.buffer = makeImpulse();
    conv.connect(gn(nMute, 0.45));
    nRevIn = gn(null, 1); nRevIn.connect(flt(conv, 'highpass', 120));
    startBeds();
    mus.nextChord = ctx.currentTime + 1.2; mus.chord = 0;
  }
  function unlock() {
    if (!ctx) {
      const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
      if (!AC) return false;
      try { ctx = new AC(); build(); ctx.onstatechange = sync; }
      catch (e) { try { if (ctx && ctx.close) ctx.close(); } catch (e2) {} ctx = null; api.ready = false; return false; }
    }
    if (ctx.state !== 'running' && ctx.resume) { const pr = ctx.resume(); if (pr && pr.then) pr.then(sync, () => {}); }
    sync();
    return api.ready;
  }
  let pausedByPage = false;
  function setPaused(b) {
    if (!ctx) return;
    if (b && ctx.state === 'running') { pausedByPage = true; if (ctx.suspend) ctx.suspend(); }
    else if (!b && pausedByPage) { pausedByPage = false; if (ctx.resume) { const pr = ctx.resume(); if (pr && pr.then) pr.then(sync, () => {}); } }
  }
  function setMuted(b) {
    api.muted = !!b;
    if (ctx && nMute) nMute.gain.setTargetAtTime(api.muted ? 0 : 1, ctx.currentTime, 0.06);
  }

  function update(dt) {
    if (!ctx) return;
    sync();
    if (!api.ready) return;
    dt = cl(+dt || 0.016, 0, 0.1);
    const now = ctx.currentTime, k = 1 - Math.exp(-dt * 3.0);

    const wantTens = cl(cfg.tensionBase + tgt.tension * (1 - cfg.tensionBase), 0, 1);
    cur.labD += (cfg.labDetails - cur.labD) * k;
    cur.labH += (cfg.labHum - cur.labH) * k;
    cur.wind += (cfg.wind - cur.wind) * k;
    cur.tension += (wantTens - cur.tension) * k;

    bed.popBus.gain.setTargetAtTime(cur.labD, now, 0.1);
    bed.labG.gain.setTargetAtTime(cur.labH, now, 0.1);
    bed.windG.gain.setTargetAtTime(cur.wind, now, 0.1);
    bed.droneG.gain.setTargetAtTime(cur.tension * 0.32, now, 0.15);
    bed.droneLP.frequency.setTargetAtTime(320 + 460 * cur.tension, now, 0.15);
    nMusic.gain.setTargetAtTime(cfg.music * (1 + 0.18 * tgt.tension), now, 0.25);

    if (cur.wind > 0.01) {
      bed.timer -= dt;
      if (bed.timer <= 0) {
        bed.timer = rr(2, 5);
        const tc = rr(1.2, 3), f = rr(200, 520) * (0.7 + 0.6 * cur.wind);
        for (let i = 0; i < bed.windLP.length; i++) bed.windLP[i].frequency.setTargetAtTime(f * rr(0.85, 1.15), now, tc);
        bed.gustG.gain.setTargetAtTime(rr(0.45, 1.0), now, tc);
        const w = rnd(); bed.whG.gain.setTargetAtTime(w * w * 0.3, now, tc); bed.whF.frequency.setTargetAtTime(rr(600, 1100), now, tc);
      }
    }
    if (cur.labD > 0.02) {
      bed.popAcc += dt * (0.25 + 1.35 * cur.labD);
      if (bed.popAcc >= 1) { bed.popAcc -= rr(0.85, 1.45); labEvent(); }
    }
    musicTick(now);
  }

  // --- PANNELLO DEBUG IN-GAME (#debug / #audio o tasto F9 / Alt+A) ---
  let dbgEl = null, dbgMini = false, dbgSim = null;
  function stopDbgSim() { if (dbgSim) { clearInterval(dbgSim); dbgSim = null; } }

  function buildDebugPanel() {
    if (dbgEl || typeof document === 'undefined') return;
    const st = document.createElement('style');
    st.textContent = `
      #pc-aud-dbg {
        position: fixed; top: 54px; right: 12px; width: 312px; max-height: calc(100vh - 70px);
        overflow-y: auto; z-index: 9999; background: rgba(11, 17, 28, 0.95);
        border: 1px solid #38bdf8; border-radius: 10px; padding: 10px 12px;
        color: #e6edf3; font: 11.5px/1.35 system-ui, -apple-system, sans-serif;
        box-shadow: 0 12px 32px rgba(0,0,0,0.65); user-select: none;
      }
      #pc-aud-dbg.mini { width: auto; padding: 6px 10px; overflow: hidden; }
      #pc-aud-dbg.mini .dbg-body { display: none; }
      #pc-aud-dbg .dbg-hd { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
      #pc-aud-dbg .dbg-title { font-weight: 700; color: #7dd3fc; font-size: 12px; }
      #pc-aud-dbg .dbg-hbtns { display: flex; gap: 4px; }
      #pc-aud-dbg button {
        background: #1e293b; color: #e2e8f0; border: 1px solid #3b5273;
        border-radius: 5px; padding: 4px 7px; font-size: 10.5px; font-weight: 600; cursor: pointer;
      }
      #pc-aud-dbg button:hover { background: #2d3f59; border-color: #60a5fa; }
      #pc-aud-dbg button.ok { background: #143628; border-color: #22c55e; color: #86efac; }
      #pc-aud-dbg .sec { margin-top: 8px; padding-top: 6px; border-top: 1px solid #1e2d42; font-weight: 700; color: #fbbf24; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.5px; }
      #pc-aud-dbg .r { margin-top: 5px; }
      #pc-aud-dbg .r label { display: flex; justify-content: space-between; color: #94a3b8; font-size: 11px; }
      #pc-aud-dbg .r label b { color: #fff; }
      #pc-aud-dbg input[type="range"] { width: 100%; height: 14px; accent-color: #38bdf8; cursor: pointer; margin-top: 1px; }
      #pc-aud-dbg .tgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 6px; }
      #pc-aud-dbg .fbar { display: flex; gap: 5px; margin-top: 8px; padding-top: 7px; border-top: 1px solid #1e2d42; }
      #pc-aud-dbg .fbar button { flex: 1; padding: 5px 6px; }
    `;
    document.head.appendChild(st);

    const rowsAmb = [
      ['master',      'Master', 100],
      ['music',       'Musica (Synth/Piano)', 100],
      ['labDetails',  'Dettagli Lab (gocce/archi)', 100],
      ['labHum',      'Ronzio Lab (55Hz)', 100],
      ['tensionBase', 'Tensione Base (timpani)', 100],
      ['wind',        'Vento (fruscio)', 100],
    ];
    const rowsCat = [
      ['sfx',     'SFX Globali', 150],
      ['claw',    'Gatto Base (Graffio)', 150],
      ['fire',    'Gatto Fuoco (Lv 1-3)', 150],
      ['volcano', 'Vulcano Lv 4 (Raffica)', 150],
      ['laser',   'Gatto Laser (Lv 1-4)', 150],
      ['hybrid',  'Ibridi 4 DNA (Plasma ecc.)', 150],
      ['mut',     'Iniezione Fiala DNA', 150],
      ['monster', 'Mostri & Boss', 150],
    ];

    const mkRows = arr => arr.map(([k, lbl, max]) => `
      <div class="r">
        <label><span>${lbl}</span><b id="auv-${k}">${Math.round(cfg[k] * 100)}%</b></label>
        <input type="range" min="0" max="${max}" value="${Math.round(cfg[k] * 100)}" data-auk="${k}" />
      </div>`).join('');

    dbgEl = document.createElement('div');
    dbgEl.id = 'pc-aud-dbg';
    dbgEl.innerHTML = `
      <div class="dbg-hd">
        <span class="dbg-title">🎛️ Audio Debug [F9]</span>
        <div class="dbg-hbtns">
          <button id="au-mini" title="Minimizza">—</button>
          <button id="au-close" title="Chiudi (F9)">✕</button>
        </div>
      </div>
      <div class="dbg-body">
        <div class="sec">Sottofondo Laboratorio</div>
        ${mkRows(rowsAmb)}
        <div class="sec">Volumi Gatti &amp; SFX</div>
        ${mkRows(rowsCat)}
        <div class="sec">Test Rapido (anche in pausa)</div>
        <div class="tgrid">
          <button data-aut="f1">Fuoco Lv1</button>
          <button data-aut="f4">Vulcano Lv4</button>
          <button data-aut="raf4">Raffica Lv4</button>
          <button data-aut="l1">Laser Lv1</button>
          <button data-aut="l4">Cyborg Lv4</button>
          <button data-aut="pl">Plasma 2x2</button>
        </div>
        <div class="fbar">
          <button id="au-copy">Copia Config</button>
          <button id="au-reset">Reset Default</button>
        </div>
      </div>
    `;

    // Isola completamente gli input dal canvas / hud.js su window
    const stopProp = e => e.stopPropagation();
    ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'mousedown', 'mousemove', 'mouseup', 'wheel', 'touchstart', 'touchmove', 'touchend', 'click', 'dblclick', 'contextmenu', 'keydown', 'keyup'].forEach(ev => {
      dbgEl.addEventListener(ev, stopProp, { passive: false });
    });

    document.body.appendChild(dbgEl);

    const syncUI = () => {
      dbgEl.querySelectorAll('input[data-auk]').forEach(inp => {
        const k = inp.dataset.auk, pct = Math.round(cfg[k] * 100);
        inp.value = pct;
        const b = document.getElementById('auv-' + k);
        if (b) b.textContent = pct + '%';
      });
    };

    dbgEl.querySelectorAll('input[data-auk]').forEach(inp => {
      inp.addEventListener('input', () => {
        unlock();
        const k = inp.dataset.auk, v = +inp.value / 100;
        setCfg(k, v);
        const b = document.getElementById('auv-' + k);
        if (b) b.textContent = inp.value + '%';
      });
    });

    document.getElementById('au-mini').onclick = () => {
      dbgMini = !dbgMini;
      dbgEl.classList.toggle('mini', dbgMini);
      document.getElementById('au-mini').textContent = dbgMini ? '+' : '—';
    };
    document.getElementById('au-close').onclick = () => toggleDebug(false);

    dbgEl.querySelectorAll('[data-aut]').forEach(btn => {
      btn.onclick = () => {
        unlock();
        const act = btn.dataset.aut;
        if (act === 'raf4') {
          if (dbgSim) { stopDbgSim(); btn.classList.remove('ok'); return; }
          btn.classList.add('ok');
          const fireOne = () => { play('catFire', 0, 0.75, 1); setTimeout(() => play('catBoom', 0, 0.78, 1), 220); };
          fireOne();
          dbgSim = setInterval(fireOne, 290);
          return;
        }
        stopDbgSim();
        dbgEl.querySelectorAll('[data-aut="raf4"]').forEach(b => b.classList.remove('ok'));
        if (act === 'f1') { play('catFire', 0, 0.75, 0); setTimeout(() => play('catBoom', 0, 0.78, 0), 220); }
        else if (act === 'f4') { play('catFire', 0, 0.75, 1); setTimeout(() => play('catBoom', 0, 0.78, 1), 220); }
        else if (act === 'l1') play('catLaser', 0, 0.78, 0);
        else if (act === 'l4') play('catLaser', 0, 0.78, 1);
        else if (act === 'pl') play('catPlasma', 0, 0.85, 0.5);
      };
    });

    document.getElementById('au-reset').onclick = () => { stopDbgSim(); resetCfg(); syncUI(); };
    document.getElementById('au-copy').onclick = () => {
      const out = {};
      for (const k in DEFAULTS) out[k] = Math.round(cfg[k] * 100) / 100;
      const txt = JSON.stringify(out, null, 2);
      const copyBtn = document.getElementById('au-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(() => {
          copyBtn.textContent = 'Copiato!'; copyBtn.classList.add('ok');
          setTimeout(() => { copyBtn.textContent = 'Copia Config'; copyBtn.classList.remove('ok'); }, 1400);
        });
      } else {
        window.prompt('Copia configurazione audio:', txt);
      }
    };
  }

  function toggleDebug(force) {
    if (!dbgEl) buildDebugPanel();
    if (!dbgEl) return;
    const show = force !== undefined ? !!force : (dbgEl.style.display === 'none');
    dbgEl.style.display = show ? 'block' : 'none';
    if (!show) stopDbgSim();
  }

  if (typeof window !== 'undefined') {
    const checkHash = () => {
      const h = (location.hash || '') + (location.search || '');
      if (/debug|audio/i.test(h)) toggleDebug(true);
    };
    window.addEventListener('DOMContentLoaded', checkHash);
    window.addEventListener('load', checkHash);
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('keydown', e => {
      if (e.code === 'F9' || (e.altKey && e.code === 'KeyA')) {
        e.preventDefault();
        if (!dbgEl) { buildDebugPanel(); dbgEl.style.display = 'block'; }
        else toggleDebug();
      }
    });
  }

  return api;
})();
