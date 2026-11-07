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

  /* ---------- 3. canal de origem que fica guardado (90 dias) ----------
     Responde "de onde essa pessoa veio" mesmo que ela volte dias depois:
     guarda o PRIMEIRO canal, o ÚLTIMO canal e os pontos de contato
     importantes (aula gravada, aula ao vivo, Formação). Sem dado pessoal.
     Canais: aula_gravada, aula_ao_vivo, link_bio, minicurso, anuncio,
     instagram, youtube, whatsapp, email, busca, site_externo, direto
     (ou o utm_source, quando ele não se encaixa em nenhum). */
  var CHAVE_TOQUES = "iv_toques", VALIDADE = 90 * 864e5;
  var PONTOS = [[/^\/aula1\//, "aula_gravada"], [/^\/aulas\/virtologia\//, "aula_ao_vivo"],
                [/^\/formacao\/interesse\//, "formulario_formacao"], [/^\/formacao\//, "pagina_formacao"]];
  function minus(v) { return limpar(v).toLowerCase(); }
  function canalDaUrl(q) {
    var o = minus(q.get("o")), src = minus(q.get("utm_source")), med = minus(q.get("utm_medium")), cnt = minus(q.get("utm_content"));
    var tudo = [o, src, med, cnt].join(" ");
    if (/aula[_-]?gravada/.test(tudo)) return "aula_gravada";
    if (/aula[_-]?ao[_-]?vivo|aula[_-]?vivo/.test(tudo)) return "aula_ao_vivo";
    if (/minicurso/.test(tudo)) return "minicurso";
    if (/(^|\s|_)bio(\s|_|$)|link[_-]?bio|linkbio|linktree/.test(tudo)) return "link_bio";
    if (q.get("fbclid") || q.get("gclid") || /^(paid|cpc|ppc|anuncio|ads|paid_social)$/.test(med)) return "anuncio";
    if (o) return o.replace(/[^a-z0-9_-]/g, "").slice(0, 40) || null;
    if (src) return src.replace(/[^a-z0-9_-]/g, "").slice(0, 40) || null;
    return null;
  }
  function canalDoReferrer(ref) {
    if (!externo(ref)) return null;
    var h = ""; try { h = new URL(ref).host.toLowerCase(); } catch (e) { return null; }
    if (/instagram\./.test(h)) return "instagram";
    if (/youtube\.|youtu\.be/.test(h)) return "youtube";
    if (/whatsapp\.|wa\.me/.test(h)) return "whatsapp";
    if (/facebook\.|fb\.com/.test(h)) return "facebook";
    if (/google\.|bing\.|yahoo\.|duckduckgo\./.test(h)) return "busca";
    if (/mail\./.test(h)) return "email";
    return "site_externo";
  }
  function lerToques() {
    try {
      var t = JSON.parse(localStorage.getItem(CHAVE_TOQUES) || "null");
      if (t && t.primeiro && Date.now() - Date.parse(t.primeiro.em) < VALIDADE) return t;
    } catch (e) {}
    return null;
  }
  (function registrarToque() {
    var q = new URLSearchParams(location.search), agora = new Date().toISOString();
    var t = lerToques() || { primeiro: null, ultimo: null, pontos: {} };
    var canal = canalDaUrl(q) || canalDoReferrer(document.referrer);
    var path = location.pathname.replace(/index\.html$/, "");
    for (var k = 0; k < PONTOS.length; k++) {
      if (PONTOS[k][0].test(path)) { if (!t.pontos[PONTOS[k][1]]) t.pontos[PONTOS[k][1]] = agora.slice(0, 10); break; }
    }
    // página de aula sem UTM também conta como canal (a pessoa veio da aula)
    if (!canal) {
      if (/^\/aula1\//.test(path)) canal = "aula_gravada";
      else if (/^\/aulas\/virtologia\//.test(path)) canal = "aula_ao_vivo";
    }
    var toque = canal ? { canal: canal, pagina: path.slice(0, 120), em: agora } : null;
    if (toque && q.get("utm_campaign")) toque.campanha = limpar(q.get("utm_campaign")).slice(0, 80);
    if (!t.primeiro) t.primeiro = toque || { canal: "direto", pagina: path.slice(0, 120), em: agora };
    if (toque) t.ultimo = toque;
    if (!t.ultimo) t.ultimo = t.primeiro;
    try { localStorage.setItem(CHAVE_TOQUES, JSON.stringify(t)); } catch (e) {}
  })();
  function toques() { return lerToques() || { primeiro: null, ultimo: null, pontos: {} }; }
  // Resumo legível: "aula_gravada" ou "aula_gravada > link_bio" (primeiro > último).
  function resumoCanal() {
    var t = toques(); if (!t.primeiro) return "direto";
    var a = t.primeiro.canal, b = t.ultimo && t.ultimo.canal;
    return b && b !== a ? a + " > " + b : a;
  }

  /* ---------- 4. WhatsApp com a origem na mensagem ----------
     Links <a data-wpp-origem> para o WhatsApp ganham, no fim da mensagem
     já escrita, de onde a pessoa veio: "(Cheguei pela aula gravada)".
     A equipe e a IA leem a origem na primeira mensagem da conversa.
     O clique também vai para o GA4 e o Pixel com o canal. */
  var FRASES = {
    aula_gravada: "pela aula gravada", aula_ao_vivo: "pela aula ao vivo", link_bio: "pelo link da bio do Instagram",
    minicurso: "pelo minicurso", anuncio: "por um anúncio", instagram: "pelo Instagram", youtube: "pelo YouTube",
    whatsapp: "por um link no WhatsApp", facebook: "pelo Facebook", busca: "por uma busca no Google",
    email: "por e-mail", site_externo: "por outro site", direto: "pelo site"
  };
  function canalAtual() {
    var t = toques();
    var c = (t.ultimo && t.ultimo.canal) || (t.primeiro && t.primeiro.canal) || "direto";
    return c;
  }
  function fraseCanal(c) {
    c = c || canalAtual();
    return FRASES[c] || ("pelo site (" + String(c).replace(/[_-]+/g, " ") + ")");
  }
  // Reescreve só o parâmetro text, com espaços como %20 (o resto do link fica igual).
  function comOrigem(href, extra, canal) {
    try {
      var u = new URL(href, location.href), txt = u.searchParams.get("text") || "";
      var marca = "(Cheguei " + fraseCanal(canal) + (extra ? " · " + extra : "") + ")";
      var novo = encodeURIComponent((txt ? txt.replace(/\s+$/, "") + " " : "") + marca);
      var q = u.search.replace(/^\?/, "").split("&").filter(function (x) { return x && x.split("=")[0] !== "text"; });
      q.unshift("text=" + novo);
      if (u.searchParams.has("phone")) { // api.whatsapp.com: phone primeiro, como no original
        var ph = q.filter(function (x) { return x.split("=")[0] === "phone"; });
        q = ph.concat(q.filter(function (x) { return x.split("=")[0] !== "phone"; }));
      }
      return u.origin + u.pathname + "?" + q.join("&") + u.hash;
    } catch (e) { return href; }
  }
  function medirWhats(onde, canal) {
    var c = canal || canalAtual(), r = resumoCanal();
    try { if (window.gtag) gtag("event", "whatsapp_formacao", { canal: c, caminho: r, local: onde || location.pathname }); } catch (e) {}
    try { if (window.fbq) fbq("trackCustom", "WhatsAppFormacao", { canal: c, caminho: r }); } catch (e) {}
  }
  function prepararWhats(a) {
    if (!a.hasAttribute("data-wpp-base")) a.setAttribute("data-wpp-base", a.getAttribute("href"));
    a.setAttribute("href", comOrigem(a.getAttribute("data-wpp-base"), "", a.getAttribute("data-wpp-canal") || ""));
  }
  function prepararTodosWhats() { Array.prototype.forEach.call(document.querySelectorAll("a[data-wpp-origem]"), prepararWhats); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", prepararTodosWhats);
  else prepararTodosWhats();
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wpp-origem]") : null;
    if (a) { prepararWhats(a); medirWhats(a.getAttribute("data-wpp-origem"), a.getAttribute("data-wpp-canal") || ""); }
  }, true);

  window.IVOrigem = { ler: ler, decorar: decorar, ehCheckout: ehCheckout, UTMS: UTMS.slice(), toques: toques,
    resumoCanal: resumoCanal, canalAtual: canalAtual, fraseCanal: fraseCanal, comOrigem: comOrigem, medirWhats: medirWhats };
})();
