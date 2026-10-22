/* Plotto — spin & "짠"
 * 2.5D turn: body stays put while face, badge, hands and ears travel around
 * a vertical axis (x, z anchors), passing behind / in front of the body.
 * Fast parts get true temporal motion blur (sub-frame samples averaged).   */
(() => {
'use strict';
const M = window.SPIN_META;
const L = 'layers/';
const SIZE = 1080;                 // canvas logical size
const S = 0.74;                    // image px -> stage px
const AXIS = [420, 1000];          // image coords: spin axis x, feet line y
const STAGE = [540, 905];          // where the feet land on the stage
const CYCLE = 4.2;                 // seconds per loop

/* ---------------- math */
const PI = Math.PI, D2R = PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const sine = k => .5 - .5 * Math.cos(PI * k);
const eo = k => 1 - Math.pow(1 - k, 3);
const bump = k => (k <= 0 || k >= 1) ? 0 : Math.sin(PI * k);
const softBack = (k, s = 1.4) => { const c = s + 1, u = k - 1; return 1 + c * u * u * u + s * u * u; };
const spring = (t, f = 2.6, d = 7) => t <= 0 ? 0 : Math.exp(-d * t) * Math.sin(2 * PI * f * t);  // decaying wobble
const spinEase = k => k < .5 ? Math.pow(2 * k, 2.4) / 2 : 1 - Math.pow(2 - 2 * k, 2.4) / 2;

/* ---------------- timeline (seconds in a cycle) */
const T_WIND = .30, T_JUMP = .62, T_LAND = 1.40, T_JJANG = 1.48;
function pose(t) {
  const p = {};
  // yaw: wind-up, one full turn, tiny settle past the end
  let yaw = -18 * sine(prog(t, T_WIND, T_JUMP));
  if (t >= T_JUMP) yaw = lerp(-18, 360, spinEase(prog(t, T_JUMP, T_LAND)));
  if (t > T_LAND) yaw = 360 + 9 * spring(t - T_LAND, 1.6, 6);
  p.yaw = yaw;
  // vertical: crouch, hop, land
  const crouch = sine(prog(t, T_WIND, T_JUMP)) * (1 - prog(t, T_JUMP, T_JUMP + .06));
  const u = prog(t, T_JUMP, T_LAND);
  const air = t > T_JUMP && t < T_LAND ? 4 * u * (1 - u) : 0;
  p.y = crouch * 20 - Math.pow(air, .85) * 150 - 2 * spring(t - T_LAND, 2.2, 6);
  // squash & stretch
  const land = t >= T_LAND ? spring(t - T_LAND + .06, 2.2, 6.5) : 0;
  const stretch = bump(prog(t, T_JUMP - .02, T_JUMP + .34));
  p.sy = 1 - crouch * .085 + stretch * .06 - land * .1;
  p.sx = 1 + crouch * .065 - stretch * .045 + land * .085;
  p.tilt = -crouch * 2 + stretch * 1.5 + spring(t - T_LAND, 1.4, 5) * 3;
  // idle float (period divides the cycle -> seamless loop)
  const idleK = 1 - bump(prog(t, T_WIND - .15, T_JJANG + .6));
  p.y += Math.sin(2 * PI * t / 2.1) * 7 * idleK;
  // "짠": present the badge
  const j = t - T_JJANG;
  p.badgeS = 1 + (j > 0 ? .13 * bump(prog(j, 0, .55)) + .03 * spring(j - .45, 2, 5) : 0);
  const spread = sine(prog(j, -.05, .2)) * (1 - sine(prog(j, .9, 1.5)));
  p.handDX = spread * 20; p.handDY = -spread * 12;
  p.badgeDY = -spread * 10;
  p.shine = prog(j, .12, .62);
  p.burst = prog(j, .02, .72);
  p.sparkle = j;
  return p;
}

/* ---------------- 3D anchors (image px; x from axis, z towards viewer) */
const mid = n => [M[n].x + M[n].w / 2, M[n].y + M[n].h / 2];
const parts = {
  ears:  { c: mid('ears'),  x: 270,  z: -120, round: .62 },
  handL: { c: mid('handL'), x: -228, z: 140,  round: .8 },
  handR: { c: mid('handR'), x: 251,  z: 120,  round: .8 },
  badge: { c: [M.badge.cx, M.badge.cy], x: 21, z: 270, round: 0 },
  face:  { c: [440, 500],   x: 20,   z: 300,  round: 0 },
};
function project(pt, yaw) {
  const a = yaw * D2R, c = Math.cos(a), s = Math.sin(a);
  const X = pt.x * c + pt.z * s, Z = -pt.x * s + pt.z * c;
  const facing = Math.cos(a + Math.atan2(pt.x, Math.max(pt.z, 1)) * (pt.round ? 0 : 1));
  const sx = pt.round ? pt.round + (1 - pt.round) * Math.abs(c) : facing;
  return { dx: X - pt.x, Z, sx };
}

/* ---------------- assets */
const imgs = {};
// layers are embedded as data URIs so pixels stay readable even from file://
const load = (k, f) => new Promise(r => { const i = new Image(); i.onload = () => r(); i.onerror = () => r(); i.src = (window.SPIN_IMG && SPIN_IMG[k]) || L + f; imgs[k] = i; });
const ready = Promise.all([
  load('body', 'body.png'), load('mask', 'head_mask.png'),
  ...['ears', 'handL', 'handR', 'badge', 'face'].map(k => load(k, M[k].file))
]);

/* ---------------- canvases */
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const W = M.W, H = M.H;
const charC = mk(W, H), cc = charC.getContext('2d', { willReadFrequently: true });
const accC = mk(W, H), ac = accC.getContext('2d');
const faceC = mk(W, H), fc = faceC.getContext('2d');
const shineC = mk(M.badge.w, M.badge.h), sc = shineC.getContext('2d');
let DPR = 1, ACC = null, OUT = null;
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  const px = Math.round(cv.getBoundingClientRect().width * DPR) || SIZE;
  cv.width = cv.height = px;
}
addEventListener('resize', resize);

/* draw the whole character at one yaw into `charC` (image coords) */
function drawChar(p, yaw) {
  cc.clearRect(0, 0, W, H);
  const items = [];
  for (const k in parts) {
    const pt = parts[k], pr = project(pt, yaw);
    items.push({ k, pt, ...pr });
  }
  const drawPart = it => {
    const m = M[it.k], img = imgs[it.k], [cx, cy] = it.pt.c;
    let dx = it.dx, dy = 0, s = 1;
    if (it.k === 'handL') { dx -= p.handDX * Math.cos(yaw * D2R); dy = p.handDY; }
    if (it.k === 'handR') { dx += p.handDX * Math.cos(yaw * D2R); dy = p.handDY; }
    if (it.k === 'badge') { s = p.badgeS; dy = p.badgeDY; }
    cc.save();
    cc.translate(cx + dx, cy + dy);
    cc.scale(it.sx * s, s);
    if (it.k === 'face') {
      // features live on the head: draw, then clip to the head silhouette
      cc.restore();
      fc.clearRect(0, 0, W, H);
      fc.globalCompositeOperation = 'source-over';
      fc.save(); fc.translate(cx + dx, cy); fc.scale(it.sx, 1);
      fc.globalAlpha = clamp(it.Z / 140);
      fc.drawImage(img, m.x - cx, m.y - cy);
      fc.restore();
      fc.globalAlpha = 1;
      fc.globalCompositeOperation = 'destination-in';
      fc.drawImage(imgs.mask, 0, 0);
      fc.globalCompositeOperation = 'source-over';
      cc.drawImage(faceC, 0, 0);
      return;
    }
    if (it.k === 'badge' && p.shine > 0 && p.shine < 1 && it.Z > 0) {
      sc.clearRect(0, 0, m.w, m.h);
      sc.globalCompositeOperation = 'source-over';
      sc.drawImage(img, 0, 0);
      sc.globalCompositeOperation = 'source-atop';
      const xx = lerp(-m.w * .6, m.w * 1.6, sine(p.shine));
      const g = sc.createLinearGradient(xx - 120, 0, xx + 60, m.h);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      sc.fillStyle = g; sc.fillRect(0, 0, m.w, m.h);
      sc.globalCompositeOperation = 'source-over';
      cc.drawImage(shineC, m.x - cx, m.y - cy);
    } else {
      cc.drawImage(img, m.x - cx, m.y - cy);
    }
    cc.restore();
  };
  const back = items.filter(i => i.Z < 0).sort((a, b) => a.Z - b.Z);
  const front = items.filter(i => i.Z >= 0).sort((a, b) => a.Z - b.Z);
  back.forEach(drawPart);
  // body narrows slightly when seen from the side
  const bs = 1 - .05 * Math.abs(Math.sin(yaw * D2R));
  cc.save(); cc.translate(AXIS[0], 0); cc.scale(bs, 1); cc.translate(-AXIS[0], 0);
  cc.drawImage(imgs.body, 0, 0);
  cc.restore();
  // keep face after body; badge & hands after face
  front.sort((a, b) => (a.k === 'face' ? -1 : 0) - (b.k === 'face' ? -1 : 0) || a.Z - b.Z);
  front.forEach(drawPart);
}

function star(c, x, y, r, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = i * PI / 2;
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    c.quadraticCurveTo(Math.cos(a + PI / 4) * r * .16, Math.sin(a + PI / 4) * r * .16, Math.cos(a + PI / 2) * r, Math.sin(a + PI / 2) * r);
  }
  c.closePath(); c.fillStyle = col; c.shadowColor = 'rgba(124,100,255,.55)'; c.shadowBlur = r * .8; c.fill(); c.restore();
}

