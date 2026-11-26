'use strict';

let RIG_CAPTURE = null;
class PartBatch {
  constructor(build, cap, o = {}) {
    const S = new Soup(); build(S); const geo = S.build();
    this.cap = cap; this.n = 0;
    const m = this.mesh = new THREE.InstancedMesh(geo, MAT.inst, cap);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3); m.instanceColor.setUsage(THREE.DynamicDrawUsage);
    this.flash = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1); this.flash.setUsage(THREE.DynamicDrawUsage); geo.setAttribute('aFlash', this.flash);
    m.frustumCulled = false; m.castShadow = o.shadow !== false; m.receiveShadow = true; m.count = 0;
    this.rad = o.rad || .1;
    R.scene.add(m); PartBatch.all.push(this);
  }
  put(mat, flash = 0, tint = null) {
    if (RIG_CAPTURE) { RIG_CAPTURE(this, mat, tint); return; }
    if (this.n >= this.cap) return; const i = this.n++;
    mat.toArray(this.mesh.instanceMatrix.array, i * 16);
    const c = this.mesh.instanceColor.array;
    if (tint) { c[i * 3] = tint[0]; c[i * 3 + 1] = tint[1]; c[i * 3 + 2] = tint[2]; } else { c[i * 3] = c[i * 3 + 1] = c[i * 3 + 2] = 1; }
    this.flash.array[i] = flash;
  }
  end() {
    const m = this.mesh; m.count = this.n; m.visible = this.n > 0;
    if (this.n) {
      for (const a of [m.instanceMatrix, m.instanceColor, this.flash]) { a.clearUpdateRanges(); a.addUpdateRange(0, this.n * a.itemSize); a.needsUpdate = true; }
    }
  }
}
PartBatch.all = [];
function beginParts() { for (const b of PartBatch.all) b.n = 0; }
function endParts() { for (const b of PartBatch.all) b.end(); }

const _rq = new THREE.Quaternion(), _re = new THREE.Euler(), _rv = new THREE.Vector3(), _rs = new THREE.Vector3(), _rm = new THREE.Matrix4();
const _M = []; for (let i = 0; i < 28; i++) _M.push(new THREE.Matrix4());
function xf(out, parent, px, py, pz, rx, ry, rz, sx = 1, sy = 1, sz = 1) {
  _rq.setFromEuler(_re.set(rx, ry, rz, 'XYZ')); _rm.compose(_rv.set(px, py, pz), _rq, _rs.set(sx, sy, sz));
  if (parent) out.multiplyMatrices(parent, _rm); else out.copy(_rm); return out;
}

const KIT = {};
function humanKit(style, cap) {
  const k = {}, limb = cap * 2;
  if (style === 'skel' || style === 'giant') {
    const G = style === 'giant', bone = G ? mulC(COL.bone, .82) : COL.bone, bd = G ? mulC(COL.boneD, .8) : COL.boneD, o = () => ({ l: L_BONE, jit: .05 });
    k.pelvis = new PartBatch(S => { S.box(.27, .1, .15, 0, 0, 0, bd, o()); S.box(.08, .13, .08, 0, .09, -.01, bone, o()); if (G) { for (const s of [-1, 1]) S.box(.1, .16, .17, s * .14, -.02, 0, bone, o()); clothPanel(S, { x0: -.13, x1: .13, yTop: -.03, len: .3, z: .09, col: mulC(COL.clothD, 1.4), rng: makeRng(5), sway: 0, nx: 3, ny: 4 }); } }, cap, { rad: .1 });
    k.torso = new PartBatch(S => {
      S.box(.07, .43, .07, 0, .21, -.03, bd, o());
      const ribs = G ? [.1, .16, .22, .28, .34] : [.15, .24, .33];
      for (const y of ribs) { S.box(.31 - (.34 - y) * .25, G ? .04 : .055, .21, 0, y, .01, bone, o()); }
      S.box(.39, .07, .12, 0, .43, 0, bone, o()); S.box(.06, .25, .03, 0, .25, .11, bone, o());
      if (G) { for (const s of [-1, 1]) { S.cone(.05, .16, s * .2, .52, 0, bone, { n: 4, l: L_BONE }); S.cone(.04, .12, s * .13, .5, -.04, bd, { n: 4, l: L_BONE }); } for (let v = 0; v < 4; v++) S.box(.05, .03, .06, 0, .1 + v * .09, -.08, bone, o()); }
    }, cap, { rad: .16 });
    k.head = new PartBatch(S => {
      S.sph(.15, 0, .17, 0, bone, { sc: [1, .95, 1.08], l: L_BONE, w: 7, h: 5, smooth: false }); S.box(.17, .08, .14, 0, .04, .035, bd, o());
      for (const s of [-1, 1]) S.box(.066, .062, .05, s * .058, .185, .132, COL.black, { jit: 0 });
      S.box(.03, .04, .04, 0, .12, .152, COL.black, { jit: 0 });
      if (G) { for (const s of [-1, 1]) { S.seg([s * .12, .24, 0], [s * .27, .36, .03], .05, .035, bd, { l: L_BONE, n: 5 }); S.seg([s * .27, .36, .03], [s * .3, .52, .1], .035, .008, bone, { l: L_BONE, n: 5 }); } for (let t = -2; t <= 2; t++) S.box(.022, .04, .02, t * .032, .005, .1, bone, { jit: 0 }); }
    }, cap, { rad: .15 });
    k.uArm = new PartBatch(S => { S.box(.062, .25, .062, 0, -.125, 0, bone, o()); S.box(.085, .06, .085, 0, -.26, 0, bd, o()); }, limb, { rad: .06, shadow: false });
    k.lArm = new PartBatch(S => { S.box(.052, .25, .052, 0, -.125, 0, bone, o()); S.box(.08, .08, .08, 0, -.28, 0, bd, o()); }, limb, { rad: .06, shadow: false });
    k.uLeg = new PartBatch(S => { S.box(.076, .27, .076, 0, -.135, 0, bone, o()); S.box(.09, .06, .09, 0, -.28, 0, bd, o()); }, limb, { rad: .07, shadow: false });
    k.lLeg = new PartBatch(S => { S.box(.062, .28, .062, 0, -.14, 0, bone, o()); S.box(.09, .05, .19, 0, -.295, .05, bd, o()); }, limb, { rad: .07, shadow: false });
  } else if (style === 'foot') {
    const mail = COL.steel, cloth = mulC(COL.clothB, 1.75), lea = COL.leather;
    k.pelvis = new PartBatch(S => { S.box(.28, .14, .19, 0, 0, 0, mulC(COL.clothD, 1.6), { l: L_CLOTH }); S.box(.3, .05, .2, 0, .06, 0, lea, {}); }, cap, { rad: .12 });
    k.torso = new PartBatch(S => {
      S.box(.34, .4, .22, 0, .21, 0, cloth, { l: L_CLOTH, jit: 0 }); S.box(.12, .34, .23, 0, .2, 0, mulC(cloth, .62), { l: L_CLOTH, jit: 0 });
      S.box(.42, .1, .25, 0, .4, 0, mail, { l: L_METAL, rough: .5 }); S.box(.16, .08, .16, 0, .45, 0, COL.skin, {});
    }, cap, { rad: .17 });
    k.head = new PartBatch(S => {
      S.box(.19, .2, .19, 0, .12, .0, COL.skin, { jit: .04 }); S.box(.2, .08, .1, 0, .06, -.06, mulC(COL.leather, .7), {});
      S.add(gDome(8, 3), { s: [.155, .13, .155], p: [0, .19, 0], c: mail, l: L_METAL, rough: .42 }); S.cyl(.21, .03, 0, .19, 0, mulC(mail, .85), { n: 8, l: L_METAL, rough: .42 });
      for (const s of [-1, 1]) S.box(.03, .03, .02, s * .05, .14, .098, COL.black, { jit: 0 });
    }, cap, { rad: .14 });
    k.uArm = new PartBatch(S => { S.box(.1, .26, .1, 0, -.13, 0, mail, { l: L_METAL, rough: .5 }); S.box(.13, .09, .13, 0, -.03, 0, mulC(mail, 1.1), { l: L_METAL, rough: .45 }); }, limb, { rad: .07, shadow: false });
    k.lArm = new PartBatch(S => { S.box(.085, .24, .085, 0, -.12, 0, lea, {}); S.box(.09, .08, .09, 0, -.27, 0, COL.skin, {}); }, limb, { rad: .07, shadow: false });
    k.uLeg = new PartBatch(S => { S.box(.115, .28, .115, 0, -.14, 0, mulC(COL.clothD, 1.5), { l: L_CLOTH }); }, limb, { rad: .08, shadow: false });
    k.lLeg = new PartBatch(S => { S.box(.1, .28, .1, 0, -.14, 0, mulC(lea, .7), {}); S.box(.11, .06, .2, 0, -.29, .045, mulC(lea, .6), {}); }, limb, { rad: .08, shadow: false });
  } else {
    const sk = COL.ogre, sdk = COL.ogreD, o = () => ({ jit: .06, d: 1 });
    k.pelvis = new PartBatch(S => { S.ico(.2, 0, 0, 0, sdk, { sc: [1.15, .6, .95], d: 1 }); clothPanel(S, { x0: -.15, x1: .15, yTop: .02, len: .3, z: .17, col: COL.leather, rng: makeRng(3), sway: 0, nx: 3, ny: 4 }); clothPanel(S, { x0: -.14, x1: .14, yTop: .02, len: .24, z: -.17, col: mulC(COL.leather, .7), rng: makeRng(4), sway: 0, nx: 3, ny: 3 }); S.box(.44, .05, .36, 0, .03, 0, mulC(COL.leather, .6), {}); }, cap, { rad: .2 });
    k.torso = new PartBatch(S => {
      S.ico(.27, 0, .17, .04, sk, { sc: [1.1, .9, 1.05], d: 1 }); S.ico(.25, 0, .37, -.01, sk, { sc: [1.2, .75, .85], d: 1 });
      for (const s of [-1, 1]) S.ico(.11, s * .27, .45, 0, sdk, { d: 1 });
      S.sph(.1, -.27, .5, 0, COL.iron, { l: L_METAL, w: 6, h: 4, smooth: false }); for (let a = 0; a < 3; a++) S.cone(.03, .1, -.27 + Math.cos(a * 2.1) * .08, .6, Math.sin(a * 2.1) * .08, COL.ironL, { n: 4, l: L_METAL });
      S.box(.07, .5, .03, .08, .25, .29, mulC(COL.leather, .7), { r: [0, 0, .5] });
    }, cap, { rad: .28 });
    k.head = new PartBatch(S => {
      S.ico(.13, 0, .1, .02, sk, { sc: [1.05, .95, 1.0], d: 1 }); S.box(.19, .07, .13, 0, .03, .08, sdk, { jit: 0 }); S.box(.22, .04, .08, 0, .15, .09, sdk, { jit: 0 });
      for (const s of [-1, 1]) { S.cone(.022, .09, s * .07, .08, .15, COL.bone, { n: 4, l: L_BONE }); S.box(.045, .03, .03, s * .055, .125, .125, COL.black, { jit: 0 }); S.box(.04, .09, .03, s * .15, .12, 0, sdk, { r: [0, 0, s * -.4] }); }
    }, cap, { rad: .13 });
    k.uArm = new PartBatch(S => { S.ico(.1, 0, -.12, 0, sk, { sc: [1, 1.5, 1], d: 1 }); }, limb, { rad: .1, shadow: false });
    k.lArm = new PartBatch(S => { S.ico(.09, 0, -.12, 0, sk, { sc: [1, 1.5, 1], d: 1 }); S.ico(.085, 0, -.27, 0, sdk, { d: 1 }); S.box(.2, .06, .2, 0, -.18, 0, COL.leather, {}); }, limb, { rad: .1, shadow: false });
    k.uLeg = new PartBatch(S => { S.ico(.11, 0, -.1, 0, sk, { sc: [1, 1.35, 1.05], d: 1 }); }, limb, { rad: .1, shadow: false });
    k.lLeg = new PartBatch(S => { S.ico(.095, 0, -.1, 0, sk, { sc: [1, 1.3, 1], d: 1 }); S.box(.17, .07, .26, 0, -.21, .05, sdk, {}); }, limb, { rad: .1, shadow: false });
  }
  return k;
}

