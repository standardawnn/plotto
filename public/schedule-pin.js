/* Project home schedule: a fixed marker (blue date tag + dotted line) sits at one spot while the schedule scrolls
   sideways. The tag shows whichever date is under the marker ("오늘" for today), and only the task chips the
   dotted line passes through are coloured. The marker lives outside the scrolling area, so it does not jitter. */
(function () {
  var st = { scroll: null, born: 0, ready: false, lineX: 0, a: null, b: null, last: '' };
  var wrap = null;
  function reset() { if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap); wrap = null; st.ready = false; st.last = ''; }
  function update() {
    if (!st.ready) return;
    var x = st.lineX, tasks = document.querySelectorAll('.schedule-row .task'), i;
    for (i = 0; i < tasks.length; i++) {
      var tb = tasks[i].getBoundingClientRect();
      var hit = tb.left - 2 <= x && x <= tb.right + 2;
      if (tasks[i].classList.contains('plotto-hit') !== hit) tasks[i].classList.toggle('plotto-hit', hit);
    }
    var dates = document.querySelectorAll('.date-row .date'), cur = null;
    for (i = 0; i < dates.length; i++) {
      var db = dates[i].getBoundingClientRect();
      if (db.left <= x && x < db.right) { cur = dates[i]; break; }
    }
    if (cur) {
      var sp = cur.querySelectorAll('span');
      var t = (sp[0] ? sp[0].textContent : '') + '|' + (sp[1] ? sp[1].textContent : '');
      if (t !== st.last) { st.last = t; st.a.textContent = sp[0] ? sp[0].textContent : ''; st.b.textContent = sp[1] ? sp[1].textContent : ''; }
    }
  }
  function tick() {
    var scroll = document.querySelector('.schedule-scroll');
    var vp = document.querySelector('.schedule-viewport');
    var line = document.querySelector('.selected-date-line');
    var chip = document.querySelector('.date.selected');
    if (!scroll || !vp || !line || !chip) { if (st.scroll) { st.scroll = null; reset(); } return; }
    if (st.scroll !== scroll) { st.scroll = scroll; st.born = Date.now(); reset(); }
    if (!st.ready) {
      if (Date.now() - st.born < 900) return;
      var vr = vp.getBoundingClientRect(), lr = line.getBoundingClientRect(), cr = chip.getBoundingClientRect();
      st.lineX = lr.left + lr.width / 2;
      wrap = document.createElement('div');
      wrap.setAttribute('aria-hidden', 'true');
      wrap.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:8';
      var c2 = document.createElement('div'); c2.className = 'plotto-pin-chip';
      st.a = document.createElement('span'); st.b = document.createElement('span');
      c2.appendChild(st.a); c2.appendChild(st.b);
      c2.style.left = (st.lineX - vr.left - 26) + 'px'; c2.style.top = (cr.top - vr.top) + 'px';
      var l2 = line.cloneNode(true);
      l2.style.cssText += ';position:absolute;transform:none;left:' + (lr.left - vr.left) + 'px;top:' + (lr.top - vr.top) + 'px';
      wrap.appendChild(l2); wrap.appendChild(c2);
      vp.appendChild(wrap);
      st.ready = true;
    }
    line.style.visibility = 'hidden';
    update();
  }
  setInterval(tick, 150);
  document.addEventListener('scroll', update, true);
})();
