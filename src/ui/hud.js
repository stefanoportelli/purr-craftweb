'use strict';

const PX = (() => {
  const LINE = 9, CAP = 7, GAP = 1, CACHE_MAX = 500;

  const SRC = {
    '!': '#/#/#/#/#/./#',
    '"': '#.#/#.#',
    '#': '.#.#./.#.#./#####/.#.#./#####/.#.#./.#.#.',
    '$': '..#../.####/#.#../.###./..#.#/####./..#..',
    '%': '##.../##..#/...#./..#../.#.../#..##/...##',
    '&': '.##../#..#./#.#../.#.../#.#.#/#..#./.##.#',
    "'": '#/#',
    '(': '.#/#./#./#./#./#./.#',
    ')': '#./.#/.#/.#/.#/.#/#.',
    '*': '1:#.#/.#./#.#',
    '+': '2:.#./###/.#.',
    ',': '5:.#/.#/#.',
    '-': '3:###',
    '.': '6:#',
    '/': '..#/..#/.#./.#./.#./#../#..',
    '0': '.###./#...#/#..##/#.#.#/##..#/#...#/.###.',
    '1': '..#../.##../..#../..#../..#../..#../.###.',
    '2': '.###./#...#/....#/...#./..#../.#.../#####',
    '3': '.###./#...#/....#/..##./....#/#...#/.###.',
    '4': '...#./..##./.#.#./#..#./#####/...#./...#.',
    '5': '#####/#..../####./....#/....#/#...#/.###.',
    '6': '..##./.#.../#..../####./#...#/#...#/.###.',
    '7': '#####/....#/...#./..#../..#../..#../..#..',
    '8': '.###./#...#/#...#/.###./#...#/#...#/.###.',
    '9': '.###./#...#/#...#/.####/....#/...#./.##..',
    ':': '2:#/././#',
    ';': '2:.#/../../.#/.#/#.',
    '<': '1:..#/.#./#../.#./..#',
    '=': '2:###/.../###',
    '>': '1:#../.#./..#/.#./#..',
    '?': '.###./#...#/....#/...#./..#../...../..#..',
    '@': '.###./#...#/#.###/#.#.#/#.###/#..../.###.',
    'A': '.###./#...#/#...#/#####/#...#/#...#/#...#',
    'B': '####./#...#/#...#/####./#...#/#...#/####.',
    'C': '.###./#...#/#..../#..../#..../#...#/.###.',
    'D': '####./#...#/#...#/#...#/#...#/#...#/####.',
    'E': '#####/#..../#..../####./#..../#..../#####',
    'F': '#####/#..../#..../####./#..../#..../#....',
    'G': '.###./#...#/#..../#.###/#...#/#...#/.###.',
    'H': '#...#/#...#/#...#/#####/#...#/#...#/#...#',
    'I': '###/.#./.#./.#./.#./.#./###',
    'J': '...#/...#/...#/...#/...#/#..#/.##.',
    'K': '#...#/#..#./#.#../##.../#.#../#..#./#...#',
    'L': '#.../#.../#.../#.../#.../#.../####',
    'M': '#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#',
    'N': '#...#/#...#/##..#/#.#.#/#..##/#...#/#...#',
    'O': '.###./#...#/#...#/#...#/#...#/#...#/.###.',
    'P': '####./#...#/#...#/####./#..../#..../#....',
    'Q': '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#',
    'R': '####./#...#/#...#/####./#.#../#..#./#...#',
    'S': '.###./#...#/#..../.###./....#/#...#/.###.',
    'T': '#####/..#../..#../..#../..#../..#../..#..',
    'U': '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
    'V': '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
    'W': '#...#/#...#/#...#/#.#.#/#.#.#/#.#.#/.#.#.',
    'X': '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
    'Y': '#...#/#...#/.#.#./..#../..#../..#../..#..',
    'Z': '#####/....#/...#./..#../.#.../#..../#####',
    '[': '##/#./#./#./#./#./##',
    '\\': '#../#../.#./.#./.#./..#/..#',
    ']': '##/.#/.#/.#/.#/.#/##',
    '^': '.#./#.#',
    '_': '7:####',
    '`': '#./.#',
    'a': '2:.###./....#/.####/#...#/.####',
    'b': '#..../#..../####./#...#/#...#/#...#/####.',
    'c': '2:.###/#.../#.../#.../.###',
    'd': '....#/....#/.####/#...#/#...#/#...#/.####',
    'e': '2:.###./#...#/#####/#..../.###.',
    'f': '..##/.#../####/.#../.#../.#../.#..',
    'g': '2:.####/#...#/#...#/#...#/.####/....#/.###.',
    'h': '#..../#..../####./#...#/#...#/#...#/#...#',
    'i': '#/./#/#/#/#/#',
    'j': '..#/.../..#/..#/..#/..#/..#/..#/##.',
    'k': '#.../#.../#..#/#.#./##../#.#./#..#',
    'l': '#./#./#./#./#./#./.#',
    'm': '2:####./#.#.#/#.#.#/#.#.#/#.#.#',
    'n': '2:####./#...#/#...#/#...#/#...#',
    'o': '2:.###./#...#/#...#/#...#/.###.',
    'p': '2:####./#...#/#...#/#...#/####./#..../#....',
    'q': '2:.####/#...#/#...#/#...#/.####/....#/....#',
    'r': '2:#.##/##../#.../#.../#...',
    's': '2:.####/#..../.###./....#/####.',
    't': '1:.#../####/.#../.#../.#../..##',
    'u': '2:#...#/#...#/#...#/#...#/.####',
    'v': '2:#...#/#...#/#...#/.#.#./..#..',
    'w': '2:#...#/#...#/#.#.#/#.#.#/.#.#.',
    'x': '2:#...#/.#.#./..#../.#.#./#...#',
    'y': '2:#...#/#...#/#...#/#...#/.####/....#/.###.',
    'z': '2:#####/...#./..#../.#.../#####',
    '{': '..#/.#./.#./#../.#./.#./..#',
    '|': '#/#/#/#/#/#/#',
    '}': '#../.#./.#./..#/.#./.#./#..',
    '~': '2:.#.../#.#.#/...#.',
    '·': '3:#',
    '×': '3:#.#/.#./#.#',
    '←': '1:..#../.#.../#####/.#.../..#..',
    '→': '1:..#../...#./#####/...#./..#..',
    '↑': '..#../.###./#.#.#/..#../..#../..#../..#..',
    '↓': '..#../..#../..#../..#../#.#.#/.###./..#..',
    '–': '3:####',
    '…': '6:#.#.#',
  };
  const UNKNOWN_SRC = '1:####/#..#/#..#/#..#/#..#/####';

  function parse(def) {
    let off = 0, s = def;
    if (s.length > 1 && s[1] === ':' && s[0] >= '0' && s[0] <= '9') { off = +s[0]; s = s.slice(2); }
    const rows = s.split('/');
    let w = 0;
    for (const r of rows) if (r.length > w) w = r.length;
    const bits = new Uint8Array(LINE);
    for (let i = 0; i < rows.length && off + i < LINE; i++) {
      const r = rows[i]; let b = 0;
      for (let x = 0; x < r.length; x++) if (r[x] === '#') b |= 1 << x;
      bits[off + i] = b;
    }
    return { w, bits };
  }

  const glyphs = new Map();
  glyphs.set(' ', { w: 3, bits: new Uint8Array(LINE) });
  for (const ch in SRC) glyphs.set(ch, parse(SRC[ch]));
  const UNKNOWN = parse(UNKNOWN_SRC);

  function measure(str) {
    str = String(str);
    let w = 0, n = 0;
    for (const ch of str) { w += (glyphs.get(ch) || UNKNOWN).w + GAP; n++; }
    return n ? w - GAP : 0;
  }

  const cache = new Map();
  const DIRS = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

  function remember(key, entry) {
    cache.set(key, entry);
    if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
    return entry;
  }

  function run(str, color, shadow, outline) {
    const key = 't\u0001' + str + '\u0001' + color + '\u0001' + shadow + '\u0001' + outline;
    const hit = cache.get(key);
    if (hit) { cache.delete(key); cache.set(key, hit); return hit; }
    const gl = [];
    let w = 0;
    for (const ch of str) { const g = glyphs.get(ch) || UNKNOWN; gl.push(g); w += g.w + GAP; }
    if (gl.length) w -= GAP;
    const o = outline ? 1 : 0, sh = shadow ? 1 : 0;
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, w + 2 * o + sh);
    cv.height = LINE + 2 * o + sh;
    const c = cv.getContext('2d');
    const paint = (dx, dy) => {
      let x = o + dx;
      for (const g of gl) {
        for (let r = 0; r < LINE; r++) {
          let b = g.bits[r], cx = 0;
          while (b) { if (b & 1) c.fillRect(x + cx, o + r + dy, 1, 1); b >>= 1; cx++; }
        }
        x += g.w + GAP;
      }
    };
    if (shadow) {
      c.fillStyle = shadow;
      paint(1, 1);
      if (outline) for (const d of DIRS) paint(d[0] + 1, d[1] + 1);
    }
    if (outline) { c.fillStyle = outline; for (const d of DIRS) paint(d[0], d[1]); }
    c.fillStyle = color;
    paint(0, 0);
    return remember(key, { cv, w, o });
  }

  const NOOPT = {};

  function text(ctx, str, x, y, s, color, opts) {
    str = String(str);
    if (!str.length) return 0;
    s = Math.max(1, Math.round(s || 1));
    const op = opts || NOOPT;
    const e = run(str, color || '#ffffff', op.shadow || '', op.outline || '');
    const wpx = e.w * s;
    let dx = x;
    if (op.align === 'c') dx = x - wpx / 2; else if (op.align === 'r') dx = x - wpx;
    dx = Math.round(dx); const dy = Math.round(y);
    const a = op.alpha === undefined ? 1 : op.alpha;
    if (a <= 0) return wpx;
    if (ctx.imageSmoothingEnabled) ctx.imageSmoothingEnabled = false;
    const ga = ctx.globalAlpha;
    if (a < 1) ctx.globalAlpha = ga * a;
    ctx.drawImage(e.cv, dx - e.o * s, dy - e.o * s, e.cv.width * s, e.cv.height * s);
    if (a < 1) ctx.globalAlpha = ga;
    return wpx;
  }

  const PAL = {
    G: '#e8b04a', g: '#a8742a', Y: '#ffe2a0',
    B: '#e9dfc8', b: '#b9ad93',
    E: '#ff8a3c', e: '#c9481e', d: '#7a2a14',
    C: '#7dd3fc', c: '#0ea5e9',
    S: '#9aa3b0', s: '#5b6472', k: '#353b49',
    W: '#8a6a48', w: '#5a4330',
    P: '#f57a94', v: '#42b862', f: '#ffffff',
    R: '#ff2e55', r: '#b91c1c',
    o: '#0b0d14',
  };

  const ICONS = {
    coin: [
      '..oooo..',
      '.oYYGGo.',
      'oYGGGGgo',
      'oYGgGGgo',
      'oGGgGGgo',
      'oGGGGggo',
      '.oGgggo.',
      '..oooo..',
    ],
    flame: [
      '....o...',
      '...oEo..',
      '...oEEo.',
      '..oEEEo.',
      '.oEEYEEo',
      'oEEYYEEo',
      'oEYYYYEo',
      'oeEYYEeo',
      '.oeEEeo.',
      '..oooo..',
    ],
    bolt: [
      '....oo..',
      '...oCo..',
      '..oCCo..',
      '.oCfCo..',
      'oCCfCCo.',
      'oooCCCo.',
      '..oCCo..',
      '.oCco...',
      '.oco....',
      '..o.....',
    ],
    skull: [
      '..ooooo..',
      '.oBBBBBo.',
      'oBBBBBBBo',
      'oBooBooBo',
      'oBooBooBo',
      'oBBBoBBbo',
      '.oBBBBbo.',
      '.oBoBobo.',
      '..ooooo..',
    ],
    banner: [
      'S.......',
      'Wddddddd',
      'WeEEEEEe',
      'WeEEYEEe',
      'WeEYEYEe',
      'WeEEYEEe',
      'WeEEEEEe',
      'WeEe.eEe',
      'Wed...de',
      'W.......',
    ],
    sound: [
      '...B......',
      '..BB...G..',
      'BBBB....G.',
      'BBBB.G..G.',
      'BBBB.G..G.',
      'BBBB....G.',
      '..bb...G..',
      '...b......',
    ],
    mute: [
      '...B......',
      '..BB......',
      'BBBB.e..e.',
      'BBBB..ee..',
      'BBBB..ee..',
      'BBBB.e..e.',
      '..bb......',
      '...b......',
    ],
    archer: [
      '.............',
      '.oo.......oo.',
      '.oEo.....oEo.',
      '.oEPo...oPEo.',
      '.oEEoooooEEo.',
      '.oEEEEEEEEEo.',
      'oEEvoEEEovEEo',
      'oEEEEEPEEEEEo',
      'BoEBBBoBBBEoB',
      '.oeBBoBoBBeo.',
      'BoeeBBBBBeeoB',
      '..ooeeeeeoo..',
      '....ooooo....',
    ],
    upgrade: [
      '....Y....',
      '...YGG...',
      '..YG.GG..',
      '.YG...GG.',
      '....G....',
      '...GGg...',
      '..GG.gg..',
      '.GG...gg.',
      '.........',
    ],
    sell: [
      '..ooooo..',
      '.oYYGGGo.',
      '.oYGgGGo.',
      '.oGGgGgo.',
      '.oGGGggo.',
      '..ooooo..',
      '..EEEEE..',
      '...EeE...',
      '....e....',
    ],
    helm: [
      '....E....',
      '..SSSSS..',
      '.SBSSSSs.',
      '.SSSSSSs.',
      '.SooSoos.',
      '.SS.S.ss.',
      '.SS.S.ss.',
      '..S...s..',
    ],
    hand: [
      '...oo....',
      '..oBBo...',
      '..oBBo...',
      '..oBBooo.',
      '..oBBbBbo',
      'ooBBBbBbo',
      'oBBBBBBBo',
      '.oBBBBbo.',
      '..ooooo..',
    ],
    slotFire: [
      '.ooo.',
      'oYEEo',
      'oEEeo',
      'oeeeo',
      '.ooo.',
    ],
    slotElec: [
      '.ooo.',
      'ofCCo',
      'oCCco',
      'occco',
      '.ooo.',
    ],
    slotEmpty: [
      '.ooo.',
      'oksko',
      'os.so',
      'oksko',
      '.ooo.',
    ],
    pawOn: [
      '...oo.oo...',
      '..oYYoYYo..',
      '.ooYYoYYoo.',
      'oYYoo.ooYYo',
      'oGGo...oGGo',
      '.oo.ooo.oo.',
      '..ooYYYoo..',
      '.oYYYYYYYo.',
      '.oYGGGGGYo.',
      '..ooooooo..',
    ],
    pawOff: [
      '...oo.oo...',
      '..okkokko..',
      '.ookkokkoo.',
      'okkoo.ookko',
      'osso...osso',
      '.oo.ooo.oo.',
      '..ookkkoo..',
      '.okkkkkkko.',
      '.oksssssko.',
      '..ooooooo..',
    ],
    laser: [
      '...oooo...',
      '..oRRRRo..',
      '.oRRffRRo.',
      'oRRffffRRo',
      'oRRffffRRo',
      '.oRRffRRo.',
      '..oRRRRo..',
      '...oooo...',
    ],
  };

  const iconMeta = {};
  for (const name in ICONS) {
    const rows = ICONS[name];
    let w = 0;
    for (const r of rows) if (r.length > w) w = r.length;
    iconMeta[name] = [w, rows.length];
  }

  function iconCanvas(name) {
    const key = 'i\u0001' + name;
    const hit = cache.get(key);
    if (hit) { cache.delete(key); cache.set(key, hit); return hit; }
    const rows = ICONS[name], m = iconMeta[name];
    const cv = document.createElement('canvas');
    cv.width = m[0]; cv.height = m[1];
    const c = cv.getContext('2d');
    for (let y = 0; y < rows.length; y++) {
      const r = rows[y];
      for (let x = 0; x < r.length; x++) {
        const col = PAL[r[x]];
        if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); }
      }
    }
    return remember(key, { cv });
  }

  function icon(ctx, name, x, y, s, alpha) {
    if (!ICONS[name]) return;
    const a = alpha === undefined ? 1 : alpha;
    if (a <= 0) return;
    s = Math.max(1, Math.round(s || 1));
    const e = iconCanvas(name);
    if (ctx.imageSmoothingEnabled) ctx.imageSmoothingEnabled = false;
    const ga = ctx.globalAlpha;
    if (a < 1) ctx.globalAlpha = ga * a;
    ctx.drawImage(e.cv, Math.round(x), Math.round(y), e.cv.width * s, e.cv.height * s);
    if (a < 1) ctx.globalAlpha = ga;
  }

  function iconSize(name) {
    const m = iconMeta[name];
    return m ? [m[0], m[1]] : [0, 0];
  }

  return { LINE, CAP, measure, text, icon, iconSize, icons: Object.keys(ICONS), palette: PAL };
})();


