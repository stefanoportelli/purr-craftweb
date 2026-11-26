'use strict';

const COL0 = Object.assign({}, COL);
const BIOMES = [
  {
    key: 'lab', name: 'Il Laboratorio Segreto',
    col: {
      stone: 0x6b7482, stoneD: 0x3b424e, stoneL: 0x939eab,
      earth: 0x3b444c, earthD: 0x242b32,
      grass: 0x455652, grassD: 0x2e3c39, moss: 0x3d6b4c,
      road: 0x87909c, roadD: 0x565e69, mud: 0x2d4a34,
      bark: 0x333a44, tuftA: 0x497856, tuftB: 0x76b852,
      leaf: 0x2b5944, leafL: 0x46825c
    },
    strata: [0x586270, 0x2a313b, 0x3c5246, 0x727c8a, 0x242930, 0x485866, 0x8994a3, 0x2d3f35],
    hemi: [0x7da4c8, 0x1c252e, 1.2], moon: [0xb9d8f5, 1.45], fill: [0x4c9a7c, .32], moonPos: [14, 44, -34],
    clear: [.004, .007, .011], mistAmb: [.05, .10, .12], mist: [-.3, .45, .7, .1], sky: [.016, .034, .042], lift: [.010, .018, .024], sat: .95, expo: 1.0, sprAmb: [.06, .085, .10],
    cover: [.35, .55, .35, .45], coverCol: [.16, .34, .22], coverP: [.85, .4, .2, 0],
    wat: [3, .45, .7, 0], watA: [.014, .045, .032], watB: [.14, .42, .22], fall: [0, 1, 1, 0], fallA: [.03, .16, .06], fallB: [.24, .75, .28], spray: 'water',
    relief: [1.1, .25, .65, 0], puddles: 8, ponds: 2, sway: .5, wind: .7,
    wx: { n: [.08, .06], velA: [.18, -.08, .12], swayA: [.4, .5], sizeA: [.03, .055], colA: [.65, 1.05, .8, 1], alA: [.45, 0, 0], yA: [-1, 8], velB: [0, 0, 0], swayB: [0, 0], sizeB: [.04, .04], colB: [1, 1, 1, 1], alB: [0, 0, 0], yB: [0, 1], amb: [.12, .18, .16] },
    mobs: {}, early: {}, boss: ['amalgama'], tints: {}, wispHex: 0x78ff9c,
    trees: [], stumps: 0, rocks: 36, tufts: 90, webs: 0,
  },
];

const BIOME = { start: 0 };
function biomeFor(index) { return BIOMES[0]; }
function applyBiomePalette(b) { Object.assign(COL, COL0); for (const k in b.col) COL[k] = C(b.col[k]); }

const LOOK = { cur: null, to: null, bio: null };
function lookOf(b) {
  return { hs: C(b.hemi[0]), hg: C(b.hemi[1]), hi: [b.hemi[2]], mc: C(b.moon[0]), mi: [b.moon[1]], fc: C(b.fill[0]), fi: [b.fill[1]], clear: b.clear.slice(), mAmb: b.mistAmb.slice(), mist: b.mist.slice(), sky: b.sky.slice(), lift: b.lift.slice(), grade: [b.sat, b.expo], amb: b.sprAmb.slice(), wamb: b.wx.amb.slice() };
}
const _lc = new THREE.Color();
function applyLook(L) {
  LT.hemi.color.setRGB(L.hs[0], L.hs[1], L.hs[2]); LT.hemi.groundColor.setRGB(L.hg[0], L.hg[1], L.hg[2]); LT.hemi.intensity = L.hi[0];
  LT.moon.color.setRGB(L.mc[0], L.mc[1], L.mc[2]); LT.moon.intensity = L.mi[0]; LT.fill.color.setRGB(L.fc[0], L.fc[1], L.fc[2]); LT.fill.intensity = L.fi[0];
  R.renderer.setClearColor(_lc.setRGB(L.clear[0], L.clear[1], L.clear[2]), 1);
  const a = R.mats.atmo.uniforms, c = R.mats.comp.uniforms;
  a.uMistAmb.value.set(L.mAmb[0], L.mAmb[1], L.mAmb[2]); a.uMist.value.set(L.mist[0], L.mist[1], L.mist[2], L.mist[3]);
  SH.uSky.value.setRGB(L.sky[0], L.sky[1], L.sky[2]); c.uLift.value.set(L.lift[0], L.lift[1], L.lift[2]); c.uGrade.value.y = L.grade[0]; R.exposure = L.grade[1];
  FX.alpha.mesh.material.uniforms.uAmb.value.set(L.amb[0], L.amb[1], L.amb[2]); WX.u.uAmb.value.set(L.wamb[0], L.wamb[1], L.wamb[2]);
}
function setBiomeLook(B, instant) {
  const b = B.bio; LOOK.bio = b; LOOK.to = lookOf(b);
  if (instant || !LOOK.cur) LOOK.cur = lookOf(b);
  SH.uCover.value.fromArray(b.cover); SH.uCoverCol.value.fromArray(b.coverCol); SH.uCoverP.value.fromArray(b.coverP);
  SH.uWat.value.fromArray(b.wat); SH.uWatA.value.fromArray(b.watA); SH.uWatB.value.fromArray(b.watB); SH.uWind.value = b.sway;
  const f = MAT.fall.uniforms; f.uFP.value.fromArray(b.fall); f.uFA.value.fromArray(b.fallA); f.uFB.value.fromArray(b.fallB);
  setWeather(b.wx, instant);
  const m = B.mirrored, p = b.moonPos; LT.moon.position.set(m ? p[2] : p[0], p[1], m ? p[0] : p[2]); LT.moon.target.position.set(0, 0, 0);
  applyLook(LOOK.cur);
}
function updateBiomeLook(dt) {
  if (!LOOK.cur) return;
  const k = 1 - Math.exp(-dt * 1.6), a = LOOK.cur, b = LOOK.to;
  for (const key in a) { const x = a[key], y = b[key]; for (let i = 0; i < x.length; i++) x[i] += (y[i] - x[i]) * k; }
  applyLook(a); WX.fade = Math.min(1, WX.fade + dt * .5); WX.u.uFade.value = WX.fade;
}