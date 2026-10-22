"""Derive animation-ready layers from the supplied Plotto PNGs.

Nothing is regenerated: every output is a cut, cleanup or recolour of the
original pixels.  Run:  python3 -I tools/prep_assets.py  (from app/)
"""
import json, os, sys
import numpy as np, cv2
from PIL import Image

A = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
OUT = os.path.join(A, 'build')
os.makedirs(OUT, exist_ok=True)
meta = {}


def load(n):
    return np.array(Image.open(os.path.join(A, n)).convert('RGBA')).astype(np.float32)


def save(arr, n):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, n), optimize=True)


def trim(arr, pad=4):
    ys, xs = np.where(arr[..., 3] > 2)
    y0, y1, x0, x1 = max(ys.min() - pad, 0), ys.max() + pad + 1, max(xs.min() - pad, 0), xs.max() + pad + 1
    return arr[y0:y1, x0:x1], (int(x0), int(y0))


def poly_fill(rgb, hole, ring):
    """Fill `hole` with a smooth quadratic surface fitted on `ring` pixels."""
    ys, xs = np.where(ring)
    X = np.stack([np.ones_like(xs), xs, ys, xs * xs, ys * ys, xs * ys], 1).astype(np.float64)
    hy, hx = np.where(hole)
    H = np.stack([np.ones_like(hx), hx, hy, hx * hx, hy * hy, hx * hy], 1).astype(np.float64)
    out = rgb.copy()
    for c in range(3):
        coef, *_ = np.linalg.lstsq(X, rgb[ys, xs, c].astype(np.float64), rcond=None)
        out[hy, hx, c] = H @ coef
    return out


# ------------------------------------------------------------------ eyes
def split_eyes(name, key):
    a = load(name)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    m = ((al > 200) & (r < 140) & (b > 150) & (b - r > 60)).astype(np.uint8)
    n, lab, st, cen = cv2.connectedComponentsWithStats(m)
    comps = [i for i in range(1, n) if 3000 < st[i][4] < 9000 and st[i][3] > 80 and cen[i][1] > 0.35 * a.shape[0]]
    comps.sort(key=lambda i: cen[i][0])
    base = a.copy()
    eyes = []
    feather_all = np.zeros(al.shape, np.float32)
    for k, i in enumerate(comps):
        comp = (lab == i).astype(np.uint8)
        cnts, _ = cv2.findContours(comp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        (cx, cy), (w, h), ang = cv2.fitEllipse(max(cnts, key=len))
        eye = np.zeros(al.shape, np.uint8)
        cv2.ellipse(eye, ((cx, cy), (w + 24, h + 24), ang), 255, -1)
        eye_soft = cv2.GaussianBlur(eye.astype(np.float32), (0, 0), 1.6) / 255.0
        hole = np.zeros(al.shape, np.uint8)
        cv2.ellipse(hole, ((cx, cy), (w + 44, h + 44), ang), 255, -1)
        ringm = np.zeros(al.shape, np.uint8)
        cv2.ellipse(ringm, ((cx, cy), (w + 100, h + 100), ang), 255, -1)
        ringm = (ringm > 0) & (hole == 0) & (al > 250)
        filled = poly_fill(a[..., :3], hole > 0, ringm)
        hs = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3.0) / 255.0
        base[..., :3] = base[..., :3] * (1 - hs[..., None]) + filled * hs[..., None]
        # eye sprite (original pixels, soft-masked)
        spr = a.copy()
        spr[..., 3] = al * eye_soft
        spr, (ox, oy) = trim(spr, 2)
        fn = f'{key}_eye_{k}.png'
        save(spr, fn)
        eyes.append({'file': fn, 'x': ox, 'y': oy, 'w': spr.shape[1], 'h': spr.shape[0],
                     'cx': float(cx), 'cy': float(cy), 'ew': float(w), 'eh': float(h), 'angle': float(ang)})
    save(base, f'{key}_mascot_base.png')
    meta[key + '_mascot'] = {'file': f'{key}_mascot_base.png', 'w': a.shape[1], 'h': a.shape[0], 'eyes': eyes}


