// Menu do celular
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      btn.setAttribute('aria-expanded', aberto);
      btn.textContent = aberto ? '\u00d7' : '\u2261';
    });
  }
});


// Meta Pixel: registra o clique nos botoes de checkout (InitiateCheckout)
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a[href*="payfast.greenn"]') : null;
  if (a && typeof fbq === 'function') {
    fbq('track', 'InitiateCheckout', { content_name: document.title });
  }
});


// Submenu do menu (Formações)
document.addEventListener('DOMContentLoaded', function () {
  var subs = document.querySelectorAll('.tem-sub');
  subs.forEach(function (li) {
    var btn = li.querySelector('.menu-sub-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var abre = !li.classList.contains('aberto');
      subs.forEach(function (o) { o.classList.remove('aberto'); });
      var b2 = null;
      subs.forEach(function (o) { b2 = o.querySelector('.menu-sub-btn'); if (b2) b2.setAttribute('aria-expanded', 'false'); });
      if (abre) { li.classList.add('aberto'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', function () {
    subs.forEach(function (o) {
      o.classList.remove('aberto');
      var b = o.querySelector('.menu-sub-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      subs.forEach(function (o) { o.classList.remove('aberto'); });
    }
  });
});