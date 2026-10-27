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
    var last = s ? Number(s.getItem(KEY_RELOAD) || 0) : 0;
    if (Date.now() - last < 60000) return false;
    if (s) { try { s.setItem(KEY_RELOAD, String(Date.now())); } catch (e) { /* ignore */ } }
    location.reload();
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
    if (location.hash && nav1.type !== 'reload' && s0 && s0.getItem(KEY_ROUTE)) {
      // Re-entering this tab (not a reload): start from the beginning instead of the last flow left in the URL.
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (!location.hash) {
      // Only resume after a reload of this tab (e.g. iOS killed the page); a fresh visit starts at the beginning.
      var nav0 = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
      var saved = nav0.type === 'reload' && s0 && s0.getItem(KEY_ROUTE);
      if (!(nav0.type === 'reload') && s0) { try { s0.removeItem(KEY_ROUTE); s0.removeItem('plotto-launch-page'); s0.removeItem('plotto-tour-step'); } catch (err) { /* ignore */ } }
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
