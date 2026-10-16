/* Ard-Bud - suwaki w układzie wzoru (usługi + opinie). Awaria = treść zostaje widoczna. */
(function () {
  try {
    // suwak usług: przewijanie kartami + pasek postępu
    document.querySelectorAll('[data-kw-slider]').forEach(function (s) {
      var track = s.querySelector('.kw-track');
      var bar = s.querySelector('.kw-bar i');
      if (!track) return;
      function step() {
        var c = track.querySelector('.kw-card');
        return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 40) : track.clientWidth * 0.8;
      }
      s.querySelectorAll('[data-dir]').forEach(function (b) {
        b.addEventListener('click', function () {
          track.scrollBy({ left: step() * (+b.getAttribute('data-dir')), behavior: 'smooth' });
        });
      });
      function upd() {
        if (!bar) return;
        var max = track.scrollWidth - track.clientWidth;
        var vis = track.clientWidth / track.scrollWidth;
        var p = max > 0 ? track.scrollLeft / max : 0;
        bar.style.width = (vis * 100) + '%';
        bar.style.left = (p * (100 - vis * 100)) + '%';
      }
      track.addEventListener('scroll', upd, { passive: true });
      window.addEventListener('resize', upd);
      upd();
    });
    // opinie: cytat + zdjęcie zmieniane strzałkami
    document.querySelectorAll('[data-kw-testi]').forEach(function (t) {
      var q = t.querySelectorAll('.kw-quote');
      var im = t.querySelectorAll('.kw-testi-img img');
      if (q.length < 2) return;
      var i = 0;
      function go(n) {
        i = (n + q.length) % q.length;
        q.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
        im.forEach(function (el, k) { el.classList.toggle('is-active', k === i % im.length); });
      }
      t.querySelectorAll('[data-dir]').forEach(function (b) {
        b.addEventListener('click', function () { go(i + (+b.getAttribute('data-dir'))); });
      });
    });
    // stopklatka: zdjęcie przyklejone do okna rysujemy tylko, gdy jej sekcja jest blisko kadru
    var stk = document.querySelectorAll('.stopklatka');
    if (stk.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (w) {
        w.forEach(function (e) { e.target.classList.toggle('is-near', e.isIntersecting); });
      }, { rootMargin: '200px 0px' });
      stk.forEach(function (el) { io.observe(el); });
      document.documentElement.classList.add('kw-stk-js');
    }
  } catch (e) {}
})();