const SPARKS = [  // stage coords relative to feet anchor, size, delay
  [-270, -610, 30, 0], [250, -520, 22, .06], [-300, -300, 18, .11], [300, -250, 26, .03], [40, -700, 16, .14],
];

function renderAt(T) {
  const t = ((T % CYCLE) + CYCLE) % CYCLE;
  const p = pose(t);
  const k = cv.width / SIZE;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.setTransform(k, 0, 0, k, 0, 0);

  // ground shadow
  const lift = clamp(-p.y / 150);
  ctx.save();
  ctx.translate(STAGE[0], STAGE[1] + 14);
  ctx.scale(1, .2);
  const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 230 * (1 - .3 * lift) * p.sx);
  sg.addColorStop(0, `rgba(84,70,200,${.2 * (1 - .55 * lift)})`); sg.addColorStop(1, 'rgba(84,70,200,0)');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, 240, 0, 2 * PI); ctx.fill();
  ctx.restore();

  // burst ring behind Plotto
  if (p.burst > 0 && p.burst < 1) {
    const bc = [STAGE[0] + (M.badge.cx - AXIS[0]) * S, STAGE[1] + (M.badge.cy - AXIS[1]) * S + p.y];
    ctx.save();
    ctx.strokeStyle = `rgba(122,104,246,${(.45 * (1 - p.burst)).toFixed(3)})`;
    ctx.lineWidth = 6 * (1 - p.burst) + 1.5;
    ctx.beginPath(); ctx.arc(bc[0], bc[1] - 120, 220 + eo(p.burst) * 260, 0, 2 * PI); ctx.stroke();
    ctx.restore();
  }

  // character with temporal motion blur across this frame's yaw span
  const dt = 1 / 60;
  const y0 = pose(Math.max(0, t - dt * .5)).yaw, y1 = pose(t + dt * .5).yaw;
  const span = Math.abs(y1 - y0);
  const n = Math.min(24, Math.max(1, Math.ceil(span / .8)));
  ac.clearRect(0, 0, W, H);
  if (n === 1) { drawChar(p, p.yaw); ac.drawImage(charC, 0, 0); }
  else {
    // average samples in float (premultiplied) to avoid 8-bit banding
    const acc = ACC || (ACC = new Float32Array(W * H * 4));
    acc.fill(0);
    for (let i = 0; i < n; i++) {
      drawChar(p, lerp(y0, y1, (i + .5) / n));
      const d = cc.getImageData(0, 0, W, H).data;
      for (let j = 0; j < d.length; j += 4) {
        const a = d[j + 3];
        if (!a) continue;
        acc[j] += d[j] * a; acc[j + 1] += d[j + 1] * a; acc[j + 2] += d[j + 2] * a; acc[j + 3] += a;
      }
    }
    const out = OUT || (OUT = ac.createImageData(W, H)), o = out.data;
    for (let j = 0; j < o.length; j += 4) {
      const a = acc[j + 3];
      if (!a) { o[j + 3] = 0; continue; }
      o[j] = acc[j] / a; o[j + 1] = acc[j + 1] / a; o[j + 2] = acc[j + 2] / a; o[j + 3] = a / n;
    }
    ac.putImageData(out, 0, 0);
  }
  ctx.save();
  ctx.translate(STAGE[0], STAGE[1] + p.y);
  ctx.rotate(p.tilt * D2R);
  ctx.scale(p.sx * S, p.sy * S);
  ctx.translate(-AXIS[0], -AXIS[1]);
  ctx.drawImage(accC, 0, 0);
  ctx.restore();

  // sparkles
  SPARKS.forEach(([x, y, r, d], i) => {
    const q = prog(p.sparkle - d, 0, .6);
    if (q <= 0 || q >= 1) return;
    const s = Math.sin(PI * Math.pow(q, .7));
    star(ctx, STAGE[0] + x * (1 + q * .12), STAGE[1] + y - q * 18, r * s, q * .9 + i, i % 2 ? '#ffffff' : '#8f7cf8');
  });
}

/* ---------------- run */
const RECORD = /[?&]record\b/.test(location.search);
if (/[?&]alpha\b/.test(location.search)) document.body.classList.add('alpha');
window.PlottoSpin = { ready, renderAt, CYCLE };
ready.then(() => {
  resize();
  if (RECORD) return;
  let t0 = performance.now();
  cv.addEventListener('click', () => { t0 = performance.now(); });   // tap to replay from the start
  const loop = () => { renderAt((performance.now() - t0) / 1000); requestAnimationFrame(loop); };
  loop();
});
})();
