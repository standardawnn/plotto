(function () {
  function reset() {
    try {
      if (navigator.serviceWorker) navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); });
      if (self.caches) caches.keys().then(function (ks) { ks.forEach(function (k) { caches.delete(k); }); });
    } catch (e) {}
    setTimeout(function () { location.replace('/mobile.html?r=' + Date.now()); }, 200);
  }
  function show(msg) {
    if (!document.body) return;
    var d = document.getElementById('plotto-fallback');
    if (!d) {
      d = document.createElement('div');
      d.id = 'plotto-fallback';
      d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#f4f7fd;color:#222;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;font:15px/1.5 -apple-system,BlinkMacSystemFont,sans-serif';
      document.body.appendChild(d);
    }
    d.textContent = '';
    var t = document.createElement('p'); t.textContent = '화면을 불러오지 못했어요.';
    var m = document.createElement('p'); m.style.cssText = 'font-size:12px;color:#777;word-break:break-all'; m.textContent = String(msg || '');
    var b = document.createElement('button'); b.textContent = '다시 불러오기';
    b.style.cssText = 'padding:12px 20px;border:0;border-radius:12px;background:#536ffa;color:#fff;font-size:15px';
    b.onclick = reset;
    d.appendChild(t); d.appendChild(m); d.appendChild(b);
  }
  addEventListener('error', function (e) { show(e.message || (e.error && e.error.message) || 'script error'); });
  addEventListener('unhandledrejection', function (e) { show(e.reason && e.reason.message ? e.reason.message : e.reason); });
  addEventListener('load', function () {
    setTimeout(function () {
      var root = document.getElementById('root');
      if (!root || !root.childElementCount) show('앱이 시작되지 않았어요 (timeout)');
    }, 10000);
  });
})();
