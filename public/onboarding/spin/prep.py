"""Split the single Plotto 'check' PNG into turnable layers (pixels from the original only)."""
import json, os
import numpy as np, cv2
from PIL import Image

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'layers'); os.makedirs(OUT, exist_ok=True)
a = np.array(Image.open(os.path.join(D, 'src.png')).convert('RGBA')).astype(np.float32)
H, W = a.shape[:2]
A = a[..., 3].copy()
A[A < 16] = 0                       # drop faint background haze
rgb = a[..., :3]

def ell(c, ax, ang=0, grow=0):
    m = np.zeros((H, W), np.uint8)
    cv2.ellipse(m, tuple(map(int, c)), (int(ax[0] + grow), int(ax[1] + grow)), ang, 0, 360, 255, -1)
    return m > 0

def soft(m, s):
    return cv2.GaussianBlur(m.astype(np.float32), (0, 0), s)

def qfill(img, hole, ring, deg=2):
    ys, xs = np.where(ring); hy, hx = np.where(hole)
    def feats(x, y):
        x = (x - W / 2) / W; y = (y - H / 2) / H
        f = [np.ones_like(x), x, y, x * x, y * y, x * y]
        if deg >= 3: f += [x ** 3, y ** 3, x * x * y, x * y * y]
        return np.stack(f, 1)
    X = feats(xs.astype(float), ys.astype(float)); Hm = feats(hx.astype(float), hy.astype(float))
    out = img.copy()
    for c in range(3):
        coef, *_ = np.linalg.lstsq(X, img[ys, xs, c].astype(float), rcond=None)
        out[hy, hx, c] = Hm @ coef
    return out

def save(rgbx, alpha, name):
    o = np.dstack([np.clip(rgbx, 0, 255), np.clip(alpha, 0, 255)]).astype(np.uint8)
    Image.fromarray(o, 'RGBA').save(os.path.join(OUT, name), optimize=True)

solid = A > 200
head = ell((420, 388), (357, 262), -4)
torso = ell((398, 800), (218, 205), 0)
handL = ell((192, 694), (104, 80), 4, 10)
handR = ell((671, 742), (76, 90), -8, 10)

# badge: purple disc (fill holes so the check mark is included)
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
purple = (b > 180) & (b - r > 45) & (b - g > 40) & solid & ell((440, 712), (200, 200))
n, lab, st, _ = cv2.connectedComponentsWithStats(purple.astype(np.uint8))
big = 1 + int(np.argmax(st[1:, 4]))
cnts, _ = cv2.findContours((lab == big).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
(bcx, bcy), (bw, bh), bang = cv2.fitEllipse(max(cnts, key=len))
badge = ell((bcx, bcy), (bw / 2, bh / 2), bang, 8)
badge &= ~handL & ~handR     # hands overlap the badge rim (they hold it)

# ears: everything above-right that is outside the head
YY, XX = np.mgrid[0:H, 0:W]
ears_col = (((g - r) > 18) | (((b - g) > 70) & (r < 200))) & (XX > 480) & (YY < 345) & (A > 40)
_n, _l, _s, _ = cv2.connectedComponentsWithStats(ears_col.astype(np.uint8))
ears_col = _l == 1 + int(np.argmax(_s[1:, 4]))
ears_col = cv2.dilate(ears_col.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
ears = ((A > 0) & ~ell((420, 388), (357, 262), -4, -4) & (XX > 470) & (YY < 340)) | (ears_col & (A > 0))

# ---------------- base body (head + torso, no features)
body_sil = cv2.morphologyEx((head | torso).astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (121, 121))) > 0
body_sil &= (A > 0) | handL | handR
base_rgb = rgb.copy()
# torso under badge + hands
hole_t = (badge | handL | handR)
ring_t = soft(hole_t, 1) > 0
ring_t = cv2.dilate(hole_t.astype(np.uint8), np.ones((41, 41), np.uint8)) > 0
ring_t = (cv2.dilate(hole_t.astype(np.uint8), np.ones((181, 181), np.uint8)) > 0) & ~hole_t & solid & ~ears & ~cv2.dilate((badge | handL | handR).astype(np.uint8), np.ones((61, 61), np.uint8)).astype(bool)
ring_t &= np.mgrid[0:H, 0:W][0] > 560
ring_t &= (b - r) < 38                      # ignore the badge's purple glow on the skin
grow_t = cv2.dilate(hole_t.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61))) > 0
Ft = qfill(base_rgb, grow_t, ring_t)
Ft = Ft * .62 + np.array([236, 236, 254]) * .38      # lighter belly, closer to the visible skin
ht = soft(cv2.dilate(hole_t.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (51, 51))) > 0, 16)[..., None]
base_rgb = base_rgb * (1 - ht) + Ft * ht