function initKits() {
  const iron = COL.iron, rust = mixC(COL.ironL, C(0x7a4a2a), .45);
  KIT.skel = humanKit('skel', 96);
  KIT.foot = humanKit('foot', 40);
  KIT.giant = humanKit('giant', 2);
  KIT.ogre = humanKit('ogre', 30);
  for (const k of ['uArm', 'lArm', 'uLeg', 'lLeg']) KIT.giant[k].mesh.castShadow = true;
  const E = KIT.item = {};
  E.sword = new PartBatch(S => { S.box(.035, .13, .035, 0, 0, 0, COL.woodD, {}); S.box(.17, .03, .05, 0, .075, 0, iron, { l: L_METAL }); S.box(.055, .5, .018, 0, .34, 0, rust, { l: L_METAL, rough: .5 }); S.cone(.03, .08, 0, .63, 0, rust, { n: 4, l: L_METAL, rough: .5, rz: .012 }); }, 100, { rad: .05, shadow: false });
  E.blade = new PartBatch(S => { S.box(.04, .13, .04, 0, 0, 0, COL.leather, {}); S.box(.2, .035, .055, 0, .075, 0, COL.brass, { l: L_METAL, rough: .4 }); S.box(.06, .52, .02, 0, .35, 0, mulC(COL.steel, 1.15), { l: L_METAL, rough: .3 }); S.cone(.032, .09, 0, .655, 0, mulC(COL.steel, 1.15), { n: 4, l: L_METAL, rough: .3 }); }, 40, { rad: .05, shadow: false });
  E.torch = new PartBatch(S => { S.box(.04, .42, .04, 0, .1, 0, COL.woodD, { l: L_WOOD }); S.cyl(.06, .1, 0, .34, 0, mulC(COL.black, 3), { n: 6 }); S.cyl(.05, .03, 0, .4, 0, COL.ember, { n: 6, emis: .5, jit: 0 }); }, 80, { rad: .05, shadow: false });
  E.shieldR = new PartBatch(S => { S.cyl(.27, .05, 0, 0, 0, COL.woodD, { n: 8, r: [HPI, 0, 0], l: L_WOOD }); S.add(gTorus(8, .13, 4), { s: .25, p: [0, 0, .01], c: iron, l: L_METAL }); S.sph(.075, 0, 0, .04, COL.ironL, { l: L_METAL, w: 6, h: 4, smooth: false }); for (let a = 0; a < 4; a++) S.box(.03, .42, .012, 0, 0, .03, iron, { l: L_METAL, r: [0, 0, a * PI / 4] }); }, 60, { rad: .2, shadow: false });
  E.shieldH = new PartBatch(S => { const sc = mulC(COL.clothB, 1.6); S.box(.36, .3, .045, 0, .08, 0, sc, { l: L_WOOD, jit: 0 }); S.box(.26, .12, .045, 0, -.12, 0, sc, { l: L_WOOD, jit: 0 }); S.box(.14, .1, .045, 0, -.22, 0, sc, { l: L_WOOD, jit: 0 }); S.box(.07, .5, .05, 0, -.02, .004, mulC(COL.gold, .8), { l: L_METAL, rough: .45, jit: 0 }); S.box(.36, .06, .05, 0, .1, .004, mulC(COL.gold, .8), { l: L_METAL, rough: .45, jit: 0 }); }, 40, { rad: .2, shadow: false });
  E.helm = new PartBatch(S => { S.add(gDome(8, 3), { s: [.18, .175, .195], p: [0, .16, 0], c: iron, l: L_METAL, rough: .5 }); S.box(.035, .13, .03, 0, .15, .185, COL.ironL, { l: L_METAL }); for (const s of [-1, 1]) S.box(.03, .14, .13, s * .165, .1, .03, iron, { l: L_METAL }); S.cone(.03, .16, 0, .4, 0, COL.ironL, { n: 4, l: L_METAL }); }, 60, { rad: .16, shadow: false });
  E.plate = new PartBatch(S => { S.box(.35, .31, .25, 0, .27, 0, iron, { l: L_METAL, rough: .5 }); S.box(.2, .2, .26, 0, .29, .005, COL.ironL, { l: L_METAL, rough: .45 }); for (const s of [-1, 1]) S.sph(.1, s * .21, .44, 0, COL.ironL, { l: L_METAL, w: 6, h: 4, smooth: false, sc: [1, .8, 1.1] }); }, 60, { rad: .2, shadow: false });
  E.bow = new PartBatch(S => { let p = [0, -.36, 0]; for (let i = 1; i <= 6; i++) { const t = i / 6 * 2 - 1, q = [0, t * .36, (1 - t * t) * .12]; S.seg(p, q, .016, .016, COL.woodL, { n: 4, l: L_WOOD }); p = q; } S.seg([0, -.36, 0], [0, .36, 0], .005, .005, COL.bone, { n: 3, jit: 0 }); }, 40, { rad: .1, shadow: false });
  E.club = new PartBatch(S => { S.seg([0, -.12, 0], [0, .62, 0], .045, .11, COL.wood, { l: L_WOOD, n: 6 }); S.cyl(.12, .1, 0, .6, 0, iron, { n: 6, l: L_METAL }); for (let a = 0; a < 6; a++) S.cone(.03, .12, Math.cos(a * 1.05) * .13, .45 + (a % 2) * .14, Math.sin(a * 1.05) * .13, COL.ironL, { n: 4, l: L_METAL, r: [Math.sin(a * 1.05) * 1.57, 0, -Math.cos(a * 1.05) * 1.57] }); }, 10, { rad: .1 });
  E.greatsword = new PartBatch(S => {
    const steel = mulC(mixC(COL.steel, C(0x7a4a2a), .22), 1.15), dark = mulC(iron, .85), fl = mulC(steel, .6);
    S.box(.05, .24, .05, 0, -.02, 0, COL.leather, {}); S.ico(.055, 0, -.17, 0, COL.bone, { l: L_BONE, d: 1 });
    S.box(.36, .05, .08, 0, .12, 0, dark, { l: L_METAL }); for (const sg of [-1, 1]) S.box(.05, .1, .08, sg * .17, .08, 0, dark, { l: L_METAL });
    S.box(.12, .82, .026, 0, .555, 0, steel, { l: L_METAL, rough: .45 }); S.box(.035, .7, .034, 0, .52, 0, fl, { l: L_METAL, rough: .5 });
    for (const z of [.013, -.013]) { const a = [-.06, .965, z], b = [.06, .965, z], c = [0, 1.14, 0]; if (z > 0) S.tri(a, b, c, steel, L_METAL, .45); else S.tri(a, c, b, steel, L_METAL, .45); }
    for (const [y, sg] of [[.42, 1], [.7, -1], [.86, 1]]) S.box(.03, .05, .034, sg * .058, y, 0, COL.black, { jit: 0 });
  }, 2, { rad: .1 });
  const fur = COL.rat, furD = COL.ratD;
  KIT.rat = {
    body: new PartBatch(S => {
      S.ico(.2, 0, .02, 0, fur, { sc: [.75, .7, 1.45], d: 1 }); S.ico(.12, 0, .0, .3, furD, { sc: [.8, .75, 1.3], d: 1 }); S.cone(.045, .13, 0, -.03, .47, C(0x8a6a62), { n: 5, r: [HPI, 0, 0] });
      for (const s of [-1, 1]) { S.box(.07, .08, .02, s * .075, .11, .24, C(0x7a5a55), { r: [0, s * .4, 0] }); S.box(.025, .025, .02, s * .05, .03, .4, COL.black, { jit: 0 }); }
    }, 90, { rad: .15 }),
    leg: new PartBatch(S => { S.box(.05, .14, .05, 0, -.07, 0, furD, {}); S.box(.05, .03, .1, 0, -.14, .03, C(0x8a6a62), {}); }, 360, { rad: .05, shadow: false }),
    tail: new PartBatch(S => { S.seg([0, 0, 0], [0, 0, -.24], .028, .014, C(0x8a6a62), { n: 4 }); }, 180, { rad: .04, shadow: false }),
  };
  KIT.slime = { body: new PartBatch(S => {
    S.add(gDome(10, 5), { s: [.5, .46, .5], p: [0, 0, 0], c: COL.slime, smooth: true, rough: .32, jit: 0, emis: .006, c2: [COL.slimeD[0], COL.slimeD[1], COL.slimeD[2], v => smooth(.3, .0, v.y)] });
    S.cyl(.5, .05, 0, .0, 0, COL.slimeD, { n: 10, rough: .32, rt: .96 });
    S.ico(.17, .04, .16, -.02, mulC(COL.slimeD, .6), { d: 1, rough: .4, sc: [1, .8, 1] });
    for (const s of [-1, 1]) S.box(.07, .09, .03, s * .13, .2, .42, COL.black, { jit: 0, r: [-.35, 0, 0] });
  }, 80, { rad: .3 }) };
  KIT.bat = {
    body: new PartBatch(S => { S.ico(.11, 0, 0, 0, COL.bat, { sc: [.9, .9, 1.4], d: 1 }); for (const s of [-1, 1]) { S.cone(.03, .1, s * .05, .1, .1, COL.bat, { n: 4 }); S.box(.02, .02, .02, s * .04, .03, .15, COL.black, { jit: 0 }); } }, 50, { rad: .1 }),
    wing: new PartBatch(S => {
      const c = mulC(COL.bat, 1.25), c2 = mulC(COL.bat, .8), pts = [[0, 0, .1], [.2, .03, .14], [.46, .02, .06], [.4, 0, -.06], [.27, 0, -.02], [.2, 0, -.14], [.1, 0, -.06], [0, 0, -.12]];
      for (let i = 1; i < pts.length - 1; i++) { S.tri(pts[0], pts[i + 1], pts[i], i & 1 ? c : c2, L_PLAIN, .9); S.tri(pts[0], pts[i], pts[i + 1], i & 1 ? c : c2, L_PLAIN, .9); }
      S.seg([0, 0, .1], [.46, .02, .06], .014, .008, c2, { n: 3 });
    }, 100, { rad: .1 }),
  };
  KIT.arrow = new PartBatch(S => { S.box(.022, .022, .5, 0, 0, 0, COL.woodL, { jit: 0 }); S.cone(.035, .09, 0, 0, .29, COL.ember, { n: 4, r: [HPI, 0, 0], emis: .9, jit: 0 }); for (const r of [0, HPI]) S.box(.07, .006, .1, 0, 0, -.2, COL.bone, { r: [0, 0, r], jit: 0 }); }, 120, { shadow: false });
  KIT.shell = new PartBatch(S => { S.sph(.12, 0, 0, 0, mulC(COL.iron, .8), { l: L_METAL, w: 7, h: 5, smooth: false, rough: .5 }); S.box(.04, .04, .04, 0, .12, 0, COL.ember, { emis: 1, jit: 0 }); }, 24, {});
  KIT.coin = new PartBatch(S => { S.cyl(.075, .022, 0, 0, 0, COL.gold, { n: 8, l: L_METAL, rough: .35, emis: .16, jit: 0 }); S.cyl(.05, .026, 0, 0, 0, mulC(COL.gold, 1.3), { n: 8, l: L_METAL, rough: .3, emis: .2, jit: 0 }); }, 160, { shadow: false, rad: .05 });
  KIT.goo = new PartBatch(S => { S.ico(.08, 0, 0, 0, COL.slime, { d: 1, rough: .3, emis: .08 }); }, 200, { shadow: false, rad: .06 });
  KIT.rubble = new PartBatch(S => { S.rock(.14, 0, 0, 0, COL.stone, {}); }, 160, { rad: .1 });
  KIT.plank = new PartBatch(S => { S.box(.12, .6, .05, 0, 0, 0, COL.wood, { l: L_WOOD }); }, 100, { rad: .08 });
  initBestiary();
}