split_eyes('01_mascot.png', '01')
split_eyes('02_mascot.png', '02')

# ------------------------------------------------------------------ 01 cards
for n in ['01_card_color1.png', '01_card_color2.png', '01_card_gray.png']:
    a = load(n)
    t, (ox, oy) = trim(a)
    save(t, n.replace('.png', '_t.png'))
    meta[n[:-4]] = {'file': n.replace('.png', '_t.png'), 'x': ox, 'y': oy, 'w': t.shape[1], 'h': t.shape[0]}

# violet version of the grayscale card via a luminance gradient map
gray = np.array(Image.open(os.path.join(OUT, '01_card_gray_t.png')).convert('RGBA')).astype(np.float32)
L = gray[..., 0] * 0.299 + gray[..., 1] * 0.587 + gray[..., 2] * 0.114
stops = [(40, (70, 52, 200)), (95, (122, 98, 236)), (150, (170, 150, 246)),
         (205, (222, 215, 252)), (240, (246, 244, 255)), (255, (255, 255, 255))]
xs = [s[0] for s in stops]
vio = gray.copy()
for c in range(3):
    vio[..., c] = np.interp(L, xs, [s[1][c] for s in stops])
save(vio, '01_card_violet_t.png')

# ------------------------------------------------------------------ 02 cards
front = load('02_card_front.png')
H, W = front.shape[:2]
# card silhouette: rotated rounded rectangle fitted to the front card
cx, cy, cw, ch, ang, rad = 285, 308, 352, 506, 15.5, 46
card = np.zeros((H, W), np.uint8)
rect = np.zeros((ch + 2 * rad, cw + 2 * rad), np.uint8)
cv2.rectangle(rect, (rad, rad), (rad + cw, rad + ch), 255, -1)
rect = cv2.dilate(rect, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 1)))
rr = np.zeros((ch, cw), np.uint8)
cv2.rectangle(rr, (rad, 0), (cw - rad, ch), 255, -1)
cv2.rectangle(rr, (0, rad), (cw, ch - rad), 255, -1)
for px, py in [(rad, rad), (cw - rad, rad), (rad, ch - rad), (cw - rad, ch - rad)]:
    cv2.circle(rr, (px, py), rad, 255, -1)
M = cv2.getRotationMatrix2D((cw / 2, ch / 2), -ang, 1.0)
M[0, 2] += cx - cw / 2
M[1, 2] += cy - ch / 2
card = cv2.warpAffine(rr, M, (W, H))
card_soft = cv2.GaussianBlur(card.astype(np.float32), (0, 0), 2.0) / 255.0
front[..., 3] = np.minimum(front[..., 3], card_soft * 255)
# remove thin connector-line fragments painted across the card
lines = np.zeros((H, W), np.uint8)
segA = np.array([(40, 328), (90, 314), (140, 302), (200, 295), (265, 303)], np.int32)
segB = np.array([(310, 319), (370, 328), (430, 326), (480, 314), (520, 300)], np.int32)
cv2.polylines(lines, [segA, segB], False, 255, 30)
# column-wise linear interpolation across the line band keeps the
# vertical gradients of the card and the blue panel intact
rgb = front[..., :3].copy()
for x in range(W):
    col = np.where(lines[:, x] > 0)[0]
    if len(col) == 0:
        continue
    y0, y1 = col.min() - 2, col.max() + 2
    if y0 < 0 or y1 >= H:
        continue
    t = np.linspace(0, 1, y1 - y0 + 1)[:, None]
    rgb[y0:y1 + 1, x] = rgb[y0, x] * (1 - t) + rgb[y1, x] * t
sm = cv2.GaussianBlur(rgb, (0, 0), 1.2)
lm = cv2.GaussianBlur(lines.astype(np.float32), (0, 0), 2)[..., None] / 255
front[..., :3] = rgb * (1 - lm) + sm * lm
# (debug) save(front, 'dbg_front_clean.png')

