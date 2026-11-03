/* =====================================================================
   FORMAÇÃO EM VIRTOLOGIA - PÁGINA DE INTERESSE
   Uma tela por vez: apresentação, 3 perguntas intercaladas com pequenos
   capítulos, nome e WhatsApp, confirmação com o código de atendimento.
   Grava no Supabase antes de mostrar a confirmação.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.INTERESSE_CONFIG || {};
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var palco = $("#palco"), acao = $("#acao"), voltar = $("#voltar"), barra = $("#progresso-barra"), prog = $("#progresso");

  /* ---------- opções (o "valor" é o que vai para o banco) ---------- */
  var OP = {
    area: [
      ["psicologia", "Psicologia"],
      ["psicanalise", "Psicanálise"],
      ["terapias_desenvolvimento", "Terapias e desenvolvimento humano"],
      ["outra_area", "Outra área profissional"],
      ["interesse_pessoal", "Tenho interesse pessoal em estudar o funcionamento humano"]
    ],
    objetivo: [
      ["compreender_padroes", "Compreender melhor os padrões que fazem as pessoas repetirem comportamentos que lhes causam sofrimento"],
      ["investigar_atendimentos", "Aprimorar minha capacidade de investigar necessidades, personalidade e mecanismos inconscientes durante os atendimentos"],
      ["metodologia_virtudes", "Aprender uma metodologia para orientar o desenvolvimento de virtudes e novos recursos de comportamento"],
      ["ampliar_repertorio", "Ampliar meu repertório profissional com uma nova abordagem do funcionamento humano"],
      ["desenvolvimento_pessoal", "Aprofundar meu conhecimento para meu desenvolvimento pessoal"]
    ],
    conhecimento: [
      ["conhece_bem", "Conheço bem e acompanho os conteúdos"],
      ["aulas_ou_livros", "Já assisti a aulas ou li algum dos livros"],
      ["conhece_pouco", "Já ouvi falar, mas conheço pouco"],
      ["conhecendo_agora", "Estou conhecendo agora"]
    ]
  };

  /* ---------- estado (sobrevive a recarregar a página) ---------- */
  var CHAVE = "formacao_interesse_estado";
  var st;
  try { st = JSON.parse(sessionStorage.getItem(CHAVE) || "null"); } catch (e) { st = null; }
  if (!st || typeof st !== "object") st = { etapa: 0, r: {}, nome: "", tel: "", novidades: false, codigo: null };
  st.r = st.r || {};
  function salvar() { try { sessionStorage.setItem(CHAVE, JSON.stringify(st)); } catch (e) {} }

  /* ---------- medição (sem dado pessoal) ---------- */
  function ga(nome, p) { try { if (window.gtag) gtag("event", nome, p || {}); } catch (e) {} }
  function fbCustom(nome, p) { try { if (window.fbq) fbq("trackCustom", nome, p || {}); } catch (e) {} }
  function umaVez(chave) { try { if (sessionStorage.getItem(chave)) return false; sessionStorage.setItem(chave, "1"); } catch (e) {} return true; }

  /* ---------- telas ---------- */
  var TELAS = ["intro", "p_area", "edu1", "p_objetivo", "edu2", "exemplo", "p_conhecimento", "edu3", "dados", "fim"];
  var PERGUNTA = { p_area: "area", p_objetivo: "objetivo", p_conhecimento: "conhecimento" };

  function opcoes(campo) {
    return '<div class="opcoes" role="radiogroup" aria-labelledby="tit">' + OP[campo].map(function (o) {
      var sel = st.r[campo] === o[0];
      return '<button type="button" class="opcao" role="radio" aria-checked="' + sel + '" data-campo="' + campo + '" data-valor="' + o[0] + '"><span class="marcador" aria-hidden="true"></span><span>' + esc(o[1]) + "</span></button>";
    }).join("") + "</div>";
  }

  var pessoal = function () { return st.r.area === "interesse_pessoal"; };

  var INTRO_OBJ = {
    compreender_padroes: "Você quer entender por que as pessoas repetem padrões que as fazem sofrer. A Virtologia parte daí e vai além.",
    investigar_atendimentos: "Você quer investigar com mais profundidade. Na Virtologia, a investigação é o primeiro de três movimentos.",
    metodologia_virtudes: "Você quer orientar o desenvolvimento de virtudes. É onde a Virtologia chega, no terceiro de três movimentos.",
    ampliar_repertorio: "Você quer ampliar seu repertório. A Virtologia oferece uma estrutura de trabalho em três movimentos.",
    desenvolvimento_pessoal: "Você quer se desenvolver. Os mesmos três movimentos servem para olhar o próprio funcionamento."
  };

  var CARTOES = [
    ["Uma nova leitura do funcionamento humano", "Estudar como investigar padrões de comportamento, necessidades, personalidade e mecanismos inconscientes."],
    ["Os mecanismos de orgulho e egoísmo", "Conhecer a arquitetura teórica da Virtologia para interpretar reações defensivas, relações humanas e padrões associados ao sofrimento."],
    ["Investigar recursos disponíveis e recursos a desenvolver", "Estudar como as virtudes e as Faixas de Evolução neurológica fazem parte da leitura virtológica do funcionamento humano."],
    ["Uma estrutura para conduzir o trabalho", "Aprofundar a aplicação do tripé Investigação, Ensinamento e Ação."],
    ["Orientar o desenvolvimento de virtudes", "Estudar princípios de aprendizagem, neuroplasticidade e os exercícios propostos pela metodologia."],
    ["Um repertório para diferentes situações humanas", "Compreender como a Virtologia aborda dificuldades de relacionamento, reações defensivas, conflitos, necessidades e outros aspectos da personalidade."]
  ];

  function tela(nome) {
    switch (nome) {

      case "intro": return {
        html:
          '<p class="kicker">Formação em Virtologia</p>' +
          '<h1 id="tit" tabindex="-1">E se você pudesse ir além de compreender o sofrimento humano e aprender uma metodologia para trabalhar sua transformação?</h1>' +
          '<p class="sub">Conheça a Formação em Virtologia e descubra como aprofundar sua atuação profissional por meio do estudo da personalidade, dos mecanismos inconscientes e do desenvolvimento de virtudes por neuroplasticidade.</p>' +
          '<p class="rotulo">Uma formação para quem deseja desenvolver uma compreensão mais profunda do funcionamento humano e novas possibilidades de atuação.</p>' +
          '<ul class="promessas">' +
            '<li><strong>Investigar com mais profundidade</strong><span>Compreender padrões, necessidades e mecanismos que influenciam comportamentos.</span></li>' +
            '<li><strong>Desenvolver uma direção de trabalho</strong><span>Identificar os recursos humanos que precisam ser fortalecidos.</span></li>' +
            '<li><strong>Transformar conhecimento em aplicação</strong><span>Estudar maneiras de orientar exercícios e ações voltadas à construção de virtudes.</span></li>' +
          "</ul>",
        botao: "Descobrir como a Virtologia pode ampliar minha atuação",
        aoAvancar: function () { if (umaVez("fi_quiz_iniciado")) { fbCustom("QuizStarted", { content_name: "Formação em Virtologia" }); ga("quiz_iniciado", { pagina: "formacao_interesse" }); } }
      };

      case "p_area": return {
        html: '<p class="kicker">Pergunta 1 de 3</p><h2 id="tit" tabindex="-1">Em qual dessas áreas você atua ou pretende atuar?</h2>' + opcoes("area"),
        pergunta: "area"
      };

      case "edu1": return {
        html:
          '<p class="kicker">Capítulo 1</p>' +
          '<h2 id="tit" tabindex="-1">O que muda quando você passa a investigar o funcionamento humano por outra perspectiva?</h2>' +
          '<p>Imagine alguém que entende o comportamento que o faz sofrer, sabe que ele prejudica sua vida e, mesmo assim, continua repetindo o padrão.</p>' +
          (pessoal()
            ? '<p>A Virtologia propõe ir além da explicação: quem estuda aprende a investigar os mecanismos envolvidos, a estrutura da personalidade, as necessidades por trás das reações e os recursos a desenvolver, inclusive em si mesmo.</p>' +
              '<blockquote>Não é apenas saber explicar por que alguém age de determinada maneira. É entender o que precisa ser desenvolvido para funcionar de outra forma.</blockquote>' +
              '<p class="fecho">A proposta é transformar a compreensão do funcionamento humano em direção de desenvolvimento.</p>'
            : '<p>Na Virtologia, o profissional não para na explicação: aprende a investigar os mecanismos envolvidos, a estrutura da personalidade, as necessidades por trás das reações e os recursos que precisam ser desenvolvidos.</p>' +
              '<blockquote>Não é apenas saber explicar por que alguém age de determinada maneira. É estudar como identificar o que essa pessoa precisa desenvolver para funcionar de outra forma.</blockquote>' +
              '<p class="fecho">A proposta é transformar a compreensão do funcionamento humano em direção de trabalho.</p>'),
        botao: "Quero conhecer essas possibilidades"
      };

      case "p_objetivo": return {
        html: '<p class="kicker">Pergunta 2 de 3</p><h2 id="tit" tabindex="-1">O que você mais gostaria de conseguir fazer com uma formação como essa?</h2>' + opcoes("objetivo"),
        pergunta: "objetivo"
      };

      case "edu2": return {
        html:
          '<p class="kicker">Capítulo 2</p>' +
          '<h2 id="tit" tabindex="-1">Da investigação à transformação</h2>' +
          '<p class="pessoal">' + esc(INTRO_OBJ[st.r.objetivo] || "A Virtologia organiza sua proposta de trabalho em três movimentos fundamentais.") + '</p>' +
          '<ol class="movimentos">' +
            '<li><strong>Investigação</strong><span>Compreender como a pessoa funciona: padrões, necessidades, defesas e personalidade.</span></li>' +
            '<li><strong>Ensinamento</strong><span>Ajudar a pessoa a entender o próprio funcionamento e orientar mudanças concretas.</span></li>' +
            '<li><strong>Ação</strong><span>Desenvolver os recursos necessários com exercícios de virtudes, por aprendizagem e neuroplasticidade.</span></li>' +
          "</ol>" +
          '<blockquote>Compreender o funcionamento, identificar o que precisa ser desenvolvido e orientar a transformação.</blockquote>',
        botao: "Ver um exemplo de aplicação"
      };

      case "exemplo": return {
        html:
          '<p class="kicker">Exemplo de aplicação</p>' +
          '<h2 id="tit" tabindex="-1">Uma pessoa que não consegue lidar com críticas</h2>' +
          '<p>Ela sabe que reage mal, sabe que isso prejudica seus relacionamentos e até explica de onde isso vem. <strong>Mas continua reagindo na defensiva.</strong></p>' +
          '<ol class="fluxo" aria-label="Como a Virtologia propõe estudar esse caso">' +
            '<li><em>Comportamento observado</em>Reação defensiva diante de críticas</li>' +
            '<li><em>Investigar</em>Orgulho, necessidade de importância e aceitação, recursos da personalidade</li>' +
            '<li><em>Ensinar</em>A diferença entre sentir a crítica como ameaça e encará-la com consciência</li>' +
            '<li><em>Orientar a ação</em>Humildade, aceitação e abertura ao aprendizado, conforme o planejamento do caso</li>' +
          "</ol>" +
          '<p class="fecho"><strong>É só um exemplo.</strong> A formação oferece uma arquitetura para situações muito mais diversas, não uma técnica única.</p>',
        botao: "Continuar"
      };

      case "p_conhecimento": return {
        html: '<p class="kicker">Pergunta 3 de 3</p><h2 id="tit" tabindex="-1">Antes de conhecer esta Formação, quanto você já sabia sobre Virtologia?</h2>' + opcoes("conhecimento"),
        pergunta: "conhecimento"
      };

      case "edu3": return {
        html:
          '<p class="kicker">Capítulo 3</p>' +
          '<h2 id="tit" tabindex="-1">O que você desenvolve ao estudar Virtologia de maneira aprofundada?</h2>' +
                    '<div class="cartoes">' + CARTOES.map(function (c, i) {
            return '<details><summary><span class="n">' + (i + 1) + "</span>" + esc(c[0]) + "</summary><p>" + esc(c[1]) + "</p></details>";
          }).join("") + "</div>" +
          '<div class="quadro">' +
            '<p><span>Livro ou aula</span>Conhecer as ideias.</p>' +
            '<p class="forte"><span>Formação</span>A arquitetura completa e suas aplicações. Inclui o livro.</p>' +
          "</div>" +
          '<p class="aviso">Formação oferecida atualmente como curso livre. A aplicação profissional deve respeitar as atribuições, a formação prévia e os limites legais de cada profissão.</p>',
        botao: "Quero conhecer as condições para ingressar"
      };

      case "dados": return {
        html:
          '<p class="kicker">Última etapa</p>' +
          '<h2 id="tit" tabindex="-1">Quer descobrir como estudar essa metodologia de maneira completa?</h2>' +
          '<p>Nossa equipe apresenta a estrutura da formação, o investimento e as condições de ingresso, e tira suas dúvidas.</p>' +
          '<form id="form" novalidate>' +
            '<p class="rotulo">Informe seus dados para solicitar atendimento:</p>' +
            '<div class="campo"><label for="f-nome">Qual é seu nome?</label><input id="f-nome" name="nome" type="text" autocomplete="name" autocapitalize="words" maxlength="120" required aria-describedby="e-nome" value="' + esc(st.nome) + '"><p class="erro" id="e-nome"></p></div>' +
            '<div class="campo"><label for="f-tel">Qual é seu WhatsApp com DDD?</label><input id="f-tel" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 91234-5678" maxlength="25" required aria-describedby="e-tel" value="' + esc(st.tel) + '"><p class="erro" id="e-tel"></p></div>' +
            '<div class="hp" aria-hidden="true"><label for="f-site">Site</label><input id="f-site" name="site" type="text" tabindex="-1" autocomplete="off"></div>' +
            '<p class="autoriza">Ao continuar, você autoriza a equipe do Instituto Virtudes a falar com você pelo WhatsApp sobre esta solicitação. <a href="../../privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</p>' +
            '<label class="consent"><input type="checkbox" id="f-novidades"' + (st.novidades ? " checked" : "") + '><span>Quero receber também convites para aulas gratuitas e novidades do Instituto Virtudes. (Opcional)</span></label>' +
            '<p class="erro erro-envio" id="e-envio" role="alert"></p>' +
            '<button type="submit" hidden></button>' +
          "</form>",
        botao: "Próximo",
        enviar: true
      };

      case "fim": return {
        html:
          '<p class="kicker">Quase lá</p>' +
          '<h2 id="tit" tabindex="-1">Seu interesse na Formação em Virtologia está quase registrado.</h2>' +
          '<p>Agora faltam dois passos simples:</p>' +
          '<ol class="passos">' +
            '<li><strong>Passo 1</strong>Clique no botão abaixo, que vai te direcionar para o nosso WhatsApp.</li>' +
            '<li><strong>Passo 2</strong>Na conversa que vai abrir automaticamente, nos envie a mensagem. Nossa equipe de matrículas entrará em contato com você.</li>' +
          '</ol>',
        whatsapp: true
      };
    }
  }

  /* ---------- navegação ---------- */
  function primeiraPendente() {
    if (!st.r.area) return 1;
    if (!st.r.objetivo) return 3;
    if (!st.r.conhecimento) return 6;
    return null;
  }
  function permitida(n) {
    if (n >= 9 && !st.codigo) return 8;
    var p = primeiraPendente();
    if (p !== null && n > p) return p;
    return n;
  }

  function ir(n, empilhar) {
    n = permitida(Math.max(0, Math.min(TELAS.length - 1, n)));
    var dir = n >= st.etapa ? 1 : -1;
    st.etapa = n; salvar();
    if (empilhar) { try { history.pushState({ fi: n }, ""); empilhados++; } catch (e) {} }
    desenhar(dir);
    if (n > 0 && n < 9) ga("quiz_etapa", { etapa: TELAS[n] });
  }

  function guardarDados() {
    var a = $("#f-nome"), b = $("#f-tel"), c = $("#f-novidades");
    if (a) st.nome = a.value; if (b) st.tel = b.value; if (c) st.novidades = c.checked;
    salvar();
  }

  function desenhar(dir) {
    var nome = TELAS[st.etapa], t = tela(nome);
    var total = TELAS.length - 1;
    var pct = Math.round(st.etapa / total * 100);
    barra.style.width = pct + "%";
    prog.setAttribute("aria-valuenow", String(pct));
    voltar.hidden = st.etapa === 0 || nome === "fim";

    palco.innerHTML = '<div class="tela tela-' + nome + (dir < 0 ? " volta" : "") + '">' + t.html + "</div>";
    palco.scrollTop = 0;

    /* rodapé com a ação principal (fica sempre visível) */
    if (t.whatsapp) {
      acao.innerHTML = '<a class="btn-principal btn-wa" href="' + esc(CFG.linkWhatsapp) + '" target="_blank" rel="noopener" id="btn-principal">Ir para o WhatsApp</a>' +
        '<a class="link-sec" href="' + esc(CFG.linkConhecerMais || "../../aulas/virtologia/") + '">Quero conhecer mais antes de decidir</a>';
      acao.hidden = false;
      $("#btn-principal").addEventListener("click", function () {
        fbCustom("WhatsAppClick", { content_name: "Formação em Virtologia" });
        ga("whatsapp_click", { pagina: "formacao_interesse" });
      });
    } else if (t.pergunta) {
      var resp = st.r[t.pergunta];
      acao.innerHTML = '<button type="button" class="btn-principal" id="btn-principal"' + (resp ? "" : " disabled") + ">Continuar</button>";
      acao.hidden = false;
    } else {
      acao.innerHTML = '<button type="button" class="btn-principal" id="btn-principal">' + esc(t.botao) + "</button>";
      acao.hidden = false;
    }

    var btn = $("#btn-principal");
    if (btn && btn.tagName === "BUTTON") {
      btn.addEventListener("click", function () {
        if (t.enviar) return enviar();
        if (t.aoAvancar) t.aoAvancar();
        ir(st.etapa + 1, true);
      });
    }

    /* respostas: tocar já marca e segue */
    $$(".opcao", palco).forEach(function (o) {
      o.addEventListener("click", function () {
        var campo = o.getAttribute("data-campo");
        st.r[campo] = o.getAttribute("data-valor"); salvar();
        $$(".opcao", palco).forEach(function (x) { x.setAttribute("aria-checked", String(x === o)); });
        if (btn) btn.disabled = false;
        ga("quiz_resposta", { pergunta: campo, resposta: st.r[campo] });
        setTimeout(function () { if (TELAS[st.etapa] === nome) ir(st.etapa + 1, true); }, 260);
      });
    });

    var form = $("#form");
    if (form) {
      form.addEventListener("input", guardarDados);
      form.addEventListener("change", guardarDados);
      form.addEventListener("submit", function (e) { e.preventDefault(); enviar(); });
    }

    var tit = $("#tit");
    if (tit) { try { tit.focus({ preventScroll: true }); } catch (e) {} }
  }

  /* voltar: usa o histórico do navegador quando a etapa foi aberta nesta visita,
     para o botão "voltar" do celular também funcionar */
  var empilhados = 0;
  voltar.addEventListener("click", function () {
    if (st.etapa <= 0) return;
    if (empilhados > 0) { history.back(); return; }
    ir(st.etapa - 1, false);
    try { history.replaceState({ fi: st.etapa }, ""); } catch (e) {}
  });
  window.addEventListener("popstate", function (e) {
    if (empilhados > 0) empilhados--;
    var n = e.state && typeof e.state.fi === "number" ? e.state.fi : 0;
    ir(n, false);
  });

  /* ---------- envio ---------- */
  function soDigitos(t) { return String(t || "").replace(/\D/g, ""); }
  function normalizarTelefone(t) {
    var bruto = String(t || "").trim(), d = soDigitos(bruto);
    if (!d) return "";
    if (bruto.charAt(0) === "+") return d;
    if (d.length >= 12 && d.indexOf("55") === 0) return d;
    if (d.length === 10 || d.length === 11) return "55" + d;
    return d;
  }
  function telefoneValido(t) {
    var bruto = String(t || "").trim(), n = normalizarTelefone(t);
    if (bruto.charAt(0) === "+" && n.indexOf("55") !== 0) return n.length >= 8 && n.length <= 15;
    return /^55[1-9][0-9](9[0-9]{8}|[2-8][0-9]{7})$/.test(n);
  }
  function chaveIdem() {
    var k; try { k = localStorage.getItem("formacao_interesse_idem"); } catch (e) {}
    if (!k) { k = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ("k" + Date.now() + Math.random().toString(16).slice(2)); try { localStorage.setItem("formacao_interesse_idem", k); } catch (e) {} }
    return k;
  }

  var enviando = false;
  function enviar() {
    if (enviando) return;
    guardarDados();
    var nome = st.nome.trim().replace(/\s+/g, " "), ok = true;
    $("#e-nome").textContent = ""; $("#e-tel").textContent = ""; $("#e-envio").textContent = "";
    $("#f-nome").removeAttribute("aria-invalid"); $("#f-tel").removeAttribute("aria-invalid");
    if (nome.length < 2 || !/[A-Za-zÀ-ÿ]/.test(nome)) { $("#e-nome").textContent = "Informe seu nome."; $("#f-nome").setAttribute("aria-invalid", "true"); ok = false; }
    if (!telefoneValido(st.tel)) { $("#e-tel").textContent = "Informe um WhatsApp válido, com DDD."; $("#f-tel").setAttribute("aria-invalid", "true"); ok = false; }
    if (!ok) { var inv = $('[aria-invalid="true"]'); if (inv) inv.focus(); return; }
    if ($("#f-site").value) return; /* robô */
    var p = primeiraPendente(); if (p !== null) { ir(p, true); return; }
    if (!CFG.envioAtivo || !CFG.endpoint) { $("#e-envio").textContent = "O envio ainda não está ativo nesta página. Fale com a equipe pelo WhatsApp."; return; }

    var origem = (window.IVOrigem && window.IVOrigem.ler) ? window.IVOrigem.ler() : {};
    var corpo = {
      nome: nome,
      telefone_original: st.tel.trim(),
      area_atuacao: st.r.area,
      objetivo_profissional: st.r.objetivo,
      conhecimento_virtologia: st.r.conhecimento,
      aceite_novidades: !!st.novidades,
      versao_aviso: CFG.versaoAviso,
      pagina_url: location.href.split("#")[0],
      referencia_origem: origem.referencia_origem || document.referrer || null,
      chave_idempotencia: chaveIdem(),
      site: ""
    };
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "campaign_id", "adset_id", "ad_id", "fbclid"].forEach(function (k) { corpo[k] = origem[k] || null; });

    enviando = true;
    var btn = $("#btn-principal"), rot = btn.textContent;
    btn.disabled = true; btn.setAttribute("aria-busy", "true"); btn.textContent = "Enviando...";

    fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, d: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.d || !res.d.ok || !res.d.codigo) throw new Error("falha");
        st.codigo = res.d.codigo; salvar();
        if (umaVez("fi_lead_" + st.codigo)) {
          try { if (window.fbq) fbq("track", "Lead", { content_name: "Formação em Virtologia", content_category: "formacao_virtologia" }, { eventID: st.codigo }); } catch (e) {}
          ga("generate_lead", { pagina: "formacao_interesse", trilha: "virtologia" });
        }
        enviando = false;
        try { history.replaceState({ fi: 9 }, ""); } catch (e) {}
        st.etapa = 9; salvar(); desenhar(1);
      })
      .catch(function () {
        enviando = false;
        btn.disabled = false; btn.removeAttribute("aria-busy"); btn.textContent = rot;
        $("#e-envio").textContent = "Não conseguimos registrar agora. Seus dados continuam aqui: tente novamente em instantes.";
      });
  }

  /* ---------- início ---------- */
  st.etapa = permitida(st.etapa || 0);
  try { history.replaceState({ fi: st.etapa }, ""); } catch (e) {}
  desenhar(1);
})();