const SPEC = {
  skel: { hip: .6, pelvisH: .12, torsoH: .46, shX: .21, shY: .42, uArm: .27, lArm: .29, hipX: .085, uLeg: .29, lLeg: .3, stride: .62, lean: .12, stoop: .1, eyeX: .058, eyeY: .185, eyeZ: .15, top: 1.42 },
  foot: { hip: .59, pelvisH: .1, torsoH: .46, shX: .23, shY: .4, uArm: .27, lArm: .27, hipX: .09, uLeg: .29, lLeg: .29, stride: .55, lean: .06, stoop: 0, eyeX: 0, eyeY: 0, eyeZ: 0, top: 1.4 },
  ogre: { hip: .43, pelvisH: .08, torsoH: .5, shX: .3, shY: .43, uArm: .25, lArm: .3, hipX: .12, uLeg: .21, lLeg: .21, stride: .5, lean: .1, stoop: .14, eyeX: .055, eyeY: .125, eyeZ: .15, top: 1.2 },
};
const RIGOUT = { headM: _M[3], handR: new THREE.Vector3(), handL: new THREE.Vector3(), tip: new THREE.Vector3(), torch: new THREE.Vector3() };
function rigHuman(kit, sp, e) {
  const s = e.scale || 1, mv = e.mv, ph = e.ph, fl = e.flash || 0, tint = e.tint || null, fz = e.flinch || 0;
  const sw = Math.sin(ph) * sp.stride * mv, cw = Math.cos(ph);
  let twist = Math.sin(ph) * .12 * mv, lean = sp.lean * mv + sp.stoop, lunge = 0, dip = 0;
  let shR = .25 * sw - .15, elR = -.35, bladeA = .55, shL = -.7 * sw - .1, elL = -.3, rzR = -.1, rzL = .1;
  if (e.shamble) { shR = -1.0 + .12 * Math.sin(ph); elR = -.7; shL = -.75 + .2 * Math.sin(ph + 1); elL = -.5; bladeA = .2; }
  if (e.shield) { shL = -.55; elL = -1.25; rzL = .2; }
  if (e.torch) { shL = -1.25 + .06 * Math.sin(ph * 2); elL = -.5; }
  if (e.heavy) { shR = -.3 + .3 * sw; elR = -.5; bladeA = 1.9; shL = -.2 - .5 * sw; elL = -.6; }
  if (e.claw) { shR = -1.25 + .45 * sw; elR = -.55; shL = -1.25 - .45 * sw; elL = -.55; }
  if (e.staff) { shR = -.75; elR = -.95; bladeA = .12; }
  if (e.cast > 0) { const u = easeInOut(Math.min(1, e.cast * 1.6)); shR = lerp(shR, -2.7, u); elR = lerp(elR, -.25, u); shL = lerp(shL, -2.3, u); elL = lerp(elL, -.4, u); }
  if (e.drum) { const b = Math.sin(e.beat || 0); shR = -.95 - .5 * Math.max(0, b); elR = -1.15; shL = -.95 - .5 * Math.max(0, -b); elL = -1.15; bladeA = .9; }
  let atk = e.atk;
  if (e.bow) {
    const d = e.draw || 0; shL = -HPI + (e.pitch || 0); elL = -.05; rzL = .05; shR = -HPI + (e.pitch || 0) + .1; elR = -.2 - d * 1.9; twist = .2 + d * .25; atk = -1;
  }
  if (atk >= 0) {
    const t = atk;
    if (t < .38) { const u = easeInOut(t / .38); shR = lerp(shR, -3.35, u); elR = lerp(elR, -.95, u); bladeA = lerp(bladeA, -2.95, u); twist = lerp(twist, -.42, u); lean = lerp(lean, -.12, u); }
    else if (t < .52) { const u = easeIn((t - .38) / .14); shR = lerp(-3.35, -.85, u); elR = lerp(-.95, -.12, u); bladeA = lerp(-2.95, 1.75, u); twist = lerp(-.42, .42, u); lean = lerp(-.12, .26, u); lunge = .14 * u; dip = .05 * u; }
    else { const u = easeOut((t - .52) / .48); shR = lerp(-.85, shR, u); elR = lerp(-.12, elR, u); bladeA = lerp(1.75, bladeA, u); twist = lerp(.42, twist, u); lean = lerp(.26, lean, u); lunge = .14 * (1 - u); dip = .05 * (1 - u); }
  }
  const bob = -sp.uLeg * (1 - Math.cos(sw)) - dip + (e.heavy ? Math.abs(Math.sin(ph)) * .035 * mv : Math.abs(Math.sin(ph)) * .02 * mv);
  const M0 = xf(_M[0], null, e.x, e.y, e.z, 0, e.yaw, 0, s, s, s);
  const M1 = xf(_M[1], M0, 0, sp.hip + sp.uLeg * 0 + bob, lunge - fz * .06, lean * .4 - fz * .18, twist * .5, (e.shamble ? Math.sin(ph) * .05 * mv : 0));
  kit.pelvis.put(M1, fl, tint);
  const M2 = xf(_M[2], M1, 0, sp.pelvisH, 0, lean * .6 - fz * .4, twist, 0);
  kit.torso.put(M2, fl, tint);
  const M3 = xf(_M[3], M2, 0, sp.torsoH, 0, -lean * .6 - fz * .35 + (e.shamble ? Math.sin(ph * 2) * .05 : 0), -twist * .8, e.shamble ? Math.sin(ph) * .1 * mv : 0);
  kit.head.put(M3, fl, tint);
  const M4 = xf(_M[4], M2, sp.shX, sp.shY, 0, shL + fz * .5, 0, rzL + fz * .3), M5 = xf(_M[5], M4, 0, -sp.uArm, 0, elL, 0, 0);
  kit.uArm.put(M4, fl, tint); kit.lArm.put(M5, fl, tint);
  const M6 = xf(_M[6], M2, -sp.shX, sp.shY, 0, shR + fz * .4, 0, rzR - fz * .3), M7 = xf(_M[7], M6, 0, -sp.uArm, 0, elR, 0, 0);
  kit.uArm.put(M6, fl, tint); kit.lArm.put(M7, fl, tint);
  RIGOUT.handR.set(0, -sp.lArm, 0).applyMatrix4(M7); RIGOUT.handL.set(0, -sp.lArm, 0).applyMatrix4(M5);
  const I = KIT.item, psiR = shR + elR + fz * .4, psiL = shL + elL + fz * .5;
  if (e.weapon) { const M8 = xf(_M[8], M7, 0, -sp.lArm, 0, bladeA - psiR, 0, 0, e.wScale || 1, e.wScale || 1, e.wScale || 1); e.weapon.put(M8, fl, null); RIGOUT.tip.set(0, .6, 0).applyMatrix4(M8); }
  if (e.shield) { const M9 = xf(_M[9], M5, .04, -sp.lArm * .6, .06, -psiL + .05, .25, 0); e.shield.put(M9, fl, e.shieldTint || null); }
  if (e.torch) { const M9 = xf(_M[9], M5, 0, -sp.lArm, 0, .25 - psiL, 0, 0); I.torch.put(M9, 0, null); RIGOUT.torch.set(0, .46, 0).applyMatrix4(M9); }
  if (e.bow) { const M9 = xf(_M[9], M5, 0, -sp.lArm, 0, HPI + .0, 0, 0); I.bow.put(M9, fl, null); }
  if (e.helm) I.helm.put(M3, fl, null);
  if (e.plate) I.plate.put(M2, fl, null);
  if (e.hood) I.hood.put(M3, fl, null); if (e.robe) I.robe.put(M2, fl, null); if (e.drum) I.drum.put(M2, fl, null); if (e.standard) I.standard.put(M2, 0, null);
  if (e.keg) I.keg.put(M2, fl, null); if (e.wraps) { I.wraps.put(M2, fl, null); I.wrapHead.put(M3, fl, null); } if (e.crown) I.crown.put(M3, fl, null);
  const kL = Math.max(0, cw) * 1.0 * mv, kR = Math.max(0, -cw) * 1.0 * mv;
  const M10 = xf(_M[10], M1, sp.hipX, 0, 0, -sw - kL * .25, 0, 0), M11 = xf(_M[11], M10, 0, -sp.uLeg, 0, kL, 0, 0);
  const M12 = xf(_M[12], M1, -sp.hipX, 0, 0, sw - kR * .25, 0, 0), M13 = xf(_M[13], M12, 0, -sp.uLeg, 0, kR, 0, 0);
  kit.uLeg.put(M10, fl, tint); kit.lLeg.put(M11, fl, tint); kit.uLeg.put(M12, fl, tint); kit.lLeg.put(M13, fl, tint);
  return M3;
}
function rigRat(e) {
  const K = KIT.rat, ph = e.ph, s = e.scale || 1, fl = e.flash || 0, mv = e.mv;
  const M0 = xf(_M[0], null, e.x, e.y + (.2 + Math.abs(Math.sin(ph * 2)) * .035 * mv) * s, e.z, Math.sin(ph * 2) * .07 * mv - (e.flinch || 0) * .5, e.yaw, 0, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 4; i++) {
    const fr = i < 2, sd = (i & 1) ? -1 : 1, a = Math.sin(ph * 2 + (fr === (sd > 0) ? 0 : PI)) * .9 * mv;
    K.leg.put(xf(_M[4 + i], M0, sd * .12, -.04, fr ? .16 : -.16, a, 0, sd * .15), fl, e.tint);
  }
  const T1 = xf(_M[8], M0, 0, .03, -.26, .25, Math.sin(ph + 1) * .4, 0); K.tail.put(T1, fl, e.tint);
  K.tail.put(xf(_M[9], T1, 0, 0, -.24, -.2, Math.sin(ph + 2.2) * .6, 0, .8, .8, 1), fl, e.tint);
  return M0;
}
function rigSlime(e) {
  const s = e.scale || 1, h = e.hop || 0, fl = e.flash || 0;
  let sy = 1, y = 0;
  if (h < .22) sy = 1 - .3 * easeOut(h / .22);
  else if (h < .6) { const u = (h - .22) / .38; sy = .7 + .62 * Math.sin(Math.min(1, u * 1.6) * HPI) - .12 * u; y = Math.sin(u * PI) * .34; }
  else if (h < .76) { const u = (h - .6) / .16; sy = 1.2 - .5 * Math.sin(u * PI) - .2 * u; }
  else sy = 1 + .04 * Math.sin((h - .76) / .24 * TAU);
  sy *= 1 - (e.flinch || 0) * .25; const sx = 1 / Math.sqrt(Math.max(.4, sy));
  const M0 = xf(_M[0], null, e.x, e.y + y * s, e.z, 0, e.yaw, 0, s * sx, s * sy, s * sx);
  KIT.slime.body.put(M0, fl, e.tint); return M0;
}
function rigBat(e, K = KIT.bat, wx = .06, wy = .02) {
  const s = e.scale || 1, fl = e.flash || 0, f = Math.sin(e.ph), tint = e.tint || null;
  const M0 = xf(_M[0], null, e.x, e.y + Math.sin(e.ph * .5) * .08, e.z, -.25 + (e.flinch || 0) * .8, e.yaw, Math.sin(e.ph * .25) * .15, s, s, s);
  K.body.put(M0, fl, tint);
  K.wing.put(xf(_M[1], M0, wx, wy, 0, 0, 0, f * .85 + .15), fl, tint);
  K.wing.put(xf(_M[2], M0, -wx, wy, 0, 0, 0, -(f * .85 + .15), -1, 1, 1), fl, tint);
  return M0;
}

const DEB = [];
const _dq = new THREE.Quaternion(), _dax = new THREE.Vector3(), _dp = new THREE.Vector3(), _ds = new THREE.Vector3(), _dm = new THREE.Matrix4();
function addDebris(batch, mat, tint, vx, vy, vz, spin, life, o = {}) {
  if (DEB.length > 520) return null;
  const d = { batch, p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), vx, vy, vz, w: new THREE.Vector3(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize(), ws: spin, life, max: life, tint: tint ? tint.slice() : null, rad: o.rad || batch.rad, rest: false, coin: o.coin || 0, bounce: o.bounce === undefined ? .32 : o.bounce, flash: o.flash || 0, goo: o.goo || 0, hold: o.hold || 0 };
  mat.decompose(d.p, d.q, d.s); d.rad *= Math.max(d.s.x, d.s.y); DEB.push(d); return d;
}
function shatter(rigFn, e, impulse, o = {}) {
  const ix = impulse[0], iy = impulse[1], iz = impulse[2], spread = o.spread === undefined ? 1.6 : o.spread;
  RIG_CAPTURE = (batch, mat, tint) => { addDebris(batch, mat, tint, ix + rr(-spread, spread), iy + rr(.4, 2.2) * (o.up || 1), iz + rr(-spread, spread), rr(3, 11), rr(3.2, 5.5) * (o.life || 1), { hold: o.hold ? rr(0, o.hold) : 0 }); };
  try { rigFn(e); } finally { RIG_CAPTURE = null; }
}
function updateDebris(dt, groundAt, onCoin) {
  for (let i = DEB.length - 1; i >= 0; i--) {
    const d = DEB[i]; d.life -= dt;
    if (d.life <= 0) { swapRemove(DEB, i); continue; }
    if (d.hold > 0) { d.hold -= dt; }
    else if (!d.rest) {
      d.vy -= 13 * dt; d.p.x += d.vx * dt; d.p.y += d.vy * dt; d.p.z += d.vz * dt;
      _dq.setFromAxisAngle(d.w, d.ws * dt); d.q.premultiply(_dq);
      const gy = groundAt(d.p.x, d.p.z) + d.rad;
      if (d.p.y < gy) {
        d.p.y = gy;
        if (d.goo) { d.life = 0; continue; }
        if (Math.abs(d.vy) < 1.2) { d.rest = true; d.vy = 0; } else { d.vy = -d.vy * d.bounce; }
        d.vx *= .55; d.vz *= .55; d.ws *= .5;
      }
    } else if (d.life < .9 && !d.coin) { d.p.y -= dt * .22; }
    if (d.coin && d.max - d.life > d.coin) { onCoin(d); swapRemove(DEB, i); continue; }
    let sc = 1; if (!d.coin && d.life < .5) sc = Math.max(.01, d.life / .5);
    _dm.compose(d.p, d.q, _ds.copy(d.s).multiplyScalar(sc));
    d.batch.put(_dm, d.flash, d.tint);
  }
}
function clearDebris() { DEB.length = 0; }


SPEC.golem = { hip: .5, pelvisH: .1, torsoH: .56, shX: .36, shY: .44, uArm: .26, lArm: .38, hipX: .15, uLeg: .22, lLeg: .24, stride: .42, lean: .1, stoop: .16, eyeX: .04, eyeY: .1, eyeZ: .16, top: 1.35 };

