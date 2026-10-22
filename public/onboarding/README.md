# Plotto onboarding — motion

Open `index.html` in a browser (works from file:// too). No build step, no dependencies.

- `onboarding.js` — the three scenes (Catch Up / Understand Changes / Connect People), navigation and transitions.
  Each scene is a pure function of time since entry: intro sequence, then continuous idle motion (no reset).
- `onboarding.css` — layout (container-query units, 2048×2048 illustration stage scaled to fit).
- `assets/` — the supplied PNGs (renamed to ASCII) + `bg.png`.
- `assets/build/` — layers derived from the supplied PNGs by `tools/prep_assets.py`
  (eyes separated, stray line fragments removed, full back cards rebuilt from the front card, violet card recolour).
- `tools/render.py` — frame-accurate video render: `python3 tools/render.py video out.mp4`.
- Navigation: CTA, page dots, ← / → keys, swipe. Finishing or Skip dispatches `plotto:onboarding-complete` on `document`.
