"""python3 render.py stills DIR t1 t2 ... | mp4 OUT [loops] | webm OUT"""
import os, sys, subprocess, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent
FPS, PX = 60, 1080

def page(p, alpha=False):
    b = p.chromium.launch(args=['--force-color-profile=srgb'])
    pg = b.new_page(viewport={'width': PX, 'height': PX}, device_scale_factor=1)
    pg.goto((ROOT / 'spin.html').as_uri() + '?record' + ('&alpha' if alpha else ''))
    pg.wait_for_function('window.PlottoSpin'); pg.evaluate('PlottoSpin.ready')
    pg.evaluate('PlottoSpin.renderAt(0)')
    return b, pg

def frames(out_args, n, alpha=False):
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-'] + out_args, stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b, pg = page(p, alpha)
        for f in range(n):
            pg.evaluate(f'PlottoSpin.renderAt({f / FPS})')
            ff.stdin.write(pg.screenshot(type='png', omit_background=alpha))
        b.close()
    ff.stdin.close(); ff.wait()

mode = sys.argv[1]
if mode == 'stills':
    os.makedirs(sys.argv[2], exist_ok=True)
    with sync_playwright() as p:
        b, pg = page(p)
        for t in sys.argv[3:]:
            pg.evaluate(f'PlottoSpin.renderAt({t})'); pg.screenshot(path=f'{sys.argv[2]}/t{float(t):05.2f}.png')
        b.close()
elif mode == 'mp4':
    loops = int(sys.argv[3]) if len(sys.argv) > 3 else 2
    frames(['-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', sys.argv[2]], int(round(4.2 * loops * FPS)))
elif mode == 'webm':
    frames(['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '24', '-auto-alt-ref', '0', sys.argv[2]], int(round(4.2 * FPS)), alpha=True)