function golemKit(cap) {
  const k = {}, limb = cap * 2, c = [.34, .34, .37], cd = [.22, .22, .25], gl = [1, .9, .8], rk = () => ({ l: L_ROCK, jit: .08 });
  k.pelvis = new PartBatch(S => { S.rock(.2, 0, 0, 0, cd, { sq: .7 }); }, cap, { rad: .2, shadow: false });
  k.torso = new PartBatch(S => {
    S.rock(.3, 0, .2, 0, c, { sq: .9 }); S.rock(.27, 0, .4, -.02, c, { sq: .7 }); S.rock(.13, -.1, .56, -.12, cd, { sq: .9 });
    for (const s of [-1, 1]) S.rock(.19, s * .33, .44, 0, cd, { sq: .8 });
    S.box(.035, .26, .03, .06, .26, .28, gl, { emis: .1, jit: 0, r: [0, 0, .35] }); S.box(.03, .18, .03, -.07, .3, .28, gl, { emis: .1, jit: 0, r: [0, 0, -.5] }); S.box(.03, .14, .03, 0, .14, .27, gl, { emis: .1, jit: 0, r: [0, 0, 1.2] });
  }, cap, { rad: .3 });
  k.head = new PartBatch(S => { S.rock(.14, 0, .1, .03, c, { sq: .85 }); S.box(.22, .05, .1, 0, .17, .1, cd, rk()); S.box(.15, .035, .03, 0, .1, .155, gl, { emis: .22, jit: 0 }); }, cap, { rad: .14, shadow: false });
  k.uArm = new PartBatch(S => { S.rock(.13, 0, -.12, 0, c, { sq: 1.25 }); }, limb, { rad: .12, shadow: false });
  k.lArm = new PartBatch(S => { S.rock(.17, 0, -.15, 0, c, { sq: 1.15 }); S.rock(.15, 0, -.36, .02, cd, { sq: .9 }); }, limb, { rad: .15, shadow: false });
  k.uLeg = new PartBatch(S => { S.rock(.15, 0, -.1, 0, cd, { sq: 1.1 }); }, limb, { rad: .13, shadow: false });
  k.lLeg = new PartBatch(S => { S.rock(.15, 0, -.12, 0, c, { sq: 1.1 }); S.box(.24, .1, .32, 0, -.24, .04, cd, rk()); }, limb, { rad: .13, shadow: false });
  return k;
}

function initBestiary() {
  const I = KIT.item, cloth = C(0x3b3048), clothL = C(0x6a4a78), wrap = C(0xcdbf9a), N = { rad: .2, shadow: false };
  KIT.golem = golemKit(8);
  I.hood = new PartBatch(S => {
    S.add(gDome(8, 4), { s: [.2, .17, .21], p: [0, .19, -.03], c: cloth, l: L_CLOTH });
    S.box(.34, .24, .1, 0, .1, -.15, cloth, { l: L_CLOTH }); S.box(.3, .05, .05, 0, .2, .15, clothL, { l: L_CLOTH });
    for (const s of [-1, 1]) S.box(.06, .26, .2, s * .18, .1, -.04, mulC(cloth, .8), { l: L_CLOTH });
  }, 12, N);
  I.robe = new PartBatch(S => {
    S.add(gCyl(8, .5, true), { s: [.3, 1.12, .27], p: [0, -.12, 0], c: cloth, l: L_CLOTH, dbl: true, deform: v => { if (v.y < 0) { const j = .85 + .3 * vnoise(Math.atan2(v.z, v.x) * 2 + 3, 1, 7); v.x *= j; v.z *= j; v.y += (j - 1) * .25; } }, cf: v => .7 + .3 * sat(v.y / .56 + .5) });
    S.box(.46, .1, .28, 0, .4, 0, clothL, { l: L_CLOTH }); S.cyl(.2, .05, 0, .02, 0, COL.rope, { n: 8 });
  }, 12, N);
  I.staff = new PartBatch(S => {
    S.seg([0, -.55, 0], [0, .95, 0], .028, .024, COL.woodD, { l: L_WOOD, n: 5 });
    for (let a = 0; a < 3; a++) S.seg([0, .9, 0], [Math.cos(a * 2.1) * .09, 1.08, Math.sin(a * 2.1) * .09], .02, .008, COL.bone, { l: L_BONE, n: 4 });
    S.ico(.075, 0, 1.06, 0, [.35, 1, .5], { d: 1, emis: .2, jit: 0 });
  }, 12, N);
  I.drum = new PartBatch(S => {
    const T = new Soup(); T.cyl(.2, .2, 0, 0, 0, C(0x7a2c24), { n: 10, l: L_WOOD }); T.cyl(.205, .03, 0, .1, 0, C(0xc9b28a), { n: 10 }); T.cyl(.212, .025, 0, -.09, 0, COL.brass, { n: 10, l: L_METAL }); T.cyl(.212, .025, 0, .08, 0, COL.brass, { n: 10, l: L_METAL });
    S.merge(T, { p: [0, .1, .28], r: [.5, 0, 0], ao: null }); S.box(.05, .5, .03, .05, .26, .13, COL.leather, { r: [0, 0, .55] });
  }, 8, N);
  I.standard = new PartBatch(S => {
    S.seg([0, .1, -.14], [0, 1.55, -.2], .022, .018, COL.woodD, { l: L_WOOD, n: 4 }); S.seg([-.2, 1.42, -.2], [.2, 1.42, -.2], .016, .016, COL.woodD, { l: L_WOOD, n: 4 });
    clothPanel(S, { x0: -.18, x1: .18, yTop: 1.41, len: .56, z: -.2, col: COL.clothR, col2: mulC(COL.gold, .6), rng: makeRng(21), sway: 0, nx: 3, ny: 5 });
    PROP.skull(S, 0, 1.62, -.2, .07, 0);
  }, 8, { rad: .3, shadow: false });
  I.stick = new PartBatch(S => { S.seg([0, -.05, 0], [0, .3, 0], .02, .018, COL.bone, { l: L_BONE, n: 4 }); S.ico(.04, 0, .32, 0, COL.boneD, { d: 0, l: L_BONE }); }, 8, N);
  I.keg = new PartBatch(S => {
    const T = new Soup(); PROP.barrel(T, 0, 0, 0, .8, makeRng(3)); S.merge(T, { p: [.215, .26, -.24], r: [0, 0, HPI], ao: null });
    S.seg([0, .4, -.24], [.05, .52, -.22], .012, .01, COL.rope, { n: 3 }); S.ico(.035, .05, .53, -.22, COL.ember, { d: 0, emis: .6, jit: 0 });
    S.box(.05, .5, .03, 0, .22, .12, COL.leather, { r: [0, 0, .5] });
  }, 12, N);
  I.wraps = new PartBatch(S => {
    let k = 0; for (const [y, w, rz] of [[.12, .3, .1], [.2, .33, -.12], [.29, .35, .08], [.37, .37, -.06]]) S.box(w, .05, .25, 0, y, 0, mulC(wrap, .8 + .1 * (k++ & 1) * 3), { l: L_CLOTH, r: [0, 0, rz] });
    S.box(.05, .3, .02, .1, -.08, .12, wrap, { l: L_CLOTH, r: [0, 0, .15] });
  }, 12, N);
  I.wrapHead = new PartBatch(S => { S.cyl(.16, .07, 0, .26, 0, wrap, { n: 8, l: L_CLOTH }); S.cyl(.158, .05, 0, .09, .01, mulC(wrap, .85), { n: 8, l: L_CLOTH }); S.box(.04, .22, .02, .1, .06, -.15, wrap, { l: L_CLOTH, r: [.3, 0, .2] }); }, 12, N);
  I.crown = new PartBatch(S => {
    const g = mulC(COL.gold, .9);
    S.cyl(.165, .07, 0, .3, 0, g, { n: 8, l: L_METAL, rough: .35, emis: .03 });
    for (let a = 0; a < 6; a++) S.cone(.03, .12, Math.cos(a * 1.047) * .15, .39, Math.sin(a * 1.047) * .15, g, { n: 4, l: L_METAL, rough: .35, emis: .03 });
    for (const s of [-1, 1]) S.box(.05, .3, .16, s * .17, .12, -.02, C(0x2a4a8a), { l: L_CLOTH });
    S.ico(.03, 0, .31, .16, [.2, .9, .8], { d: 0, emis: .3, jit: 0 });
  }, 2, N);
  I.khopesh = new PartBatch(S => {
    const g = mulC(COL.gold, .85); S.box(.04, .2, .04, 0, 0, 0, COL.leather, {}); S.box(.14, .03, .05, 0, .11, 0, g, { l: L_METAL });
    let p = [.24, 0]; for (const [y, z] of [[.4, .03], [.52, .1], [.62, .2], [.66, .32]]) { const dy = y - p[0], dz = z - p[1], l = Math.hypot(dy, dz); S.box(.02, l + .02, .075, 0, (y + p[0]) / 2, (z + p[1]) / 2, g, { l: L_METAL, rough: .35, r: [Math.atan2(dz, dy), 0, 0] }); p = [y, z]; }
    S.box(.02, .14, .07, 0, .18, 0, g, { l: L_METAL, rough: .35 });
  }, 2, N);
  I.iceclub = new PartBatch(S => {
    S.seg([0, -.12, 0], [0, .5, 0], .045, .06, COL.wood, { l: L_WOOD, n: 6 });
    for (let a = 0; a < 5; a++) S.add(gOct(), { s: [.09, .25, .09], p: [Math.cos(a * 1.26) * .07, .6 + (a & 1) * .06, Math.sin(a * 1.26) * .07], r: [Math.sin(a * 1.26) * .5, a, -Math.cos(a * 1.26) * .5], c: COL.ice, rough: .15, emis: .05 });
  }, 2, { rad: .1, shadow: false });

  KIT.spider = {
    body: new PartBatch(S => {
      const c = [.3, .27, .27], cd = [.19, .17, .18];
      S.ico(.2, 0, .03, -.2, c, { sc: [.95, .8, 1.25], d: 1 }); S.ico(.13, 0, 0, .08, cd, { sc: [1, .72, 1.1], d: 1 });
      S.box(.07, .02, .13, 0, .19, -.2, [1, .25, .12], { emis: .12, jit: 0 });
      for (const s of [-1, 1]) { S.cone(.025, .1, s * .045, -.06, .2, C(0x1a1414), { n: 4, r: [PI - .5, 0, 0] }); for (const [ex, ey, ez] of [[.035, .06, .19], [.075, .05, .16]]) S.box(.022, .022, .02, s * ex, ey, ez, COL.black, { jit: 0 }); }
    }, 70, { rad: .2 }),
    leg: new PartBatch(S => { const c = [.2, .18, .19]; S.seg([0, 0, 0], [.2, .15, 0], .024, .02, c, { n: 4 }); S.seg([.2, .15, 0], [.4, -.17, 0], .02, .009, c, { n: 4 }); }, 560, { rad: .05, shadow: false }),
  };
  KIT.wolf = {
    body: new PartBatch(S => {
      const f = [.3, .3, .33], fd = [.2, .2, .23];
      S.ico(.2, 0, .02, .16, f, { sc: [.78, .95, 1.15], d: 1 }); S.ico(.16, 0, 0, -.2, fd, { sc: [.78, .85, 1.35], d: 1 }); S.ico(.1, 0, 0, .3, [.42, .42, .45], { sc: [.7, .7, .6], d: 1 });
      for (let k = 0; k < 4; k++) S.cone(.045, .13, 0, .2 - k * .02, .2 - k * .13, fd, { n: 4, r: [-.5, 0, 0] });
      S.seg([0, .08, .3], [0, .2, .46], .11, .085, f, { n: 6 });
      S.ico(.105, 0, .24, .52, f, { sc: [.9, .85, 1.1], d: 1 }); S.box(.085, .07, .17, 0, .21, .66, fd, {}); S.box(.04, .03, .03, 0, .235, .75, COL.black, { jit: 0 }); S.box(.07, .025, .14, 0, .16, .64, C(0x3a1a18), {});
      for (const s of [-1, 1]) { S.cone(.035, .1, s * .065, .35, .48, fd, { n: 4 }); S.box(.025, .022, .02, s * .05, .27, .615, COL.black, { jit: 0 }); S.box(.012, .035, .012, s * .03, .165, .7, COL.bone, { jit: 0 }); }
    }, 28, { rad: .22 }),
    leg: new PartBatch(S => { const fd = [.2, .2, .23]; S.seg([0, 0, 0], [0, -.2, -.03], .055, .038, fd, { n: 5 }); S.seg([0, -.2, -.03], [0, -.39, .02], .034, .026, fd, { n: 5 }); S.box(.06, .035, .09, 0, -.4, .04, [.13, .13, .15], {}); }, 112, { rad: .05, shadow: false }),
    tail: new PartBatch(S => { S.seg([0, 0, 0], [0, -.07, -.3], .055, .02, [.2, .2, .23], { n: 5 }); }, 28, { rad: .05, shadow: false }),
  };
  KIT.wraith = {
    body: new PartBatch(S => {
      const c = [.2, .25, .32], cd = [.12, .15, .2];
      S.add(gCyl(8, .32, true), { s: [.36, .96, .36], p: [0, .5, 0], c, l: L_CLOTH, dbl: true, emis: .012, deform: v => { if (v.y < 0) { const j = .75 + .55 * vnoise(Math.atan2(v.z, v.x) * 2.3 + 1, 2, 9); v.x *= j; v.z = v.z * j - .12; v.y += (j - 1) * .3; } }, cf: v => .55 + .45 * sat(v.y / .48 + .5) });
      S.ico(.22, 0, .9, -.02, cd, { sc: [1.3, .45, .95], d: 1, l: L_CLOTH });
      S.add(gDome(8, 4), { s: [.19, .2, .2], p: [0, 1.06, -.03], c: cd, l: L_CLOTH }); S.box(.3, .22, .1, 0, .98, -.14, cd, { l: L_CLOTH });
      S.sph(.115, 0, 1.03, .05, COL.bone, { sc: [1, 1.05, 1], l: L_BONE, w: 7, h: 5, smooth: false, emis: .03 }); S.box(.11, .06, .08, 0, .93, .1, COL.boneD, { l: L_BONE });
      for (const s of [-1, 1]) S.box(.045, .045, .03, s * .045, 1.04, .15, COL.black, { jit: 0 });
    }, 30, { rad: .3 }),
    arm: new PartBatch(S => { const c = [.16, .2, .27]; S.seg([0, 0, 0], [0, -.1, .3], .075, .05, c, { l: L_CLOTH, n: 5 }); for (let k = -1; k <= 1; k++) S.seg([k * .025, -.1, .3], [k * .05, -.16, .42], .012, .006, COL.bone, { n: 3, l: L_BONE }); }, 60, { rad: .08, shadow: false }),
  };
  KIT.garg = {
    body: new PartBatch(S => {
      const st = [.3, .31, .35], sd = [.2, .21, .24];
      S.ico(.17, 0, 0, 0, st, { sc: [.9, 1.0, 1.05], d: 1, l: L_ROCK }); S.ico(.11, 0, .13, .17, st, { sc: [.95, .9, 1.05], d: 1, l: L_ROCK }); S.box(.1, .06, .1, 0, .08, .27, sd, { l: L_ROCK });
      for (const s of [-1, 1]) {
        S.seg([s * .06, .2, .14], [s * .13, .3, .04], .03, .02, sd, { n: 4 }); S.seg([s * .13, .3, .04], [s * .12, .36, -.08], .02, .006, sd, { n: 4 }); S.box(.03, .03, .02, s * .045, .15, .265, COL.black, { jit: 0 });
        S.seg([s * .12, -.02, .08], [s * .15, -.16, .2], .04, .028, sd, { n: 4 }); S.seg([s * .09, -.1, -.08], [s * .12, -.24, 0], .045, .03, sd, { n: 4 });
      }
      S.seg([0, -.05, -.15], [0, -.14, -.42], .04, .012, sd, { n: 4 }); S.cone(.04, .08, 0, -.15, -.46, sd, { n: 4, r: [-HPI, 0, 0] });
    }, 24, { rad: .2 }),
    wing: new PartBatch(S => {
      const c = [.26, .27, .31], c2 = [.17, .18, .21], pts = [[0, 0, .12], [.3, .06, .2], [.74, .04, .1], [.66, 0, -.1], [.46, 0, -.04], [.36, 0, -.24], [.18, 0, -.1], [0, 0, -.18]];
      for (let i = 1; i < pts.length - 1; i++) { S.tri(pts[0], pts[i + 1], pts[i], i & 1 ? c : c2, L_PLAIN, .9); S.tri(pts[0], pts[i], pts[i + 1], i & 1 ? c : c2, L_PLAIN, .9); }
      S.seg([0, 0, .12], [.3, .06, .2], .03, .022, c2, { n: 4 }); S.seg([.3, .06, .2], [.74, .04, .1], .022, .01, c2, { n: 4 });
    }, 48, { rad: .15, shadow: false }),
  };
  KIT.wisp = { core: new PartBatch(S => { S.ico(.07, 0, 0, 0, [.5, .5, .5], { d: 1, emis: .45, jit: 0 }); }, 60, { rad: .07, shadow: false }) };
  const tc = [.2, .29, .15], tcd = [.13, .2, .1], pale = [.46, .46, .28];
  const toadLeg = sg => new PartBatch(S => { S.seg([0, 0, 0], [sg * .17, .05, -.1], .075, .06, tc, { n: 5 }); S.seg([sg * .17, .05, -.1], [sg * .2, -.12, .08], .055, .04, tcd, { n: 5 }); S.box(.1, .03, .18, sg * .21, -.14, .14, tcd, {}); }, 40, { rad: .1, shadow: false });
  KIT.toad = {
    body: new PartBatch(S => {
      S.ico(.27, 0, .17, -.02, tc, { sc: [1.1, .72, 1.2], d: 1, c2: [pale[0], pale[1], pale[2], v => smooth(0, -.14, v.y)] }); S.ico(.19, 0, .2, .2, tc, { sc: [1.15, .68, 1.0], d: 1 });
      S.box(.34, .02, .2, 0, .15, .27, [.05, .06, .04], { jit: 0 }); S.ico(.12, 0, .08, .26, pale, { sc: [1.1, .7, .8], d: 1 });
      for (const s of [-1, 1]) { S.sph(.075, s * .12, .33, .2, tcd, { w: 6, h: 4 }); S.box(.05, .05, .03, s * .125, .345, .265, COL.black, { jit: 0 }); S.seg([s * .2, .1, .16], [s * .26, -.02, .26], .045, .035, tcd, { n: 4 }); S.box(.08, .025, .1, s * .27, -.03, .3, tcd, {}); }
      for (const [x, y, z] of [[.1, .34, -.1], [-.14, .31, -.02], [.02, .36, -.2], [-.05, .33, .05]]) S.ico(.035, x, y, z, tcd, { d: 0 });
    }, 40, { rad: .3 }),
    legR: toadLeg(1), legL: toadLeg(-1),
  };
  initPurrcraftMonsters();
  initGattoGraffiatore();
  initGattoFuoco();
  initGattoElettrico();
}

