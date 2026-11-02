/* =====================================================================
   AULAS AO VIVO - MODELO COMPARTILHADO
   Monta a página e o formulário em 3 etapas a partir de aulas/config.js.
   Cada página só diz qual aula é: <body data-aula="virtologia">.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.AULAS_CONFIG || {};
  var chave = document.body.getAttribute("data-aula");
  var A = (CFG.aulas || {})[chave];
  var main = document.getElementById("aula-main");
  if (!A || !main) return;

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- estado do evento ---------- */
  var inicio = new Date(A.inicio);
  var fim = new Date(inicio.getTime() + (A.duracaoMinutos || 0) * 60000);
  var agora = new Date();
  var encerrada = !isNaN(fim) && agora >= fim;
  var horas = Math.floor((A.duracaoMinutos || 0) / 60), mins = (A.duracaoMinutos || 0) % 60;
  var duracaoTxt = horas + "h" + (mins ? String(mins).padStart(2, "0") : "");

  /* ---------- validação da configuração ---------- */
  var problemas = [];
  if (!/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+/.test(A.grupoUrl || "")) problemas.push("O link do grupo desta aula está ausente ou inválido.");
  if (!A.id) problemas.push("A aula está sem identificador.");
  if (isNaN(inicio)) problemas.push("A data e o horário da aula estão inválidos.");
  if (!CFG.envioAtivo) problemas.push("O envio das inscrições está desligado (envioAtivo: false). A gravação no Supabase ainda não foi instalada.");
  var podeEnviar = problemas.length === 0;

  /* ---------- página ---------- */
  var cta = '<a class="btn aula-cta" href="#inscricao" data-ir-form>Quero participar da aula gratuita</a>';
  var temas = A.temas.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

  var faq = [
    ["A aula é gratuita?", "Sim. A inscrição e a participação nesta aula são gratuitas."],
    ["Quando e onde acontece?", esc(A.dataExtenso) + ", às 19h, horário de Brasília, pelo Zoom. O acesso será enviado no grupo no dia da aula."],
    ["Quanto tempo dura?", "A duração prevista é de " + duracaoTxt + "."],
    ["Se eu não conseguir acompanhar ao vivo, haverá replay?", "Sim. O replay ficará disponível por uma semana."],
    ["Como recebo os materiais?", "Os materiais bônus em PDF serão enviados no grupo da aula."],
    ["Preciso ter formação na área para participar?", "A aula é aberta ao público. A participação não exige matrícula em uma formação do Instituto."],
    ["A aula oferece certificado?", "Não. Esta aula aberta não oferece certificado."]
  ].map(function (q) { return "<details><summary>" + q[0] + "</summary><p>" + q[1] + "</p></details>"; }).join("");

  function radios(nome, lista) {
    return lista.map(function (o, i) {
      return '<label class="opcao"><input type="radio" name="' + nome + '" value="' + esc(o.valor) + '"' + (i === 0 ? ' aria-describedby="erro-' + nome + '"' : "") + '><span>' + esc(o.rotulo) + "</span></label>";
    }).join("");
  }

  var aviso = problemas.length ? '<div class="aviso-config" role="alert"><strong>Prévia: esta página ainda não recebe inscrições.</strong><ul>' + problemas.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>" : "";

  var formulario = encerrada
    ? '<div class="encerrada"><h2>Esta aula já aconteceu</h2><p>As inscrições para a aula de ' + esc(A.dataCurta) + ' foram encerradas.</p>' + (A.aulaGravada ? '<p><a class="btn-sec" href="' + esc(A.aulaGravada) + '">Assistir a uma aula gravada</a></p>' : "") + "</div>"
    : '' +
    '<form id="form-aula" novalidate>' +
      '<p class="progresso" id="progresso" aria-live="polite">Etapa 1 de 3</p>' +
      '<div class="barra-prog" aria-hidden="true"><i id="barra-prog"></i></div>' +

      '<fieldset class="etapa" data-etapa="1">' +
        '<legend><span class="et-tit">Vamos começar sua inscrição</span></legend>' +
        '<p class="et-txt">Informe seus dados para receber as orientações da aula.</p>' +
        '<div class="campo"><label for="f-nome">Nome</label><input id="f-nome" name="nome" type="text" autocomplete="name" autocapitalize="words" maxlength="120" required aria-describedby="erro-nome"><p class="erro" id="erro-nome"></p></div>' +
        '<div class="campo"><label for="f-tel">WhatsApp com DDD</label><input id="f-tel" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 91234-5678" maxlength="25" required aria-describedby="dica-tel erro-tel"><p class="dica" id="dica-tel">Fora do Brasil? Comece com + e o código do país.</p><p class="erro" id="erro-tel"></p></div>' +
        '<div class="campo"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="160" required aria-describedby="erro-email"><p class="erro" id="erro-email"></p></div>' +
        '<div class="hp" aria-hidden="true"><label for="f-site">Site</label><input id="f-site" name="site" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<div class="acoes-form"><button type="button" class="btn" data-avancar>Continuar</button></div>' +
      '</fieldset>' +

      '<fieldset class="etapa" data-etapa="2" hidden>' +
        '<legend><span class="et-tit">Conte um pouco sobre você</span></legend>' +
        '<p class="et-txt">Suas respostas nos ajudam a indicar conteúdos relevantes para o seu objetivo.</p>' +
        '<div class="grupo-op" role="radiogroup" aria-labelledby="q-area"><p class="pergunta" id="q-area">Qual é sua principal área de atuação?</p>' + radios("area", CFG.opcoes.area) + '<p class="erro" id="erro-area"></p></div>' +
        '<div class="grupo-op" role="radiogroup" aria-labelledby="q-obj"><p class="pergunta" id="q-obj">Qual é seu principal objetivo ao participar?</p>' + radios("objetivo", CFG.opcoes.objetivo) + '<p class="erro" id="erro-objetivo"></p></div>' +
        '<div class="acoes-form"><button type="button" class="btn-sec" data-voltar>Voltar</button><button type="button" class="btn" data-avancar>Continuar</button></div>' +
      '</fieldset>' +

      '<fieldset class="etapa" data-etapa="3" hidden>' +
        '<legend><span class="et-tit destaque-tit">Última pergunta para terminar sua inscrição</span></legend>' +
        '<div class="grupo-op" role="radiogroup" aria-labelledby="q-mom"><p class="pergunta" id="q-mom">Hoje, qual opção descreve melhor seu momento de interesse?</p>' + radios("momento", CFG.opcoes.momento) + '<p class="erro" id="erro-momento"></p></div>' +
        '<label class="consent"><input type="checkbox" name="aceite_ofertas" id="f-ofertas"><span>Quero receber também convites para próximas aulas gratuitas e formações do Instituto Virtudes. (Opcional)</span></label>' +
        '<p class="uso-dados">Usaremos seus dados para a sua inscrição e para os avisos desta aula, conforme a <a href="../../privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</p>' +
        '<p class="antes-btn">Ao clicar no botão abaixo, você será redirecionado para o grupo onde enviaremos o link do Zoom no dia da aula e os materiais bônus em PDF.</p>' +
        '<p class="erro erro-envio" id="erro-envio" role="alert"></p>' +
        '<div class="acoes-form"><button type="button" class="btn-sec" data-voltar>Voltar</button><button type="submit" class="btn btn-final" id="btn-final">Finalizar inscrição e seguir para grupo da aula</button></div>' +
      '</fieldset>' +
      '<p class="status-envio" id="status-envio" role="status" aria-live="polite"></p>' +
    '</form>' +
    '<div class="sucesso" id="sucesso" hidden tabindex="-1"><h2>Inscrição concluída</h2><p>Se o grupo não abriu sozinho, toque no botão abaixo. É por lá que enviaremos o link do Zoom no dia da aula e os materiais bônus em PDF.</p><p><a class="btn" id="link-grupo" href="#">Abrir grupo da aula</a></p></div>';

  main.innerHTML =
    '<section class="aula-topo">' +
      '<div class="wrap">' +
        '<p class="trilha-aula">' + esc(A.rotuloTrilha) + ' · Instituto Virtudes</p>' +
        '<p class="kicker">' + esc(A.chamada) + '</p>' +
        '<h1>' + esc(A.titulo) + '</h1>' +
        '<p class="lead">' + esc(A.subtitulo) + '</p>' +
        '<dl class="info-aula">' +
          '<div><dt>Data</dt><dd>' + esc(A.dataExtenso) + '</dd></div>' +
          '<div><dt>Horário</dt><dd>19h, horário de Brasília</dd></div>' +
          '<div><dt>Duração</dt><dd>' + duracaoTxt + '</dd></div>' +
          '<div><dt>Formato</dt><dd>Ao vivo, pelo Zoom</dd></div>' +
          '<div><dt>Replay</dt><dd>Disponível por uma semana</dd></div>' +
          '<div><dt>Com</dt><dd>Eduardo Casarotto</dd></div>' +
        '</dl>' +
        (encerrada ? "" : cta) +
      '</div>' +
    '</section>' +
    '<section><div class="wrap"><h2>Sobre a aula</h2><p>' + esc(A.apresentacao) + '</p></div></section>' +
    '<section><div class="wrap"><h2>O que será abordado</h2><ul class="temas">' + temas + '</ul></div></section>' +
    '<section><div class="wrap"><h2>Para quem é esta aula</h2><p>' + esc(A.paraQuem) + '</p>' + (encerrada ? "" : cta) + '</div></section>' +
    '<section class="prof"><div class="wrap prof-grade">' +
      '<img src="../../img/eduardo-palestra.webp" alt="Eduardo Casarotto em palestra." width="853" height="1067" loading="lazy">' +
      '<div><p class="kicker">Quem conduz</p><h2>Dr. Eduardo Casarotto</h2>' +
      '<p>Pesquisador, professor, consultor empresarial, formador de terapeutas há 25 anos e coordenador de cursos de pós-graduação. Fundamentador dos Sistemas Humanizados e da Escola Clínico-Filosófica Virtologia.</p>' +
      '<p>Autor de mais de 20 livros, com publicações científicas no Brazilian Journal of Health Review. Seu trabalho de humanização foi aplicado em grandes organizações, hospitais oncológicos, escolas, órgãos públicos e sistemas prisionais no Brasil e na Colômbia.</p></div>' +
    '</div></section>' +
    '<section id="inscricao" class="inscricao"><div class="wrap estreito">' + aviso + formulario + '</div></section>' +
    '<section class="faq"><div class="wrap"><h2>Perguntas frequentes</h2>' + faq + '</div></section>';

  /* rolagem dos CTAs até o formulário */
  $$("[data-ir-form]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var alvo = document.getElementById("inscricao");
      alvo.scrollIntoView({ behavior: "smooth", block: "start" });
      var primeiro = $("#form-aula .etapa:not([hidden]) input:not([type=hidden])");
      if (primeiro) setTimeout(function () { try { primeiro.focus({ preventScroll: true }); } catch (x) { primeiro.focus(); } }, 450);
    });
  });

  if (encerrada) return;

  /* ---------- formulário ---------- */
  var form = $("#form-aula");
  var etapaAtual = 1;
  var RASCUNHO = "aula_rascunho_" + A.id;
  var IDEM = "aula_idem_" + A.id;
  var FEITO = "aula_feita_" + A.id;

  function soDigitos(t) { return String(t || "").replace(/\D/g, ""); }
  function normalizarTelefone(t) {
    var bruto = String(t || "").trim(), d = soDigitos(bruto);
    if (!d) return "";
    if (bruto.charAt(0) === "+") return d;                    /* já veio com código do país */
    if (d.length >= 12 && d.indexOf("55") === 0) return d;    /* 55 + DDD + número */
    if (d.length === 10 || d.length === 11) return "55" + d;  /* DDD + número do Brasil */
    return d;
  }
  function telefoneValido(t) {
    var bruto = String(t || "").trim(), n = normalizarTelefone(t);
    if (bruto.charAt(0) === "+" && n.indexOf("55") !== 0) return n.length >= 8 && n.length <= 15; /* fora do Brasil */
    return /^55[1-9][0-9](9[0-9]{8}|[2-8][0-9]{7})$/.test(n);                                       /* Brasil: DDD + 8 ou 9 dígitos */
  }
  function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "").trim()); }

  function erro(nome, msg) {
    var el = document.getElementById("erro-" + nome);
    if (el) el.textContent = msg || "";
    var campo = form.querySelector('[name="' + nome + '"]');
    if (campo && campo.type !== "radio") campo.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function valor(nome) {
    var el = form.querySelector('[name="' + nome + '"]:checked') || form.querySelector('[name="' + nome + '"]:not([type=radio])');
    return el ? (el.type === "checkbox" ? el.checked : el.value) : "";
  }

  function validar(etapa) {
    var ok = true, primeiro = null;
    function falha(nome, msg, el) { erro(nome, msg); ok = false; if (!primeiro) primeiro = el; }
    if (etapa === 1) {
      var nome = valor("nome").trim().replace(/\s+/g, " ");
      if (nome.length < 2 || !/[A-Za-zÀ-ÿ]/.test(nome)) falha("nome", "Informe seu nome.", $("#f-nome")); else erro("nome", "");
      if (!telefoneValido(valor("whatsapp"))) falha("tel", "Informe um WhatsApp válido, com DDD.", $("#f-tel")); else erro("tel", "");
      if (!emailValido(valor("email"))) falha("email", "Informe um e-mail válido. Ele é obrigatório.", $("#f-email")); else erro("email", "");
      $("#f-tel").setAttribute("aria-invalid", document.getElementById("erro-tel").textContent ? "true" : "false");
    }
    if (etapa === 2) {
      if (!valor("area")) falha("area", "Escolha uma opção.", form.querySelector('[name="area"]')); else erro("area", "");
      if (!valor("objetivo")) falha("objetivo", "Escolha uma opção.", form.querySelector('[name="objetivo"]')); else erro("objetivo", "");
    }
    if (etapa === 3) {
      if (!valor("momento")) falha("momento", "Escolha uma opção.", form.querySelector('[name="momento"]')); else erro("momento", "");
    }
    if (primeiro) primeiro.focus();
    return ok;
  }

  function mostrar(n) {
    etapaAtual = n;
    $$(".etapa", form).forEach(function (f) { f.hidden = Number(f.getAttribute("data-etapa")) !== n; });
    $("#progresso").textContent = "Etapa " + n + " de 3";
    $("#barra-prog").style.width = (n / 3 * 100) + "%";
    var tit = $('.etapa[data-etapa="' + n + '"] .et-tit');
    document.getElementById("inscricao").scrollIntoView({ behavior: "smooth", block: "start" });
    if (tit) { tit.setAttribute("tabindex", "-1"); setTimeout(function () { try { tit.focus({ preventScroll: true }); } catch (x) {} }, 300); }
    guardar();
  }

  /* rascunho: voltar ou recarregar não perde o que foi digitado */
  function guardar() {
    var d = { etapa: etapaAtual };
    ["nome", "whatsapp", "email", "area", "objetivo", "momento", "aceite_ofertas"].forEach(function (k) { d[k] = valor(k); });
    try { sessionStorage.setItem(RASCUNHO, JSON.stringify(d)); } catch (e) {}
  }
  function restaurar() {
    var d; try { d = JSON.parse(sessionStorage.getItem(RASCUNHO) || "null"); } catch (e) { d = null; }
    if (!d) return;
    if (d.nome) $("#f-nome").value = d.nome;
    if (d.whatsapp) $("#f-tel").value = d.whatsapp;
    if (d.email) $("#f-email").value = d.email;
    ["area", "objetivo", "momento"].forEach(function (k) {
      if (!d[k]) return;
      var r = form.querySelector('[name="' + k + '"][value="' + d[k] + '"]'); if (r) r.checked = true;
    });
    if (d.aceite_ofertas) $("#f-ofertas").checked = true;
  }
  restaurar();
  form.addEventListener("input", guardar);
  form.addEventListener("change", guardar);

  $$("[data-avancar]", form).forEach(function (b) { b.addEventListener("click", function () { if (validar(etapaAtual)) mostrar(etapaAtual + 1); }); });
  $$("[data-voltar]", form).forEach(function (b) { b.addEventListener("click", function () { mostrar(etapaAtual - 1); }); });
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && etapaAtual < 3) { e.preventDefault(); if (validar(etapaAtual)) mostrar(etapaAtual + 1); }
  });

  /* inscrição já feita nesta sessão: mostra direto o caminho para o grupo */
  function mostrarSucesso(url) {
    form.hidden = true;
    var s = $("#sucesso"); s.hidden = false;
    $("#link-grupo").setAttribute("href", url);
    try { s.focus(); } catch (e) {}
  }
  try { var feita = sessionStorage.getItem(FEITO); if (feita) mostrarSucesso(feita); } catch (e) {}

  function chaveIdempotencia() {
    var k; try { k = localStorage.getItem(IDEM); } catch (e) {}
    if (!k) {
      k = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ("k" + Date.now() + Math.random().toString(16).slice(2));
      try { localStorage.setItem(IDEM, k); } catch (e) {}
    }
    return k;
  }

  var enviando = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (enviando) return;
    if (!validar(1)) { mostrar(1); return; }
    if (!validar(2)) { mostrar(2); return; }
    if (!validar(3)) return;
    var errEnvio = $("#erro-envio"); errEnvio.textContent = "";
    if (valor("site")) return; /* robô */
    if (!podeEnviar) { errEnvio.textContent = "As inscrições desta página ainda não estão abertas. Tente novamente mais tarde."; return; }

    var origem = (window.IVOrigem && window.IVOrigem.ler) ? window.IVOrigem.ler() : {};
    var corpo = {
      aula_id: A.id,
      trilha: A.trilha,
      nome: valor("nome").trim().replace(/\s+/g, " "),
      telefone_original: valor("whatsapp").trim(),
      telefone_normalizado: normalizarTelefone(valor("whatsapp")),
      email: valor("email").trim().toLowerCase(),
      area_atuacao: valor("area"),
      objetivo: valor("objetivo"),
      momento_interesse: valor("momento"),
      aceite_ofertas: !!valor("aceite_ofertas"),
      versao_aviso: CFG.versaoAviso,
      pagina_url: location.href.split("#")[0],
      referencia_origem: origem.referencia_origem || document.referrer || null,
      chave_idempotencia: chaveIdempotencia()
    };
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "campaign_id", "adset_id", "ad_id", "fbclid"].forEach(function (p) { corpo[p] = origem[p] || null; });

    enviando = true;
    var btn = $("#btn-final"), rotulo = btn.textContent;
    btn.disabled = true; btn.setAttribute("aria-busy", "true"); btn.textContent = "Finalizando sua inscrição...";
    $("#status-envio").textContent = "Finalizando sua inscrição...";

    fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, d: j }; }); })
      .then(function (res) {
        var url = res.d && res.d.grupo_url;
        if (!res.ok || !res.d.ok || !/^https:\/\/chat\.whatsapp\.com\//.test(url || "")) throw new Error("falha");
        try { sessionStorage.setItem(FEITO, url); sessionStorage.removeItem(RASCUNHO); } catch (x) {}
        try { if (window.fbq) fbq("track", "Lead", { content_name: "Aula ao vivo " + A.id, content_category: A.trilha }); } catch (x) {}
        try { if (window.gtag) gtag("event", "generate_lead", { aula_id: A.id, trilha: A.trilha }); } catch (x) {}
        $("#status-envio").textContent = "Inscrição concluída. Abrindo o grupo da aula.";
        mostrarSucesso(url);
        setTimeout(function () { window.location.href = url; }, 350);
      })
      .catch(function () {
        enviando = false;
        btn.disabled = false; btn.removeAttribute("aria-busy"); btn.textContent = rotulo;
        $("#status-envio").textContent = "";
        errEnvio.textContent = "Não conseguimos concluir sua inscrição agora. Seus dados continuam aqui: tente novamente em instantes.";
      });
  });
})();
