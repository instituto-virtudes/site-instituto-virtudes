/* ============================================================
   ORIGEM DA VISITA ATÉ O CHECKOUT (Instituto Virtudes)
   Um único lugar para guardar as UTMs da visita e levá-las aos
   checkouts. Carregue antes de site.js e de matricula.js.

   1. Captura: quando a URL traz UTMs (lista permitida abaixo), elas
      substituem o conjunto guardado na sessão (vale a mais recente).
      Sem UTMs na URL, a sessão continua com o que já tinha.
   2. Checkout: as UTMs vão sempre como conjunto de UMA origem. Se a
      visita tem UTMs, elas substituem todas as UTMs que o link trazia;
      se não tem, o link fica como está. O resto do endereço (produto,
      oferta, cupom, afiliado) não muda.
      É link de checkout: host da lista CHECKOUT_HOSTS ou qualquer
      <a data-checkout>. Produto novo com o mesmo checkout já entra.
   3. Variante da página: <body data-variante="a"> envia lp_variant=a;
      <body data-src-checkout="livro-sh-a"> envia src=livro-sh-a.
      Ficam separadas de utm_content, que identifica o anúncio.
   4. Nada de campo vazio, valor inventado ou parâmetro fora da lista.

   API: IVOrigem.ler()         -> objeto guardado na sessão
        IVOrigem.decorar(url)  -> url de checkout com a origem
        IVOrigem.ehCheckout(a) -> true se o link leva a checkout
   ============================================================ */