function rigSpider(e) {
  const K = KIT.spider, s = e.scale || 1, fl = e.flash || 0, ph = e.ph, mv = e.mv, Z = [.15, .08, 0, -.08], A = [1.0, .4, -.3, -.9];
  const M0 = xf(_M[0], null, e.x, e.y + (.19 + Math.abs(Math.sin(ph * 2)) * .015 * mv) * s, e.z, -(e.flinch || 0) * .3, e.yaw, Math.sin(ph) * .04 * mv, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) {
    const g = ((i + (sd > 0 ? 0 : 1)) & 1) ? PI : 0, a = A[i] + Math.sin(ph * 2 + g) * .32 * mv, lift = Math.max(0, Math.cos(ph * 2 + g)) * .3 * mv;
    K.leg.put(xf(_M[1 + i * 2 + (sd > 0 ? 0 : 1)], M0, sd * .09, 0, Z[i], 0, sd > 0 ? -a : PI + a, lift), fl, e.tint);
  }
  return M0;
}
function rigWolf(e) {
  const K = KIT.wolf, ph = e.ph, s = e.scale || 1, fl = e.flash || 0, mv = e.mv, g = Math.sin(ph * 2);
  const M0 = xf(_M[0], null, e.x, e.y + (.43 + Math.abs(g) * .06 * mv) * s, e.z, g * .1 * mv - (e.flinch || 0) * .4, e.yaw, 0, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 4; i++) { const fr = i < 2, sd = (i & 1) ? -1 : 1, a = Math.sin(ph * 2 + (fr ? 0 : 2.6) + (sd > 0 ? 0 : .5)) * .85 * mv; K.leg.put(xf(_M[4 + i], M0, sd * .1, -.04, fr ? .2 : -.26, a, 0, 0), fl, e.tint); }
  K.tail.put(xf(_M[8], M0, 0, .06, -.4, -.3 + g * .2 * mv, Math.sin(ph + 1) * .3, 0), fl, e.tint);
  return M0;
}
function rigWraith(e) {
  const K = KIT.wraith, s = e.scale || 1, fl = e.flash || 0, t = SH.uTime.value + (e.lseed || 0);
  const M0 = xf(_M[0], null, e.x, e.y + (.22 + Math.sin(t * 2.1) * .07) * s, e.z, .16 * e.mv - (e.flinch || 0) * .4, e.yaw, Math.sin(t * 1.3) * .06, s, s, s);
  K.body.put(M0, fl, e.tint);
  for (const sd of [-1, 1]) K.arm.put(xf(_M[sd > 0 ? 1 : 2], M0, sd * .22, .84, .04, -.25 + Math.sin(t * 1.7 + sd) * .22, sd * -.25, 0), fl, e.tint);
  return M0;
}
function rigWisp(e) {
  const s = (e.scale || 1) * (1 + .15 * Math.sin(SH.uTime.value * 9 + (e.lseed || 0) * 5));
  const M0 = xf(_M[0], null, e.x, e.y, e.z, 0, e.yaw, 0, s, s, s); KIT.wisp.core.put(M0, e.flash || 0, e.tint); return M0;
}
function rigToad(e) {
  const K = KIT.toad, s = e.scale || 1, h = e.hop || 0, fl = e.flash || 0;
  let y = 0, pitch = 0, ext = 0, sq = 1;
  if (h < .22) sq = 1 - .22 * easeOut(h / .22);
  else if (h < .62) { const u = (h - .22) / .4; y = Math.sin(u * PI) * .5; pitch = -.45 * Math.cos(u * PI); ext = Math.sin(Math.min(1, u * 1.5) * PI); sq = 1.08; }
  else if (h < .78) sq = 1 - .25 * Math.sin((h - .62) / .16 * PI);
  sq *= 1 - (e.flinch || 0) * .2;
  const M0 = xf(_M[0], null, e.x, e.y + (.1 + y) * s, e.z, pitch, e.yaw, 0, s, s * sq, s);
  K.body.put(M0, fl, e.tint);
  K.legR.put(xf(_M[1], M0, .17, .06, -.14, -ext * .9, 0, 0), fl, e.tint); K.legL.put(xf(_M[2], M0, -.17, .06, -.14, -ext * .9, 0, 0), fl, e.tint);
  return M0;
}

