/* Plotto recovery + diagnostics. Plain script (no build needed).
   Loaded in index.html (data-mode="shell") and mobile.html (data-mode="app").
   - Records errors in sessionStorage 'plotto-diag' (last 20) and console.error('[plotto]').
   - Reloads once for stale-chunk errors after a redeploy (old hashed files 404).
   - Shows a recovery screen instead of a blank white page when the app never renders.
   - Keeps the last route (flow) so a full reload returns to the same screen. */
(function () {
  var script = document.currentScript;
  var mode = (script && script.getAttribute('data-mode')) || 'app';
  var inFrame = window.parent !== window;
  var KEY_DIAG = 'plotto-diag', KEY_ROUTE = 'plotto-route', KEY_RELOAD = 'plotto-chunk-reload';

  function store() { try { return window.sessionStorage; } catch (e) { return null; } }
  function local() { try { return window.localStorage; } catch (e) { return null; } }

  function log(kind, detail) {
    var msg = detail && (detail.message || detail);
    var entry = {
      t: new Date().toISOString(),
      mode: mode,
      kind: kind,
      msg: String(msg || '').slice(0, 300),
      stack: String((detail && detail.stack) || '').slice(0, 800),
      url: location.pathname + location.search + location.hash
    };
    console.error('[plotto]', entry);
    var s = store();
    if (s) {
      try {
        var list = JSON.parse(s.getItem(KEY_DIAG) || '[]');
        list.push(entry);
        s.setItem(KEY_DIAG, JSON.stringify(list.slice(-20)));
      } catch (e) { /* storage unavailable */ }
    }
    if (mode === 'app' && inFrame) {
      try { window.parent.postMessage({ type: 'plotto:error', entry: entry }, location.origin); } catch (e) { /* ignore */ }
    }
    return entry;
  }

  function isChunkError(text) {
    return /dynamically imported module|Importing a module script failed|Failed to fetch dynamically|Loading chunk|ChunkLoadError|Unable to preload/i.test(text || '');
  }

  // Returns true when a reload was started. Guarded so a broken build cannot loop.
  function reloadOnce() {
    var s = store();
    /* never reload the page by itself (it sent people back to the first screen) */
    return true;
  }

  function rootEmpty() {
    var root = document.getElementById('root');
    return !root || root.childElementCount === 0;
  }

  function showOverlay(message) {
    if (!document.body) { document.addEventListener('DOMContentLoaded', function () { showOverlay(message); }); return; }
    var box = document.getElementById('plotto-recovery');
    if (!box) {
      box = document.createElement('div');
      box.id = 'plotto-recovery';
      box.setAttribute('role', 'alert');
      box.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#f4f7fd;color:#222;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif';
      document.body.appendChild(box);
    }
    box.textContent = '';
    var title = document.createElement('p');
    title.textContent = '화면을 불러오지 못했어요.';
    var detail = document.createElement('p');
    detail.style.cssText = 'font-size:12px;color:#777;word-break:break-all;max-width:320px';
    detail.textContent = String(message || '');
    var retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = '다시 시작';
    retry.style.cssText = 'padding:12px 20px;border:0;border-radius:12px;background:#536ffa;color:#fff;font-size:15px;min-width:200px';
    retry.onclick = function () { location.reload(); };
    var reset = document.createElement('button');
    reset.type = 'button';
    reset.textContent = '처음부터 다시';
    reset.style.cssText = 'padding:12px 20px;border:0;border-radius:12px;background:#fff;color:#536ffa;font-size:15px;min-width:200px';
    reset.onclick = function () {
      var s = store();
      if (s) { try { s.removeItem(KEY_ROUTE); } catch (e) { /* ignore */ } }
      if (local()) { try { local().removeItem(KEY_ROUTE); } catch (e) { /* ignore */ } }
      if (mode === 'app') location.replace('./mobile.html?flow=briefing');
      else location.replace(location.pathname);
    };
    var copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = '오류 정보 복사';
    copy.style.cssText = 'padding:10px 16px;border:0;background:none;color:#555;font-size:13px;text-decoration:underline';
    copy.onclick = function () {
      var s = store();
      var text = s ? (s.getItem(KEY_DIAG) || '[]') : '[]';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { copy.textContent = '복사했어요'; }, function () { copy.textContent = '복사 실패'; });
      } else { copy.textContent = '복사 미지원'; }
    };
    box.appendChild(title);
    box.appendChild(detail);
    box.appendChild(retry);
    box.appendChild(reset);
    box.appendChild(copy);
  }

  // Keep the current flow across a full reload (shell side).
  if (mode === 'shell') {
    var s0 = store();
    var nav1 = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
    // iPhone can close the page for memory and open it again by itself; that reload is not always reported as 'reload'.
    // A heartbeat younger than 6 s means this tab was open a moment ago, so treat it like a reload (stay on the app screen).
    var hbFresh = false;
    try { hbFresh = Date.now() - Number((local() && local().getItem('plotto-hb')) || 0) < 6000; } catch (e) { hbFresh = false; }
    // back_forward: coming back from the document page (viewer.html) opened in the same tab
    var resume = nav1.type === 'reload' || nav1.type === 'back_forward' || hbFresh;
    setInterval(function () { try { local() && local().setItem('plotto-hb', String(Date.now())); } catch (e) { /* ignore */ } }, 1500);
    if (location.hash && !resume && s0 && s0.getItem(KEY_ROUTE)) {
      // Re-entering this tab (not a reload): start from the beginning instead of the last flow left in the URL.
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (!location.hash) {
      // Only resume after a reload of this tab (e.g. iOS killed the page); a fresh visit starts at the beginning.
      var saved = resume && s0 && s0.getItem(KEY_ROUTE);
      if (!resume && s0) { try { s0.removeItem(KEY_ROUTE); s0.removeItem('plotto-launch-page'); s0.removeItem('plotto-tour-step'); } catch (err) { /* ignore */ } }
      if (saved) history.replaceState(null, '', location.pathname + location.search + '#' + saved);
    }
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data) return;
      if (e.data.type === 'plotto:route' && typeof e.data.flow === 'string') {
        var s = store();
        var route = new URLSearchParams({ flow: e.data.flow, entry: e.data.entry || '' }).toString();
        if (s) { try { s.setItem(KEY_ROUTE, route); } catch (err) { /* ignore */ } }
      }
      if (e.data.type === 'plotto:error') log('child-error', e.data.entry && e.data.entry.msg);
    });
  }

  // Resource failures (a hashed script that no longer exists after a redeploy).
  window.addEventListener('error', function (e) {
    var target = e.target;
    if (target && target !== window && target.tagName) {
      var src = target.src || target.href || target.tagName;
      log('resource', src);
      if (target.tagName === 'SCRIPT' && /\/assets\//.test(src) && reloadOnce()) return;
      return;
    }
    var text = (e.message || '') + ' ' + ((e.error && e.error.message) || '');
    log(isChunkError(text) ? 'chunk' : 'error', e.error || e.message);
    if (isChunkError(text) && reloadOnce()) return;
    if (mode === 'app' && rootEmpty()) showOverlay(e.message || (e.error && e.error.message));
  }, true);

  window.addEventListener('unhandledrejection', function (e) {
    var reason = e.reason;
    var text = String((reason && reason.message) || reason || '');
    log(isChunkError(text) ? 'chunk' : 'rejection', reason);
    if (isChunkError(text) && reloadOnce()) return;
    if (mode === 'app' && rootEmpty()) showOverlay(text);
  });


  // Installed app (status bar overlays the page): paint the band above the app with the colours found at
  // the very top edge of the current screen, so the screen looks filled up to the top.
  if (mode === 'shell') {
    var imgTint = {};
    var parseRgb = function (str) {
      var m = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/.exec(str || '');
      return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
    };
    var loadImgTint = function (url, key, W, H, fx, cs) {
      imgTint[key] = null;
      try {
        var im = new Image();
        im.onload = function () {
          try {
            var c = document.createElement('canvas'); c.width = 8; c.height = 1;
            var g = c.getContext('2d');
            var size = cs.backgroundSize || '';
            var sc = /contain/.test(size) ? Math.min(W / im.naturalWidth, H / im.naturalHeight) : Math.max(W / im.naturalWidth, H / im.naturalHeight);
            var top = /top/.test(cs.backgroundPosition || '') ? 0 : (H - im.naturalHeight * sc) / 2;
            var srcY = Math.max(0, Math.min(im.naturalHeight - 1, -top / sc));
            var srcX = Math.max(0, Math.min(im.naturalWidth - 4, im.naturalWidth * fx - 2));
            g.drawImage(im, srcX, srcY, 4, 1, 0, 0, 8, 1);
            var d = g.getImageData(0, 0, 8, 1).data, r = 0, gg = 0, b = 0, n = 0;
            for (var i = 0; i < 8; i++) { if (d[i * 4 + 3] > 200) { r += d[i * 4]; gg += d[i * 4 + 1]; b += d[i * 4 + 2]; n++; } }
            if (n) imgTint[key] = { r: Math.round(r / n), g: Math.round(gg / n), b: Math.round(b / n), a: 1 };
          } catch (e) { imgTint[key] = null; }
        };
        im.src = url;
      } catch (e) { imgTint[key] = null; }
    };
    var topUrl = '', topEl = null, lastEl = null;
    var topColorAt = function (doc, fx) {
      var w = doc.documentElement.clientWidth || 390, h = doc.documentElement.clientHeight || 800;
      var el = doc.elementFromPoint(Math.round(w * fx), 2);
      while (el) {
        var cs = doc.defaultView.getComputedStyle(el);
        var img = cs.backgroundImage || '';
        var um = /url\((['"]?)(.*?)\1\)/.exec(img);
        if (um) {
          if (fx === 0.5 && !topUrl) { var rr = el.getBoundingClientRect(); if (rr.width >= w * 0.95 && rr.height >= h * 0.6) { topUrl = new URL(um[2], doc.baseURI).href; topEl = el; } }
          var key = um[2] + '|' + w + 'x' + h + '|' + fx;
          if (imgTint[key]) return imgTint[key];
          if (imgTint[key] === undefined) loadImgTint(um[2], key, w, h, fx, cs);
        }
        var bg = parseRgb(cs.backgroundColor);
        if (bg && bg.a > 0.85 && !um) return bg;
        if (/gradient\(/.test(img)) {
          var first = /rgba?\([^)]*\)/.exec(img);
          var c = first && parseRgb(first[0]);
          if (c && c.a > 0.85) return c;
        }
        el = el.parentElement;
      }
      return null;
    };
    var band = document.createElement('div');
    band.id = 'plotto-band';
    band.setAttribute('aria-hidden', 'true');
    band.style.cssText = 'position:fixed;left:0;right:0;top:0;height:env(safe-area-inset-top,0px);z-index:2;pointer-events:none';
    var shade = document.createElement('div');
    shade.style.cssText = 'position:absolute;inset:0;pointer-events:none';
    band.appendChild(shade);
    var bgLayer = document.createElement('div');
    bgLayer.id = 'plotto-bg';
    bgLayer.setAttribute('aria-hidden', 'true');
    bgLayer.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100vh;height:100lvh;z-index:0;pointer-events:none;background:#c3c2fe url(/onboarding/assets/bg.png) center top/cover no-repeat';
    var mountBand = function () { /* no photo layer: screens keep their own background colours */ };
    var mountBand0 = function () { if (document.body && !band.parentNode) document.body.appendChild(band); };
    var satProbe = document.createElement('div'); satProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;padding-top:env(safe-area-inset-top,0px)';
    var sabProbe = document.createElement('div'); sabProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;padding-bottom:env(safe-area-inset-bottom,0px)';
    var mountAll = function () { if (document.body && !satProbe.parentNode) document.body.appendChild(satProbe); if (document.body && !sabProbe.parentNode) document.body.appendChild(sabProbe);  mountBand(); mountBand0(); };
    var lastKey = '';
    var hex = function (c) { return '#' + [c.r, c.g, c.b].map(function (n) { return ('0' + Math.max(0, Math.min(255, n)).toString(16)).slice(-2); }).join(''); };
    var applyTint = function () {
      mountAll();
      var frame = document.querySelector('iframe.app-frame');
      var doc = null;
      try { doc = frame && frame.contentDocument; } catch (e) { doc = null; }
      if (!doc || !doc.body) return;
      if (!doc.getElementById('plotto-clear')) { var st = doc.createElement('style'); st.id = 'plotto-clear'; st.textContent = ''; (doc.head || doc.documentElement).appendChild(st); }
      var sp = doc.getElementById('plotto-sat');
      if (!sp) { sp = doc.createElement('style'); sp.id = 'plotto-sat'; (doc.head || doc.documentElement).appendChild(sp); }
      var satPx = parseFloat(getComputedStyle(satProbe).paddingTop) || 0;
      var sabPx = parseFloat(getComputedStyle(sabProbe).paddingBottom) || 0;
      var satCss = 'html{--sat:' + satPx + 'px;--sab:' + sabPx + 'px}';
      if (sp.textContent !== satCss) sp.textContent = satCss;
      // static: no per-tick colour/image changes (they made the background flicker)
      if (!band.__init) { band.__init = 1; shade.style.background = 'linear-gradient(to bottom,rgba(24,22,56,.28),rgba(24,22,56,0))';  }
    };
    setInterval(applyTint, 400);
    /* inject the safe-area value right away (every 40 ms for the first 4 s) so screens don't shift after they appear */
    (function () { var n = 0, f = setInterval(function () { applyTint(); if (++n > 100) clearInterval(f); }, 40); applyTint(); })();
  }

  // Watchdog: the app never rendered (blank page without any thrown error).
  function watchdog() {
    setTimeout(function () {
      if (mode === 'app') {
        if (rootEmpty()) { log('timeout', 'root empty after 10s'); if (!reloadOnce()) showOverlay('앱이 시작되지 않았어요 (10초 초과).'); }
        return;
      }
      var frame = document.querySelector('iframe.app-frame');
      if (!frame) return;
      var doc = null;
      try { doc = frame.contentDocument; } catch (e) { doc = null; }
      var root = doc && doc.getElementById('root');
      var failed = !doc || !doc.body || (root ? root.childElementCount === 0 : doc.body.children.length === 0);
      if (failed) { log('frame-timeout', frame.getAttribute('src')); if (!reloadOnce()) showOverlay('앱 화면이 비어 있어요.'); }
    }, 10000);
  }
  if (document.readyState === 'complete') watchdog();
  else window.addEventListener('load', watchdog);
})();
