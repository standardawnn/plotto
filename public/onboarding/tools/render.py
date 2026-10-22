"""Render the live onboarding page to video (or stills) frame-accurately.

  python3 tools/render.py video  out.mp4
  python3 tools/render.py stills outdir 0.5 2.4 3.0 ...

The page is opened with ?record, which disables the realtime clock; each
frame calls PlottoOnboarding.renderAt(T) so every frame is exact at 60fps.
"""
import os, subprocess, sys, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / 'index.html').as_uri() + '?record'
W, H, FPS = 1080, 1920, 60

# scripted taps on the CTA (press feedback, then navigation)
NAV1, NAV2, END = 8.7, 15.5, 22.7
SCRIPT = [
    {'at': NAV1 - .1, 'press': True}, {'at': NAV1, 'to': 1},
    {'at': NAV2 - .1, 'press': True}, {'at': NAV2, 'to': 2},
]


def open_page(p):
    b = p.chromium.launch(args=['--force-color-profile=srgb', '--disable-lcd-text'])
    pg = b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
    pg.goto(URL)
    pg.wait_for_function('window.PlottoOnboarding')
    pg.evaluate('PlottoOnboarding.ready')
    pg.evaluate('document.fonts.ready')
    pg.evaluate(f'PlottoOnboarding.script({SCRIPT!r})'.replace('True', 'true'))
    return b, pg


def stills(outdir, times):
    os.makedirs(outdir, exist_ok=True)
    with sync_playwright() as p:
        b, pg = open_page(p)
        for T in sorted(times):
            pg.evaluate(f'PlottoOnboarding.renderAt({T})')
            pg.screenshot(path=os.path.join(outdir, f't{T:06.2f}.png'))
        b.close()


def video(out):
    n = int(round(END * FPS))
    ff = subprocess.Popen([
        'ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
        '-r', str(FPS), '-movflags', '+faststart', '-color_primaries', 'bt709', '-color_trc', 'bt709',
        '-colorspace', 'bt709', out], stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b, pg = open_page(p)
        for f in range(n):
            pg.evaluate(f'PlottoOnboarding.renderAt({f / FPS})')
            ff.stdin.write(pg.screenshot(type='png'))
            if f % 120 == 0:
                print(f'frame {f}/{n}', flush=True)
        b.close()
    ff.stdin.close()
    ff.wait()
    print('done', out)


if __name__ == '__main__':
    if sys.argv[1] == 'video':
        video(sys.argv[2])
    else:
        stills(sys.argv[2], [float(x) for x in sys.argv[3:]])