function initPurrcraftMonsters() {
  KIT.polipetto = {
    body: new PartBatch(S => {
      const bodyC = C(0x3a2648), bellyC = C(0x2d5a36), eyeC = C(0xb8ff38);
      S.ico(.22, 0, .22, -.05, bodyC, {
        sc: [.95, 1.15, 1.1], d: 1, rough: .28, emis: .02, r: [-.35, 0, 0],
        c2: [bellyC[0], bellyC[1], bellyC[2], v => smooth(.15, -.18, v.y)]
      });
      S.box(.18, .09, .1, 0, .11, .16, COL.black, { jit: 0 });
      for (const s of [-1, 0, 1]) S.cone(.018, .045, s * .05, .145, .19, COL.bone, { n: 4, r: [PI, 0, 0], jit: 0 });
      for (const [ex, ey, ez, er] of [[-.09, .26, .14, .05], [.09, .25, .14, .045], [0, .34, .11, .058]]) {
        S.sph(er, ex, ey, ez, eyeC, { w: 6, h: 4, rough: .2, emis: .28, jit: 0 });
        S.box(er * .55, er * .9, .02, ex, ey, ez + er * .88, COL.black, { jit: 0 });
      }
    }, 100, { rad: .22 }),
    tentacle: new PartBatch(S => {
      const tC = C(0x335c38), tipC = C(0x63a844);
      S.seg([0, 0, 0], [.18, -.03, 0], .048, .032, tC, { n: 5, rough: .3 });
      S.seg([.18, -.03, 0], [.34, .03, 0], .032, .012, tipC, { n: 5, rough: .3, emis: .03 });
    }, 600, { rad: .06, shadow: false }),
  };

  const rkC = C(0x342f3d), rkD = C(0x211d28), veinC = C(0x7be036);
  KIT.abominio = {
    pelvis: new PartBatch(S => { S.rock(.21, 0, 0, 0, rkD, { sq: .72 }); }, 24, { rad: .2, shadow: false }),
    torso: new PartBatch(S => {
      S.rock(.32, 0, .2, 0, rkC, { sq: .92 });
      S.rock(.28, 0, .42, -.02, rkC, { sq: .75 });
      for (const s of [-1, 1]) {
        S.rock(.2, s * .34, .45, 0, rkD, { sq: .82 });
        S.cone(.055, .22, s * .36, .62, -.04, C(0x4c2d5e), { n: 5, r: [-.2, 0, s * -.35], emis: .05 });
      }
      S.box(.04, .28, .03, .07, .27, .29, veinC, { emis: .22, jit: 0, r: [0, 0, .35] });
      S.box(.035, .2, .03, -.08, .31, .29, veinC, { emis: .22, jit: 0, r: [0, 0, -.45] });
    }, 24, { rad: .32 }),
    head: new PartBatch(S => {
      S.rock(.15, 0, .1, .03, rkC, { sq: .85 });
      for (const [ex, ey, ez, er] of [[-.055, .1, .15, .032], [.055, .095, .15, .03], [0, .16, .135, .038]]) {
        S.sph(er, ex, ey, ez, veinC, { w: 5, h: 4, emis: .3, jit: 0 });
      }
    }, 24, { rad: .15, shadow: false }),
    uArm: new PartBatch(S => { S.rock(.14, 0, -.12, 0, rkC, { sq: 1.25 }); }, 48, { rad: .12, shadow: false }),
    lArm: new PartBatch(S => { S.rock(.18, 0, -.16, 0, rkC, { sq: 1.15 }); S.rock(.16, 0, -.36, .02, rkD, { sq: .9 }); }, 48, { rad: .15, shadow: false }),
    uLeg: new PartBatch(S => { S.rock(.15, 0, -.1, 0, rkD, { sq: 1.1 }); }, 48, { rad: .13, shadow: false }),
    lLeg: new PartBatch(S => { S.rock(.15, 0, -.12, 0, rkC, { sq: 1.1 }); S.box(.24, .1, .32, 0, -.24, .04, rkD, { l: L_ROCK }); }, 48, { rad: .13, shadow: false }),
  };

  KIT.tentacolo = {
    body: new PartBatch(S => {
      const fC = C(0x482242), eyeC = C(0xd4ff42);
      S.ico(.17, 0, .03, 0, fC, { sc: [.9, 1.05, 1.25], d: 1, rough: .32 });
      S.sph(.075, 0, .05, .18, eyeC, { w: 6, h: 5, rough: .18, emis: .32, jit: 0 });
      S.box(.035, .1, .02, 0, .05, .25, COL.black, { jit: 0 });
      for (const s of [-1, 1]) S.cone(.02, .06, s * .05, -.08, .14, COL.bone, { n: 4, r: [PI - .3, 0, 0], jit: 0 });
    }, 50, { rad: .16 }),
    wing: new PartBatch(S => {
      const w1 = C(0x5a2850), w2 = C(0x31152d);
      const pts = [[0, 0, .12], [.24, .05, .18], [.58, .03, .08], [.5, 0, -.08], [.34, 0, -.03], [.24, 0, -.18], [.12, 0, -.08], [0, 0, -.15]];
      for (let i = 1; i < pts.length - 1; i++) {
        S.tri(pts[0], pts[i + 1], pts[i], i & 1 ? w1 : w2, L_PLAIN, .85);
        S.tri(pts[0], pts[i], pts[i + 1], i & 1 ? w1 : w2, L_PLAIN, .85);
      }
      S.seg([0, 0, .12], [.58, .03, .08], .022, .01, w2, { n: 4 });
    }, 100, { rad: .12, shadow: false }),
    tail: new PartBatch(S => {
      S.seg([0, 0, 0], [0, -.2, -.12], .032, .02, C(0x335c38), { n: 4, rough: .3 });
      S.seg([0, -.2, -.12], [0, -.38, -.22], .02, .008, C(0x63a844), { n: 4, rough: .3, emis: .03 });
    }, 150, { rad: .05, shadow: false }),
  };

  KIT.amalgama = {
    body: new PartBatch(S => {
      const mC = C(0x3d223a), mG = C(0x284d30), eyeC = C(0xc8ff38);
      S.ico(.42, 0, .38, -.04, mC, {
        sc: [1.08, .96, 1.12], d: 2, rough: .3, emis: .02,
        c2: [mG[0], mG[1], mG[2], v => smooth(.2, -.3, v.y)]
      });
      S.ico(.26, -.16, .62, -.12, C(0x4b2a46), { d: 1, rough: .32 });
      S.rock(.22, .2, .56, -.18, COL.stoneD, { sq: .7 });
      S.box(.36, .18, .18, 0, .22, .34, COL.black, { jit: 0 });
      for (let k = -2; k <= 2; k++) {
        S.cone(.026, .08, k * .065, .29, .4, COL.bone, { n: 4, r: [PI, 0, 0], jit: 0 });
        S.cone(.022, .065, k * .06, .15, .4, COL.bone, { n: 4, jit: 0 });
      }
      for (const [ex, ey, ez, er] of [[-.15, .46, .33, .068], [.16, .44, .32, .062], [0, .56, .29, .082], [-.24, .58, .18, .05], [.22, .6, .18, .048]]) {
        S.sph(er, ex, ey, ez, eyeC, { w: 7, h: 5, rough: .18, emis: .32, jit: 0 });
        S.box(er * .5, er * .95, .025, ex, ey, ez + er * .88, COL.black, { jit: 0 });
      }
    }, 4, { rad: .42 }),
    tentacle: new PartBatch(S => {
      const tC = C(0x2e5434), tipC = C(0x7be036);
      S.seg([0, 0, 0], [.28, -.04, 0], .09, .06, tC, { n: 6, rough: .3 });
      S.seg([.28, -.04, 0], [.52, .08, 0], .06, .022, tipC, { n: 6, rough: .28, emis: .05 });
    }, 32, { rad: .1 }),
  };
}

function rigPolipetto(e) {
  const K = KIT.polipetto, s = e.scale || 1, fl = e.flash || 0, ph = e.ph * 2.2 + SH.uTime.value * 2.5;
  const sq = 1 + Math.sin(ph) * .09 * (0.3 + 0.7 * e.mv) - (e.flinch || 0) * .25;
  const sx = 1 / Math.sqrt(Math.max(.5, sq));
  const M0 = xf(_M[0], null, e.x, e.y + .03 * s, e.z, Math.sin(ph) * .06 * e.mv - (e.flinch || 0) * .35, e.yaw, 0, s * sx, s * sq, s * sx);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + .52, w = Math.sin(ph + i * 1.35);
    K.tentacle.put(xf(_M[1 + i], M0, Math.cos(a) * .13, .06, -Math.sin(a) * .13, 0, a + w * .2, .12 + w * .3), fl, e.tint);
  }
  return M0;
}

function rigAbominio(e) {
  e.heavy = true;
  return rigHuman(KIT.abominio, SPEC.golem, e);
}

function rigTentacolo(e) {
  const K = KIT.tentacolo, s = e.scale || 1, fl = e.flash || 0, f = Math.sin(e.ph), t = SH.uTime.value * 4 + (e.lseed || 0);
  const M0 = xf(_M[0], null, e.x, e.y + Math.sin(e.ph * .5) * .08, e.z, -.18 + (e.flinch || 0) * .6, e.yaw, Math.sin(e.ph * .25) * .12, s, s, s);
  K.body.put(M0, fl, e.tint);
  K.wing.put(xf(_M[1], M0, .1, .04, 0, 0, 0, f * .85 + .15), fl, e.tint);
  K.wing.put(xf(_M[2], M0, -.1, .04, 0, 0, 0, -(f * .85 + .15), -1, 1, 1), fl, e.tint);
  for (let i = 0; i < 3; i++) {
    const ox = (i - 1) * .07;
    K.tail.put(xf(_M[3 + i], M0, ox, -.05, -.08, Math.sin(t + i * 1.7) * .28, 0, Math.cos(t * .8 + i) * .2), fl, e.tint);
  }
  return M0;
}

function rigAmalgama(e) {
  const K = KIT.amalgama, s = e.scale || 1, fl = e.flash || 0, ph = e.ph * 1.6 + SH.uTime.value * 2.0;
  const slam = e.atk >= 0 ? Math.sin(Math.min(1, e.atk * 1.5) * PI) * .35 : 0;
  const sq = 1 + Math.sin(ph) * .06 - (e.flinch || 0) * .15 - slam * .12;
  const sx = 1 / Math.sqrt(Math.max(.6, sq));
  const M0 = xf(_M[0], null, e.x, e.y + .04 * s, e.z, slam * .35 - (e.flinch || 0) * .2, e.yaw, Math.sin(ph * .5) * .04, s * sx, s * sq, s * sx);
  K.body.put(M0, fl, e.tint);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + .39, w = Math.sin(ph + i * 1.1);
    K.tentacle.put(xf(_M[1 + i], M0, Math.cos(a) * .28, .1, -Math.sin(a) * .28, 0, a + w * .18, .1 + w * .26 + slam * .5), fl, e.tint);
  }
  return M0;
}

function initGattoGraffiatore() {
  const fur = C(0xe8893c), furD = C(0xbd6022), cream = C(0xfbf1df), pink = [.96, .48, .58];
  const collar = C(0xd9383a), bell = mulC(COL.gold, 1.15);

  KIT.gattoBase = {
    body: new PartBatch(S => {
      S.sph(.38, 0, .28, -.03, fur, { sc: [1.05, .92, 1.12], w: 10, h: 7, rough: .65 });
      S.cyl(.26, .46, 0, .54, .02, fur, { n: 10, rt: 1.25, rough: .65 });
      S.sph(.25, 0, .48, .19, cream, { sc: [.9, 1.15, .65], w: 8, h: 6, rough: .7 });
      for (const s of [-1, 1]) {
        S.sph(.19, s * .3, .18, -.08, furD, { sc: [.85, .85, 1.25], w: 8, h: 6, rough: .65 });
        S.sph(.11, s * .31, .07, .12, cream, { sc: [1.0, .65, 1.25], w: 6, h: 4 });
      }
      S.add(gTorus(12, .15, 5), { s: .27, p: [0, .74, .04], r: [HPI, 0, 0], c: collar });
      S.sph(.065, 0, .72, .31, bell, { w: 6, h: 4, l: L_METAL, rough: .3 });
    }, 32, { rad: .4 }),

    head: new PartBatch(S => {
      S.sph(.36, 0, .26, .02, fur, { sc: [1.14, .95, 1.02], w: 10, h: 8, rough: .6 });
      for (const s of [-1, 1]) S.sph(.14, s * .13, .17, .27, cream, { sc: [1.1, .85, .9], w: 7, h: 5 });
      S.box(.15, .07, .08, 0, .13, .3, cream, { jit: 0 });
      S.cone(.042, .045, 0, .21, .39, pink, { n: 4, r: [HPI, 0, 0], jit: 0 });
      for (const s of [-1, 1]) {
        S.box(.075, .016, .02, s * .042, .14, .355, COL.black, { r: [0, 0, s * .35], jit: 0 });
        for (const [wy, wz] of [[.19, .31], [.155, .3]]) {
          S.seg([s * .19, wy, wz], [s * .5, wy + .02, wz - .04], .01, .005, cream, { n: 3, jit: 0 });
        }
        S.cone(.14, .31, s * .21, .56, 0, fur, { n: 4, r: [0, 0, s * -.24] });
        S.cone(.082, .2, s * .21, .54, .03, pink, { n: 4, r: [0, 0, s * -.24], jit: 0 });
        S.sph(.072, s * .135, .28, .33, C(0x2d6a3e), { w: 7, h: 5, rough: .2, jit: 0 });
        S.box(.024, .09, .025, s * .135, .28, .395, COL.black, { jit: 0 });
        S.sph(.018, s * .12, .3, .4, [1, 1, 1], { w: 4, h: 3, emis: .4, jit: 0 });
      }
    }, 32, { rad: .36 }),

    paw: new PartBatch(S => {
      S.cyl(.095, .38, 0, -.14, .08, fur, { n: 8, r: [.45, 0, 0], rough: .65 });
      S.sph(.115, 0, -.28, .18, cream, { sc: [1.05, .75, 1.2], w: 7, h: 5 });
      for (const cx of [-.055, 0, .055]) {
        S.cone(.016, .085, cx, -.28, .31, [1, 1, 1], { n: 4, r: [HPI + .15, 0, 0], emis: .25, jit: 0 });
      }
    }, 64, { rad: .14, shadow: false }),

    giantPaw: new PartBatch(S => {
      const aura = [1.0, .94, .82], clawGlow = [.55, .96, 1.0];
      S.sph(.28, 0, 0, -.04, aura, { sc: [1.25, .62, 1.35], w: 8, h: 6, emis: .45, jit: 0 });
      S.sph(.13, 0, -.12, -.02, pink, { sc: [1.2, .4, 1.0], w: 6, h: 4, emis: .35, jit: 0 });
      for (const [dx, dz] of [[-.16, .14], [-.06, .2], [.06, .2], [.16, .14]]) {
        S.sph(.085, dx, -.02, dz, aura, { sc: [.9, .65, 1.15], w: 6, h: 4, emis: .5, jit: 0 });
      }
      for (const cx of [-.17, -.06, .06, .17]) {
        S.cone(.036, .28, cx, -.02, .34, clawGlow, { n: 4, r: [HPI + .18, 0, 0], emis: .85, jit: 0 });
      }
    }, 32, { rad: .35, shadow: false }),

    tail: new PartBatch(S => {
      S.seg([0, 0, 0], [0, .24, -.22], .075, .062, fur, { n: 6 });
      S.seg([0, .24, -.22], [0, .56, -.16], .062, .05, furD, { n: 6 });
      S.seg([0, .56, -.16], [0, .8, -.28], .05, .036, fur, { n: 5 });
      S.sph(.048, 0, .83, -.3, cream, { w: 6, h: 5 });
    }, 32, { rad: .1, shadow: false }),
  };
}

