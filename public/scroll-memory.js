// Keeps each screen's scroll position when the app moves to another screen and comes back.
// Each screen is a separate page load, so the position is saved on leave and restored on arrival.
(function () {
  var params = new URLSearchParams(location.search);
  var key = 'plotto-scroll:' + (params.get('flow') || 'briefing') + ':' + (params.get('entry') || '');
  function read() {
    try { var v = sessionStorage.getItem(key); return v === null ? null : Number(v); } catch (e) { return null; }
  }
  function save() {
    try { sessionStorage.setItem(key, String(Math.max(0, Math.round(window.scrollY)))); } catch (e) { /* storage unavailable */ }
  }
  // The proposal screen always starts at the top so its question panel can drop from above.
  var saved = params.get('flow') === 'proposal' ? null : read();
  var interrupted = false;
  ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach(function (type) {
    window.addEventListener(type, function () { interrupted = true; }, { passive: true, once: true });
  });
  if (saved !== null && saved > 0) {
    // Content can finish laying out late, so try a few times, but stop as soon as the user scrolls.
    [0, 60, 180, 400, 800, 1400].forEach(function (ms) {
      setTimeout(function () { if (!interrupted) window.scrollTo(0, saved); }, ms);
    });
  }
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') save(); });
})();