const UI = (() => {
  const U = {
    ctx: null, s: 3, insetTop: 0, goldShown: 0, hurt: 0, coins: [], msg: null, hover: null, menu: null, armed: null, idle: 99, mx: -1, my: -1, inside: false,
    btns: [], hotBtn: null, press: null, gp: { sel: -1, t: 0, prev: [] , active: false }, goldBump: 0, deny: 0, hintT: 0, titleT: 0, rangeMesh: null, padMesh: null, soundRect: null, cmdRect: null, manual: true, moved: 99, focus: 0, slainBump: 0, lastSlain: 0,
    touch: false, ptrs: new Map(), gest: null, lastTap: { t: -9, x: 0, y: 0 }, waveRect: null, followRect: null, menuRect: null, wake: null, panning: false,
    hud: [], tips: [], tip: null, keys: new Set(), sndArmed: false, vvT: 0, vvN: 0,
  };
  const COLR = { bg: 'rgba(9,11,17,0.86)', bg2: 'rgba(24,27,38,0.94)', bd: '#5d4c35', bdHi: '#e8b04a', tx: '#efe4cd', dim: '#a79e8a', amber: '#e8b04a', ember: '#ff8a3c', cold: '#7dd3fc', red: '#e5553c', dark: '#0b0d14', ok: '#9fd08a' };
  const _pv = new THREE.Vector3(), _o = new THREE.Vector3(), _d = new THREE.Vector3();
  function proj(x, y, z) { _pv.set(x, y, z).project(R.cam); return { x: (_pv.x * .5 + .5) * R.dw, y: (1 - (_pv.y * .5 + .5)) * R.dh }; }
  U.proj = proj;
  U.playerActive = () => U.manual;
  U.setManual = on => { U.manual = !!on; if (!on) { U.menu = null; U.armed = null; } };
  U.banner = (text, dur, big) => { U.msg = { text, t: 0, dur, big }; };
  U.ping = (x, y, z, byPlayer) => { fxTimed(4, x, y + .12, z, 5, 5, byPlayer ? 1.0 : 1.5, byPlayer ? 1.4 : 1.1, byPlayer ? 1.8 : .5, .7, .55, { ground: true }); };
  U.closeMenu = () => { U.menu = null; U.armed = null; };
  U.coinFrom = (x, y, z, value) => {
    if (U.coins.length > 70) { U.goldShown += value; return; }
    const p = proj(x, y, z); U.coins.push({ sx: p.x, sy: p.y, t: 0, T: rr(.55, .8), value, cx: p.x + rr(-60, 60) * U.s, cy: p.y - rr(30, 70) * U.s });
  };

  function plate(x, y, w, h, o = {}) {
    const c = U.ctx, s = U.s; x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    c.fillStyle = o.bd || COLR.bd; c.fillRect(x + s, y, w - 2 * s, h); c.fillRect(x, y + s, w, h - 2 * s);
    c.fillStyle = o.bg || COLR.bg; c.fillRect(x + 2 * s, y + s, w - 4 * s, h - 2 * s); c.fillRect(x + s, y + 2 * s, w - 2 * s, h - 4 * s);
    if (o.hi) { c.fillStyle = o.hi; c.fillRect(x + 2 * s, y + s, w - 4 * s, s); }
  }
  function text(str, x, y, col, o) { return PX.text(U.ctx, str, x, y, U.s, col || COLR.tx, o); }
  const tw = str => PX.measure(str) * U.s;

  const RADIAL_ELEMS = [
    { id: 'fire', name: 'Fuoco', tag: 'TERRA', col: '#ff7832', icon: 'flame' },
    { id: 'elec', name: 'Laser', tag: 'ARIA',  col: '#38bdf8', icon: 'bolt'  },
  ];

  function hexPath(c, x, y, rad) {
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i * Math.PI) / 3;
      const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad;
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();
  }
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function canAddDna(dna, elemId) {
    if (dna.length >= 4) return { ok: false, reason: 'max' };
    const dist = [];
    for (let i = 0; i < dna.length; i++) if (!dist.includes(dna[i])) dist.push(dna[i]);
    if (dist.length >= 2 && !dist.includes(elemId)) return { ok: false, reason: 'locked2' };
    return { ok: true, reason: null };
  }
  function drawLockMark(c, x, y, sz) {
    c.save(); c.translate(x, y);
    c.strokeStyle = '#94a3b8'; c.lineWidth = Math.max(1.6, sz * 0.1);
    c.beginPath(); c.arc(0, -sz * 0.14, sz * 0.18, Math.PI, 0); c.stroke();
    c.fillStyle = '#334155';
    rrect(c, -sz * 0.26, -sz * 0.12, sz * 0.52, sz * 0.42, Math.max(2, sz * 0.12)); c.fill();
    c.strokeStyle = '#cbd5e1'; c.lineWidth = Math.max(1.2, sz * 0.07); c.stroke();
    c.fillStyle = '#fbbf24';
    c.beginPath(); c.arc(0, sz * 0.08, Math.max(1.5, sz * 0.06), 0, TAU); c.fill();
    c.restore();
  }
  function drawConfirmMark(c, x, y, sz, isSell) {
    const pulse = 1 + Math.sin(G.t * 10) * 0.08;
    c.save(); c.translate(x, y); c.scale(pulse, pulse);
    c.beginPath(); c.arc(0, 0, sz * 0.46, 0, TAU);
    c.fillStyle = isSell ? 'rgba(220, 38, 38, 0.86)' : 'rgba(22, 163, 74, 0.88)';
    c.fill();
    c.lineWidth = Math.max(1.6, sz * 0.08);
    c.strokeStyle = isSell ? '#fecaca' : '#bbf7d0';
    c.stroke();
    c.strokeStyle = '#ffffff';
    c.lineWidth = Math.max(2.2, sz * 0.13);
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(-sz * 0.22, sz * 0.02);
    c.lineTo(-sz * 0.05, sz * 0.19);
    c.lineTo(sz * 0.24, -sz * 0.17);
    c.stroke();
    c.restore();
  }
  function drawHexPips(c, cx, cy, dna, gap, rad, previewCol) {
    const x0 = cx - (3 * gap) / 2;
    for (let i = 0; i < 4; i++) {
      const px = x0 + i * gap, id = dna[i];
      const col = id === 'fire' ? '#ff7832' : (id === 'elec' ? '#38bdf8' : null);
      const isNext = !col && previewCol && i === dna.length;
      c.save();
      if (isNext) {
        const p = 1 + Math.sin(G.t * 10) * 0.16;
        c.translate(px, cy); c.scale(p, p); c.translate(-px, -cy);
      }
      hexPath(c, px, cy, rad);
      c.fillStyle = col || (isNext ? previewCol : '#152033');
      if (isNext) c.globalAlpha = 0.78;
      c.fill();
      c.globalAlpha = 1;
      c.lineWidth = col || isNext ? Math.max(1.4, rad * 0.26) : Math.max(1.0, rad * 0.2);
      c.strokeStyle = col || isNext ? '#ffffff' : '#475569';
      c.stroke();
      c.restore();
    }
  }

  function initUI() {
    const cv = document.getElementById('hud'); U.ctx = cv.getContext('2d'); U.ctx.imageSmoothingEnabled = false;
    const mk = (seg, col) => {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((seg + 1) * 6), 3)); const idx = [];
      for (let i = 0; i < seg; i++) { const a = i * 2; idx.push(a, a + 1, a + 3, a, a + 3, a + 2); } g.setIndex(idx);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6, side: THREE.DoubleSide }));
      m.frustumCulled = false; m.visible = false; m.renderOrder = 6; m.seg = seg; R.scene.add(m); return m;
    };
    U.rangeMesh = mk(96, new THREE.Color(1.5, 1.15, .6)); U.padMesh = mk(40, new THREE.Color(2.2, 1.7, .9));
    U.touch = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
    const D = () => R.dpr || 1, pos = e => [e.clientX * D(), e.clientY * D()];
    window.addEventListener('pointerdown', e => {
      const [x, y] = pos(e); U.touch = e.pointerType !== 'mouse'; U.mx = x; U.my = y; U.inside = true; U.gp.active = false; U.moved = 0;
      U.ptrs.set(e.pointerId, { x, y, x0: x, y0: y });
      audioGesture();
      CAM.za = null;
      if (U.ptrs.size === 1) {
        const b = btnAt(x, y);
        const ch = typeof CHARGE !== 'undefined' ? CHARGE : null;
        if (!b && !hudAt(x, y) && ch && (ch.state === 'armed' || ch.state === 'active')) {
          const pt = ch.screenToWorld(x, y);
          if (pt) {
            touchInput();
            if (ch.state === 'armed') { ch.trigger(pt.x, pt.z); buzz(14); }
            else ch.moveTo(pt.x, pt.z);
          }
          U.gest = { mode: 'charge', hud: true, btn: null }; U.press = null;
        } else {
          U.gest = { mode: 'tap', hud: !!b || hudAt(x, y), btn: b }; U.press = b ? b.id : null;
        }
      }
      else if (U.ptrs.size === 2) { const [a, b] = [...U.ptrs.values()]; U.gest = { mode: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; U.press = null; }
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('pointermove', e => {
      const [x, y] = pos(e), p = U.ptrs.get(e.pointerId);
      if (e.pointerType === 'mouse' || p) { U.mx = x; U.my = y; U.inside = true; U.moved = 0; U.gp.active = false; }
      if (typeof CHARGE !== 'undefined' && (CHARGE.state === 'armed' || CHARGE.state === 'active') && (e.pointerType === 'mouse' || p)) {
        const pt = CHARGE.screenToWorld(x, y);
        if (pt) CHARGE.moveTo(pt.x, pt.z);
      }
      if (!p) return;
      const g = U.gest;
      if (g && g.mode === 'charge') { p.x = x; p.y = y; return; }
      if (g && g.mode === 'pinch' && U.ptrs.size >= 2) {
        p.x = x; p.y = y; const [a, b] = [...U.ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y) || 1, cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        camPan(cx - g.cx, cy - g.cy); camZoomAt(d / g.d, cx, cy); g.d = d; g.cx = cx; g.cy = cy; return;
      }
      if (g && g.mode === 'tap' && !g.hud && Math.hypot(x - p.x0, y - p.y0) > (U.touch ? 10 : 6) * D()) { g.mode = 'pan'; U.press = null; }
      if (g && g.mode === 'pan') camPan(x - p.x, y - p.y);
      p.x = x; p.y = y;
    });
    const up = e => {
      const p = U.ptrs.get(e.pointerId); if (!p) return; U.ptrs.delete(e.pointerId); audioGesture(); U.keepAwake();
      const g = U.gest;
      if (U.ptrs.size === 0) { if (g && g.mode === 'tap' && e.type === 'pointerup') onTap(p.x, p.y, g.btn); U.gest = null; U.press = null; if (U.touch) U.inside = false; }
      else if (g && g.mode === 'pinch') U.gest = { mode: 'pan' };
    };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    window.addEventListener('pointerleave', () => { if (!U.ptrs.size) U.inside = false; });
    document.addEventListener('mouseleave', () => { if (!U.ptrs.size) U.inside = false; });
    window.addEventListener('wheel', e => { const [x, y] = pos(e), d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY; camZoomTo(camZoomNow() * Math.exp(-clamp(d, -160, 160) * (e.ctrlKey ? .012 : .0024)), x, y, 16); e.preventDefault(); }, { passive: false });
    const stop = e => { if (e.cancelable) e.preventDefault(); };
    for (const ev of ['touchmove', 'touchcancel', 'dblclick', 'gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, stop, { passive: false });
    document.addEventListener('touchstart', e => {
      stop(e); const n = e.touches.length;
      if (n < U.ptrs.size) { const keys = [...U.ptrs.keys()]; for (let i = 0; i < keys.length - n; i++) U.ptrs.delete(keys[i]); if (U.ptrs.size <= 1) { const p = [...U.ptrs.values()][0]; U.gest = p ? { mode: 'tap', hud: !!btnAt(p.x, p.y) || hudAt(p.x, p.y) } : null; } }
    }, { passive: false });
    document.addEventListener('touchend', e => { audioGesture(); stop(e); if (!e.touches.length && U.ptrs.size) setTimeout(() => { if (U.ptrs.size) U.dropTouches(); }, 80); }, { passive: false });
    if (window.visualViewport) for (const ev of ['resize', 'scroll']) window.visualViewport.addEventListener(ev, fixPageZoom);
    try { if (localStorage.getItem('cinderwatch.muted') === '1') AU.muted = true; G.best = +localStorage.getItem('cinderwatch.best') || 0; } catch (e) {}
    window.addEventListener('keyup', e => { U.keys.delete(e.code); });
    window.addEventListener('blur', () => U.keys.clear());
    window.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('keydown', e => {
      if (PAN[e.code] && !e.ctrlKey && !e.metaKey && !e.altKey) { U.keys.add(e.code); e.preventDefault(); }
      if (e.repeat) return; audioGesture(); U.keepAwake(); U.touch = false;
      const k = e.key;
      if (k === '1') {
        const t = (U.menu && U.menu.tower) || (U.hover && U.hover.tower);
        if (t) { touchInput(); doMutate(t, 'fire'); } else pickKind('archer');
        e.preventDefault();
      }
      else if (k === '2' || k === 'e' || k === 'E') {
        const t = (U.menu && U.menu.tower) || (U.hover && U.hover.tower);
        if (t) { touchInput(); doMutate(t, 'elec'); e.preventDefault(); }
      }
      else if (k === 'u' || k === 'U') {
        const t = (U.menu && U.menu.tower) || (U.hover && U.hover.tower);
        if (t) { touchInput(); doMutate(t, 'fire'); }
      }
      else if (k === ' ' || k === 'Enter') { callWave(); e.preventDefault(); }
      else if (k === 'Escape') { U.closeMenu(); if (typeof CHARGE !== 'undefined') CHARGE.cancel(); }
      else if (k === 'q' || k === 'Q') { toggleCharge(); e.preventDefault(); }
      else if (k === 'x' || k === 'X' || k === 'Delete' || k === 'Backspace') { const t = U.menu && U.menu.tower; if (t) { touchInput(); if (U.menu.armedId === 'sell') doSell(t); else { U.menu.armedId = 'sell'; sfx('uiHover', t.x, t.z, .8); } } }
      else if (k === 'p' || k === 'P') { togglePause(); }
      else if (k === 'Tab') { cycleSpeed(); e.preventDefault(); }
      else if (k === '0') { camReset(); }
      else if (k === 'm' || k === 'M') { setMute(!AU.muted); }
      else if (k === 'l' || k === 'L') { togglePerf(); }
      else if (k === '+' || k === '=') { camZoomBy(1.4); }
      else if (k === '-' || k === '_') { camZoomBy(1 / 1.4); }
      else if (k === 'c' || k === 'C') { toggleCommand(); }
      else if (k === 'f' || k === 'F' || k === 'Home') { camReset(); }
    });
  }
  const PAN = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1], KeyA: [1, 0], KeyD: [-1, 0], KeyW: [0, 1], KeyS: [0, -1] };
  function togglePause() { G.paused = !G.paused; sfx('uiClick', CAM.x, CAM.z, .6); }
  function cycleSpeed() { G.speed = G.speed % 3 + 1; if (G.paused) G.paused = false; sfx('uiClick', CAM.x, CAM.z, .6); }
  function soundTap() { if (AU.ready && U.sndArmed) setMute(!AU.muted); }
  function togglePerf() {
    if (typeof setPerfMode !== 'function') return;
    const on = setPerfMode(!R.perf, false);
    U.banner(on ? 'Grafica Lite: ON' : 'Grafica HD: ON', 1.5, false);
    sfx('uiClick', CAM.x, CAM.z, .6);
    buzz(8);
  }
  function toggleCharge() {
    if (typeof CHARGE === 'undefined' || G.phase !== 'play') return;
    touchInput();
    if (CHARGE.state === 'ready' || CHARGE.state === 'armed') {
      CHARGE.arm();
      buzz(10);
    } else if (CHARGE.state === 'cooling') {
      deny();
    }
  }
  U.sawMonster = type => { if (G.seen[type]) return; G.seen[type] = 1; if (MON[type].tip && U.tips.length < 4) U.tips.push(type); };
  U.keepAwake = () => { try { if (navigator.wakeLock && !document.hidden && (!U.wake || U.wake.released)) navigator.wakeLock.request('screen').then(w => { U.wake = w; }, () => {}); } catch (e) {} };
  U.dropTouches = () => { U.ptrs.clear(); U.gest = null; U.press = null; if (U.touch) U.inside = false; };
  function fixPageZoom() {
    const vv = window.visualViewport, m = document.getElementById('vp'); if (!vv || !m || Math.abs(vv.scale - 1) < .02) { U.vvN = 0; return; }
    const now = performance.now(); if (now - U.vvT < 250 || U.vvN > 12) return; U.vvT = now; U.vvN++;
    const c = 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
    m.setAttribute('content', c + ',shrink-to-fit=no'); setTimeout(() => { m.setAttribute('content', c); try { window.scrollTo(0, 0); } catch (e) {} resizeRenderer(); }, 40);
  }
  function setMute(b) { AU.setMuted(b); try { localStorage.setItem('cinderwatch.muted', b ? '1' : '0'); } catch (e) {} }
  function fullscreenOK() { const d = document; return !!(d.fullscreenEnabled || d.webkitFullscreenEnabled) && !(window.navigator.standalone); }
  function isFull() { const d = document; return !!(d.fullscreenElement || d.webkitFullscreenElement); }
  function toggleFull() {
    const d = document, el = d.documentElement;
    try { if (isFull()) (d.exitFullscreen || d.webkitExitFullscreen).call(d); else { const r = (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: 'hide' }); if (r && r.catch) r.catch(() => {}); } } catch (e) {}
  }
  function buzz(p) { if (U.touch && navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } }
  function inRect(r, x, y, min = 0) {
    if (!r) return false;
    if (r.cx !== undefined && r.rad !== undefined) {
      const rr2 = Math.max(r.rad, min * (R.dpr || 1) * 0.5);
      return Math.hypot(x - r.cx, y - r.cy) <= rr2;
    }
    const m = min * (R.dpr || 1), mw = Math.max(0, m - r.w) / 2, mh = Math.max(0, m - r.h) / 2;
    return x >= r.x - mw && x <= r.x + r.w + mw && y >= r.y - mh && y <= r.y + r.h + mh;
  }
  function btnAt(x, y) { const m = U.touch ? 44 : 0; for (const b of U.btns) if (inRect(b, x, y, m)) return b; for (const b of U.hud) if (inRect(b, x, y, m)) return b; return null; }
  function hudAt(x, y) { return inRect(U.menuRect, x, y, 0); }
  function callWave() { touchInput(); if (callWaveEarly()) { sfx('uiClick', CAM.x, CAM.z, .8); buzz(10); } else sfx('uiDeny', CAM.x, CAM.z, .5); }
  function audioGesture() { if (!AU.ready) AU.unlock(); }
  function touchInput() { U.idle = 0; U.manual = true; }
  function toggleCommand() { U.setManual(!U.manual); U.idle = 0; sfx('uiClick', CAM.x, CAM.z, .8); }
  function deny() { U.deny = 1; sfx('uiDeny', CAM.x, CAM.z, .6); buzz([18, 40, 18]); }
  function doBuild(pad, kind) { touchInput(); if (buildTower(pad, kind || 'archer', true)) { sfx('uiClick', pad.x, pad.z, .8); buzz(12); U.menu = null; U.armed = null; return true; } deny(); return false; }
  function doMutate(t, elem) {
    if (mutateTower(t, elem, true)) {
      sfx('uiClick', t.x, t.z, .8); buzz(12);
      if (U.menu && U.menu.tower === t && t.lvl < 4) { U.menu.armedId = null; }
      else U.menu = null;
      return true;
    }
    deny(); return false;
  }
  function doSell(t) { if (sellTower(t)) { U.menu = null; return true; } return false; }
  function pickKind(kind) {
    touchInput();
    if (U.menu && U.menu.pad && !U.menu.pad.tower) { doBuild(U.menu.pad, kind); return; }
    if (U.hover && !U.hover.tower) { doBuild(U.hover.pad, kind); return; }
    if (U.gp.active && U.gp.sel >= 0 && !G.B.pads[U.gp.sel].tower) { doBuild(G.B.pads[U.gp.sel], kind); return; }
    U.armed = U.armed === kind ? null : kind; U.menu = null; sfx('uiHover', CAM.x, CAM.z, .7);
  }
  function pickPad(mx, my) {
    if (!G.B || G.phase !== 'play') return null;
    const cam = R.cam; _o.set(mx / R.dw * 2 - 1, 1 - my / R.dh * 2, -1).unproject(cam); cam.getWorldDirection(_d);
    let best = null, bd = 1e9; const slop = U.touch ? clamp(24 * (R.viewW || 40) / (R.cssW || 800), 1.55, 2.3) : 1.55;
    for (const pad of G.B.pads) {
      const top = pad.tower ? Math.min(3.4, pad.tower.mounts ? pad.tower.mounts.top : 2) : .1;
      for (let h = 0; h <= top; h += .6) {
        const t = (pad.y + h - _o.y) / _d.y, x = _o.x + _d.x * t, z = _o.z + _d.z * t, d = Math.hypot(x - pad.x, z - pad.z), r = h === 0 ? slop : slop - .55;
        if (d < r && d + h * .01 < bd) { bd = d; best = pad; }
      }
    }
    return best ? { pad: best, tower: best.tower } : null;
  }
  function onTap(x, y, held) {
    const now = performance.now();
    const b = held && inRect(held, x, y, U.touch ? 44 : 8) ? held : btnAt(x, y); if (b) { if (!b.hud) touchInput(); b.fn(); return; }
    if (inRect(U.menuRect, x, y, 0)) return;
    const h = pickPad(x, y);
    if (h) {
      touchInput(); U.lastTap.t = -9;
      if (!h.tower && U.armed) { doBuild(h.pad, U.armed); return; }
      if (U.menu && U.menu.pad === h.pad) { U.menu = null; return; }
      U.menu = { pad: h.pad, tower: h.tower, t: 0, focus: 0, sel: null, armedId: null }; U.armed = null; sfx('uiHover', h.pad.x, h.pad.z, .9); buzz(6); return;
    }
    if (U.menu || U.armed) { U.menu = null; U.armed = null; U.lastTap.t = -9; return; }
    if (now - U.lastTap.t < 330 && Math.hypot(x - U.lastTap.x, y - U.lastTap.y) < 40 * (R.dpr || 1)) { U.lastTap.t = -9; if (CAM.man && CAM.mzoom > 1.3) camReset(); else camZoomTo(Math.max(1.9, (CAM.man ? CAM.mzoom : CAM.zoom) * 1.6), x, y); }
    else { U.lastTap.t = now; U.lastTap.x = x; U.lastTap.y = y; }
  }
  function setRing(mesh, cx, cz, radius, width) {
    const P = mesh.geometry.attributes.position, a = P.array, H = G.B.heightAt, n = mesh.seg;
    for (let i = 0; i <= n; i++) { const t = i / n * TAU, c = Math.cos(t), s = Math.sin(t); for (let k = 0; k < 2; k++) { const r = radius + (k ? width : 0), x = cx + c * r, z = cz + s * r, o = (i * 2 + k) * 3; a[o] = x; a[o + 1] = H(x, z) + .1; a[o + 2] = z; } }
    P.needsUpdate = true; mesh.visible = true;
  }
  function pollGamepad(dt) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : []; let gp = null; for (const p of pads) if (p && p.connected) { gp = p; break; }
    if (!gp || !G.B || G.phase !== 'play') return;
    const st = U.gp, b = i => !!(gp.buttons[i] && gp.buttons[i].pressed), was = i => !!st.prev[i], hit = i => b(i) && !was(i);
    let ax = (Math.abs(gp.axes[0]) > .5 ? Math.sign(gp.axes[0]) : 0) + (b(15) ? 1 : 0) - (b(14) ? 1 : 0), ay = (Math.abs(gp.axes[1]) > .5 ? Math.sign(gp.axes[1]) : 0) + (b(13) ? 1 : 0) - (b(12) ? 1 : 0);
    st.t -= dt;
    if ((ax || ay) && st.t <= 0) {
      st.t = .22; st.active = true; touchInput(); audioGesture();
      if (U.menu) { const n = U.btns.length || 1; U.menu.focus = ((U.menu.focus + (ax || ay)) % n + n) % n; sfx('uiHover', CAM.x, CAM.z, .6); }
      else {
        const P = G.B.pads; if (st.sel < 0) st.sel = 0; const cur = proj(P[st.sel].x, P[st.sel].y, P[st.sel].z); let best = -1, bs = 1e9;
        P.forEach((p, i) => { if (i === st.sel) return; const q = proj(p.x, p.y, p.z), dx = q.x - cur.x, dy = q.y - cur.y, along = dx * ax + dy * ay; if (along <= 4) return; const off = Math.abs(-dx * ay + dy * ax), sc = along + off * 2.2; if (sc < bs) { bs = sc; best = i; } });
        if (best >= 0) { st.sel = best; sfx('uiHover', CAM.x, CAM.z, .6); }
      }
    }
    if (!ax && !ay) st.t = 0;
    if (hit(0)) { touchInput(); audioGesture(); st.active = true; if (st.sel < 0) st.sel = 0; if (U.menu) { const bt = U.btns[U.menu.focus]; if (bt) bt.fn(); } else { const pad = G.B.pads[st.sel]; U.menu = { pad, tower: pad.tower, t: 0, focus: 0, sel: null, armedId: null }; sfx('uiHover', pad.x, pad.z, .9); } }
    if (hit(1)) { U.closeMenu(); touchInput(); }
    if (hit(2)) { const pad = st.sel >= 0 ? G.B.pads[st.sel] : null; if (pad && pad.tower) { touchInput(); doMutate(pad.tower, 'fire'); } }
    if (hit(3) || hit(9)) callWave();
    for (let i = 0; i < 16; i++) st.prev[i] = b(i);
  }

  function update(dt) {
    U.idle += dt; U.moved += dt; U.hurt = Math.max(0, U.hurt - dt * 1.6); U.goldBump = Math.max(0, U.goldBump - dt * 5); U.deny = Math.max(0, U.deny - dt * 3); U.titleT += dt; U.slainBump = Math.max(0, U.slainBump - dt * 4);
    if (G.slain !== U.lastSlain) { U.lastSlain = G.slain; U.slainBump = 1; }
    { const dpr = R.dpr || 1, iw = n => PX.iconSize(n)[0], m3 = PX.measure('000'); let sc = Math.max(2, Math.round(clamp(Math.min(R.cssH / 430, R.cssW / 225), 1.6, 4) * dpr));
      let st = 4; for (const [ic, v] of [['flame', G.lives], ['coin', Math.floor(U.goldShown)], ['skull', G.slain]]) st += iw(ic) + 8 + Math.max(PX.measure('' + v), m3);
      const cm = Math.max(iw('helm') + 3 + PX.measure('AI commander'), PX.measure(U.touch ? 'Tap a pad to play' : 'Click a pad to take over')) + 12, minS = Math.max(2, Math.ceil(1.3 * dpr));
      while (sc > minS && (st + cm + 13) * sc + R.safe[0] + R.safe[2] > R.dw) sc--;
      U.s = sc; }
    U.panning = !!(U.gest && U.gest.mode === 'pan');
    if (AU.ready && !U.ptrs.size) U.sndArmed = true;
    if (U.keys.size) { let kx = 0, ky = 0; for (const k of U.keys) { kx += PAN[k][0]; ky += PAN[k][1]; } if (kx || ky) { CAM.za = null; camPan(kx * R.dh * .9 * dt, ky * R.dh * .9 * dt); } }
    if (U.tip) { U.tip.t += dt; if (U.tip.t > 5.2) U.tip = null; } else if (U.tips.length && U.titleT > 7.5) U.tip = { type: U.tips.shift(), t: 0 };
    if (window.visualViewport && Math.abs(window.visualViewport.scale - 1) > .02) fixPageZoom();
    pollGamepad(dt);
    if (U.menu) { U.menu.t += dt; if ((U.menu.tower && !U.menu.tower.alive) || G.phase !== 'play') U.menu = null; else if (U.menu.pad.tower !== U.menu.tower) U.menu.tower = U.menu.pad.tower; }
    if (G.phase !== 'play') { U.armed = null; U.hover = null; }
    else U.hover = (U.inside && !U.touch && !U.hotBtn && !U.panning && !(typeof CHARGE !== 'undefined' && (CHARGE.state === 'armed' || CHARGE.state === 'active'))) ? pickPad(U.mx, U.my) : null;
    if (U.goldShown > G.gold) U.goldShown = G.gold;
    if (!U.coins.length && U.goldShown < G.gold) U.goldShown = Math.min(G.gold, U.goldShown + Math.max(1, (G.gold - U.goldShown) * 6 * dt));
    const tgt = U.menu ? U.menu : (U.gp.active && U.gp.sel >= 0 && G.phase === 'play' ? { pad: G.B.pads[U.gp.sel], tower: G.B.pads[U.gp.sel].tower } : U.hover);
    if (tgt && G.B && G.phase === 'play') {
      const pad = tgt.pad, pulse = .5 + .5 * Math.sin(G.t * 5);
      setRing(U.padMesh, pad.x, pad.z, 1.5, .1); U.padMesh.material.opacity = .45 + .25 * pulse;
      let range = TOWER.archer.range[0], rCol = [1.5, 1.15, .6];
      if (tgt.tower) {
        const armedElem = (U.menu && U.menu.armedId && U.menu.armedId.startsWith('m')) ? U.menu.armedId.slice(1) : null;
        const previewElem = armedElem || (U.menu && U.hotBtn && U.hotBtn.elem);
        const pr = (previewElem && tgt.tower.lvl < 4 && canAddDna(tgt.tower.dna, previewElem).ok) ? catProfile(tgt.tower.dna.concat([previewElem])) : tgt.tower.prof;
        range = pr.range;
        rCol = pr.model === 'elec' ? [.55, 1.45, 2.0] : (pr.model === 'fire' ? [1.9, .85, .35] : [1.5, 1.15, .6]);
      } else if (U.menu && U.menu.armedId === 'barcher') {
        rCol = [1.2, 2.0, 1.0];
      }
      U.rangeMesh.material.color.setRGB(rCol[0], rCol[1], rCol[2]);
      setRing(U.rangeMesh, pad.x, pad.z, range, .07); U.rangeMesh.material.opacity = .36;
    } else { U.padMesh.visible = false; U.rangeMesh.visible = false; }
    R.canvas.style.cursor = U.panning ? 'grabbing' : (U.hotBtn || U.hover || U.hudHot) ? 'pointer' : 'default';
  }

  function draw() {
    const c = U.ctx, s = U.s, W = R.dw, H = R.dh, pad = 5 * s, LH = PX.LINE * s;
    c.clearRect(0, 0, W, H); U.btns.length = 0; let hot = null;
    const pix = Math.max(1, Math.round(R.dh / R.ih));
    for (const b of G.hbars) {
      const p = proj(b.x, b.y, b.z), w = (b.boss ? 34 : b.man ? 8 : 9) * pix, h = (b.boss ? 2 : 1) * pix, x = Math.round(p.x - w / 2), y = Math.round(p.y);
      if (x < -w || x > W || y < 0 || y > H) continue;
      c.globalAlpha = b.f >= .999 ? .4 : .95;
      c.fillStyle = COLR.dark; c.fillRect(x - pix, y - pix, w + 2 * pix, h + 2 * pix);
      c.fillStyle = b.man ? '#7fb6ea' : (b.f > .5 ? '#d9a13c' : b.f > .25 ? '#e0762c' : '#e04a32'); c.fillRect(x, y, Math.max(pix, Math.round(w * b.f)), h);
      c.globalAlpha = 1;
      if (b.boss) text(b.name, p.x, y - LH - 2 * pix, COLR.tx, { align: 'c', outline: COLR.dark });
    }
    const [iL, iT, iR, iB] = R.safe, Wr = W - iR, Hb = H - iB, tch = U.touch, mouse = U.inside && !tch && !U.panning;
    const over = (x, y, w, h) => mouse && U.mx >= x && U.mx <= x + w && U.my >= y && U.my <= y + h;
    const stats = [['flame', '' + G.lives, U.hurt > 0 ? COLR.red : COLR.tx], ['coin', '' + Math.floor(U.goldShown), U.deny > 0 ? COLR.red : (U.goldBump > 0 ? '#ffe2a0' : COLR.tx)], ['skull', '' + G.slain, U.slainBump > .5 ? '#ffffff' : COLR.tx]];
    let wS = pad; for (const st of stats) wS += PX.iconSize(st[0])[0] * s + 2 * s + Math.max(tw(st[1]), tw('000')) + 6 * s; wS += pad - 6 * s;
    const hS = 10 * s + pad * 2 - 2 * s, x0 = 5 * s + iL, y0 = 5 * s + iT + U.insetTop;
    plate(x0, y0, wS, hS, U.hurt > 0 ? { bd: COLR.red } : {});
    let x = x0 + pad; const goldPos = { x: 0, y: 0 };
    for (const st of stats) {
      const [iw, ih] = PX.iconSize(st[0]); const iy = y0 + Math.round((hS - ih * s) / 2);
      PX.icon(c, st[0], x, iy, s, st[0] === 'flame' ? .55 + .45 * (G.lives / G.maxLives) : 1); if (st[0] === 'coin') { goldPos.x = x + iw * s / 2; goldPos.y = iy + ih * s / 2; }
      x += iw * s + 2 * s; text(st[1], x, y0 + Math.round((hS - LH) / 2) + s, st[2]); x += Math.max(tw(st[1]), tw('000')) + 6 * s;
    }
    const wn = 'Wave ' + Math.max(1, waveNumber()), callable = G.phase === 'play' && !G.spawning && !G.bossWave && G.nextIn > .4;
    let sub, frac = -1;
    if (G.phase === 'play') { if (!G.spawning && !G.bossWave && G.nextIn > 0) { sub = callable && (tch || over(U.waveRect ? U.waveRect.x : -1, U.waveRect ? U.waveRect.y : -1, U.waveRect ? U.waveRect.w : 0, U.waveRect ? U.waveRect.h : 0)) ? (tch ? 'Chiama subito · +' : 'Chiama ora · +') + Math.round(G.nextIn * 3) : 'Prossima tra ' + Math.ceil(G.nextIn) + 's'; frac = 1 - G.nextIn / 6.5; } else { const n = G.mons.length + G.queue.length; sub = n + ' in marcia'; } }
    else sub = G.phase === 'defeat' ? 'Nucleo esaurito' : G.phase === 'clear' ? 'Boss sconfitto' : 'Nuova mappa in arrivo';
    const bw = PX.iconSize('banner')[0] * s, wW = Math.max(bw + 3 * s + tw(wn), tw(sub), tw('Next wave in 0'), tw('Tap to call · +00')) + pad * 2 + 4 * s, hW = LH * 2 + pad * 2 + s;
    const you = U.playerActive(), ct = you ? 'Comando Manuale' : 'Comandante IA', cs = tch ? (you ? 'Tocca per IA' : 'Tocca piazzola') : (you ? 'Click per IA' : 'Click su piazzola');
    const ic = you ? 'hand' : 'helm', icw = PX.iconSize(ic)[0] * s, cW = Math.max(icw + 3 * s + tw(ct), tw(cs)) + pad * 2 + 2 * s, xc = Wr - cW - 5 * s, g3 = 3 * s;
    const xw = Math.round(W / 2 - wW / 2);
    let yc = y0, yw = y0;
    if (xc < x0 + wS + g3) yc = y0 + hS + g3;
    if (xw < x0 + wS + g3 || (yc === y0 && xw + wW > xc - g3) || yc !== y0) yw = Math.max(y0 + hS, yc + (yc === y0 || xw + wW > xc - g3 ? hW : 0)) + g3;
    const topH = Math.max(y0 + hS, yc + hW, yw + hW) - y0; R.hudTop = y0 + topH;
    U.hud.length = 0; U.hudHot = false;
    const hotW = callable && over(xw, yw, wW, hW); U.waveRect = callable ? { id: 'wave', x: xw, y: yw, w: wW, h: hW, hot: hotW, fn: callWave, hud: true } : null; if (callable) U.hud.push(U.waveRect); if (hotW) U.hudHot = true;
    plate(xw, yw, wW, hW, hotW ? { bd: COLR.bdHi, bg: COLR.bg2 } : callable && tch ? { bd: '#8a6a3a' } : {});
    const tx0 = Math.round(W / 2 - (bw + 3 * s + tw(wn)) / 2);
    PX.icon(c, 'banner', tx0, yw + pad - s, s); text(wn, tx0 + bw + 3 * s, yw + pad, COLR.amber);
    text(sub, W / 2, yw + pad + LH + s, callable && (tch || hotW) ? COLR.tx : COLR.dim, { align: 'c' });
    if (frac >= 0) { c.fillStyle = '#2a2620'; c.fillRect(xw + 3 * s, yw + hW - 3 * s, wW - 6 * s, s); c.fillStyle = COLR.amber; c.fillRect(xw + 3 * s, yw + hW - 3 * s, Math.round((wW - 6 * s) * sat(frac)), s); }
    const hotC = over(xc, yc, cW, hW); U.cmdRect = { id: 'cmd', x: xc, y: yc, w: cW, h: hW, hot: hotC, fn: toggleCommand, hud: true }; U.hud.push(U.cmdRect); if (hotC) U.hudHot = true;
    plate(xc, yc, cW, hW, hotC ? { bd: COLR.bdHi, bg: COLR.bg2 } : you ? { bd: COLR.bdHi } : {});
    PX.icon(c, ic, xc + pad, yc + pad - s, s); text(ct, xc + pad + icw + 3 * s, yc + pad, you ? COLR.amber : COLR.tx); text(cs, xc + pad, yc + pad + LH + s, COLR.dim);
    const dpr = R.dpr || 1, hB = LH + pad * 2 - s, zb = tch ? Math.max(22 * s, Math.round(40 * dpr)) : hB, yB = Hb - zb - 5 * s; let tipB = null;
    const sq = (id, x, w, fn, tip, icon, on) => {
      const r = { id, x, y: yB, w, h: zb, fn, hud: true }, hot = over(x, yB, w, zb), down = U.press === id, dy = down ? s : 0; U.hud.push(r); if (hot) { U.hudHot = true; tipB = { x: x + w / 2, tip }; }
      plate(x, yB + dy, w, zb, hot || down ? { bd: COLR.bdHi, bg: COLR.bg2 } : on ? { bd: '#8a6a3a' } : {}); icon(x, yB + dy, hot || down); return r;
    };
    const glyph = (g, col) => (x, y) => { const k = Math.max(s, Math.floor(zb / 10)); PX.text(c, g, x + zb / 2, y + Math.round(zb / 2 - 3.5 * k), k, col, { align: 'c' }); };
    const label = (t, col) => (x, y) => { const k = Math.max(s, Math.floor(zb / 15)); PX.text(c, t, x + zb / 2, y + Math.round((zb - PX.LINE * k) / 2) + k, k, col, { align: 'c' }); };
    const bars = (x, y) => { const u = zb / 18; c.fillStyle = COLR.tx; if (G.paused) { for (let i = 0; i < 4; i++) c.fillRect(Math.round(x + (6.5 + i * 1.5) * u), Math.round(y + (5 + i) * u), Math.ceil(1.5 * u), Math.round((8 - 2 * i) * u)); } else { c.fillRect(Math.round(x + 6 * u), Math.round(y + 5 * u), Math.round(2.2 * u), Math.round(8 * u)); c.fillRect(Math.round(x + 9.8 * u), Math.round(y + 5 * u), Math.round(2.2 * u), Math.round(8 * u)); } };
    const corners = (x, y) => { const u = Math.round(zb / 9), q = Math.round(zb / 5), f = isFull(); c.fillStyle = COLR.tx; for (const [ax, ay] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const cx = x + (ax ? zb - q - u : q), cy = y + (ay ? zb - q - u : q), ix = f ? (ax ? -1 : 1) : (ax ? 1 : -1), iy = f ? (ay ? -1 : 1) : (ay ? 1 : -1); c.fillRect(cx, cy, u, u); c.fillRect(cx - ix * u, cy, u, u); c.fillRect(cx, cy - iy * u, u, u); } };
    const play = G.phase === 'play' || G.phase === 'defeat', nR = (fullscreenOK() && tch ? 3 : 2), rightW = nR * zb + (nR - 1) * g3;
    let xl = 5 * s + iL;
    sq('pause', xl, zb, togglePause, G.paused ? 'Resume (P)' : 'Pause (P)', bars, G.paused); xl += zb + g3;
    sq('speed', xl, zb, cycleSpeed, 'Speed (Tab)', label(G.speed + 'x', G.speed > 1 ? COLR.amber : COLR.tx), G.speed > 1); xl += zb + g3;
    { const on = AU.ready && !AU.muted, icn = on ? 'sound' : 'mute', k = Math.max(s, Math.floor(zb / 14)), [iw2, ih2] = PX.iconSize(icn), lbl = tch ? 'Tap for sound' : 'Click for sound', wl = iw2 * s + 3 * s + tw(lbl) + pad * 2;
      const wide = !AU.ready && xl + wl + g3 + zb + g3 + rightW + 5 * s + iR <= W;
      U.soundRect = sq('sound', xl, wide ? wl : zb, soundTap, AU.ready ? (AU.muted ? 'Sound is off (M)' : 'Sound is on (M)') : 'Sound', (x, y) => { if (wide) { PX.icon(c, icn, x + pad, y + Math.round((zb - ih2 * s) / 2), s, .85); text(lbl, x + pad + iw2 * s + 3 * s, y + Math.round((zb - LH) / 2) + s, COLR.tx); } else PX.icon(c, icn, x + Math.round((zb - iw2 * k) / 2), y + Math.round((zb - ih2 * k) / 2), k, AU.ready ? 1 : .8); }, !AU.ready);
      xl += (wide ? wl : zb) + g3; }
    sq('perf', xl, zb, togglePerf, R.perf ? 'Grafica Lite: ON (L)' : 'Grafica HD · clicca per Lite (L)', label(R.perf ? 'LT' : 'HD', R.perf ? COLR.cold : COLR.tx), R.perf); xl += zb + g3;
    if (typeof CHARGE !== 'undefined' && G.phase === 'play') {
      const ch = CHARGE, C = ch.cfg();
      const chLbl = ch.state === 'ready' ? 'LASER' : (ch.state === 'armed' ? 'PUNTA!' : (ch.state === 'active' ? ch.timer.toFixed(1) + 's' : Math.ceil(ch.cd) + 's'));
      const [liw, lih] = PX.iconSize('laser');
      const chW = Math.max(zb + 12 * s, liw * s + 5 * s + tw('PUNTA!') + pad * 2);
      const chTip = ch.state === 'ready' ? 'Carica Felina (Q) · Segui il puntino' : (ch.state === 'armed' ? 'Clicca sulla strada per lanciare!' : (ch.state === 'active' ? 'Muovi cursore/dito per guidare i gatti!' : 'Carica Felina in ricarica'));
      sq('charge', xl, chW, toggleCharge, chTip, (x, y) => {
        if (ch.state === 'cooling' && C.cooldown > 0) {
          const fracC = sat(1 - ch.cd / C.cooldown);
          c.fillStyle = 'rgba(255,46,85,0.22)';
          c.fillRect(x + 2 * s, y + 2 * s, Math.round((chW - 4 * s) * fracC), zb - 4 * s);
        } else if (ch.state === 'armed' || ch.state === 'active') {
          c.fillStyle = 'rgba(255,46,85,0.28)';
          c.fillRect(x + 2 * s, y + 2 * s, chW - 4 * s, zb - 4 * s);
        }
        PX.icon(c, 'laser', x + pad - s, y + Math.round((zb - lih * s) / 2), s, ch.state === 'cooling' ? 0.4 : 1);
        const colT = ch.state === 'armed' ? '#ffffff' : (ch.state === 'active' ? '#ff8a9e' : (ch.state === 'ready' ? '#ffd6de' : COLR.dim));
        text(chLbl, x + pad + liw * s + 2 * s, y + Math.round((zb - LH) / 2) + s, colT);
      }, ch.state === 'armed' || ch.state === 'active');
      xl += chW + g3;
    }
    let xr = Wr - 5 * s - zb; const cur = camZoomNow();
    if (nR === 3) { sq('full', xr, zb, toggleFull, 'Full screen', corners, false); xr -= zb + g3; }
    sq('zin', xr, zb, () => camZoomBy(1.5), 'Zoom in (+)', glyph('+', cur < 2.99 ? COLR.tx : '#5a5448'), false); xr -= zb + g3;
    sq('zout', xr, zb, () => camZoomBy(1 / 1.5), 'Zoom out (-)', glyph('-', cur > camZoomMin() + .01 ? COLR.tx : '#5a5448'), false);
    let yUp = yB - g3;
    if (CAM.man && play) {
      const lbl = 'Follow the fight', w = tw(lbl) + pad * 2, fits = xr - g3 - w >= xl, xf2 = fits ? xr - g3 - w : Wr - w - 5 * s, yf = fits ? yB + Math.round((zb - hB) / 2) : yB - g3 - hB, hotF = over(xf2, yf, w, hB);
      plate(xf2, yf, w, hB, hotF ? { bd: COLR.bdHi, bg: COLR.bg2 } : { bd: '#8a6a3a' }); text(lbl, xf2 + pad, yf + pad - s, COLR.tx);
      U.followRect = { id: 'follow', x: xf2, y: yf, w, h: hB, hot: hotF, fn: () => { camReset(); sfx('uiClick', CAM.x, CAM.z, .6); }, hud: true }; U.hud.push(U.followRect); if (hotF) U.hudHot = true; if (!fits) yUp = yf - g3;
    } else U.followRect = null;
    if (tipB && !tch) { const w = tw(tipB.tip) + pad * 2, x = clamp(Math.round(tipB.x - w / 2), 4 * s + iL, Wr - w - 4 * s); plate(x, yB - g3 - hB, w, hB, { bd: COLR.bdHi }); text(tipB.tip, x + pad, yB - g3 - hB + pad - s, COLR.tx); yUp = Math.min(yUp, yB - g3 - hB - g3); }
    const wrap = (str, maxW) => { const out = []; let cur2 = ''; for (const wd of str.split(' ')) { const t = cur2 ? cur2 + ' ' + wd : wd; if (cur2 && tw(t) > maxW) { out.push(cur2); cur2 = wd; } else cur2 = t; } if (cur2) out.push(cur2); return out; };
    const boxW = Wr - iL - 10 * s;
    if (typeof CHARGE !== 'undefined' && CHARGE.state === 'armed' && G.phase === 'play') {
      const t1 = tch ? 'Tocca e trascina il puntino rosso!' : 'Clicca sulla strada e guida il puntino rosso!';
      const w = tw(t1) + pad * 2, h = LH + pad * 2 - s;
      plate(Math.round(W / 2 - w / 2), yUp - h, w, h, { bd: '#ff2e55', bg: 'rgba(36,10,18,0.92)' });
      text(t1, W / 2, yUp - h + pad - s, '#ffd6de', { align: 'c' });
      yUp -= h + g3;
    }
    if (G.paused && !G.summary) { const k = s + 1, t1 = 'In Pausa', w = PX.measure(t1) * k + pad * 4, h = PX.LINE * k + pad * 2; plate(Math.round(W / 2 - w / 2), yUp - h, w, h, { bd: COLR.bdHi }); PX.text(c, t1, W / 2, yUp - h + pad, k, COLR.amber, { align: 'c' }); yUp -= h + g3; }
    if (U.tip && !U.menu) {
      const d = MON[U.tip.type], a = sat(Math.min(U.tip.t * 4, (5.2 - U.tip.t) * 2)), head = (d.boss ? 'Boss: ' : 'New: ') + d.name, lines = wrap(d.tip, Math.min(boxW - pad * 2, 46 * 6 * s));
      let w = tw(head); for (const l of lines) w = Math.max(w, tw(l)); w += pad * 2; const h = LH * (lines.length + 1) + pad * 2 - s, x = Math.round((iL + Wr - w) / 2), y = yUp - h;
      c.globalAlpha = a; plate(x, y, w, h, { bd: d.boss ? COLR.ember : '#8a6a3a' }); text(head, x + w / 2, y + pad - s, COLR.amber, { align: 'c' }); lines.forEach((l, k) => text(l, x + w / 2, y + pad - s + (k + 1) * LH, COLR.tx, { align: 'c' })); c.globalAlpha = 1; yUp = y - g3;
    } else {
      const first = U.titleT < 16, a = tch ? sat(Math.min(U.titleT - 7.2, first ? 1 : 3 - U.moved, U.manual && !first ? 0 : 1, 62 - U.titleT)) : sat(Math.min(U.titleT - 7.2, 3 - Math.min(U.moved, U.idle > 20 ? U.moved : 0) + (U.titleT < 18 ? 8 : 0)));
      if (a > .02 && !U.menu && !G.paused) {
        const parts = tch ? ['Tap a pad to place a cat', 'Tap a cat to mutate DNA', 'Pinch to zoom'] : ['Click pad: Gatto Base', 'Click cat: Fuoco (1) / Laser (2)', 'P pause · Space next wave'];
        let lines = [parts.join(' · ')]; if (tw(lines[0]) + pad * 2 > boxW) { lines = parts; }
        let w = 0; for (const l of lines) w = Math.max(w, tw(l)); w += pad * 2; const h = LH * lines.length + pad * 2 - s, hx = Math.round((iL + Wr - w) / 2), hy = yUp - h;
        if (w <= boxW) { c.globalAlpha = a; plate(hx, hy, w, h); lines.forEach((l, k) => text(l, hx + w / 2, hy + pad - s + k * LH, COLR.dim, { align: 'c' })); c.globalAlpha = 1; }
      }
    }
    for (let i = U.coins.length - 1; i >= 0; i--) {
      const q = U.coins[i]; q.t += R.frameDt; const u = sat(q.t / q.T), e = u * u * (3 - 2 * u), a = 1 - e;
      const px = a * a * q.sx + 2 * a * e * q.cx + e * e * goldPos.x, py = a * a * q.sy + 2 * a * e * q.cy + e * e * goldPos.y;
      PX.icon(c, 'coin', Math.round(px - 4 * s * .75), Math.round(py - 4 * s * .75), Math.max(2, s - 1), 1);
      if (u >= 1) { U.goldShown = Math.min(G.gold, U.goldShown + q.value); U.goldBump = 1; sfx('coin', CAM.x, CAM.z, .35, rnd()); U.coins.splice(i, 1); }
    }
    if (U.msg) {
      const m = U.msg; m.t += R.frameDt; const a = sat(Math.min(m.t * 3, (m.dur - m.t) * 2));
      if (m.t >= m.dur) U.msg = null; else { let sc = s + (m.big ? 2 : 1); while (sc > 2 && PX.measure(m.text) * sc + pad * 4 > Wr - iL - 6 * s) sc--; const w = PX.measure(m.text) * sc + pad * 4, h = PX.LINE * sc + pad * 2; c.globalAlpha = a; const yb = Math.max(Math.round(H * .2), y0 + topH + 4 * s); plate(Math.round(W / 2 - w / 2), yb, w, h, { bd: m.big ? COLR.ember : COLR.bdHi }); PX.text(c, m.text, W / 2, yb + pad, sc, m.big ? '#ffd9a8' : COLR.tx, { align: 'c' }); c.globalAlpha = 1; }
    }
    U.menuRect = null;
    if (U.menu && G.phase === 'play') {
      const m = U.menu, t = m.tower;
      const p0 = proj(m.pad.x, m.pad.y + (t ? 1.1 : 0.4), m.pad.z);
      const ease = 1 - Math.pow(1 - sat(m.t * 5.2), 3);
      const aAlpha = sat(m.t * 8);
      const uScale = Math.max(dpr, s * 0.42);
      const hexRad = Math.round((tch ? 30 : 27) * uScale);
      const sellRad = Math.round((tch ? 25 : 23) * uScale);
      const Rdist = Math.round((tch ? 78 : 72) * uScale);
      const pillH = LH + pad * 2 - 2 * s;

      // Clamp centro del menu radiale per non uscire mai dallo schermo o coprire HUD
      const marginX = Rdist + hexRad + 8 * s;
      const topLimit = y0 + topH + Rdist + hexRad + pillH + 10 * s;
      const botLimit = yB - Rdist - sellRad - 6 * s;
      const cx = Math.round(clamp(p0.x, iL + marginX, Wr - marginX));
      const cy = Math.round(clamp(p0.y, Math.min(topLimit, botLimit), Math.max(topLimit, botLimit)));

      // Rettangolo bounding per evitare pan accidentali dentro il menu
      U.menuRect = { x: cx - Rdist - hexRad, y: cy - Rdist - hexRad - pillH - 8 * s, w: (Rdist + hexRad) * 2, h: (Rdist + hexRad) * 2 + pillH + 8 * s };

      // Costruisci elenco nodi esagonali
      const nodes = [];
      let topEdgeY = cy - Rdist - hexRad;

      if (!t) {
        const cost0 = DNA_COSTS[0], can0 = G.gold >= cost0;
        const ny = cy - Math.round(Rdist * 0.92 * ease);
        topEdgeY = cy - Math.round(Rdist * 0.92) - hexRad;
        nodes.push({
          id: 'barcher', kind: 'build', icon: 'archer', label: 'Gatto Base',
          cost: cost0, col: '#f59e0b', enabled: can0, locked: false, reason: can0 ? null : 'dna',
          armed: m.armedId === 'barcher', x: cx, y: ny, rad: hexRad,
          onConfirm: () => doBuild(m.pad, 'archer')
        });
      } else {
        const nextCost = t.lvl < 4 ? DNA_COSTS[t.lvl + 1] : 0;
        const refRate = (typeof BAL !== 'undefined' && BAL.cfg) ? BAL.cfg.sellRefund : .5;
        const refund = Math.floor(t.spent * refRate);
        const nEl = RADIAL_ELEMS.length;
        const angs = nEl === 2
          ? [-Math.PI * 0.78, -Math.PI * 0.22]
          : [-Math.PI * 0.82, -Math.PI * 0.61, -Math.PI * 0.39, -Math.PI * 0.18];

        for (let i = 0; i < nEl; i++) {
          const el = RADIAL_ELEMS[i];
          const chk = canAddDna(t.dna, el.id);
          const afford = G.gold >= nextCost;
          const locked = !chk.ok;
          const id = 'm' + el.id;
          const rEl = nEl === 2 ? Rdist : Math.round(Rdist * 1.05);
          nodes.push({
            id, elem: el.id, kind: 'elem', icon: el.icon, label: el.name,
            cost: nextCost, col: el.col, enabled: chk.ok && afford, locked,
            reason: locked ? chk.reason : (afford ? null : 'dna'),
            armed: m.armedId === id,
            nextProf: chk.ok ? catProfile(t.dna.concat([el.id])) : null,
            x: Math.round(cx + Math.cos(angs[i]) * rEl * ease),
            y: Math.round(cy + Math.sin(angs[i]) * rEl * ease),
            rad: hexRad,
            onConfirm: () => doMutate(t, el.id)
          });
        }
        nodes.push({
          id: 'sell', kind: 'sell', icon: 'sell', label: 'Vendi',
          cost: '+' + refund, col: m.armedId === 'sell' ? '#ef4444' : '#e8b04a',
          enabled: true, locked: false, reason: null,
          armed: m.armedId === 'sell',
          x: cx, y: Math.round(cy + Rdist * 0.90 * ease), rad: sellRad,
          onConfirm: () => { buzz(16); doSell(t); }
        });
        topEdgeY = cy - Math.round((nEl === 2 ? Rdist * 0.64 : Rdist * 1.05)) - hexRad;
      }

      c.save();
      c.globalAlpha = aAlpha;

      // Sottile anello guida dell'Alveare Stretto
      c.beginPath(); c.arc(cx, cy, Rdist * 0.94 * ease, 0, TAU);
      c.strokeStyle = 'rgba(148, 163, 184, 0.24)';
      c.lineWidth = Math.max(1.5, 1.5 * uScale);
      c.stroke();

      // Disegna nodi esagonali + registra hit area in U.btns
      let focusNode = null;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const isSell = n.kind === 'sell';
        const btnObj = {
          id: n.id, elem: n.elem, cx: n.x, cy: n.y, rad: n.rad + 4 * uScale,
          x: n.x - n.rad, y: n.y - n.rad, w: n.rad * 2, h: n.rad * 2,
          fn: () => {
            if (n.locked) { m.armedId = null; deny(); return; }
            if (!isSell && !n.enabled) { m.armedId = null; deny(); return; }
            // 1° TAP: arma e mostra segno di spunta ✓; 2° TAP sulla stessa icona: conferma!
            if (m.armedId !== n.id) {
              m.armedId = n.id;
              sfx('uiHover', m.pad.x, m.pad.z, .85);
              buzz(8);
              return;
            }
            m.armedId = null;
            n.onConfirm();
          }
        };
        U.btns.push(btnObj);
        const ov = mouse && Math.hypot(U.mx - n.x, U.my - n.y) <= n.rad + 3 * uScale && !U.gp.active;
        const focused = U.gp.active && (U.btns.length - 1) === m.focus;
        if (ov) hot = btnObj;
        if (n.armed) focusNode = n;
        else if (!focusNode && (ov || focused)) focusNode = n;

        const dn = U.press === n.id;
        const lit = ov || focused || n.armed || dn;
        const bdCol = n.locked ? '#334155' : (n.armed ? (isSell ? '#ef4444' : '#4ade80') : (lit ? '#fde047' : (n.reason === 'dna' ? '#e5553c' : n.col)));

        c.save();
        c.translate(n.x, n.y + (dn ? s : 0));
        if ((lit && !n.locked) && !dn) c.scale(1.08, 1.08);
        // Esagono con bordo scuro esterno + cornice colorata
        hexPath(c, 0, 0, n.rad + 1.5 * uScale);
        c.fillStyle = 'rgba(7, 10, 16, 0.92)'; c.fill();
        hexPath(c, 0, 0, n.rad);
        c.fillStyle = n.locked ? 'rgba(15,21,32,0.88)' : (n.armed ? (isSell ? 'rgba(59,21,26,0.96)' : 'rgba(19,46,34,0.96)') : (lit ? 'rgba(29,43,66,0.96)' : 'rgba(18,28,44,0.94)'));
        c.fill();
        c.lineWidth = Math.max(1.8, (n.armed || lit ? 2.6 : 2.0) * uScale);
        c.strokeStyle = bdCol; c.stroke();

        // Icona pixel centrata
        const [iw, ih] = PX.iconSize(n.icon);
        const isc = Math.max(1, Math.round((n.rad * 0.92) / Math.max(iw, ih, 8)));
        PX.icon(c, n.icon, -Math.round(iw * isc / 2), -Math.round(ih * isc / 2) - Math.round(n.rad * 0.16), isc, (n.locked || !n.enabled || n.armed) ? 0.34 : 1);

        // Sovrapposizione Lucchetto o Segno di Spunta Conferma ✓
        if (n.locked) drawLockMark(c, 0, -n.rad * 0.14, n.rad * 0.72);
        else if (n.armed) drawConfirmMark(c, 0, -n.rad * 0.14, n.rad * 0.86, isSell);

        // Costo / Stato nella parte bassa dell'esagono
        const costTxt = n.locked ? (n.reason === 'max' ? 'MAX' : 'LOCK') : (n.armed ? 'OK' : String(n.cost));
        const cCol = n.locked ? '#64748b' : (n.armed ? '#ffffff' : (n.reason === 'dna' ? COLR.red : (isSell ? COLR.amber : COLR.tx)));
        const ks = Math.max(1, Math.round(s * 0.85));
        PX.text(c, costTxt, 0, Math.round(n.rad * 0.30), ks, cCol, { align: 'c', outline: COLR.dark });
        c.restore();
      }

      // 4 mini-esagoni DNA subito sopra la testa del gatto (con preview pulsante!)
      if (t) {
        const prevCol = (focusNode && focusNode.kind === 'elem' && !focusNode.locked) ? focusNode.col : null;
        drawHexPips(c, cx, cy - Math.round(Rdist * 0.46 * ease), t.dna, Math.round(13 * uScale), Math.round(5.2 * uScale), prevCol);
      }

      // Pillola Compatta superiore
      let pillTxt = t ? (t.prof.name + ' · ' + t.prof.tag) : 'Piazzola Libera';
      let pillCol = t ? (t.prof.model === 'elec' ? COLR.cold : (t.prof.model === 'fire' ? COLR.ember : COLR.amber)) : COLR.amber;
      if (focusNode) {
        if (focusNode.kind === 'build') {
          pillTxt = focusNode.armed ? ('OK? Gatto Base · ' + focusNode.cost) : ('Gatto Base · ' + focusNode.cost);
          pillCol = focusNode.armed ? '#4ade80' : COLR.amber;
        } else if (focusNode.kind === 'elem') {
          if (focusNode.locked) {
            pillTxt = focusNode.reason === 'max' ? 'DNA 4/4 (Max)' : (focusNode.label + ' Bloccato');
            pillCol = COLR.dim;
          } else if (focusNode.nextProf) {
            pillTxt = (focusNode.armed ? 'OK? ' : '→ ') + focusNode.nextProf.name + ' [' + focusNode.nextProf.tag + ']';
            pillCol = focusNode.armed ? '#4ade80' : focusNode.col;
          }
        } else if (focusNode.kind === 'sell') {
          pillTxt = focusNode.armed ? ('OK? Vendi ' + focusNode.cost) : ('Vendi ' + focusNode.cost + ' DNA');
          pillCol = focusNode.armed ? COLR.red : COLR.amber;
        }
      }
      const pw = tw(pillTxt) + pad * 2 + 4 * s;
      const px = Math.round(clamp(cx - pw / 2, iL + 4 * s, Wr - pw - 4 * s));
      const py = Math.round(clamp(topEdgeY - pillH - 6 * s, y0 + topH + 3 * s, Hb - pillH - 4 * s));
      plate(px, py, pw, pillH, { bg: 'rgba(10,14,24,0.94)', bd: pillCol });
      text(pillTxt, px + pw / 2, py + pad - s, pillCol, { align: 'c' });

      c.restore();
    }
    if (hot !== U.hotBtn && hot) sfx('uiHover', CAM.x, CAM.z, .5);
    U.hotBtn = hot;
    if (U.armed && mouse && G.phase === 'play') { const l = 'Gatto Base: click a pad', w = tw(l) + pad * 2; const xx = clamp(U.mx + 10 * s, 2 * s, W - w - 2 * s), yy = clamp(U.my + 10 * s, 2 * s, H - LH - pad * 2); plate(xx, yy, w, LH + pad * 2 - s, { bd: COLR.bdHi }); text(l, xx + pad, yy + pad - s, COLR.tx); }
    if (U.titleT < 7 && !U.menu) {
      const a = sat(Math.min((U.titleT - .4) * 1.5, (6.6 - U.titleT) * 1.2));
      if (a > 0) {
        const sc = s * 2, t1 = 'Purr-craft', full = G.B.bio.name + ' · In pausa: piazza i gatti e premi P.', t2 = tw(full) + pad * 4 > Wr - iL - 6 * s ? [G.B.bio.name, 'In pausa: piazza i gatti', 'e premi P per iniziare.'] : [full]; if (G.best > 5) t2.push('Best run: wave ' + G.best);
        let w = PX.measure(t1) * sc; for (const l of t2) w = Math.max(w, tw(l)); w += pad * 4; const h = PX.LINE * sc + LH * t2.length + pad * 2 + 2 * s, yy = Hb - h - 12 * s - zb;
        c.globalAlpha = a; plate(Math.round(W / 2 - w / 2), yy, w, h); PX.text(c, t1, W / 2, yy + pad, sc, '#ffd9a8', { align: 'c' }); t2.forEach((l, k) => text(l, W / 2, yy + pad + PX.LINE * sc + s + k * LH, k === 0 && t2.length > 1 ? COLR.tx : COLR.dim, { align: 'c' })); c.globalAlpha = 1;
      }
    }
    if (G.summary && (G.phase === 'clear' || G.phase === 'defeat')) {
      const sm = G.summary;
      const titleTxt = sm.won ? ('Livello ' + sm.level + ' Superato!') : 'Difesa Violata';
      const titleCol = sm.won ? COLR.amber : COLR.red;
      const hpLine = 'HP Nucleo: ' + sm.lives + '/' + sm.maxLives + (sm.won ? (' (' + Math.round(sm.lives * 100 / sm.maxLives) + '%)') : (' · Wave ' + sm.wave));
      const stLine = 'Abbattuti: ' + sm.slain + ' · DNA: ' + sm.dna;
      const tierTip = sm.won
        ? (sm.stars === 3 ? 'Valutazione Perfetta: 3/3 Zampe!' : (sm.stars === 2 ? '3 Zampe: chiudi al 100% HP' : '2 Zampe: chiudi con >=80% HP'))
        : 'Potenzia Fuoco vs Terra e Laser vs Aria';

      const bRetryLbl = 'Rigioca';
      const bNextLbl = 'Livello ' + (sm.level + 1);
      const bRestartLbl = 'Nuova Run';
      const btnH = (tch ? 26 : 20) * s;
      const maxTxtW = Math.max(
        PX.measure(titleTxt) * (s + 2),
        tw(hpLine),
        tw(stLine),
        tw(tierTip),
        (tw(bRetryLbl) + tw(bNextLbl) + 18 * s)
      );
      const cardW = Math.min(Wr - iL - 10 * s, maxTxtW + pad * 4);
      const starSz = Math.max(2, s + 1);
      const [stW, stH] = PX.iconSize('pawOn');
      const starsRowW = 3 * stW * starSz + 2 * 5 * s;
      const hasStars = sm.won ? (stH * starSz + 4 * s) : 0;
      const cardH = pad * 2 + PX.LINE * (s + 2) + 3 * s + hasStars + LH * 3 + 6 * s + btnH;
      const cx = Math.round((iL + Wr - cardW) / 2);
      const cy = Math.round(clamp((H - cardH) * .46, y0 + topH + 6 * s, Hb - cardH - 6 * s));

      U.menuRect = { x: cx, y: cy, w: cardW, h: cardH };
      plate(cx, cy, cardW, cardH, { bg: 'rgba(10,14,23,0.97)', bd: sm.won ? COLR.bdHi : COLR.red, hi: sm.won ? 'rgba(232,176,74,0.2)' : 'rgba(229,85,60,0.16)' });

      let curY = cy + pad;
      PX.text(c, titleTxt, cx + cardW / 2, curY, s + 2, titleCol, { align: 'c' });
      curY += PX.LINE * (s + 2) + 3 * s;

      if (sm.won) {
        const sx0 = Math.round(cx + (cardW - starsRowW) / 2);
        for (let i = 0; i < 3; i++) {
          const on = i < sm.stars;
          PX.icon(c, on ? 'pawOn' : 'pawOff', sx0 + i * (stW * starSz + 5 * s), curY, starSz, on ? 1 : 0.75);
        }
        curY += stH * starSz + 5 * s;
      }

      text(hpLine, cx + cardW / 2, curY, COLR.tx, { align: 'c' }); curY += LH + s;
      text(stLine, cx + cardW / 2, curY, COLR.dim, { align: 'c' }); curY += LH + s;
      text(tierTip, cx + cardW / 2, curY, sm.won ? COLR.ok : COLR.amber, { align: 'c' }); curY += LH + 5 * s;

      const by = cy + cardH - pad - btnH;
      if (sm.won) {
        const gapB = 5 * s;
        const bw2 = Math.floor((cardW - pad * 2 - gapB) / 2);
        const addSumBtn = (bx, id, lbl, primary, fn) => {
          const ov = over(bx, by, bw2, btnH);
          const b = { id, fn, x: bx, y: by, w: bw2, h: btnH };
          U.btns.push(b); if (ov) hot = b;
          const dn = U.press === id, lit = ov || dn;
          plate(bx, by + (dn ? s : 0), bw2, btnH, {
            bg: lit ? COLR.bg2 : (primary ? '#1c2b20' : 'rgba(16,18,27,0.96)'),
            bd: lit ? COLR.bdHi : (primary ? '#69a86b' : COLR.bd),
          });
          text(lbl, bx + bw2 / 2, by + Math.round((btnH - LH) / 2) + (dn ? s : 0) + s * .5, primary ? COLR.ok : COLR.tx, { align: 'c' });
        };
        addSumBtn(cx + pad, 'sumRetry', bRetryLbl, false, () => { replayCurrentLevel(); sfx('uiClick', CAM.x, CAM.z, .7); });
        addSumBtn(cx + pad + bw2 + gapB, 'sumNext', bNextLbl, true, () => { nextLevelBattle(); sfx('uiClick', CAM.x, CAM.z, .8); });
      } else {
        const bw1 = Math.min(cardW - pad * 2, tw(bRestartLbl) + 24 * s);
        const bx = Math.round(cx + (cardW - bw1) / 2);
        const ov = over(bx, by, bw1, btnH);
        const b = { id: 'sumFailRetry', fn: () => { replayCurrentLevel(); sfx('uiClick', CAM.x, CAM.z, .7); }, x: bx, y: by, w: bw1, h: btnH };
        U.btns.push(b); if (ov) hot = b;
        const dn = U.press === 'sumFailRetry', lit = ov || dn;
        plate(bx, by + (dn ? s : 0), bw1, btnH, { bg: lit ? COLR.bg2 : 'rgba(22,25,36,0.98)', bd: lit ? COLR.bdHi : COLR.amber });
        text(bRestartLbl, bx + bw1 / 2, by + Math.round((btnH - LH) / 2) + (dn ? s : 0) + s * .5, COLR.amber, { align: 'c' });
      }
    }

    if (HASH.fps) { text(R.fpsText || '', 6 * s + iL, Hb - 30 * s, COLR.ok, { outline: COLR.dark }); }
  }
  U.init = initUI; U.update = update; U.draw = draw;
  return U;
})();