function rigGattoGraffiatore(e) {
  const K = KIT.gattoBase, s = e.scale || 1, fl = e.flash || 0, sw = e.swipe || 0;
  const t = SH.uTime.value * 3.0 + (e.ph || 0);
  const lunge = Math.sin(sw * PI);
  const sq = 1 + Math.sin(t) * .025 - lunge * .08;
  const sx = 1 / Math.sqrt(sq);

  const M0 = xf(_M[0], null, e.x, e.y, e.z, lunge * .26, e.yaw, 0, s * sx, s * sq, s * sx);
  K.body.put(M0, fl, e.tint);

  const MHead = xf(_M[1], M0, 0, .78, .05, (e.pitch || 0) - lunge * .2, 0, Math.sin(t * .7) * .06);
  K.head.put(MHead, fl, e.tint);

  for (const side of [-1, 1]) {
    const active = side === (e.pawSide || 1) ? lunge : 0;
    const mp = xf(_M[2 + (side > 0 ? 1 : 0)], M0, side * .18, .54, .18 + active * .38, -active * 1.25, side * -active * .35, side * active * .25);
    K.paw.put(mp, fl, e.tint);
  }

  if (sw > .01) {
    const prog = 1 - sw;
    const reach = Math.min(1, prog * 3.4);
    const pulse = prog < .22 ? (.45 + .55 * (prog / .22)) : Math.max(.01, 1 - (prog - .22) / .78);
    const dist = e.hitDist || 1.4;
    const dy = e.hitDy !== undefined ? e.hitDy : .2;
    const pz = lerp(.35 * s, dist, reach);
    const py = lerp(.54 * s, dy, reach);
    const dir = e.pawSide || 1;
    const MRoot = xf(_M[5], null, e.x, e.y, e.z, 0, e.yaw, 0, 1, 1, 1);
    const gs = Math.min(1.35, s) * pulse * 1.2;
    const stretchZ = gs * (1 + (1 - reach) * .75);
    K.giantPaw.put(xf(_M[6], MRoot, dir * .12 * (1 - reach), py, pz, -.25 + reach * .55, 0, dir * (.45 - prog * .9), gs, gs, stretchZ), fl, null);
  }

  K.tail.put(xf(_M[4], M0, 0, .18, -.3, .12, Math.sin(t * 1.6) * .48, Math.cos(t * 1.6) * .12), fl, e.tint);
  return M0;
}

function initGattoFuoco() {
  const techOrange = C(0xee6a24), furD = C(0xbd6022), cream = C(0xfbf1df), pink = [.96, .48, .58];
  const brass = C(0xd99b26), tankRed = C(0xc4281c), glassCyan = C(0x66e8ff);
  const steelD = C(0x3a4554), hoseDark = C(0x1f252e), warnY = C(0xf2b724);
  const fGold = C(0xffa824), fCore = C(0xfff08a), lava = C(0xff4c12);

  const addHose = (S, pts, r, colTube, colRing, colGlow = null) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      S.seg(a, b, r, r, colTube, { n: 7, rough: .55, jit: 0 });
      const mx = (a[0] + b[0]) * .5, my = (a[1] + b[1]) * .5, mz = (a[2] + b[2]) * .5;
      const useGlow = colGlow && (i % 2 === 1);
      S.sph(r * 1.24, mx, my, mz, useGlow ? colGlow : colRing, { w: 6, h: 5, emis: useGlow ? .75 : 0, jit: 0 });
      if (i > 0) S.sph(r * 1.15, a[0], a[1], a[2], colTube, { w: 6, h: 5, jit: 0 });
    }
  };

  KIT.gattoFuoco = {
    body: new PartBatch(S => {
      S.sph(.38, 0, .28, -.03, techOrange, { sc: [1.06, .92, 1.12], w: 10, h: 7, rough: .65 });
      S.cyl(.26, .46, 0, .54, .02, techOrange, { n: 10, rt: 1.25, rough: .65 });
      S.sph(.25, 0, .48, .19, cream, { sc: [.9, 1.15, .65], w: 8, h: 6, rough: .7 });
      for (const s of [-1, 1]) {
        S.sph(.19, s * .3, .18, -.08, furD, { sc: [.85, .85, 1.25], w: 8, h: 6, rough: .65 });
        S.sph(.11, s * .31, .07, .12, cream, { sc: [1.0, .65, 1.25], w: 6, h: 4 });
        S.seg([s * .16, .72, -.22], [s * .18, .72, .16], .042, .042, steelD, { n: 5, l: L_METAL });
        S.seg([s * .18, .72, .16], [s * .14, .44, .27], .038, .038, steelD, { n: 5, l: L_METAL });
      }
      S.box(.26, .08, .06, 0, .56, .27, steelD, { l: L_METAL, jit: 0 });
      S.cyl(.072, .05, 0, .56, .30, brass, { n: 8, r: [HPI, 0, 0], l: L_METAL, rough: .35, jit: 0 });
      S.cyl(.045, .06, 0, .56, .31, fCore, { n: 8, r: [HPI, 0, 0], emis: .85, jit: 0 });
    }, 32, { rad: .4 }),

    head: new PartBatch(S => {
      S.sph(.36, 0, .26, .02, techOrange, { sc: [1.14, .95, 1.02], w: 10, h: 8, rough: .6 });
      for (const s of [-1, 1]) S.sph(.14, s * .13, .17, .27, cream, { sc: [1.1, .85, .9], w: 7, h: 5 });
      S.box(.15, .07, .08, 0, .13, .3, cream, { jit: 0 });
      S.cone(.042, .045, 0, .21, .39, pink, { n: 4, r: [HPI, 0, 0], jit: 0 });
      S.add(gTorus(16, .08, 5), { s: .37, p: [0, .40, .02], r: [HPI, 0, 0], c: steelD, l: L_METAL });
      for (const s of [-1, 1]) {
        S.box(.075, .016, .02, s * .042, .14, .355, COL.black, { r: [0, 0, s * .35], jit: 0 });
        S.cone(.14, .31, s * .21, .56, 0, techOrange, { n: 4, r: [0, 0, s * -.24] });
        S.cone(.082, .2, s * .21, .54, .03, pink, { n: 4, r: [0, 0, s * -.24], jit: 0 });
        S.sph(.072, s * .135, .28, .33, C(0x2d6a3e), { w: 7, h: 5, rough: .2, jit: 0 });
        S.box(.024, .09, .025, s * .135, .28, .395, COL.black, { jit: 0 });
        S.cyl(.105, .08, s * .14, .44, .32, brass, { n: 10, r: [HPI - .25, 0, 0], l: L_METAL, rough: .35, jit: 0 });
        S.cyl(.075, .09, s * .14, .44, .33, glassCyan, { n: 10, r: [HPI - .25, 0, 0], emis: .65, jit: 0 });
      }
    }, 32, { rad: .36 }),

    pawFree: new PartBatch(S => {
      S.cyl(.092, .36, 0, -.14, .08, techOrange, { n: 8, r: [.45, 0, 0], rough: .65 });
      S.sph(.112, 0, -.28, .18, cream, { sc: [1.05, .75, 1.2], w: 7, h: 5 });
    }, 32, { rad: .14, shadow: false }),

    pawWand: new PartBatch(S => {
      S.cyl(.092, .34, 0, -.13, .06, techOrange, { n: 8, r: [.42, 0, 0], rough: .65 });
      S.sph(.108, 0, -.25, .15, steelD, { sc: [1.1, .85, 1.1], w: 7, h: 5, l: L_METAL });
      S.cyl(.068, .18, 0, -.25, .08, brass, { n: 8, r: [HPI, 0, 0], l: L_METAL, rough: .35, jit: 0 });
      S.cyl(.082, .36, 0, -.25, .28, steelD, { n: 8, r: [HPI, 0, 0], l: L_METAL, rough: .42, jit: 0 });
      S.box(.04, .06, .16, 0, -.18, .26, warnY, { jit: 0 });
      S.cyl(.105, .10, 0, -.25, .48, brass, { n: 8, r: [HPI, 0, 0], l: L_METAL, rough: .35, jit: 0 });
      S.cyl(.072, .05, 0, -.25, .54, fCore, { n: 8, r: [HPI, 0, 0], emis: .95, jit: 0 });
      S.cone(.045, .14, 0, -.17, .55, fGold, { n: 4, r: [.3, 0, 0], emis: .85, jit: 0 });
    }, 64, { rad: .18, shadow: false }),

    tail: new PartBatch(S => {
      S.seg([0, 0, 0], [0, .24, -.22], .075, .062, techOrange, { n: 6 });
      S.seg([0, .24, -.22], [0, .56, -.16], .062, .05, furD, { n: 6 });
      S.seg([0, .56, -.16], [0, .80, -.28], .05, .036, techOrange, { n: 5 });
      S.sph(.055, 0, .83, -.3, cream, { w: 6, h: 5 });
    }, 32, { rad: .1, shadow: false }),

    pack1: new PartBatch(S => {
      S.box(.34, .48, .08, 0, .52, -.26, steelD, { l: L_METAL, jit: 0 });
      S.cyl(.16, .50, 0, .54, -.39, tankRed, { n: 12, l: L_METAL, rough: .38, jit: 0 });
      S.cyl(.172, .06, 0, .77, -.39, brass, { n: 12, l: L_METAL, rough: .35, jit: 0 });
      S.cyl(.172, .06, 0, .31, -.39, steelD, { n: 12, l: L_METAL, rough: .42, jit: 0 });
      S.box(.08, .22, .05, 0, .54, -.54, lava, { emis: .8, jit: 0 });
      S.cyl(.075, .10, 0, .84, -.39, steelD, { n: 8, l: L_METAL, jit: 0 });
      S.cone(.06, .16, 0, .96, -.39, fGold, { n: 5, emis: .8, jit: 0 });
      S.cyl(.058, .12, .16, .35, -.39, brass, { n: 8, r: [0, 0, HPI], l: L_METAL, jit: 0 });
      addHose(S, [
        [.20, .35, -.39],
        [.38, .31, -.34],
        [.48, .26, -.18],
        [.47, .24,  .02],
        [.36, .26,  .16],
        [.21, .29,  .22],
      ], .042, hoseDark, warnY);
    }, 32, { rad: .42 }),

    pack2: new PartBatch(S => {
      S.box(.54, .54, .10, 0, .54, -.26, steelD, { l: L_METAL, jit: 0 });
      S.cyl(.11, .14, 0, .54, -.38, brass, { n: 10, r: [HPI, 0, 0], l: L_METAL, rough: .35, jit: 0 });
      S.sph(.075, 0, .54, -.46, fCore, { w: 6, h: 5, emis: .95, jit: 0 });
      for (const s of [-1, 1]) {
        S.cyl(.155, .56, s * .20, .56, -.40, tankRed, { n: 12, l: L_METAL, rough: .38, jit: 0 });
        S.cyl(.17, .065, s * .20, .82, -.40, brass, { n: 12, l: L_METAL, rough: .35, jit: 0 });
        S.cyl(.17, .065, s * .20, .30, -.40, steelD, { n: 12, l: L_METAL, rough: .42, jit: 0 });
        S.box(.07, .24, .05, s * .20, .56, -.55, lava, { emis: .85, jit: 0 });
        S.cyl(.07, .12, s * .20, .90, -.40, steelD, { n: 8, l: L_METAL, jit: 0 });
        S.cyl(.058, .12, s * .34, .34, -.40, brass, { n: 8, r: [0, 0, HPI], l: L_METAL, jit: 0 });
        addHose(S, [
          [s * .37, .34, -.40],
          [s * .50, .29, -.30],
          [s * .54, .25, -.12],
          [s * .48, .24,  .06],
          [s * .36, .27,  .17],
          [s * .21, .29,  .22],
        ], .045, hoseDark, warnY, lava);
      }
    }, 32, { rad: .5 }),

    volcanoVents: new PartBatch(S => {
      for (const s of [-1, 1]) {
        S.cone(.11, .34, s * .20, 1.12, -.40, fGold, { n: 5, emis: .9, jit: 0 });
        S.sph(.075, s * .20, .99, -.40, fCore, { w: 6, h: 5, emis: 1.0, jit: 0 });
      }
    }, 32, { rad: .25, shadow: false }),

    fireball: new PartBatch(S => {
      S.sph(.18, 0, 0, 0, lava, { w: 8, h: 6, emis: .85, jit: 0 });
      S.sph(.11, 0, 0, .05, fCore, { w: 6, h: 5, emis: 1.0, jit: 0 });
    }, 64, { rad: .18, shadow: false }),
  };
}

function rigGattoFuoco(e, lvl) {
  const K = KIT.gattoFuoco, s = e.scale || 1, fl = e.flash || 0, sw = e.swipe || 0;
  const t = SH.uTime.value * 3.6 + (e.ph || 0);
  const puff = e.mutatePuff > 0 ? Math.sin(e.mutatePuff * PI) * .3 : 0;
  const recoil = Math.sin(sw * PI);
  const sq = 1 + Math.sin(t) * .028 - recoil * .07 + puff;
  const sx = (1 / Math.sqrt(Math.max(.5, sq))) * (1 + puff * .6);

  const M0 = xf(_M[0], null, e.x, e.y, e.z, -recoil * .16, e.yaw, 0, s * sx, s * sq, s * sx);
  K.body.put(M0, fl, e.tint);

  const MHead = xf(_M[1], M0, 0, .78, .05, (e.pitch || 0) + recoil * .14, 0, Math.sin(t * .7) * .05);
  K.head.put(MHead, fl, e.tint);

  const dual = lvl >= 3;
  const recR = dual ? (e.pawSide > 0 ? recoil : recoil * .25) : recoil;
  const recL = dual ? (e.pawSide < 0 ? recoil : recoil * .25) : recoil;

  K.pawWand.put(xf(_M[2], M0, .20, .54, .18 - recR * .08, -recR * .18, 0, 0), fl, e.tint);
  if (dual) {
    K.pawWand.put(xf(_M[3], M0, -.20, .54, .18 - recL * .08, -recL * .18, 0, 0), fl, e.tint);
  } else {
    K.pawFree.put(xf(_M[3], M0, -.19, .54, .18, -recoil * .32, .15, -.12), fl, e.tint);
  }

  K.tail.put(xf(_M[4], M0, 0, .18, -.3, .12, Math.sin(t * 1.7) * .45, Math.cos(t * 1.7) * .12), fl, e.tint);

  if (dual) {
    K.pack2.put(M0, fl, e.tint);
    if (lvl >= 4) K.volcanoVents.put(xf(_M[5], M0, 0, 0, 0, 0, 0, 0, 1, 1 + Math.sin(t * 5) * .14, 1), fl, null);
  } else {
    K.pack1.put(M0, fl, e.tint);
  }
  return M0;
}

