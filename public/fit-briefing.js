(function () {
  // Briefing is designed for an 874px-tall phone. On short desktop windows, zoom the page down so the
  // detail cards are not cut off at the top or bottom. Phones are left as they are.
  var p = new URLSearchParams(location.search);
  if ((p.get('flow') || 'briefing') !== 'briefing') return;
  function fit() {
    var k = Math.min(1, innerHeight / 874);
    document.documentElement.style.zoom = k < 1 ? String(k) : '';
  }
  addEventListener('resize', fit);
  fit();
})();
