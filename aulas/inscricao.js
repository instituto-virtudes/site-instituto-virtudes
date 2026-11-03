/* =====================================================================
   AULAS AO VIVO - NÚCLEO COMPARTILHADO
   Um só formulário (3 etapas, 6 campos obrigatórios) e uma só integração,
   usados pelas páginas de inscrição (/aulas/...) e pelo convite das aulas
   gravadas (/aula1/, /aula2/, /aularh/). Dados em aulas/config.js.
   ===================================================================== */
(function () {
  "use strict";
  if (window.IVAulas) return;

  var CFG = window.AULAS_CONFIG || {};
  var FUSO = "America/Sao_Paulo";

  /* raiz do site, a partir do endereço deste arquivo (aulas/inscricao.js) */
  var eu = document.currentScript && document.currentScript.src;
  var BASE = eu ? new URL("../", eu).href : location.origin + "/";
  function url(rel) { return new URL(rel, BASE).href; }

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- analytics (nunca leva dado pessoal) ---------- */
  function evento(nome, params) {
    try { if (window.gtag) gtag("event", nome, params || {}); } catch (e) {}
  }

  /* ---------- datas, sempre no horário de Brasília ---------- */
  function partes(d) {
    var o = {};
    new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }
  function datas(aula) {
    var ini = new Date(aula.inicio), p = partes(ini);
    var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
    var hora = Number(p.hour) % 24, min = Number(p.minute);
    var horaTxt = hora + "h" + (min ? String(min).padStart(2, "0") : "");
    var dur = aula.duracaoMinutos || 0, h = Math.floor(dur / 60), m = dur % 60;
    var mesNum = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, month: "2-digit" }).format(ini);
    var mesAbrev = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, month: "short" }).format(ini).replace(".", "").toUpperCase();
    return {
      semana: cap(p.weekday),                                   /* Segunda-feira */
      semanaCurta: cap(p.weekday.split("-")[0]),                /* Segunda */
      dia: Number(p.day) + " de " + p.month,                    /* 9 de novembro */
      ano: p.year,
      hora: horaTxt,                                            /* 19h */
      curta: String(p.day).padStart(2, "0") + "/" + mesNum,     /* 09/11 */
      selo: String(p.day).padStart(2, "0") + " " + mesAbrev,    /* 09 NOV */
      duracao: h + "h" + (m ? String(m).padStart(2, "0") : ""), /* 2h30 */
      iso: aula.inicio
    };
  }

  /* ---------- qual aula anunciar ---------- */
  function fimDe(a) { return new Date(new Date(a.inicio).getTime() + (a.duracaoMinutos || 0) * 60000); }
  function situacao(trilhaKey, agora) {
    var T = (CFG.trilhas || {})[trilhaKey];
    if (!T || !T.aulas || !T.aulas.length) return null;
    agora = agora || new Date();
    var lista = T.aulas.slice().sort(function (a, b) { return new Date(a.inicio) - new Date(b.inicio); });
    for (var i = 0; i < lista.length; i++) {
      var a = lista[i];
      if (isNaN(new Date(a.inicio))) continue;
      if (agora < fimDe(a)) return { chave: trilhaKey, trilha: T, aula: a, estado: agora >= new Date(a.inicio) ? "acontecendo" : "futura" };
    }
    return { chave: trilhaKey, trilha: T, aula: lista[lista.length - 1], estado: "encerrada" };
  }

  /* ---------- telefone e e-mail ---------- */
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

  function radios(nome, lista) {
    return lista.map(function (o, i) {
      return '<label class="opcao"><input type="radio" name="' + nome + '" value="' + esc(o.valor) + '"' + (i === 0 ? ' aria-describedby="erro-' + nome + '"' : "") + '><span>' + esc(o.rotulo) + "</span></label>";
    }).join("");
  }

  var UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];
  var IDS = ["campaign_id", "adset_id", "ad_id", "fbclid"];

  /* =====================================================================
     montarFormulario(container, opcoes)
       opcoes.sit       resultado de situacao()
       opcoes.pagina    "inscricao" ou o nome da aula gravada (aula1, aula2, aularh)
       opcoes.grupo     "redirecionar" (página de inscrição) ou "nova-aba"
                        (aula gravada: o vídeo continua na página)
       opcoes.rolarPara elemento que deve aparecer ao trocar de etapa
     ===================================================================== */
  function montarFormulario(box, op) {
    var A = op.sit.aula, T = op.sit.trilha;
    var problemas = [];
    if (!/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+/.test(A.grupoUrl || "")) problemas.push("O link do grupo desta aula está ausente ou inválido.");
    if (!A.id) problemas.push("A aula está sem identificador.");
    if (isNaN(new Date(A.inicio))) problemas.push("A data e o horário da aula estão inválidos.");
    if (!CFG.endpoint) problemas.push("O endereço de gravação das inscrições não foi configurado.");
    if (!CFG.envioAtivo) problemas.push("O envio das inscrições está desligado (envioAtivo: false).");
    var podeEnviar = problemas.length === 0;
    var privacidade = url("privacidade/");
    var novaAba = op.grupo === "nova-aba";

    box.classList.add("iv-form");
    box.innerHTML =
      (problemas.length ? '<div class="aviso-config" role="alert"><strong>Prévia: esta página ainda não recebe inscrições.</strong><ul>' + problemas.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>" : "") +
      '<form id="form-aula" novalidate>' +
        '<p class="progresso" id="progresso" aria-live="polite">Etapa 1 de 3</p>' +
        '<div class="barra-prog" aria-hidden="true"><i id="barra-prog"></i></div>' +

        '<fieldset class="etapa" data-etapa="1">' +
          '<legend><span class="et-tit">Vamos começar sua inscrição</span></legend>' +
          '<p class="et-txt">São três etapas curtas. Ao concluir, você seguirá para o grupo da aula.</p>' +
          '<div class="campo"><label for="f-nome">Nome</label><input id="f-nome" name="nome" type="text" autocomplete="name" autocapitalize="words" maxlength="120" required aria-describedby="erro-nome"><p class="erro" id="erro-nome"></p></div>' +
          '<div class="campo"><label for="f-tel">WhatsApp com DDD</label><input id="f-tel" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 91234-5678" maxlength="25" required aria-describedby="dica-tel erro-tel"><p class="dica" id="dica-tel">Fora do Brasil? Comece com + e o código do país.</p><p class="erro" id="erro-tel"></p></div>' +
          '<div class="campo"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="160" required aria-describedby="erro-email"><p class="erro" id="erro-email"></p></div>' +
          '<div class="hp" aria-hidden="true"><label for="f-site">Site</label><input id="f-site" name="site" type="text" tabindex="-1" autocomplete="off"></div>' +
          '<p class="uso-dados">Seus dados são tratados conforme a <a href="' + esc(privacidade) + '" target="_blank" rel="noopener">Política de Privacidade</a>.</p>' +
          '<div class="acoes-form"><button type="button" class="btn" data-avancar>Continuar</button></div>' +
        '</fieldset>' +

        '<fieldset class="etapa" data-etapa="2" hidden>' +
          '<legend><span class="et-tit">Conte um pouco sobre você</span></legend>' +
          '<p class="et-txt">Suas respostas nos ajudam a indicar conteúdos relevantes para o seu objetivo.</p>' +
          '<div class="grupo-op" role="radiogroup" aria-labelledby="q-area"><p class="pergunta" id="q-area">Qual é sua principal área de atuação?</p>' + radios("area", CFG.opcoes.area) + '<p class="erro" id="erro-area"></p></div>' +
          '<div class="grupo-op" role="radiogroup" aria-labelledby="q-obj"><p class="pergunta" id="q-obj">Qual é seu principal objetivo ao participar?</p>' + radios("objetivo", CFG.opcoes.objetivo) + '<p class="erro" id="erro-objetivo"></p></div>' +
          '<div class="grupo-op grupo-sn" role="radiogroup" aria-labelledby="q-aluno"><p class="pergunta" id="q-aluno">' + esc(T.perguntaAluno || "Você já é aluno(a) do Instituto Virtudes?") + '</p>' +
            '<div class="sn">' + radios("ja_aluno", [{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]) + '</div><p class="erro" id="erro-ja_aluno"></p></div>' +
          '<div class="acoes-form"><button type="button" class="btn-sec" data-voltar>Voltar</button><button type="button" class="btn" data-avancar>Continuar</button></div>' +
        '</fieldset>' +

        '<fieldset class="etapa" data-etapa="3" hidden>' +
          '<legend><span class="et-tit destaque-tit">Última pergunta para terminar sua inscrição</span></legend>' +
          '<div class="grupo-op" role="radiogroup" aria-labelledby="q-mom"><p class="pergunta" id="q-mom">Hoje, qual opção descreve melhor seu momento de interesse?</p>' + radios("momento", CFG.opcoes.momento) + '<p class="erro" id="erro-momento"></p></div>' +
          '<label class="consent"><input type="checkbox" name="aceite_ofertas" id="f-ofertas"><span>Quero receber também convites para próximas aulas gratuitas e formações do Instituto Virtudes. (Opcional)</span></label>' +
          '<p class="uso-dados">Usaremos seus dados para a sua inscrição e para os avisos desta aula, conforme a <a href="' + esc(privacidade) + '" target="_blank" rel="noopener">Política de Privacidade</a>.</p>' +
          '<p class="antes-btn">Ao clicar no botão abaixo, você será redirecionado para o grupo onde enviaremos o link do Zoom no dia da aula e os materiais bônus em PDF.</p>' +
          '<p class="erro erro-envio" id="erro-envio" role="alert"></p>' +
          '<div class="acoes-form"><button type="button" class="btn-sec" data-voltar>Voltar</button><button type="submit" class="btn btn-final" id="btn-final">Finalizar inscrição e seguir para grupo da aula</button></div>' +
        '</fieldset>' +
        '<p class="status-envio" id="status-envio" role="status" aria-live="polite"></p>' +
      '</form>' +
      '<div class="sucesso" id="sucesso" hidden tabindex="-1"><h3>Inscrição concluída</h3>' +
        '<p>' + (novaAba ? "O grupo da aula foi aberto em outra aba. Se não abriu, toque no botão abaixo." : "Se o grupo não abriu sozinho, toque no botão abaixo.") +
        ' É por lá que enviaremos o link do Zoom no dia da aula e os materiais bônus em PDF.</p>' +
        '<p><a class="btn" id="link-grupo" href="#"' + (novaAba ? ' target="_blank" rel="noopener"' : "") + '>Abrir grupo da aula</a></p></div>';

    var form = $("#form-aula", box);
    var etapaAtual = 1, comecou = false;
    var RASCUNHO = "aula_rascunho_" + A.id;   /* mesmo rascunho em todas as páginas da aula */
    var IDEM = "aula_idem_" + A.id;           /* mesma chave anti-duplicidade em todas as páginas */
    var FEITO = "aula_feita_" + A.id;
    var base = { aula_id: A.id, trilha: op.sit.chave, pagina: op.pagina };

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
        if (!valor("ja_aluno")) falha("ja_aluno", "Escolha Sim ou Não.", form.querySelector('[name="ja_aluno"]')); else erro("ja_aluno", "");
      }
      if (etapa === 3) {
        if (!valor("momento")) falha("momento", "Escolha uma opção.", form.querySelector('[name="momento"]')); else erro("momento", "");
      }
      if (primeiro) primeiro.focus();
      return ok;
    }
    function rolar() {
      var alvo = op.rolarPara || box;
      var r = alvo.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.4) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function mostrar(n) {
      etapaAtual = n;
      $$(".etapa", form).forEach(function (f) { f.hidden = Number(f.getAttribute("data-etapa")) !== n; });
      $("#progresso", box).textContent = "Etapa " + n + " de 3";
      $("#barra-prog", box).style.width = (n / 3 * 100) + "%";
      var tit = $('.etapa[data-etapa="' + n + '"] .et-tit', form);
      rolar();
      if (tit) { tit.setAttribute("tabindex", "-1"); setTimeout(function () { try { tit.focus({ preventScroll: true }); } catch (x) {} }, 300); }
      guardar();
      evento("inscricao_etapa", Object.assign({ etapa: n }, base));
    }

    /* rascunho: voltar, recarregar ou trocar de página não perde o que foi digitado */
    function guardar() {
      var d = { etapa: etapaAtual };
      ["nome", "whatsapp", "email", "area", "objetivo", "ja_aluno", "momento", "aceite_ofertas"].forEach(function (k) { d[k] = valor(k); });
      try { sessionStorage.setItem(RASCUNHO, JSON.stringify(d)); } catch (e) {}
    }
    function restaurar() {
      var d; try { d = JSON.parse(sessionStorage.getItem(RASCUNHO) || "null"); } catch (e) { d = null; }
      if (!d) return;
      if (d.nome) $("#f-nome").value = d.nome;
      if (d.whatsapp) $("#f-tel").value = d.whatsapp;
      if (d.email) $("#f-email").value = d.email;
      ["area", "objetivo", "ja_aluno", "momento"].forEach(function (k) {
        if (!d[k]) return;
        var r = form.querySelector('[name="' + k + '"][value="' + d[k] + '"]'); if (r) r.checked = true;
      });
      if (d.aceite_ofertas) $("#f-ofertas").checked = true;
    }
    restaurar();
    function marcarInicio() {
      if (comecou) return; comecou = true;
      evento("inscricao_inicio", base);
      if (op.aoComecar) op.aoComecar();
    }
    form.addEventListener("input", function () { marcarInicio(); guardar(); });
    form.addEventListener("change", function (e) {
      if (e.target && e.target.type === "radio") erro(e.target.name, "");  /* escolheu: some o aviso */
      guardar();
    });
    form.addEventListener("focusin", marcarInicio);

    $$("[data-avancar]", form).forEach(function (b) { b.addEventListener("click", function () { if (validar(etapaAtual)) mostrar(etapaAtual + 1); }); });
    $$("[data-voltar]", form).forEach(function (b) { b.addEventListener("click", function () { mostrar(etapaAtual - 1); }); });
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && etapaAtual < 3) { e.preventDefault(); if (validar(etapaAtual)) mostrar(etapaAtual + 1); }
    });

    function mostrarSucesso(link) {
      form.hidden = true;
      var s = $("#sucesso", box); s.hidden = false;
      $("#link-grupo", box).setAttribute("href", link);
      try { s.focus({ preventScroll: true }); } catch (e) {}
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
      var errEnvio = $("#erro-envio", box); errEnvio.textContent = "";
      if (valor("site")) return; /* robô */
      if (!podeEnviar) { errEnvio.textContent = "As inscrições desta página ainda não estão abertas. Tente novamente mais tarde."; return; }

      var origem = (window.IVOrigem && window.IVOrigem.ler) ? window.IVOrigem.ler() : {};
      var corpo = {
        aula_id: A.id,
        trilha: op.sit.chave,
        nome: valor("nome").trim().replace(/\s+/g, " "),
        telefone_original: valor("whatsapp").trim(),
        telefone_normalizado: normalizarTelefone(valor("whatsapp")),
        email: valor("email").trim().toLowerCase(),
        area_atuacao: valor("area"),
        objetivo: valor("objetivo"),
        ja_aluno: valor("ja_aluno") === "sim",
        momento_interesse: valor("momento"),
        aceite_ofertas: !!valor("aceite_ofertas"),
        versao_aviso: CFG.versaoAviso,
        pagina_url: location.href.split("#")[0],
        referencia_origem: origem.referencia_origem || document.referrer || null,
        chave_idempotencia: chaveIdempotencia()
      };
      UTMS.concat(IDS).forEach(function (p) { corpo[p] = origem[p] || null; });
      /* convite da aula gravada: as UTMs dizem de qual página veio a inscrição */
      if (op.utmFixas) {
        UTMS.forEach(function (p) { corpo[p] = null; });
        Object.keys(op.utmFixas).forEach(function (p) { corpo[p] = op.utmFixas[p]; });
      }

      /* aula gravada: abre a aba do grupo já no clique (o navegador só permite assim)
         e só leva ao grupo depois da confirmação do servidor */
      var janela = null;
      if (novaAba) {
        try {
          janela = window.open("", "_blank");
          if (janela) { janela.opener = null; janela.document.title = "Finalizando sua inscrição"; janela.document.body.innerHTML = '<p style="font:16px/1.5 system-ui,sans-serif;padding:32px;color:#333">Finalizando sua inscrição...</p>'; }
        } catch (x) { janela = null; }
      }

      enviando = true;
      var btn = $("#btn-final", box), rotulo = btn.textContent;
      btn.disabled = true; btn.setAttribute("aria-busy", "true"); btn.textContent = "Finalizando sua inscrição...";
      $("#status-envio", box).textContent = "Finalizando sua inscrição...";

      fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, d: j }; }); })
        .then(function (res) {
          var link = res.d && res.d.grupo_url;
          if (!res.ok || !res.d.ok || !/^https:\/\/chat\.whatsapp\.com\//.test(link || "")) throw new Error("falha");
          try { sessionStorage.setItem(FEITO, link); sessionStorage.removeItem(RASCUNHO); } catch (x) {}
          try { if (window.fbq) fbq("track", "Lead", { content_name: "Aula ao vivo " + A.id, content_category: op.sit.chave }); } catch (x) {}
          evento("generate_lead", base);
          $("#status-envio", box).textContent = "Inscrição concluída. Abrindo o grupo da aula.";
          mostrarSucesso(link);
          if (novaAba) { if (janela && !janela.closed) { try { janela.location.href = link; } catch (x) {} } }
          else setTimeout(function () { window.location.href = link; }, 350);
          if (op.aoConcluir) op.aoConcluir();
        })
        .catch(function () {
          if (janela) { try { janela.close(); } catch (x) {} }
          enviando = false;
          btn.disabled = false; btn.removeAttribute("aria-busy"); btn.textContent = rotulo;
          $("#status-envio", box).textContent = "";
          errEnvio.textContent = "Não conseguimos concluir sua inscrição agora. Seus dados continuam aqui: tente novamente em instantes.";
        });
    });

    return {
      focarPrimeiro: function () {
        var p = $(".etapa:not([hidden]) input:not([type=hidden])", form);
        if (p && !form.hidden) { try { p.focus({ preventScroll: true }); } catch (x) { p.focus(); } }
      },
      jaInscrito: function () { try { return !!sessionStorage.getItem(FEITO); } catch (e) { return false; } }
    };
  }

  window.IVAulas = { config: CFG, url: url, esc: esc, datas: datas, situacao: situacao, montarFormulario: montarFormulario, evento: evento };
})();