function initGattoElettrico() {
  const fur = C(0xe8893c), furD = C(0xbd6022), cream = C(0xfbf1df), pink = [.96, .48, .58];
  const collar = C(0xd9383a), iron = C(0x3b485b), steel = C(0x8899ad);
  const cyber = C(0x38bdf8), cyberB = C(0x9be7ff), ledG = C(0x4ade80);

  KIT.gattoElettrico = {
    body: new PartBatch(S => {
      S.sph(.38, 0, .28, -.03, fur, { sc: [1.05, .92, 1.12], w: 10, h: 7, rough: .65 });
      S.cyl(.26, .46, 0, .54, .02, fur, { n: 10, rt: 1.25, rough: .65 });
      S.sph(.25, 0, .48, .19, cream, { sc: [.9, 1.15, .65], w: 8, h: 6, rough: .7 });
      S.sph(.19, -.3, .18, -.08, furD, { sc: [.85, .85, 1.25], w: 8, h: 6, rough: .65 });
      S.sph(.11, -.31, .07, .12, cream, { sc: [1.0, .65, 1.25], w: 6, h: 4 });
      S.sph(.19, .3, .18, -.08, steel, { sc: [.85, .85, 1.25], w: 8, h: 6, l: L_METAL, rough: .38 });
      S.sph(.11, .31, .07, .12, iron, { sc: [1.0, .65, 1.25], w: 6, h: 4, l: L_METAL, rough: .42 });
      S.add(gTorus(14, .15, 5), { s: .275, p: [0, .74, .04], r: [HPI, 0, 0], c: collar });
      S.box(.14, .09, .08, 0, .72, .30, iron, { l: L_METAL, jit: 0 });
      S.box(.11, .06, .085, 0, .72, .305, steel, { l: L_METAL, jit: 0 });
      S.sph(.022, -.026, .72, .352, cyberB, { w: 5, h: 4, emis: .95, jit: 0 });
      S.sph(.022,  .026, .72, .352, ledG,   { w: 5, h: 4, emis: .95, jit: 0 });
    }, 32, { rad: .4 }),

    head: new PartBatch(S => {
      S.sph(.36, 0, .26, .02, fur, { sc: [1.14, .95, 1.02], w: 10, h: 8, rough: .6 });
      for (const s of [-1, 1]) S.sph(.14, s * .13, .17, .27, cream, { sc: [1.1, .85, .9], w: 7, h: 5 });
      S.box(.15, .07, .08, 0, .13, .3, cream, { jit: 0 });
      S.cone(.042, .045, 0, .21, .39, pink, { n: 4, r: [HPI, 0, 0], jit: 0 });
      for (const s of [-1, 1]) {
        S.box(.075, .016, .02, s * .042, .14, .355, COL.black, { r: [0, 0, s * .35], jit: 0 });
        for (const [wy, wz] of [[.19, .31], [.155, .3]]) {
          S.seg([s * .19, wy, wz], [s * .5, wy + .02, wz - .04], .01, .005, cream, { n: 3, jit: 0 });
        }
        S.sph(.072, s * .135, .28, .325, s > 0 ? C(0x2899c4) : C(0x2d6a3e), { w: 7, h: 5, rough: .2, emis: s > 0 ? .28 : 0, jit: 0 });
        S.box(.024, .09, .025, s * .135, .28, .388, COL.black, { jit: 0 });
        S.sph(.018, s * .12, .3, .395, [1, 1, 1], { w: 4, h: 3, emis: .45, jit: 0 });
      }
      S.cone(.14, .31, -.21, .56, 0, fur, { n: 4, r: [0, 0, .24] });
      S.cone(.082, .2, -.21, .54, .03, pink, { n: 4, r: [0, 0, .24], jit: 0 });
      S.cone(.145, .32, .21, .56, 0, steel, { n: 4, r: [0, 0, -.24], l: L_METAL, rough: .38 });
      S.cone(.082, .2, .21, .54, .03, pink, { n: 4, r: [0, 0, -.24], jit: 0 });
      // Modulo auricolare Scouter + braccetto + antenna
      S.cyl(.11, .09, .38, .29, .10, iron, { n: 10, r: [0, 0, HPI], l: L_METAL, jit: 0 });
      S.cyl(.085, .10, .39, .29, .10, steel, { n: 10, r: [0, 0, HPI], l: L_METAL, jit: 0 });
      S.box(.04, .04, .09, .43, .29, .10, cyber, { emis: .85, jit: 0 });
      S.seg([.38, .29, .16], [.34, .29, .33], .028, .024, iron, { n: 6, l: L_METAL, jit: 0 });
      S.seg([.34, .29, .33], [.27, .285, .38], .024, .022, steel, { n: 6, l: L_METAL, jit: 0 });
      S.seg([.39, .36, .06], [.43, .69, -.02], .018, .009, steel, { n: 6, l: L_METAL, jit: 0 });
      S.sph(.034, .43, .71, -.02, cyberB, { w: 7, h: 5, emis: .95, jit: 0 });
    }, 32, { rad: .36 }),

    paw: new PartBatch(S => {
      S.cyl(.095, .38, 0, -.14, .08, fur, { n: 8, r: [.45, 0, 0], rough: .65 });
      S.sph(.115, 0, -.28, .18, cream, { sc: [1.05, .75, 1.2], w: 7, h: 5 });
    }, 32, { rad: .14, shadow: false }),

    pawCyber: new PartBatch(S => {
      S.cyl(.092, .38, 0, -.14, .08, steel, { n: 8, r: [.45, 0, 0], l: L_METAL, rough: .38 });
      S.sph(.10, 0, -.05, .04, iron, { w: 6, h: 4, l: L_METAL });
      S.sph(.112, 0, -.28, .18, iron, { sc: [1.05, .75, 1.2], w: 7, h: 5, l: L_METAL });
      S.sph(.032, 0, -.14, .16, cyberB, { w: 5, h: 4, emis: .95, jit: 0 });
    }, 32, { rad: .14, shadow: false }),

    tail: new PartBatch(S => {
      S.seg([0, 0, 0], [0, .24, -.22], .075, .062, fur, { n: 6 });
      S.seg([0, .24, -.22], [0, .56, -.16], .062, .05, steel, { n: 6, l: L_METAL });
      S.add(gTorus(10, .22, 4), { s: .062, p: [0, .40, -.19], r: [HPI, 0, 0], c: cyber, emis: .8 });
      S.seg([0, .56, -.16], [0, .80, -.28], .05, .036, fur, { n: 5 });
      S.sph(.048, 0, .83, -.3, cream, { w: 6, h: 5 });
    }, 32, { rad: .1, shadow: false }),
  };
}

function makeHoloMonocle() {
  const root = new THREE.Group();
  const holder = new THREE.Group();
  holder.position.set(0.155, 0.285, 0.405);
  holder.rotation.set(-0.04, 0.24, 0.0);

  const lensMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8, transparent: true, opacity: 0.38,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false
  });
  holder.add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.165, 0.012), lensMat));

  const frameMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.255, 0.014, 0.018), frameMat); topBar.position.y = 0.086; holder.add(topBar);
  const botBar = new THREE.Mesh(new THREE.BoxGeometry(0.255, 0.014, 0.018), frameMat); botBar.position.y = -0.086; holder.add(botBar);
  const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.175, 0.018), frameMat); leftBar.position.x = -0.122; holder.add(leftBar);
  const rightBar = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.185, 0.026), new THREE.MeshBasicMaterial({ color: 0x64748b }));
  rightBar.position.x = 0.124; holder.add(rightBar);

  const reticle = new THREE.Group();
  reticle.position.z = 0.012;
  reticle.add(new THREE.Mesh(new THREE.RingGeometry(0.048, 0.058, 20), new THREE.MeshBasicMaterial({ color: 0xb8f2ff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })));
  reticle.add(new THREE.Mesh(new THREE.RingGeometry(0.024, 0.030, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })));
  const tickMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  for (let k = 0; k < 4; k++) {
    const a = k * HPI, tk = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.007, 0.004), tickMat);
    tk.position.set(Math.cos(a) * 0.068, Math.sin(a) * 0.068, 0.002); tk.rotation.z = a;
    reticle.add(tk);
  }
  holder.add(reticle);

  const coreDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 6, 5),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  coreDot.position.z = 0.014;
  holder.add(coreDot);

  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.032 - i * 0.006, 0.010, 0.005), frameMat);
    bar.position.set(0.075, 0.045 - i * 0.024, 0.01);
    holder.add(bar);
  }

  root.add(holder);
  root.userData = { lensMat, reticle, coreDot };
  root.visible = false;
  return root;
}

function makeCyberAura() {
  const grp = new THREE.Group();
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8, transparent: true, opacity: 0.12,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide
  });
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.88, 16, 12), shellMat);
  shell.scale.set(0.95, 1.18, 0.95);
  shell.position.y = 0.68;
  grp.add(shell);

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x7dd3fc, transparent: true, opacity: 0.34,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
  });
  const ringBase = new THREE.Mesh(new THREE.RingGeometry(0.66, 0.84, 32), ringMat);
  ringBase.rotation.x = -HPI;
  ringBase.position.y = 0.03;
  grp.add(ringBase);

  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x5eead4, transparent: true, opacity: 0.26,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.016, 6, 28), ring2Mat);
  ring2.rotation.x = HPI;
  ring2.position.y = 0.45;
  grp.add(ring2);

  grp.userData = { shellMat, ringMat, ring2, ring2Mat };
  grp.visible = false;
  return grp;
}

const _ep = new THREE.Vector3(), _eq = new THREE.Quaternion(), _es = new THREE.Vector3();
function rigGattoElettrico(e, lvl) {
  const K = KIT.gattoElettrico, s = e.scale || 1, fl = e.flash || 0, sw = e.swipe || 0;
  const t = SH.uTime.value * 3.4 + (e.ph || 0);
  const puff = e.mutatePuff > 0 ? Math.sin(e.mutatePuff * PI) * .3 : 0;
  const recoil = Math.sin(sw * PI);
  const sq = 1 + Math.sin(t) * .025 - recoil * .05 + puff;
  const sx = (1 / Math.sqrt(Math.max(.5, sq))) * (1 + puff * .6);

  const M0 = xf(_M[0], null, e.x, e.y, e.z, -recoil * .08, e.yaw, 0, s * sx, s * sq, s * sx);
  K.body.put(M0, fl, e.tint);

  const MHead = xf(_M[1], M0, 0, .78, .05, (e.pitch || 0) * .5, 0, Math.sin(t * .65) * .045);
  K.head.put(MHead, Math.min(1, fl + recoil * .22), e.tint);

  K.paw.put(xf(_M[2], M0, -.18, .54, .18, 0, 0, 0), fl, e.tint);
  K.pawCyber.put(xf(_M[3], M0, .18, .54, .18 - recoil * .04, (e.pitch || 0) * .15, 0, 0), fl, e.tint);
  K.tail.put(xf(_M[4], M0, 0, .18, -.3, .12, Math.sin(t * 1.6) * .42, Math.cos(t * 1.6) * .1), fl, e.tint);

  if (e.eyePos) e.eyePos.set(0.155, 0.285, 0.42).applyMatrix4(MHead);

  if (e.monocle) {
    MHead.decompose(_ep, _eq, _es);
    e.monocle.visible = true;
    e.monocle.position.copy(_ep);
    e.monocle.quaternion.copy(_eq);
    e.monocle.scale.copy(_es);
    const ud = e.monocle.userData;
    ud.reticle.rotation.z = SH.uTime.value * 1.5;
    ud.lensMat.opacity = 0.34 + 0.08 * Math.sin(t * 1.8) + recoil * 0.35;
    ud.coreDot.scale.setScalar(1 + recoil * 1.3);
  }
  if (e.aura) {
    const isMax = lvl >= 4;
    e.aura.visible = isMax;
    if (isMax) {
      e.aura.position.set(e.x, e.y, e.z);
      e.aura.scale.setScalar(s);
      const ud = e.aura.userData;
      ud.shellMat.opacity = 0.10 + Math.sin(t * 1.2) * 0.03 + recoil * 0.05;
      ud.ringMat.opacity = 0.28 + Math.sin(t * 1.4) * 0.08;
      const w = (SH.uTime.value * 0.45 + (e.ph || 0)) % 1.0;
      ud.ring2.position.y = 0.08 + w * 1.35;
      ud.ring2.scale.setScalar(1.0 - w * 0.22);
      ud.ring2Mat.opacity = Math.sin(w * PI) * 0.26;
    }
  }
  return M0;
}
