/* Keeps tappable bottom UI (nav pills, CTA buttons, menus) out of the iPhone home-indicator zone.
   Works on any screen: it finds fixed/absolute controls whose bottom edge is too close to the screen bottom
   and lifts them by moving their own top/bottom offset (so it never clashes with transforms/translate animations or centering). */
(function () {
  if (window.__plottoLift) return; window.__plottoLift = true;
  var GAP = 14;                    /* clear space between a control and the home-indicator zone */
  var lifted = new WeakMap(), tracked = new Set(), base = new WeakMap();
  function sab() {
    var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sab'));
    if (!isNaN(v)) return v;
    var standalone = navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
    return standalone && /iP(hone|ad|od)/.test(navigator.userAgent) ? 34 : 0;
  }
  function isPos(el) { var p = getComputedStyle(el).position; return p === 'fixed' || p === 'absolute' || p === 'sticky'; }
  function ignore(el) { return el.closest('.keyboard, .px-screen, [data-no-lift], .px-toast'); }
  function typing() { var a = document.activeElement; return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable); }
  function hasField(el) { return !!(el.matches && el.matches('input, textarea, [contenteditable]')) || !!el.querySelector('input, textarea, [contenteditable]'); }
  function pass() {
    var H = innerHeight, limit = H - sab() - GAP;
    if (typing()) { /* keyboard is up: never move the input bar, undo any lift */
      tracked.forEach(function (t) { var o = base.get(t); if (!o) return; t.style.removeProperty('top'); t.style.removeProperty('bottom'); if (o.it) t.style.setProperty('top', o.it, o.itp); if (o.ib) t.style.setProperty('bottom', o.ib, o.ibp); lifted.set(t, 0); });
      tracked.clear(); return;
    }
    var cands = document.querySelectorAll('button, a[href], [role="button"], [role="tab"], nav');
    var targets = new Set();
    cands.forEach(function (el) {
      if (ignore(el)) return;
      var r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 24 || r.height > 260 || r.bottom <= limit || r.top > H) return;
      /* outermost positioned ancestor that still looks like a small bottom bar */
      var t = null, n = el;
      while (n && n !== document.body && n !== document.documentElement) {
        if (isPos(n)) { var nr = n.getBoundingClientRect(); if (nr.height <= 300 && nr.bottom > limit - 2 && nr.bottom <= H + 2) t = n; else break; }
        n = n.parentElement;
      }
      if (t && !hasField(t)) targets.add(t);
    });
    tracked.forEach(function (t) { if (!document.contains(t)) tracked.delete(t); else targets.add(t); });
    targets.forEach(function (t) {
      var prev = lifted.get(t) || 0;
      if (!base.has(t)) { /* remember the element's own top/bottom so we can lift with them (never touches transform/translate, which CSS animations own) */
        var cs0 = getComputedStyle(t);
        base.set(t, { top: cs0.top, bottom: cs0.bottom, it: t.style.getPropertyValue('top'), itp: t.style.getPropertyPriority('top'), ib: t.style.getPropertyValue('bottom'), ibp: t.style.getPropertyPriority('bottom') });
      }
      var r = t.getBoundingClientRect();
      var cur = r.bottom + prev;          /* position without our lift */
      var need = Math.max(0, Math.ceil(cur - limit));
      if (need !== prev) {
        var o = base.get(t);
        if (!need) { t.style.removeProperty('top'); t.style.removeProperty('bottom'); if (o.it) t.style.setProperty('top', o.it, o.itp); if (o.ib) t.style.setProperty('bottom', o.ib, o.ibp); }
        else if (o.bottom !== 'auto') t.style.setProperty('bottom', 'calc(' + o.bottom + ' + ' + need + 'px)', 'important');
        else if (o.top !== 'auto') t.style.setProperty('top', 'calc(' + o.top + ' - ' + need + 'px)', 'important');
        lifted.set(t, need);
      }
      if (need) tracked.add(t); else tracked.delete(t);
    });
  }
  var q = 0; function sched() { if (q) return; q = requestAnimationFrame(function () { q = 0; try { pass(); } catch (e) {} }); }
  addEventListener('focusin', sched); addEventListener('focusout', function(){ setTimeout(sched, 300); }); addEventListener('resize', sched); addEventListener('orientationchange', sched);
  new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(sched, 600); sched();
})();