# face: eyes + blush, each filled locally from a narrow ring of surrounding skin
face_zone = ell((440, 500), (300, 105), 4)
eyes = (b > 120) & (r < 120) & (g < 90) & face_zone
eyes_d = cv2.dilate(eyes.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17))) > 0
pink = ((r - g) > 5) & ell((440, 520), (310, 95), 4) & ~eyes_d & solid & ~badge
pink = cv2.morphologyEx(pink.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
pink = cv2.dilate(pink, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (33, 33))) > 0
blushL = pink & (XX < 440); blushR = pink & (XX >= 440)
F = rgb.copy()
for hole in [blushL, blushR] + [lab_ == i for lab_ in [cv2.connectedComponents(eyes_d.astype(np.uint8))[1]] for i in (1, 2)]:
    hole = cv2.dilate(hole.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    ring = (cv2.dilate(hole.astype(np.uint8), np.ones((31, 31), np.uint8)) > 0) & ~hole & solid & head & ~badge & ~eyes_d & ~blushL & ~blushR
    F = qfill(F, hole, ring)
feat = cv2.dilate((eyes_d | blushL | blushR).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
diff = np.abs(rgb - F).max(-1)
face_a = np.clip((diff - 3) / 30, 0, 1)
face_a = np.maximum(face_a, soft(eyes_d & (diff > 25), 1.0))
face_a *= soft(feat, 2.5) * (A / 255)
fz = soft(feat, 2.5)[..., None]
base_rgb = base_rgb * (1 - fz) + F * fz

# base alpha: original silhouette minus ears and the parts of hands that stick out
sil = soft(body_sil, 1.5) * 255
base_a = A.copy()
vis = ((A > 128) & ~(handL | handR) & ~ears).astype(np.uint8)
under = (head | ell((398, 800), (226, 205), 0)).astype(np.uint8)
under = cv2.morphologyEx(under, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (91, 91)))
closed = cv2.morphologyEx(((vis > 0) | (under > 0)).astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
closed = soft(closed > 0, 3) * 255
hz = soft(cv2.dilate((handL | handR).astype(np.uint8), np.ones((15, 15), np.uint8)) > 0, 3)
base_a = base_a * (1 - hz) + closed * hz
base_a = np.where(ears, 0, base_a)
core = cv2.morphologyEx((base_a > 100).astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
core = cv2.dilate(core, np.ones((5, 5), np.uint8))
base_a = np.minimum(base_a, soft(core > 0, 1.5) * 255)
save(base_rgb, base_a, 'body.png')

# ---------------- feature layers (original pixels)
def layer(mask, name, feather=1.2):
    al = soft(mask, feather) * A
    ys, xs = np.where(al > 2)
    x0, x1, y0, y1 = xs.min() - 4, xs.max() + 5, ys.min() - 4, ys.max() + 5
    save(rgb[y0:y1, x0:x1], al[y0:y1, x0:x1], name)
    return {'file': name, 'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)}

meta = {'W': W, 'H': H}
meta['badge'] = layer(badge, 'badge.png'); meta['badge'].update(cx=float(bcx), cy=float(bcy))
meta['handL'] = layer(handL & (A > 0), 'handL.png', 1.5)
meta['handR'] = layer(handR & (A > 0), 'handR.png', 1.5)
meta['ears'] = layer(ears, 'ears.png', 1.0)
# face: alpha from difference against the filled surface
ys, xs = np.where(face_a > .01)
x0, x1, y0, y1 = xs.min() - 4, xs.max() + 5, ys.min() - 4, ys.max() + 5
save(rgb[y0:y1, x0:x1], face_a[y0:y1, x0:x1] * 255, 'face.png')
meta['face'] = {'file': 'face.png', 'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)}
# head-only clip mask for the face (so features wrap off the silhouette edge)
hm = soft(head, 2) * 255
Image.fromarray(np.dstack([np.full((H, W, 3), 255), hm]).astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'head_mask.png'))
json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
print(json.dumps(meta))
import base64
emb = {k: 'data:image/png;base64,' + base64.b64encode(open(os.path.join(OUT, f), 'rb').read()).decode()
       for k, f in [('body', 'body.png'), ('mask', 'head_mask.png')] + [(k, meta[k]['file']) for k in ('ears', 'handL', 'handR', 'badge', 'face')]}
with open(os.path.join(OUT, 'meta.js'), 'w') as f:
    f.write('window.SPIN_META=' + json.dumps(meta) + ';\nwindow.SPIN_IMG=' + json.dumps(emb) + ';\n')