# blue panel sprite
r, gch, b = front[..., 0], front[..., 1], front[..., 2]
blue = ((b > 170) & (b - r > 90) & (card > 0)).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(blue)
big = 1 + int(np.argmax(st[1:, 4]))
panel = (lab == big).astype(np.uint8) * 255
panel = cv2.morphologyEx(panel, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
cnts, _ = cv2.findContours(panel, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
panel = np.zeros_like(panel)
cv2.drawContours(panel, [max(cnts, key=cv2.contourArea)], -1, 255, -1)
panel_d = cv2.dilate(panel, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
psoft = cv2.GaussianBlur(panel_d.astype(np.float32), (0, 0), 1.5) / 255.0
pspr = front.copy()
pspr[..., 3] = 255 * psoft * card_soft
save(pspr, '02_panel_blue.png')
# lavender variant of the panel (neutral, "unchanged" state)
Lp = pspr[..., :3].mean(-1)
lav = pspr.copy()
lum = (pspr[..., 0] * .3 + pspr[..., 1] * .59 + pspr[..., 2] * .11)
k = np.clip((lum - 60) / 120, 0, 1)
for c, (lo, hi) in enumerate([(178, 222), (166, 214), (238, 252)]):
    lav[..., c] = lo + (hi - lo) * k
save(lav, '02_panel_lavender.png')

# blank card base: panel area filled from surrounding card surface
hole = cv2.dilate(panel, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
ring = cv2.dilate(hole, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
ringm = (ring > 0) & (hole == 0) & (card_soft > 0.98)
# exclude header row (avatar + lines) from the fit
hdr = ((front[..., 2] - front[..., 0]) > 18) & ((front[..., 0] + front[..., 1] + front[..., 2]) < 700)
ringm &= ~cv2.dilate(hdr.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
filled = poly_fill(front[..., :3], hole > 0, ringm)
hs = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 6) / 255.0
base = front.copy()
base[..., :3] = front[..., :3] * (1 - hs[..., None]) + filled * hs[..., None]
save(base, '02_card_base.png')

# arrow glyph from the back-card sliver (original pixels)
bk = load('02_card_back.png')
ar = ((bk[..., 2] > 170) & (bk[..., 2] - bk[..., 0] > 90) & (bk[..., 3] > 200)).astype(np.uint8)
ar[:, :250] = 0
ar[200:, :] = 0
ar = cv2.dilate(ar, np.ones((5, 5), np.uint8))
asp = bk.copy()
asp[..., 3] = bk[..., 3] * cv2.GaussianBlur(ar.astype(np.float32), (0, 0), 1.2)
asp, (ax, ay) = trim(asp, 2)
save(asp, '02_arrow.png')

meta['02_card'] = {'w': W, 'h': H, 'cx': cx, 'cy': cy, 'cw': cw, 'ch': ch, 'angle': ang}
ys, xs = np.where(panel > 0)
meta['02_panel'] = {'cx': float(xs.mean()), 'cy': float(ys.mean()),
                    'x0': int(xs.min()), 'x1': int(xs.max()), 'y0': int(ys.min()), 'y1': int(ys.max())}

# ------------------------------------------------------------------ 03
pl = load('03_profile_left.png')
pl[30:85, 255:320, 3] = 0           # stray connector stub above the disc
save(pl, '03_profile_left_clean.png')
pr = load('03_profile_right.png')
save(pr, '03_profile_right_clean.png')
sc = load('03_session_card.png')
r, gch, b = sc[..., 0], sc[..., 1], sc[..., 2]
stray = np.zeros(sc.shape[:2], np.uint8)
stray[180:260, 20:60] = 1
stray[60:140, 350:400] = 1
blu = (b - r > 70) & stray.astype(bool)
sc[..., 3] = np.where(cv2.dilate(blu.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0, 0, sc[..., 3])
save(sc, '03_session_card_clean.png')

json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
print(json.dumps(meta, indent=1)[:3000])

with open(os.path.join(OUT, 'meta.js'), 'w') as f:
    f.write('window.PLOTTO_META = ' + json.dumps(meta) + ';\n')
