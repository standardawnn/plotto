/* Plotto onboarding — motion
 * Every scene is a pure function of its local time `t` (seconds since entry):
 * an intro sequence that hands off continuously into idle motion, so the
 * same code drives the live page and the frame-accurate video render.
 * Stage coordinates: 2048 x 2048 units, scaled to fit the layout. */
(() => {
'use strict';
const META = window.PLOTTO_META;
const B = 'assets/build/';
const SVGNS = 'http://www.w3.org/2000/svg';

/* ------------------------------------------------------------ math */
const PI = Math.PI, TAU = PI * 2, D2R = PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // cubic in-out
const eo = k => 1 - Math.pow(1 - k, 3);                                      // cubic out
const eo4 = k => 1 - Math.pow(1 - k, 4);
const sine = k => .5 - .5 * Math.cos(PI * k);                                // sine in-out
const bump = k => k <= 0 || k >= 1 ? 0 : Math.sin(PI * k);                   // 0 → 1 → 0
const softBack = (k, s = .9) => { const c = s + 1, u = k - 1; return 1 + c * u * u * u + s * u * u; }; // tiny overshoot
const rot = (x, y, deg) => { const c = Math.cos(deg * D2R), s = Math.sin(deg * D2R); return [x * c - y * s, x * s + y * c]; };
const wave = (t, period, phase = 0) => Math.sin(TAU * t / period + phase);

/* blink: quick close, softer open */
function blinkAt(t, start, every, seed) {
  if (t < start) return 0;
  const n = Math.floor((t - start) / every);
  const tb = start + n * every + Math.sin(n * 12.9898 + seed) * every * .18;
  const k = (t - tb) / .2;
  if (k < 0 || k > 1) return 0;
  return k < .4 ? eo(k / .4) : 1 - sine((k - .4) / .6);
}

/* ------------------------------------------------------------ dom */
function el(tag, cls, parent) { const e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
function svgEl(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
const IMGS = [];
function img(src, parent, w, h) {
  const i = el('img', null, parent); i.src = src; i.alt = ''; i.draggable = false; i.decoding = 'sync';
  if (w) { i.style.width = w + 'px'; i.style.height = h + 'px'; }
  IMGS.push(i); return i;
}
function sizeOf(i) { return [parseFloat(i.style.width), parseFloat(i.style.height)]; }

/* place an element by its center (stage units) */
function place(e, x, y, r = 0, sx = 1, sy = sx, extra = '') {
  const w = e._w, h = e._h;
  e.style.transform = `translate3d(${(x - w / 2).toFixed(2)}px,${(y - h / 2).toFixed(2)}px,0) ${extra} rotate(${r.toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
}
function setOpacity(e, o) { e.style.opacity = o >= .999 ? '' : Math.max(0, o).toFixed(3); }

function lineGradient(svg, id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0) {
  let defs = svg.querySelector('defs') || svgEl('defs', {}, svg);
  const g = svgEl('linearGradient', { id, x1, y1, x2, y2 }, defs);
  stops.forEach(([o, c, a = 1]) => svgEl('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g));
  return `url(#${id})`;
}

/* ------------------------------------------------------------ mascot
 * base layer has the eyes removed; eyes are separate sprites so Plotto can
 * glance, blink and morph into a crescent eye-smile.                    */
function makeMascot(parent, key, pivot, scale, uid) {
  const m = META[key + '_mascot'];
  const g = el('div', 'mascot', parent);
  g.style.width = m.w + 'px'; g.style.height = m.h + 'px';
  g.style.transformOrigin = `${pivot[0]}px ${pivot[1]}px`;
  img(B + m.file, g, m.w, m.h);
  const eyes = m.eyes.map(e => {
    const i = img(B + e.file, g, e.w, e.h);
    i.style.left = e.x + 'px'; i.style.top = e.y + 'px';
    i.style.transformOrigin = `${e.cx - e.x}px ${e.cy - e.y}px`;
    return { i, e };
  });
  const svg = svgEl('svg', { width: m.w, height: m.h, viewBox: `0 0 ${m.w} ${m.h}` }, g);
  svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
  const grad = lineGradient(svg, 'smile' + uid, [[0, '#6a55f2'], [1, '#3826cf']], 0, 0, 0, 1);
  const smiles = m.eyes.map(e => {
    const a = e.ew * .5, b = e.eh * .12, c = e.eh * .40;
    const tilt = e.angle - 180;
    const outer = svgEl('g', { transform: `rotate(${tilt.toFixed(2)} ${e.cx} ${e.cy})` }, svg);
    const inner = svgEl('g', {}, outer);
    svgEl('path', {
      d: `M ${e.cx - a} ${e.cy + b} Q ${e.cx} ${e.cy - c} ${e.cx + a} ${e.cy + b}`,
      fill: 'none', stroke: grad, 'stroke-width': (e.ew * .2).toFixed(1), 'stroke-linecap': 'round'
    }, inner);
    inner.style.transformOrigin = `${e.cx}px ${e.cy}px`;
    inner.style.transformBox = 'view-box';
    return inner;
  });
  return {
    el: g,
    update({ x, y, r = 0, sx = 1, sy = 1, o = 1, lookX = 0, lookY = 0, blink = 0, smile = 0 }) {
      g.style.transform = `translate3d(${(x - pivot[0]).toFixed(2)}px,${(y - pivot[1]).toFixed(2)}px,0) rotate(${r.toFixed(3)}deg) scale(${(sx * scale).toFixed(4)},${(sy * scale).toFixed(4)})`;
      setOpacity(g, o);
      const squash = clamp(Math.max(blink, eo(prog(smile, 0, .55))));
      const eyeO = 1 - sine(prog(smile, .3, .62));
      eyes.forEach(({ i, e }) => {
        i.style.transform = `translate(${lookX.toFixed(2)}px,${(lookY + squash * e.eh * .1).toFixed(2)}px) scale(${(1 - .04 * squash).toFixed(3)},${(1 - .9 * squash).toFixed(3)})`;
        setOpacity(i, eyeO);
      });
      const sk = eo(prog(smile, .28, 1)), so = sine(prog(smile, .28, .6));
      smiles.forEach(s => {
        s.style.transform = `translate(${lookX.toFixed(2)}px,${lookY.toFixed(2)}px) scale(${(.35 + .65 * sk).toFixed(3)},${(.6 + .4 * sk).toFixed(3)})`;
        s.style.opacity = so.toFixed(3);
      });
    }
  };
}
function sprite(src, parent, w, h) { const i = img(src, parent, w, h); i._w = w; i._h = h; return i; }

/* =================================================================
 * 01 — Catch Up
 * ================================================================= */
function scene01(root) {
  const C = [1004, 1080], RX = 790, RY = 335, TILT = -16;
  const ring = phi => {
    const [x, y] = rot(RX * Math.cos(phi), RY * Math.sin(phi), TILT);
    return [C[0] + x, C[1] + y, Math.sin(phi)];
  };

  const ringBack = svgEl('svg', { class: 'lines', viewBox: '0 0 2048 2048' }, root);
  const backLayer = el('div', 'sprite', root);           // cards behind Plotto
  const mascot = makeMascot(root, '01', [650, 645], 1.02, 'a');
  const ringFront = svgEl('svg', { class: 'lines', viewBox: '0 0 2048 2048' }, root);
  const frontLayer = el('div', 'sprite', root);          // cards in front of Plotto

  const gB = lineGradient(ringBack, 'rb', [[0, '#8d7cf6', .55], [.5, '#a99cf8', .38], [1, '#8d7cf6', .55]]);
  const gF = lineGradient(ringFront, 'rf', [[0, '#7464f3'], [.5, '#8f6ff4'], [1, '#6a66f0']]);
  const mkRing = (svg, stroke, w) => ({
    glow: svgEl('path', { fill: 'none', stroke: '#8b7bf7', 'stroke-opacity': .16, 'stroke-width': w * 4.2, 'stroke-linecap': 'round' }, svg),
    line: svgEl('path', { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round' }, svg)
  });
  const rB = mkRing(ringBack, gB, 4.4), rF = mkRing(ringFront, gF, 5.2);

  const mkCard = (file, scale, phi0, extra) => {
    const m = META[file];
    const w = m.w, h = m.h;
    const wrap = el('div', 'card-wrap', frontLayer);
    wrap.style.width = w + 'px'; wrap.style.height = h + 'px'; wrap._w = w; wrap._h = h;
    const base = img(B + m.file, wrap, w, h);
    let top = null;
    if (extra) { top = img(B + extra, wrap, w, h); top.style.clipPath = 'circle(0% at 30% 30%)'; }
    return { wrap, base, top, scale, phi0, w, h, front: true };
  };
  const cards = [
    mkCard('01_card_color2', .41, 190 * D2R),                           // chat (left)
    mkCard('01_card_color1', .42, -48 * D2R),                           // calendar (back, upper right)
    mkCard('01_card_gray', .40, 40 * D2R, '01_card_violet_t.png'),      // grayscale (front, lower right)
  ];
  const GRAY = cards[2];

  /* orbit: angular speed eases in once the ring is complete */
  const T_ORBIT = 4.45, RAMP = 1.6, OMEGA = TAU / 26;
  const orbitAngle = t => {
    if (t <= T_ORBIT) return 0;
    const u = t - T_ORBIT;
    // speed = OMEGA * smoothstep(u / RAMP); angle is its integral
    if (u < RAMP) { const x = u / RAMP; return OMEGA * RAMP * (x * x * x - x * x * x * x / 2); }
    return OMEGA * (RAMP * .5 + (u - RAMP));
  };

  const ringPath = (from, to, wantFront) => {
    let d = '', open = false;
    const N = Math.max(2, Math.ceil(Math.abs(to - from) / (TAU / 260)));
    for (let i = 0; i <= N; i++) {
      const phi = from + (to - from) * i / N;
      const [x, y, z] = ring(phi);
      const isFront = z >= .35;   // only the stretch crossing Plotto's body is drawn in front
      if (isFront === wantFront) { d += (open ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); open = true; }
      else open = false;
    }
    return d;
  };

  return function update(t) {
    /* ---- Plotto */
    const intro = eo4(prog(t, 0, 1.1));
    const notice = sine(prog(t, 1.25, 1.75));
    const reach = sine(prog(t, 1.85, 2.5)) * (1 - sine(prog(t, 2.95, 3.8)));
    const smile = sine(prog(t, 4.7, 5.25)) * (1 - sine(prog(t, 6.7, 7.2)));
    const hop = bump(prog(t, 4.65, 5.45));
    const mx = C[0] + wave(t, 7.4) * 4 + reach * 40;
    const my = 990 + (1 - intro) * 70 + wave(t, 3.8) * 5 + reach * 8 - hop * 22;
    const mr = wave(t, 5.6, 1) * 0.5 + notice * 1.5 + reach * 3;
    const breath = wave(t, 3.8, 1.2) * .007;

    // eyes: glance to the grey card, then softly track it while it orbits
    let lookX = notice * 10 - reach * 1, lookY = notice * 4;
    const phiG = GRAY.phi0 + orbitAngle(t);
    const trackK = sine(prog(t, 7.2, 8.4));
    if (trackK > 0) { const [gx, gy] = ring(phiG); lookX = lerp(lookX, clamp((gx - C[0]) / 700, -1, 1) * 6, trackK); lookY = lerp(lookY, clamp((gy - 900) / 500, -1, 1) * 4, trackK); }
    lookX *= 1 - sine(prog(t, 3.0, 3.6)) * (1 - trackK) * .7;
    lookY *= 1 - sine(prog(t, 3.0, 3.6)) * (1 - trackK) * .7;
    const blink = smile > 0.01 ? 0 : blinkAt(t, 3.6, 4.2, 1.7);

    mascot.update({ x: mx, y: my, r: mr, sx: 1 + breath + hop * .02, sy: 1 - breath - hop * .015, o: sine(prog(t, 0, .7)),
      lookX, lookY, blink, smile });

    /* ---- ring: drawn progressively from the grey card around through the others */
    const draw = eio(prog(t, 3.25, 4.65));
    const from = GRAY.phi0 + orbitAngle(Math.min(t, T_ORBIT));
    const to = from + TAU * draw;
    const dB = draw > 0 ? ringPath(from, to, false) : '', dF = draw > 0 ? ringPath(from, to, true) : '';
    rB.line.setAttribute('d', dB); rB.glow.setAttribute('d', dB);
    rF.line.setAttribute('d', dF); rF.glow.setAttribute('d', dF);

    /* ---- cards */
    const connectK = eio(prog(t, 3.3, 4.6));       // free drift -> locked onto ring
    const orb = orbitAngle(t);
    cards.forEach((c, i) => {
      const phi = c.phi0 + orb;
      let [x, y, z] = ring(phi);
      const drift = 1 - connectK;
      x += (wave(t, 4.6 + i * .7, i * 2.1) * 22 + wave(t, 7.9, i) * 10) * drift;
      y += (wave(t, 3.9 + i * .5, i * 1.3 + 1) * 20) * drift + wave(t, 4.4 + i * .3, i) * 7 * (1 - drift);
      let r = wave(t, 6.2 + i, i * 1.7) * 2.2 * drift + wave(t, 5.3 + i, i) * .8 * (1 - drift) + Math.cos(phi) * 4 * (1 - drift);
      // entrance: drift in from slightly outside the ring
      const ein = eo4(prog(t, .15 + i * .12, 1.25 + i * .12));
      x += (x - C[0]) * .08 * (1 - ein); y += (y - C[1]) * .08 * (1 - ein) + 30 * (1 - ein);
      let s = c.scale * (1 + .12 * z) * (.92 + .08 * ein);
      let ry = -Math.cos(phi) * 12 * connectK;
      // pulse as the ring stroke reaches this card
      const reached = ((phi - from) % TAU + TAU) % TAU / TAU;
      const pulse = c === GRAY ? 0 : bump(prog(draw, reached - .02, reached + .16)) * (t < 5 ? 1 : 0);
      s *= 1 + pulse * .035;

      let glow = pulse * .45;
      if (c === GRAY) {
        // Plotto reaches; the card leans in to meet the touch
        x -= reach * 26; y -= reach * 14;
        const press = bump(prog(t, 2.42, 2.82));
        s *= 1 - press * .035;
        const fill = eio(prog(t, 2.5, 3.45));
        c.top.style.clipPath = `circle(${(fill * 150).toFixed(2)}% at 9% 42%)`;
        const act = prog(t, 2.5, 4.2);
        glow = Math.max(glow, bump(Math.min(act * 1.6, 1)) * .75 + sine(prog(t, 2.9, 3.8)) * .22);
        r += (1 - eo(prog(t, 2.55, 3.7))) * eo(prog(t, 2.45, 2.7)) * -9;        // activation twist, settles back
        ry += bump(prog(t, 2.55, 3.65)) * -16;
      }
      setOpacity(c.wrap, sine(prog(t, .1 + i * .12, .8 + i * .12)));
      c.wrap.style.filter = glow > .01
        ? `drop-shadow(0 0 ${(26 + glow * 30).toFixed(1)}px rgba(118,92,250,${(glow * .75).toFixed(3)}))` : '';
      place(c.wrap, x, y, r, s, s, `perspective(2400px) rotateY(${ry.toFixed(2)}deg)`);
      const wantFront = z >= -.02 || (c === GRAY && t < 4.6);
      if (wantFront !== c.front) { (wantFront ? frontLayer : backLayer).appendChild(c.wrap); c.front = wantFront; }
      c.z = z;
    });
    // inside each layer, nearer cards on top
    [frontLayer, backLayer].forEach(L => cards.filter(c => c.wrap.parentNode === L).forEach(c => { c.wrap.style.zIndex = Math.round(c.z * 100) + 200; }));
  };
}

/* =================================================================
 * 02 — Understand Changes
 * ================================================================= */
function scene02(root) {
  const CARD = META['02_card'];
  const CW = CARD.w, CH = CARD.h;
  const deck = el('div', 'sprite', root);
  const mascot = makeMascot(root, '02', [443, 638], .9, 'b');
  // wand rides with Plotto's hand (pivot = grip)
  const wand = sprite('assets/02_wand.png', mascot.el, 289, 479);
  wand.style.left = '736px'; wand.style.top = '438px';
  wand.style.transformOrigin = '100px 330px';
  const lines = svgEl('svg', { class: 'lines', viewBox: '0 0 2048 2048' }, root);
  const lg = lineGradient(lines, 'l2', [[0, '#4d5bf0'], [1, '#8a72f3']], 0, 0, 1, 0);

  const mkCard = (withArrow) => {
    const w = el('div', 'card-wrap', deck);
    w.style.width = CW + 'px'; w.style.height = CH + 'px'; w._w = CW; w._h = CH;
    img(B + '02_card_base.png', w, CW, CH);
    const blue = img(B + '02_panel_blue.png', w, CW, CH);
    const lav = img(B + '02_panel_lavender.png', w, CW, CH);
    blue.style.transformOrigin = lav.style.transformOrigin = `${META['02_panel'].cx}px ${META['02_panel'].cy}px`;
    if (withArrow) { const a = img(B + '02_arrow.png', w, 91, 85); a.style.left = '392px'; a.style.top = '128px'; a.style.opacity = .9; }
    return { w, blue, lav };
  };
  // back / middle / primary (DOM order = depth at start)
  const back = mkCard(true), mid = mkCard(false), prim = mkCard(false);
  back.blue.style.display = mid.blue.style.display = 'none';

  // stacked deck (as in the source art) -> fanned -> organised
  const S0 = { prim: [1420, 1080, 0, 1.06], mid: [1468, 1150, 9, 1.04], back: [1514, 1220, 18, 1.02] };
  const S1 = { prim: [1330, 1110, -5, 1.08], mid: [1690, 1560, 22, .84], back: [1705, 610, -16, .84] };
  const S2 = { prim: [1306, 1080, -7.5, 1.16], mid: [1768, 1482, 6, .78], back: [1762, 648, -5, .78] };

  const paths = [0, 1].map(() => ({
    glow: svgEl('path', { fill: 'none', stroke: '#7a6cf5', 'stroke-opacity': .14, 'stroke-width': 18, 'stroke-linecap': 'round', pathLength: 1 }, lines),
    line: svgEl('path', { fill: 'none', stroke: lg, 'stroke-width': 5.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, lines),
    a: svgEl('circle', { r: 9, fill: '#5260f0' }, lines),
    b: svgEl('circle', { r: 11, fill: '#fff', stroke: '#7c69f3', 'stroke-width': 5 }, lines),
  }));
  paths.forEach(p => p.glow.setAttribute('stroke-dasharray', '1 1'));

  const toStage = (st, lx, ly) => {   // card-local px -> stage
    const [dx, dy] = rot((lx - CW / 2) * st[3], (ly - CH / 2) * st[3], st[2]);
    return [st[0] + dx, st[1] + dy];
  };
  const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));

  return function update(t) {
    /* ---- Plotto + wand */
    const intro = eo4(prog(t, 0, 1.1));
    const raise = sine(prog(t, .55, 1.15));
    const flicks = [[1.2, 7], [1.55, -6], [1.9, 8], [2.6, -5]];
    let wr = lerp(14, 0, raise);
    flicks.forEach(([at, a]) => { wr += a * bump(prog(t, at - .08, at + .42)); });
    wr += wave(t, 4.2, .4) * 2 * prog(t, 4, 5);
    const lean = sine(prog(t, 1.1, 1.9)) * (1 - sine(prog(t, 3.2, 4.2)));
    const point = bump(prog(t, 2.9, 3.7));
    wr -= point * 6;
    wand.style.transform = `rotate(${wr.toFixed(3)}deg)`;
    const breath = wave(t, 3.9, 1) * .007;
    mascot.update({
      x: 610 + wave(t, 7.6) * 10 + lean * 14, y: 1000 + (1 - intro) * 70 + wave(t, 3.9) * 15,
      r: wave(t, 6.1, .5) * 1.3 + lean * 2.4 - point * 1.2, sx: 1 + breath, sy: 1 - breath, o: sine(prog(t, 0, .7)),
      lookX: 8 * sine(prog(t, .9, 1.3)) + point * 3, lookY: -2 * sine(prog(t, .9, 1.3)) + point * 3,
      blink: blinkAt(t, 3.9, 4.6, 3.1)
    });

    /* ---- cards: separate & fan (staggered, wand-driven), then organise */
    const fanK = { back: eio(prog(t, 1.2, 2.15)), mid: eio(prog(t, 1.4, 2.35)), prim: eio(prog(t, 1.6, 2.45)) };
    const orgK = { back: eio(prog(t, 2.35, 3.25)), mid: eio(prog(t, 2.4, 3.3)), prim: eio(prog(t, 2.3, 3.15)) };
    const ent = eo4(prog(t, .1, 1.1));
    const states = {};
    [['back', back, 2], ['mid', mid, 1], ['prim', prim, 0]].forEach(([k, c, i]) => {
      let st = mix(mix(S0[k], S1[k], fanK[k]), S2[k], orgK[k]);
      // arc the fan path outward a little (not a straight slide)
      const arc = bump(fanK[k]) * (k === 'prim' ? 0 : 60);
      st[0] += arc; st[1] += (k === 'back' ? -1 : 1) * arc * .4;
      // idle float once organised
      const idle = prog(t, 3.2, 4.4);
      st[0] += wave(t, 5.1 + i * .6, i * 2) * 7 * idle;
      st[1] += (wave(t, 4.3 + i * .5, i * 1.4) * 10 + (1 - ent) * 60);
      st[2] += wave(t, 6.3 + i, i) * .7 * idle;
      st[3] *= .94 + .06 * ent;
      states[k] = st;
      place(c.w, st[0], st[1], st[2], st[3]);
      setOpacity(c.w, sine(prog(t, .05 + i * .08, .75 + i * .08)));
      // depth: secondaries recede slightly
      const dim = k === 'prim' ? 0 : orgK[k] * .1;
      c.w.style.filter = dim > .005 ? `saturate(${1 - dim}) brightness(${1 + dim * .25})` : '';
    });
    // primary steps forward: shadow deepens
    const fwd = orgK.prim;
    prim.w.style.filter = fwd > .01 ? `drop-shadow(0 ${(fwd * 26).toFixed(1)}px ${(fwd * 40).toFixed(1)}px rgba(72,60,190,${(fwd * .22).toFixed(3)}))` : '';

    /* ---- the changed section turns blue */
    const hl = eio(prog(t, 3.05, 3.75));
    setOpacity(prim.lav, 1 - hl);
    const pop = bump(prog(t, 3.05, 3.9));
    const pscale = 1 + pop * .045 + hl * .012;
    prim.blue.style.transform = prim.lav.style.transform = `scale(${pscale.toFixed(4)})`;
    const glow = bump(prog(t, 3.1, 4.2)) * .8 + hl * .3 + wave(t, 3.2) * .05 * prog(t, 4.2, 5);
    prim.blue.style.filter = glow > .01 ? `drop-shadow(0 0 ${(18 + glow * 22).toFixed(1)}px rgba(70,90,255,${(glow * .6).toFixed(3)}))` : '';

    /* ---- reason / impact lines from the highlighted section */
    const P = META['02_panel'];
    const pS = states.prim;
    const starts = [toStage(pS, P.x1 - 18, P.y0 + 120), toStage(pS, P.x1 - 62, P.y1 - 120)];
    const ends = [toStage(states.back, 150, 330), toStage(states.mid, 160, 300)];
    [[0, 3.6, 4.5], [1, 3.85, 4.75]].forEach(([i, a, b]) => {
      const p = paths[i], [x0, y0] = starts[i], [x3, y3] = ends[i];
      const sgn = i === 0 ? -1 : 1;
      const c1 = [x0 + 150, y0 + sgn * 10], c2 = [x3 - 120, y3 - sgn * 150];
      const d = `M${x0.toFixed(1)} ${y0.toFixed(1)} C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${x3.toFixed(1)} ${y3.toFixed(1)}`;
      const k = eio(prog(t, a, b));
      [p.line, p.glow].forEach(e => { e.setAttribute('d', d); e.setAttribute('stroke-dashoffset', (1 - k).toFixed(4)); e.style.opacity = k > 0 ? 1 : 0; });
      p.a.setAttribute('cx', x0); p.a.setAttribute('cy', y0);
      p.a.setAttribute('r', (9 * eo(prog(t, a - .15, a + .1))).toFixed(2));
      p.b.setAttribute('cx', x3); p.b.setAttribute('cy', y3);
      const kb = softBack(prog(t, b - .08, b + .32), 1.2);
      p.b.setAttribute('r', Math.max(0, 11 * kb).toFixed(2));
      p.b.style.opacity = prog(t, b - .08, b + .05);
    });
  };
}

/* =================================================================
 * 03 — Connect People
 * ================================================================= */
function scene03(root) {
  const backArc = svgEl('svg', { class: 'lines', viewBox: '0 0 2048 2048' }, root);
  const mascot = makeMascot(root, '01', [650, 645], 1.14, 'c');
  const frontLine = svgEl('svg', { class: 'lines', viewBox: '0 0 2048 2048' }, root);
  const L = sprite(B + '03_profile_left_clean.png', root, 362, 370);
  const R = sprite(B + '03_profile_right_clean.png', root, 342, 380);
  const card = sprite(B + '03_session_card_clean.png', root, 414, 332);
  const CARD_S = 1.12;

  const g1 = lineGradient(frontLine, 'l3', [[0, '#5a63e6'], [.5, '#6f66ec'], [1, '#7d68ef']]);
  const g2 = lineGradient(backArc, 'l3b', [[0, '#8578f2', .5], [1, '#9b84f4', .5]]);
  const mk = (svg, stroke, w, glowO) => ({
    glow: svgEl('path', { fill: 'none', stroke: '#7b70f0', 'stroke-opacity': glowO, 'stroke-width': w * 3.4, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, svg),
    line: svgEl('path', { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, svg),
  });
  const front = mk(frontLine, g1, 10.5, .13), back = mk(backArc, g2, 6, .08);

  // final (source-art) positions and the separated start positions
  const LF = [402, 1330], RF = [1664, 847];
  const L0 = [262, 1398], R0 = [1800, 772];
  // connector stubs painted in the profile art (local offset from centre, outward direction)
  const LS = { p: [152, 85], d: [.947, .322] }, RS = { p: [-46, 165], d: [-.524, .852] };
  const LB = [104, -126], RB = [-150, -24];

  const bez = (p0, c1, c2, p3, k) => {
    const u = 1 - k;
    return [0, 1].map(i => u * u * u * p0[i] + 3 * u * u * k * c1[i] + 3 * u * k * k * c2[i] + k * k * k * p3[i]);
  };
  const dstr = (p0, c1, c2, p3) => `M${p0.map(v => v.toFixed(1)).join(' ')} C${c1.map(v => v.toFixed(1)).join(' ')} ${c2.map(v => v.toFixed(1)).join(' ')} ${p3.map(v => v.toFixed(1)).join(' ')}`;
  const loc = (c, r, s, v) => { const [x, y] = rot(v[0] * s, v[1] * s, r); return [c[0] + x, c[1] + y]; };

  return function update(t) {
    /* ---- Plotto gathers the two people together */
    const intro = eo4(prog(t, 0, 1.1));
    const open = sine(prog(t, .6, 1.2)) * (1 - sine(prog(t, 1.2, 2.0)));   // arms out
    const gather = sine(prog(t, 1.2, 2.0)) * (1 - sine(prog(t, 2.2, 3.0))); // arms in
    const happy = bump(prog(t, 4.15, 4.9));                                  // little hop
    const smile = sine(prog(t, 4.1, 4.65)) * (1 - sine(prog(t, 6.3, 6.8)));
    const breath = wave(t, 3.7, .8) * .007;
    mascot.update({
      x: 1058 + wave(t, 7.1) * 10 - gather * 6, y: 962 + (1 - intro) * 70 + wave(t, 3.7) * 15 - happy * 26,
      r: wave(t, 5.9, 2) * 1.2 + open * -1.8 + gather * 1.6 + happy * -1.5,
      sx: 1 + breath + open * .022 - gather * .014 + happy * .02, sy: 1 - breath - open * .012 + gather * .01 - happy * .012,
      o: sine(prog(t, 0, .7)),
      lookX: lerp(-6, 6, sine(prog(t, .9, 1.6))) * (1 - sine(prog(t, 2.2, 2.8))) + sine(prog(t, 3.2, 3.6)) * (1 - sine(prog(t, 4, 4.3))) * 0,
      lookY: sine(prog(t, 3.2, 3.7)) * 6 * (1 - sine(prog(t, 4.0, 4.4))),
      blink: smile > .01 ? 0 : blinkAt(t, 3.0, 4.4, 5.3),
      smile
    });

    /* ---- profiles drift toward each other, following the gesture */
    const move = eio(prog(t, .75, 2.75));
    const settle = softBack(prog(t, 1.9, 3.0), .6);
    const k = lerp(move, settle, prog(t, 1.9, 2.4)) ;
    const idle = prog(t, 2.8, 4);
    const nod = bump(prog(t, 4.15, 4.85));
    const lp = [lerp(L0[0], LF[0], k) + wave(t, 5.3) * 6 * idle, lerp(L0[1], LF[1], k) + wave(t, 4.1, .6) * 11 + (1 - intro) * 40 - nod * 10];
    const rp = [lerp(R0[0], RF[0], k) + wave(t, 5.7, 1) * 6 * idle, lerp(R0[1], RF[1], k) + wave(t, 4.5, 2.2) * 11 + (1 - intro) * 40 - nod * 10];
    const lr = lerp(-7, 0, k) + wave(t, 6.6) * .8, rr = lerp(7, 0, k) + wave(t, 6.9, 1) * .8;
    const ls = (.94 + .06 * intro) * (1 + nod * .03), rs = (.94 + .06 * intro) * (1 + nod * .03);
    place(L, lp[0], lp[1], lr, ls); setOpacity(L, sine(prog(t, .05, .75)));
    place(R, rp[0], rp[1], rr, rs); setOpacity(R, sine(prog(t, .15, .85)));
    const lc = [lp[0], lp[1]], rc = [rp[0], rp[1]];

    /* ---- connection line: grows out of the left stub into the right stub */
    const p0 = loc(lc, lr, ls, LS.p), p3 = loc(rc, rr, rs, RS.p);
    const d0 = rot(LS.d[0], LS.d[1], lr), d3 = rot(RS.d[0], RS.d[1], rr);
    const c1 = [p0[0] + d0[0] * 420, p0[1] + d0[1] * 420], c2 = [p3[0] + d3[0] * 420, p3[1] + d3[1] * 420];
    const fd = dstr(p0, c1, c2, p3);
    const fk = eio(prog(t, 2.25, 3.35));
    [front.line, front.glow].forEach(e => { e.setAttribute('d', fd); e.setAttribute('stroke-dashoffset', (1 - fk).toFixed(4)); e.style.opacity = fk > 0 ? 1 : 0; });
    // faint return arc behind Plotto closes the loop
    const b0 = loc(lc, lr, ls, LB), b3 = loc(rc, rr, rs, RB);
    const bd = dstr(b0, [b0[0] + 70, b0[1] - 360], [b3[0] - 420, b3[1] + 30], b3);
    const bk = eio(prog(t, 2.6, 3.7));
    [back.line, back.glow].forEach(e => { e.setAttribute('d', bd); e.setAttribute('stroke-dashoffset', (1 - bk).toFixed(4)); e.style.opacity = bk > 0 ? 1 : 0; });

    /* ---- shared-session card emerges from the line and expands */
    const mid = bez(p0, c1, c2, p3, .5);
    const ek = prog(t, 3.2, 4.15);
    const grow = softBack(ek, .7);
    const rise = eo(ek);
    const cx = lerp(mid[0], 1142, rise) + wave(t, 5.0, .3) * 5 * idle;
    const cy = lerp(mid[1], 1292, rise) + wave(t, 4.2, 1.1) * 8 * prog(t, 4.2, 5.2);
    const sx = CARD_S * Math.max(.001, lerp(.18, 1, grow) * (1 + bump(prog(t, 3.2, 3.9)) * .03));
    const sy = CARD_S * Math.max(.001, lerp(.12, 1, softBack(prog(t, 3.28, 4.2), .7)));
    place(card, cx, cy, lerp(-9, 0, eo(ek)) + wave(t, 6.4) * .6 * idle, sx, sy);
    setOpacity(card, sine(prog(t, 3.2, 3.55)));
    const cg = bump(prog(t, 3.5, 4.8));
    card.style.filter = cg > .01 ? `drop-shadow(0 0 ${(20 + cg * 20).toFixed(1)}px rgba(118,100,245,${(cg * .5).toFixed(3)}))` : '';
  };
}

/* =================================================================
 * shell: navigation, transitions, copy, dots, CTA
 * ================================================================= */
const stage = document.getElementById('stage');
const stageWrap = document.getElementById('stageWrap');
const factories = [scene01, scene03, scene02];
const scenes = factories.map((f, i) => {
  const root = el('div', 'scene', stage);
  root.style.display = 'none';
  return { root, update: f(root), enter: 0 };
});
const copies = [...document.querySelectorAll('.slide-copy')];
const dotEls = [...document.querySelectorAll('#dots button')];
const cta = document.getElementById('cta');
const lblNext = cta.querySelector('[data-l=next]'), lblStart = cta.querySelector('[data-l=start]');

const DELAY = .28, OUT = .24, IN = .42;
const state = { cur: 0, prev: null, dir: 1, pressAt: -9, lastDotT: 0, dotFrom: 0 };
scenes[0].enter = 0;

function nav(to, T) {
  if (!RECORD && (clock0 === null || T < scenes[state.cur].enter + IN)) return;
  if (to === state.cur || to < 0 || to >= scenes.length) return;
  state.prev = { idx: state.cur, at: T, enter: scenes[state.cur].enter };
  state.dir = to > state.cur ? 1 : -1;
  state.dotFrom = state.cur; state.lastDotT = T;
  state.cur = to;
  try { sessionStorage.setItem('plotto-tour-step', String(to)); } catch (e) { /* storage unavailable */ }
  scenes[to].enter = T + DELAY;
}

function resize() {
  const W = stageWrap.clientWidth;
  const screenEl = document.getElementById('screen');
  const H = screenEl ? screenEl.clientHeight : innerHeight;
  /* fit the artwork inside the device height (keep room for the dots at the bottom) */
  const avail = Math.max(0, H - stageWrap.offsetTop - 90);
  const k = Math.min(W, avail) / 2048;
  stage.style.transform = `translate(${((W - 2048 * k) / 2).toFixed(2)}px,0) scale(${k})`;
}
new ResizeObserver(resize).observe(stageWrap);
resize();

const schedule = [];   // scripted navigation (video render)
function renderAt(T) {
  document.documentElement.classList.add('motion-ready');
  while (schedule.length && schedule[0].at <= T) { const e = schedule.shift(); if (e.press) state.pressAt = e.at; else nav(e.to, e.at); }
  const { cur, prev, dir } = state;
  scenes.forEach((s, i) => {
    const active = i === cur, leaving = prev && i === prev.idx && T - prev.at < OUT;
    if (!active && !leaving) { if (s.root.style.display !== 'none') s.root.style.display = 'none'; return; }
    s.root.style.display = '';
    if (active) {
      const t = T - s.enter;
      if (t < 0) { s.root.style.opacity = 0; return; }
      const k = eo(prog(t, 0, IN));
      s.root.style.opacity = k.toFixed(3);
      s.root.style.transform = k < 1 ? `translate3d(${(dir * 70 * (1 - k)).toFixed(2)}px,0,0)` : '';
      s.update(matchMedia('(prefers-reduced-motion: reduce)').matches?4:t);
    } else {
      const u = prog(T - prev.at, 0, OUT);
      s.root.style.opacity = (1 - sine(u)).toFixed(3);
      s.root.style.transform = `translate3d(${(-dir * 90 * eio(u)).toFixed(2)}px,0,0) scale(${(1 - .025 * u).toFixed(4)})`;
      s.update(T - prev.enter);   // keeps moving while it leaves — no reset
    }
  });
  // copy
  copies.forEach((c, i) => {
    let o = 0, x = 0;
    if (i === cur) { const k = eo(prog(T - scenes[cur].enter - .04, 0, .5)); o = k; x = dir * 6 * (1 - k); }
    else if (prev && i === prev.idx) { const u = prog(T - prev.at, 0, .2); o = 1 - sine(u); x = -dir * 5 * eio(u); }
    c.style.opacity = o.toFixed(3);
    c.style.transform = `translate3d(${x.toFixed(3)}cqw,0,0)`;
    c.style.visibility = o < .002 ? 'hidden' : '';
    c.setAttribute('aria-hidden', i === cur ? 'false' : 'true');
  });
  // dots
  const dk = eio(prog(T - state.lastDotT, 0, .45));
  dotEls.forEach((d, i) => {
    const a = i === cur ? dk : (i === state.dotFrom && state.dotFrom !== cur ? 1 - dk : 0);
    d.style.width = `${(2 + 4.4 * a).toFixed(3)}cqw`;
    d.style.background = a > 0 ? `color-mix(in srgb, var(--brand) ${(a * 100).toFixed(1)}%, var(--dot))` : '';
    d.setAttribute('aria-selected', i === cur);
  });
  // CTA label + press feedback
  const last = cur === scenes.length - 1;
  const lk = last ? eio(prog(T - scenes[cur].enter + .1, 0, .4)) : (state.prev && state.prev.idx === scenes.length - 1 ? 1 - eio(prog(T - state.prev.at, 0, .3)) : 0);
  lblNext.style.opacity = (1 - lk).toFixed(3); lblStart.style.opacity = lk.toFixed(3);
  const p = bump(prog(T - state.pressAt, 0, .32));
  cta.style.transform = p > 0 ? `scale(${(1 - .035 * p).toFixed(4)})` : '';
}

/* ---------- live mode */
const RECORD = /[?&]record\b/.test(location.search);
let clock0 = null;
const now = () => (performance.now() - clock0) / 1000;
addEventListener('message', e => {if(e.origin===location.origin && e.source===parent && e.data?.type==='plotto:start'){
  /* Resume the scene the visitor was on if the page was reloaded (for example after a memory reset). */
  let saved = 0;
  try { saved = Number(sessionStorage.getItem('plotto-tour-step')) || 0; } catch (err) { saved = 0; }
  if (saved > 0 && saved < scenes.length) {
    state.cur = saved; state.prev = null; state.dir = 1;
    clock0 = performance.now() - (scenes[saved].enter + IN) * 1000;
    renderAt(now());
  } else { clock0 = performance.now(); renderAt(0); }
}});
function next() { const T = now(); if(clock0 === null || T < scenes[state.cur].enter + IN)return; state.pressAt = T; if (state.cur < scenes.length - 1) nav(state.cur + 1, T); else finish(); }
function finish() { parent.postMessage({type:'plotto:name'},location.origin); }
cta.addEventListener('click', next);
document.getElementById('skip-forward').addEventListener('click', finish);
document.getElementById('skip').addEventListener('click',()=>{if(state.cur>0)nav(state.cur-1,now());else parent.postMessage({type:'plotto:launcher'},location.origin);});
dotEls.forEach((d, i) => d.addEventListener('click', () => nav(i, now())));
addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') nav(state.cur - 1, now());
});
let sx0 = null;
const scr = document.getElementById('screen');
scr.addEventListener('pointerdown', e => { sx0 = e.clientX; });
scr.addEventListener('pointerup', e => {
  if (sx0 == null) return;
  const dx = e.clientX - sx0; sx0 = null;
  if (Math.abs(dx) > 50) { if(dx < 0) next(); else nav(state.cur - 1, now()); }
});

const ready = Promise.all(IMGS.map(i => i.decode().catch(() => {})));
window.PlottoOnboarding = {
  ready, renderAt, nav,
  script(events) { schedule.push(...events); schedule.sort((a, b) => a.at - b.at); }
};
if (!RECORD) {
  ready.then(() => {
    clock0 = performance.now();
    renderAt(0);
    parent.postMessage({type:'plotto:ready'},location.origin);
    const loop = () => { renderAt(now()); requestAnimationFrame(loop); };
    loop();
  });
}
})();
