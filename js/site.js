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

// Eventos de conversão (GA4 + Meta Pixel)
// Cliques: click_postgrad, click_book, click_lesson, click_whatsapp, click_enroll, start_checkout.
// Um link pode forçar o nome do evento com data-evento="...".
// Links do menu e do rodapé só contam se tiverem data-evento.
// Visualização: <body data-pagina="aula"> gera view_lesson_page; data-pagina="pos" gera view_postgrad.
(function () {
  function enviar(nome, dados) {
    if (typeof gtag === 'function') gtag('event', nome, dados);
    if (typeof fbq === 'function') fbq('trackCustom', nome, dados);
  }
  document.addEventListener('DOMContentLoaded', function () {
    var pag = document.body && document.body.getAttribute('data-pagina');
    if (pag === 'aula') enviar('view_lesson_page', { page_path: location.pathname });
    if (pag === 'pos') enviar('view_postgrad', { page_path: location.pathname });
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var ev = a.getAttribute('data-evento');
    if (!ev) {
      if (a.closest('.menu, .rodape')) return;
      var h = a.getAttribute('href') || '';
      if (/wa\.me|whatsapp\.com/.test(h)) ev = 'click_whatsapp';
      else if (/payfast\.greenn/.test(h)) ev = 'start_checkout';
      else if (/#matricula$/.test(h) || a.hasAttribute('data-matricula')) ev = 'click_enroll';
      else if (/pos-sistemas\//.test(h)) ev = 'click_postgrad';
      else if (/sistemas-humanizados\//.test(h)) ev = 'click_book';
      else if (/(aula2|aularh)\//.test(h)) ev = 'click_lesson';
    }
    if (!ev) return;
    enviar(ev, {
      link_url: a.href,
      link_text: (a.textContent || '').trim().slice(0, 80),
      page_path: location.pathname,
      variante: (document.body && document.body.getAttribute('data-variante')) || ''
    });
  });
})();


// Origem no WhatsApp
// A captura das UTMs fica em js/origem.js (carregado antes deste arquivo).
// Links de WhatsApp com data-wa-origem recebem a origem no fim da mensagem pré-preenchida.
(function () {
  function ler() {
    if (window.IVOrigem) return window.IVOrigem.ler();
    try { return JSON.parse(sessionStorage.getItem('matricula_atribuicao')) || {}; } catch (e) { return {}; }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-wa-origem]') : null;
    if (!a) return;
    var at = ler(), partes = [];
    if (at.utm_source) partes.push(at.utm_source);
    if (at.utm_campaign) partes.push(at.utm_campaign);
    if (!partes.length) return;
    try {
      var m = a.href.match(/([?&]text=)([^&]*)/);
      var t = m ? decodeURIComponent(m[2].replace(/\+/g, ' ')) : '';
      if (t.indexOf('[origem:') === -1) {
        var novo = encodeURIComponent(t + ' [origem: ' + partes.join(' / ') + ']');
        a.href = m ? a.href.replace(m[0], m[1] + novo) : a.href + (a.href.indexOf('?') > -1 ? '&' : '?') + 'text=' + novo;
      }
    } catch (err) {}
  }, true);
})();


// Player vertical 4:5 (.video45): só carrega o YouTube depois do clique na capa.
// Toca dentro da página (playsinline) e permite tela cheia. Sem autoplay antes do clique.
// Evento: video_start (GA4 + Meta Pixel), com a variante da página.
document.addEventListener('click', function (e) {
  var capa = e.target.closest ? e.target.closest('.video45-capa[data-yt]') : null;
  if (!capa) return;
  var id = capa.getAttribute('data-yt');
  var f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
  f.title = capa.getAttribute('data-titulo') || 'Vídeo';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
  f.setAttribute('allowfullscreen', '');
  f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  capa.parentNode.replaceChild(f, capa);
  var dados = { video_id: id, page_path: location.pathname,
                variante: (document.body && document.body.getAttribute('data-variante')) || '' };
  if (typeof gtag === 'function') gtag('event', 'video_start', dados);
  if (typeof fbq === 'function') fbq('trackCustom', 'video_start', dados);
});


// Checkout da Greenn: UTMs, src e lp_variant são acrescentados por js/origem.js.


// Teste A/B/C do livro Sistemas Humanizados (entrada: /sistemas-humanizados/rot/)
// - Quem tem o cookie iv_ab_livro_sh recebe no GA4 a propriedade de usuário ab_livro_sh (a, b ou c),
//   que acompanha os eventos seguintes, inclusive start_checkout.
// - Na chegada vinda da URL do teste, registra no GA4 o evento experiment_view com a variante,
//   desde que a página aberta seja a variante sorteada. Não dispara nada no Meta Pixel.
(function () {
  var m = document.cookie.match(/(?:^|;\s*)iv_ab_livro_sh=([abc])(?:;|$)/);
  if (!m || typeof gtag !== 'function') return;
  gtag('set', 'user_properties', { ab_livro_sh: m[1] });
  var chegada = null;
  try { chegada = JSON.parse(sessionStorage.getItem('iv_ab_livro_sh_chegada')); } catch (e) {}
  var v = document.body && document.body.getAttribute('data-variante');
  if (!chegada || !v || chegada.variante !== v) return;
  try { sessionStorage.removeItem('iv_ab_livro_sh_chegada'); } catch (e) {}
  gtag('event', 'experiment_view', {
    experiment_id: 'livro_sh_abc',
    variant_id: v,
    nova_atribuicao: chegada.nova ? 'sim' : 'nao',
    page_path: location.pathname
  });
})();
