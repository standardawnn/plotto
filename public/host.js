/* The prototype always runs full-screen on the real device (phone, tablet or desktop).
   The device already shows its own status bar, so the mock iOS status bar and home
   indicator are hidden (see responsive.css and the onboarding CSS). */
document.documentElement.setAttribute('data-host', 'device');

/* One-time onboarding reset: the first time this build opens on a device, forget saved onboarding progress
   (page, tour step, name, last route) so the app starts from the very first screen. Change RESET_ID to do it again. */
(function () {
  try {
    var RESET_ID = '2026-10-28b';
    if (localStorage.getItem('plotto-onb-reset') === RESET_ID) return;
    [localStorage, sessionStorage].forEach(function (st) {
      Object.keys(st).forEach(function (k) { if (k.indexOf('plotto') === 0 && k !== 'plotto-hb') st.removeItem(k); });
    });
    localStorage.setItem('plotto-onb-reset', RESET_ID);
  } catch (e) { /* ignore */ }
})();

/* If iOS closes the app in the background and reopens it a moment later, continue where the person was
   (onboarding page + tour step) instead of the first screen. Fresh visits (older than 6 s) start from the beginning. */
(function () {
  try {
    var KEYS = []; /* resume disabled: onboarding always starts from the first screen */
    var fresh = Date.now() - Number(localStorage.getItem('plotto-hb') || 0) < 6000;
    if (fresh) {
      KEYS.forEach(function (k) {
        var v = localStorage.getItem('plotto-ss-' + k);
        if (v !== null && sessionStorage.getItem(k) === null) sessionStorage.setItem(k, v);
      });
    } else {
      KEYS.forEach(function (k) { localStorage.removeItem('plotto-ss-' + k); });
    }
    var set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      set.call(this, k, v);
      if (this === window.sessionStorage && KEYS.indexOf(k) > -1) { try { localStorage.setItem('plotto-ss-' + k, String(v)); } catch (e) { /* ignore */ } }
    };
    var beat = function () { try { localStorage.setItem('plotto-hb', String(Date.now())); } catch (e) { /* ignore */ } };
    beat(); setInterval(beat, 1500);
  } catch (err) { /* ignore */ }
})();

/* NO_REFRESH: block pull-to-refresh and reload shortcuts */
(function(){try{var st=document.createElement('style');st.textContent='html,body{overscroll-behavior:none!important}';(document.head||document.documentElement).appendChild(st);
addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();if(e.key==='F5'||((e.ctrlKey||e.metaKey)&&k==='r')){e.preventDefault();e.stopPropagation();}},true);
}catch(e){}})();

