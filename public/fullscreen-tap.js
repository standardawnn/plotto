(function () {
  // Android Chrome only allows fullscreen after a user gesture, so enter fullscreen on the first tap.
  // iPhone Safari does not support this; there the app is opened from the home screen instead.
  var done = false;
  function go() {
    if (done) return;
    done = true;
    var el = document.documentElement;
    var req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req && !document.fullscreenElement) { try { req.call(el); } catch (e) { /* not allowed */ } }
  }
  window.addEventListener('pointerdown', go, { once: true, passive: true });
})();

if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(function () {}); }