(function () {
  "use strict";
  if (window.IVOrigem) return;

  var CHAVE = "matricula_atribuicao";           // mesma chave que matricula.js já usa
  var UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];
  // Ficam guardados para o registro de matrícula (Supabase). Desses, só o fbclid vai também
  // ao checkout (identificador do clique no anúncio da Meta, sem dado pessoal).
  var IDS_ANUNCIO = ["campaign_id", "adset_id", "ad_id", "fbclid"];
  var CHECKOUT_HOSTS = ["payfast.greenn.com.br"];
  var MAX = 200;

  var memoria = null;                           // reserva se o sessionStorage falhar

  function limpar(v) {
    if (v == null) return "";
    v = String(v).replace(/[\u0000-\u001f\u007f]/g, "").trim();
    return v.length > MAX ? v.slice(0, MAX) : v;
  }
  function ler() {
    try { var s = sessionStorage.getItem(CHAVE); if (s) return JSON.parse(s) || {}; } catch (e) {}
    return memoria ? JSON.parse(JSON.stringify(memoria)) : {};
  }
  function gravar(o) {
    memoria = o;
    try { sessionStorage.setItem(CHAVE, JSON.stringify(o)); } catch (e) {}
  }
  function externo(ref) {
    try { return ref && new URL(ref).host !== location.host; } catch (e) { return false; }
  }

  /* ---------- 1. captura na chegada ---------- */
  (function capturar() {
    var g = ler(), url = new URLSearchParams(location.search), mudou = false;
    var novas = {};
    UTMS.forEach(function (p) { var v = limpar(url.get(p)); if (v) novas[p] = v; });

    if (Object.keys(novas).length) {
      // UTMs explícitas: trocam o conjunto inteiro, para não misturar campanhas.
      UTMS.concat(IDS_ANUNCIO).forEach(function (p) { delete g[p]; });
      Object.keys(novas).forEach(function (p) { g[p] = novas[p]; });
      IDS_ANUNCIO.forEach(function (p) { var v = limpar(url.get(p)); if (v) g[p] = v; });
      g.referencia_origem = externo(document.referrer) ? document.referrer : (g.referencia_origem || null);
      g.capturado_em = new Date().toISOString();
      mudou = true;
    } else {
      // Sem UTMs: só completa identificadores que ainda não existam.
      IDS_ANUNCIO.forEach(function (p) { var v = limpar(url.get(p)); if (v && !g[p]) { g[p] = v; mudou = true; } });
      if (!g.referencia_origem && externo(document.referrer)) { g.referencia_origem = document.referrer; mudou = true; }
    }
    if (mudou) gravar(g);
  })();

  /* ---------- 2. checkout ---------- */
  function ehCheckout(a) {
    if (!a || !a.getAttribute) return false;
    if (a.hasAttribute("data-checkout")) return true;
    try { return CHECKOUT_HOSTS.indexOf(new URL(a.href, location.href).host) > -1; } catch (e) { return false; }
  }

  // Regra única para as UTMs: o conjunto vem inteiro de UMA origem.
  // - A visita tem UTMs: as UTMs que o link já trazia saem todas e entram as da visita.
  // - A visita não tem UTMs: o link fica com as UTMs que já tinha (ou nenhuma).
  // Os demais parâmetros (produto, oferta, cupom, afiliado) ficam intactos, na mesma ordem
  // e com a mesma codificação. src e lp_variant só entram se o link ainda não os tiver.
  function nomeDe(par) {
    var k = par.split("=")[0];
    try { return decodeURIComponent(k.replace(/\+/g, " ")); } catch (e) { return k; }
  }
  function decorar(href) {
    if (!href) return href;
    var base = String(href), hash = "", i = base.indexOf("#");
    if (i > -1) { hash = base.slice(i); base = base.slice(0, i); }
    var j = base.indexOf("?");
    var caminho = j > -1 ? base.slice(0, j) : base;
    var pares = j > -1 ? base.slice(j + 1).split("&").filter(function (x) { return x !== ""; }) : [];

    var g = ler(), daVisita = [];
    UTMS.forEach(function (p) { var v = limpar(g[p]); if (v) daVisita.push([p, v]); });
    if (daVisita.length) {
      pares = pares.filter(function (x) { return UTMS.indexOf(nomeDe(x)) === -1; });
    }
    var presentes = pares.map(nomeDe);
    var extras = daVisita.map(function (kv) { return kv[0] + "=" + encodeURIComponent(kv[1]); });
    var corpo = document.body;
    if (corpo) {
      [["fbclid", g.fbclid],
       ["src", corpo.getAttribute("data-src-checkout")],
       ["lp_variant", corpo.getAttribute("data-variante")]].forEach(function (kv) {
        var v = limpar(kv[1]);
        if (v && presentes.indexOf(kv[0]) === -1) extras.push(kv[0] + "=" + encodeURIComponent(v));
      });
    }
    if (!extras.length && !daVisita.length) return href;
    var todos = pares.concat(extras);
    return caminho + (todos.length ? "?" + todos.join("&") : "") + hash;
  }

  // Refaz o href a partir do endereço original guardado em data-checkout-base,
  // para nunca empilhar parâmetros e sempre usar a origem mais recente.
  function aplicar(a) {
    if (!ehCheckout(a)) return;
    if (!a.hasAttribute("data-checkout-base")) a.setAttribute("data-checkout-base", a.getAttribute("href"));
    var novo = decorar(a.getAttribute("data-checkout-base"));
    if (novo !== a.getAttribute("href")) a.setAttribute("href", novo);
  }
  function aplicarTodos() {
    var links = document.querySelectorAll("a[href]");
    for (var k = 0; k < links.length; k++) aplicar(links[k]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", aplicarTodos);
  else aplicarTodos();
  // No clique (inclusive botão do meio), garante a versão atual, também em links criados depois.
  function noClique(e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (a) aplicar(a);
  }
  document.addEventListener("click", noClique, true);
  document.addEventListener("auxclick", noClique, true);
  window.addEventListener("pageshow", function (e) { if (e.persisted) aplicarTodos(); });

  window.IVOrigem = { ler: ler, decorar: decorar, ehCheckout: ehCheckout, UTMS: UTMS.slice() };
})();
