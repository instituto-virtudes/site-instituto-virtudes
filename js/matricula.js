/* ============================================================
   FLUXO DE MATRÍCULA - Pós-graduação em Sistemas Humanizados
   Etapas: 1 atuação -> 2 condição/modalidade -> 3 dados -> checkout
   O backend é a fonte de verdade de bolsa, preço e checkout.
   ============================================================ */
(function () {
  "use strict";
  var CFG = window.MATRICULA_CONFIG;
  if (!CFG) return;

  var CHAVE = "matricula_pos";
  var CHAVE_ATRIB = "matricula_atribuicao";

  /* ---------- atribuição: captura na chegada e preserva na sessão ---------- */
  var PARAMS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term",
                "campaign_id","adset_id","ad_id","fbclid"];

  function capturarAtribuicao() {
    var guardado = ler(CHAVE_ATRIB) || {};
    var url = new URLSearchParams(location.search);
    var mudou = false;
    PARAMS.forEach(function (p) {
      var v = url.get(p);
      if (v && !guardado[p]) { guardado[p] = v; mudou = true; }
    });
    if (!guardado.referencia_origem) {
      guardado.referencia_origem = document.referrer || null; mudou = true;
    }
    if (mudou) gravar(CHAVE_ATRIB, guardado);
    return guardado;
  }

  function ler(k) {
    try { var v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; }
    catch (e) { return null; }
  }
  function gravar(k, o) {
    try { sessionStorage.setItem(k, JSON.stringify(o)); } catch (e) {}
  }

  /* ---------- estado ---------- */
  var estado = ler(CHAVE) || { segmento: null, forma: null, etapa: 1 };
  function salvarEstado() {
    gravar(CHAVE, { segmento: estado.segmento, forma: estado.forma, etapa: estado.etapa });
  }

  /* ---------- eventos internos + plataformas ---------- */
  function evento(nome, dados) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: nome }, dados || {}));
    } catch (e) {}
  }
  function pixel(nomeOficial, dados) {
    if (typeof fbq === "function") { try { fbq("track", nomeOficial, dados || {}); } catch (e) {} }
  }

  /* ---------- utilidades ---------- */
  function mascaraTelefone(v) {
    var d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  function normalizarTelefone(v) {
    var d = v.replace(/\D/g, "");
    if (d.length === 10 || d.length === 11) d = "55" + d;
    return d ? "+" + d : "";
  }
  function emailValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function whatsappHref(texto) {
    return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(texto);
  }

  /* ---------- modal ---------- */
  var modal, corpo, focoAnterior;

  function montarModal() {
    modal = document.createElement("div");
    modal.className = "mtr-fundo";
    modal.setAttribute("hidden", "");
    modal.innerHTML =
      '<div class="mtr-caixa" role="dialog" aria-modal="true" aria-labelledby="mtr-titulo">' +
        '<div class="mtr-topo">' +
          '<div class="mtr-barra"><span></span></div>' +
          '<button type="button" class="mtr-fechar" aria-label="Fechar">&times;</button>' +
        '</div>' +
        '<div class="mtr-corpo" tabindex="-1"></div>' +
      '</div>';
    document.body.appendChild(modal);
    corpo = modal.querySelector(".mtr-corpo");

    modal.querySelector(".mtr-fechar").addEventListener("click", fechar);
    modal.addEventListener("mousedown", function (e) { if (e.target === modal) fechar(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hasAttribute("hidden")) fechar();
      if (e.key === "Tab" && !modal.hasAttribute("hidden")) prenderFoco(e);
    });
  }

  function prenderFoco(e) {
    var f = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var primeiro = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  }

  function progresso(n) {
    var b = modal.querySelector(".mtr-barra span");
    if (b) b.style.width = (n / 3 * 100) + "%";
  }

  function abrir() {
    if (!modal) montarModal();
    focoAnterior = document.activeElement;
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    evento("fluxo_matricula_iniciado", { pagina_origem: CFG.paginaOrigem });
    render();
  }
  function fechar() {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
  }

  /* ---------- render por etapa ---------- */
  function render() {
    progresso(estado.etapa);
    if (estado.etapa === 1) etapaSegmento();
    else if (estado.etapa === 2) etapaOferta();
    else etapaDados();
    corpo.scrollTop = 0;
    var alvo = corpo.querySelector("h2");
    if (alvo) { corpo.focus(); }
    salvarEstado();
  }

  function temBolsa(seg) {
    return seg === "setor_publico" ||
           seg === "enfermagem_fora_setor_publico" ||
           seg === "servico_social_fora_setor_publico";
  }

  /* ETAPA 1 */
  function etapaSegmento() {
    var itens = CFG.segmentos.map(function (s) {
      var sel = estado.segmento === s.valor ? " mtr-sel" : "";
      return '<button type="button" class="mtr-opcao' + sel + '" data-seg="' + s.valor + '">' +
             esc(s.rotulo) + '</button>';
    }).join("");
    corpo.innerHTML =
      '<p class="mtr-rotulo">Matrícula</p>' +
      '<h2 id="mtr-titulo">Qual opção melhor representa sua atuação?</h2>' +
      '<p class="mtr-nota">Se você atua no setor público, escolha a primeira opção, independentemente da sua profissão.</p>' +
      '<div class="mtr-opcoes">' + itens + '</div>';
    corpo.querySelectorAll(".mtr-opcao").forEach(function (b) {
      b.addEventListener("click", function () {
        estado.segmento = b.dataset.seg;
        estado.forma = null;
        evento("segmento_profissional_selecionado", { segmento_profissional: estado.segmento });
        evento("bolsa_identificada", { elegivel_bolsa: temBolsa(estado.segmento) });
        estado.etapa = 2; render();
      });
    });
  }

  /* ETAPA 2 */
  function etapaOferta() {
    var bolsa = temBolsa(estado.segmento);
    var codigos = bolsa
      ? ["bolsa_avista", "bolsa_cartao_12x", "bolsa_recorrente_12x"]
      : ["regular_avista", "regular_cartao_12x", "regular_recorrente_12x"];

    var cabecalho = bolsa
      ? '<h2 id="mtr-titulo">Sua categoria é contemplada pela Bolsa Institucional</h2>' +
        '<p class="mtr-texto">Esta bolsa é uma forma de reconhecer profissionais que exercem funções essenciais para a sociedade e ampliar o acesso a uma formação capaz de fortalecer ainda mais o impacto do seu trabalho.</p>' +
        '<div class="mtr-ancora">' +
          '<div><span>Investimento regular</span><strong>' + esc(CFG.ancoraRegular) + '</strong></div>' +
          '<div class="mtr-ancora-sua"><span>Sua condição com Bolsa Institucional</span><strong>' + esc(CFG.ancoraBolsa) + '</strong></div>' +
        '</div>' +
        '<h3 class="mtr-sub">Escolha a modalidade</h3>'
      : '<h2 id="mtr-titulo">Escolha sua condição de matrícula</h2>';

    var cards = codigos.map(function (c) {
      var o = CFG.ofertas[c];
      var sel = estado.forma === c ? " mtr-sel" : "";
      return '<button type="button" class="mtr-oferta' + sel + '" data-oferta="' + c + '">' +
               '<span class="mtr-of-rot">' + esc(o.rotulo) + '</span>' +
               '<span class="mtr-of-val">' + esc(o.destaque) + '</span>' +
               '<span class="mtr-of-det">' + esc(o.detalhe) + '</span>' +
               (o.total ? '<span class="mtr-of-tot">' + esc(o.total) + '</span>' : '') +
             '</button>';
    }).join("");

    var recorrente = '<p class="mtr-nota">No plano recorrente, as cobranças são realizadas mês a mês, sem comprometer o valor total no limite do cartão.</p>';
    var comprovacao = CFG.EXIGIR_COMPROVACAO_BOLSA && bolsa
      ? '<p class="mtr-nota">A comprovação da categoria profissional poderá ser solicitada após a matrícula.</p>' : '';

    corpo.innerHTML =
      '<p class="mtr-rotulo">Matrícula</p>' + cabecalho +
      '<div class="mtr-ofertas">' + cards + '</div>' + recorrente + comprovacao +
      '<div class="mtr-rodape">' +
        '<button type="button" class="mtr-voltar">&larr; Voltar</button>' +
        '<a class="mtr-duvida" href="' + whatsappHref(mensagemDuvida()) + '" target="_blank" rel="noopener">Tem alguma dúvida sobre a matrícula? Fale com nossa equipe.</a>' +
      '</div>';

    corpo.querySelectorAll(".mtr-oferta").forEach(function (b) {
      b.addEventListener("click", function () {
        estado.forma = b.dataset.oferta;
        evento("forma_pagamento_selecionada", { codigo_oferta: estado.forma });
        estado.etapa = 3; render();
      });
    });
    corpo.querySelector(".mtr-voltar").addEventListener("click", function () {
      estado.etapa = 1; render();
    });
  }

  function mensagemDuvida() {
    var s = CFG.segmentos.filter(function (x) { return x.valor === estado.segmento; })[0];
    var base = "Olá! Estou vendo a Pós-graduação em Sistemas Humanizados e tenho uma dúvida sobre a matrícula.";
    if (!s) return base;
    var extra = temBolsa(estado.segmento) ? " Minha categoria tem Bolsa Institucional (" + s.rotulo + ")." : " Atuo em: " + s.rotulo + ".";
    if (estado.forma && CFG.ofertas[estado.forma]) extra += " Modalidade: " + CFG.ofertas[estado.forma].rotulo + ".";
    return base + extra;
  }

  /* ETAPA 3 */
  function etapaDados() {
    var o = CFG.ofertas[estado.forma];
    corpo.innerHTML =
      '<p class="mtr-rotulo">Matrícula</p>' +
      '<h2 id="mtr-titulo">Falta pouco para concluir sua matrícula</h2>' +
      '<p class="mtr-texto">Preencha seus dados para continuar para o pagamento.</p>' +
      (o ? '<div class="mtr-resumo"><span>' + esc(o.rotulo) + '</span><strong>' + esc(o.destaque) + '</strong></div>' : '') +
      '<div class="mtr-campos">' +
        '<label for="mtr-nome">Nome completo</label>' +
        '<input id="mtr-nome" type="text" autocomplete="name" required>' +
        '<label for="mtr-tel">WhatsApp</label>' +
        '<input id="mtr-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 90000-0000" required>' +
        '<label for="mtr-email">E-mail</label>' +
        '<input id="mtr-email" type="email" inputmode="email" autocomplete="email" required>' +
        '<div class="mtr-hp" aria-hidden="true"><label for="mtr-site">Não preencha</label><input id="mtr-site" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<p class="mtr-erro" role="alert" hidden></p>' +
        '<button type="button" class="mtr-enviar">Continuar para o pagamento</button>' +
        '<p class="mtr-legal">Seus dados são usados para dar continuidade à solicitação de matrícula e para contatos relacionados a ela. Veja a <a href="../../privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</p>' +
      '</div>' +
      '<div class="mtr-rodape">' +
        '<button type="button" class="mtr-voltar">&larr; Voltar</button>' +
        '<a class="mtr-duvida" href="' + whatsappHref(mensagemDuvida()) + '" target="_blank" rel="noopener">Precisa de ajuda pelo WhatsApp?</a>' +
      '</div>';

    var tel = corpo.querySelector("#mtr-tel");
    tel.addEventListener("input", function () { tel.value = mascaraTelefone(tel.value); });
    corpo.querySelector(".mtr-voltar").addEventListener("click", function () { estado.etapa = 2; render(); });
    corpo.querySelector(".mtr-enviar").addEventListener("click", enviar);
  }

  var enviando = false;
  function enviar() {
    if (enviando) return;
    var btn = corpo.querySelector(".mtr-enviar");
    var erro = corpo.querySelector(".mtr-erro");
    var nome = corpo.querySelector("#mtr-nome").value.trim();
    var tel = corpo.querySelector("#mtr-tel").value.trim();
    var email = corpo.querySelector("#mtr-email").value.trim();
    var hp = corpo.querySelector("#mtr-site").value;

    function falhar(msg) { erro.textContent = msg; erro.hidden = false; }
    erro.hidden = true;

    if (nome.length < 3 || nome.indexOf(" ") === -1) return falhar("Informe seu nome completo.");
    if (normalizarTelefone(tel).length < 13) return falhar("Informe um WhatsApp válido com DDD.");
    if (!emailValido(email)) return falhar("Informe um e-mail válido.");
    if (hp) return; /* honeypot: descarta em silêncio */

    var atrib = capturarAtribuicao();
    var corpoEnvio = {
      nome_completo: nome,
      email: email,
      telefone_original: tel,
      telefone_normalizado: normalizarTelefone(tel),
      segmento_profissional: estado.segmento,
      forma_pagamento_pretendida: estado.forma,
      pagina_origem: CFG.paginaOrigem,
      versao_pagina: CFG.versaoPagina,
      referencia_origem: atrib.referencia_origem || null
    };
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term",
     "campaign_id","adset_id","ad_id","fbclid"].forEach(function (p) {
      corpoEnvio[p] = atrib[p] || null;
    });

    enviando = true;
    btn.disabled = true;
    btn.textContent = "Salvando...";

    fetch(CFG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpoEnvio)
    })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, dados: j }; }); })
    .then(function (res) {
      if (!res.ok || !res.dados || !res.dados.url_checkout) {
        throw new Error((res.dados && res.dados.erro) || "falha");
      }
      evento("lead_capturado", { id_tentativa: res.dados.id_tentativa, codigo_oferta: res.dados.codigo_oferta });
      pixel("Lead", {
        content_name: "Matricula_Pos_" + CFG.paginaOrigem,
        content_category: "Pós-graduação Sistemas Humanizados"
      });
      evento("checkout_iniciado", { id_tentativa: res.dados.id_tentativa, codigo_oferta: res.dados.codigo_oferta });
      pixel("InitiateCheckout", {
        content_name: res.dados.codigo_oferta,
        value: (res.dados.valor_total_centavos || 0) / 100,
        currency: "BRL"
      });
      try { sessionStorage.removeItem(CHAVE); } catch (e) {}
      window.location.href = res.dados.url_checkout;
    })
    .catch(function () {
      enviando = false;
      btn.disabled = false;
      btn.textContent = "Continuar para o pagamento";
      falhar("Não conseguimos salvar seus dados agora. Tente novamente em instantes.");
    });
  }

  /* ---------- ligação com os CTAs da página ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    capturarAtribuicao();
    document.querySelectorAll("[data-matricula]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); abrir(); });
    });
  });

  window.MatriculaPos = { abrir: abrir };
})();
