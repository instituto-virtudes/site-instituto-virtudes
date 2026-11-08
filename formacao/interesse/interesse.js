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

  /* aberto como pop-up dentro da página da Formação (?embed=1) */
  var EMBED = /[?&]embed=1/.test(location.search);
  if (EMBED) {
    document.documentElement.classList.add("embed");
    var mc = document.querySelector(".marca"); if (mc) mc.removeAttribute("href");
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { try { parent.postMessage({ tipo: "fechar-preinscricao" }, location.origin); } catch (x) {} }
    });
  }

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
  var TELAS = ["intro", "p_area", "v_cerebro", "p_objetivo", "v_personalidade", "v_aparelho", "p_conhecimento", "v_mandatos", "v_mais", "dados", "fim"];
  var I = function (nome) { return TELAS.indexOf(nome); };
  var PERGUNTA = { p_area: "area", p_objetivo: "objetivo", p_conhecimento: "conhecimento" };

  function opcoes(campo) {
    return '<div class="opcoes" role="radiogroup" aria-labelledby="tit">' + OP[campo].map(function (o) {
      var sel = st.r[campo] === o[0];
      return '<button type="button" class="opcao" role="radio" aria-checked="' + sel + '" data-campo="' + campo + '" data-valor="' + o[0] + '"><span class="marcador" aria-hidden="true"></span><span>' + esc(o[1]) + "</span></button>";
    }).join("") + "</div>";
  }

  var FASES = [
    ["Intrauterino", "concepção"], ["Oral", "0-1"], ["Anal", "1-3"], ["Fálica-genital", "3-6"], ["Latência", "6-9"],
    ["Transição", "9-11"], ["Adolescência inicial", "11-13"], ["Adolescência média", "13-15"], ["Adolescência tardia", "15-17"],
    ["Limiar adulto", "17-19"], ["Independência", "19-24"], ["Consolidação", "24-28"], ["Vida adulta plena", "28-30"],
    ["Realização", "30-35"], ["Maturidade", "35-40"], ["Generatividade", "40-50"], ["Transição", "50-60"],
    ["Integridade", "60-70"], ["Sabedoria", "70-80"], ["Plenitude", "80-90"], ["Unidade", "90-100"]
  ];

  /* esquema do cérebro em corte (posições aproximadas, só para localizar) */
  var CEREBRO =
    '<svg class="cerebro" viewBox="34 26 344 272" role="img" aria-label="Esquema do cérebro em corte, com as regiões do SNO e do SNE numeradas">' +
      '<path class="c-cortex" d="M62,168 C40,118 72,58 142,44 C204,30 284,40 322,76 C356,106 362,150 342,180 C330,196 310,202 288,198 C268,204 250,214 226,214 C202,214 186,205 170,210 C150,218 120,222 100,212 C80,204 67,190 62,168 Z"/>' +
      '<ellipse class="c-cerebelo" cx="292" cy="222" rx="44" ry="25"/>' +
      '<path class="c-tronco" d="M226,205 C231,236 235,262 237,292 L259,292 C259,263 256,236 252,205 Z"/>' +
      '<path class="c-calo" d="M128,142 C168,104 252,98 288,136"/>' +
      [[1,96,92,"reg"],[2,112,138,"dois"],[3,96,176,"sne"],[4,152,124,"dois"],[5,176,174,"sno"],[6,256,108,"sno"],[7,300,140,"dois"],[8,198,198,"sne"],[9,236,206,"sne"],[10,248,262,"orig"]]
        .map(function (r) { return '<g class="c-ponto r-' + r[3] + '"><circle cx="' + r[1] + '" cy="' + r[2] + '" r="11"/><text x="' + r[1] + '" y="' + (r[2] + 4) + '">' + r[0] + "</text></g>"; }).join("") +
      '<text class="c-rot" x="40" y="44">frente</text>' +
    "</svg>";


  function tela(nome) {
    switch (nome) {

      case "intro": return {
        html:
          '<p class="kicker">Pré-inscrição</p>' +
          '<h1 id="tit" tabindex="-1">Formação em Virtologia</h1>' +
          '<p class="sub">Um curso para se formar com o Dr. Eduardo Casarotto e aprender tudo o que ele sabe sobre tratamento terapêutico. Preencha a pré-inscrição para receber todas as informações.</p>' +
          '<p class="rotulo">Nossos alunos são profissionais que trabalham com:</p>' +
          '<ul class="profissoes"><li>Psicologia</li><li>Psiquiatria</li><li>Psicanálise</li><li>Terapias</li><li>Nutrição</li><li>Desenvolvimento de pessoas</li><li>Coaching</li></ul>' +
          '<p class="quem">E qualquer pessoa que queira aprender a fundo como o ser humano funciona e como transformá-lo, psicológica e neurologicamente, para que se torne mais funcional e saudável mentalmente.</p>' +
          '<p class="rotulo">Como funciona</p>' +
          '<ul class="como">' +
            '<li><strong>60 horas</strong><span>de aulas, 100% online</span></li>' +
            '<li><strong>Tudo liberado</strong><span>de uma vez, para assistir no seu tempo</span></li>' +
            '<li><strong>Aula mensal ao vivo</strong><span>com o Dr. Eduardo Casarotto</span></li>' +
            '<li><strong>Tira-dúvidas semanal</strong><span>em grupo, no Google Meet, com nossos especialistas</span></li>' +
            '<li><strong>Grupos de estudo</strong><span>criados pelos alunos mais experientes</span></li>' +
            '<li><strong>1 ano de acesso</strong><span>à plataforma</span></li>' +
          "</ul>",
        botao: "Seguir para pré-inscrição",
        aoAvancar: function () { if (umaVez("fi_quiz_iniciado")) { fbCustom("QuizStarted", { content_name: "Formação em Virtologia" }); ga("quiz_iniciado", { pagina: "formacao_interesse" }); } }
      };

      case "p_area": return {
        html: '<p class="kicker">Pergunta 1 de 3</p><h2 id="tit" tabindex="-1">Em qual dessas áreas você atua ou pretende atuar?</h2>' + opcoes("area"),
        pergunta: "area"
      };

      case "v_cerebro": return {
        html:
          '<p class="kicker">O ser humano pela Virtologia</p>' +
          '<h2 id="tit" tabindex="-1">O orgulho e o egoísmo têm endereço no cérebro</h2>' +
          '<p class="legenda-topo">Dois sistemas: o <b class="t-sno">SNO</b>, do orgulho, calcula a minha posição. O <b class="t-sne">SNE</b>, do egoísmo, calcula a minha vantagem.</p>' +
          CEREBRO +
          '<ol class="regioes">' +
            '<li><i class="r-reg">1</i>Pré-frontal dorsolateral</li>' +
            '<li><i class="r-dois">2</i>Pré-frontal medial</li>' +
            '<li><i class="r-sne">3</i>Pré-frontal ventromedial</li>' +
            '<li><i class="r-dois">4</i>Cingulado anterior e ínsula</li>' +
            '<li><i class="r-sno">5</i>Estriado ventral</li>' +
            '<li><i class="r-sno">6</i>Cingulado posterior</li>' +
            '<li><i class="r-dois">7</i>Junção temporoparietal</li>' +
            '<li><i class="r-sne">8</i>Amígdala</li>' +
            '<li><i class="r-sne">9</i>Área tegmental ventral</li>' +
            '<li><i class="r-orig">10</i>Tronco cerebral</li>' +
          "</ol>" +
          '<p class="chave"><i class="r-sno"></i>SNO <i class="r-sne"></i>SNE <i class="r-dois"></i>os dois <i class="r-reg"></i>regulador <i class="r-orig"></i>origem</p>',
        botao: "Continuar"
      };

      case "p_objetivo": return {
        html: '<p class="kicker">Pergunta 2 de 3</p><h2 id="tit" tabindex="-1">O que você mais gostaria de conseguir fazer com uma formação como essa?</h2>' + opcoes("objetivo"),
        pergunta: "objetivo"
      };

      case "v_personalidade": return {
        html:
          '<p class="kicker">O ser humano pela Virtologia</p>' +
          '<h2 id="tit" tabindex="-1">A personalidade tem cinco partes</h2>' +
          '<div class="equacao">' +
            '<p class="eq-res">Personalidade</p>' +
            '<p class="eq-igual">=</p>' +
            '<ul class="eq-partes">' +
              '<li><strong>Identidade</strong></li>' +
              '<li><strong>Caráter</strong></li>' +
              '<li><strong>Temperamento</strong><span>12 campos</span></li>' +
              '<li><strong>Virtudes</strong><span>33 virtudes</span></li>' +
              '<li><strong>Psique</strong><span>aparelho psíquico</span></li>' +
            "</ul>" +
          "</div>" +
          '<p class="legenda">Cada pessoa tem a sua composição. É ela que explica por que duas pessoas, na mesma situação, reagem de jeitos tão diferentes.</p>',
        botao: "Continuar"
      };

      case "v_aparelho": return {
        html:
          '<p class="kicker">O ser humano pela Virtologia</p>' +
          '<h2 id="tit" tabindex="-1">O aparelho psíquico</h2>' +
          '<figure class="figura-livro"><img src="../../img/virtologia/aparelho-psiquico.webp" alt="Diagrama do aparelho psíquico na Virtologia, com Tanque, Memória, Persona, Ego, Self, Superego, Instintos, Defesas, Condicionamentos, Complexo, Holofote, Transcendência, Interferência e IC." width="900" height="1163"><figcaption>Fundamentos da Virtologia, terceira edição</figcaption></figure>' +
          '<p class="legenda">Tanque, Holofote, Complexo, Persona, Self, Transcendência... Cada parte tem uma função, e todas aparecem no comportamento de uma pessoa.</p>',
        botao: "Continuar"
      };

      case "p_conhecimento": return {
        html: '<p class="kicker">Pergunta 3 de 3</p><h2 id="tit" tabindex="-1">Antes de conhecer esta Formação, quanto você já sabia sobre Virtologia?</h2>' + opcoes("conhecimento"),
        pergunta: "conhecimento"
      };

      case "v_mandatos": return {
        html:
          '<p class="kicker">O ser humano pela Virtologia</p>' +
          '<h2 id="tit" tabindex="-1">Cada idade da vida tem um mandato</h2>' +
          '<p class="legenda-topo">A experiência que o cérebro precisa atravessar naquela fase para a personalidade se construir. São 21 fases, do útero à longevidade:</p>' +
          '<ol class="fases">' + FASES.map(function (f) { return "<li><strong>" + esc(f[0]) + "</strong><span>" + esc(f[1]) + "</span></li>"; }).join("") + "</ol>" +
          '<p class="rotulo">Cada mandato pode ser:</p>' +
          '<ul class="desfechos"><li class="d-bem">Bem vivido</li><li class="d-nao">Não vivido</li><li class="d-mal">Mal vivido</li></ul>',
        botao: "Continuar"
      };

      case "v_mais": return {
        html:
          '<p class="kicker">O ser humano pela Virtologia</p>' +
          '<h2 id="tit" tabindex="-1">E isso é só uma parte</h2>' +
          '<p class="legenda-topo">A Virtologia ainda lê o ser humano por:</p>' +
          '<ul class="mosaico">' +
            '<li><strong>7</strong>Faixas de Evolução neurológica</li>' +
            '<li><strong>51</strong>necessidades humanas</li>' +
            '<li><strong>33</strong>virtudes</li>' +
            '<li><strong>12</strong>campos do temperamento</li>' +
            '<li><strong>SNO</strong>e <strong class="in">SNE</strong> e seus cálculos</li>' +
            '<li><strong>21</strong>fases e seus mandatos</li>' +
          "</ul>" +
          '<p class="formula-lf"><span>A Lei do Fluxo</span>PRF = E × I × PS × FA × PO × LV</p>' +
          '<div class="quadro">' +
            '<p><span>Livro ou aula</span>Conhecer as ideias.</p>' +
            '<p class="forte"><span>Formação</span>A arquitetura completa e suas aplicações. Inclui o livro.</p>' +
          "</div>" +
          '<p class="aviso">Formação oferecida atualmente como curso livre. A aplicação profissional deve respeitar as atribuições, a formação prévia e os limites legais de cada profissão.</p>',
        botao: "Continuar"
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
    if (!st.r.area) return I("p_area");
    if (!st.r.objetivo) return I("p_objetivo");
    if (!st.r.conhecimento) return I("p_conhecimento");
    return null;
  }
  function permitida(n) {
    if (n >= I("fim") && !st.codigo) return I("dados");
    var p = primeiraPendente();
    if (p !== null && n > p) return p;
    return n;
  }

  function ir(n, empilhar) {
    n = permitida(Math.max(0, Math.min(TELAS.length - 1, n)));
    var dir = n >= st.etapa ? 1 : -1;
    st.etapa = n; salvar();
    if (empilhar && !EMBED) { try { history.pushState({ fi: n }, ""); empilhados++; } catch (e) {} }
    desenhar(dir);
    if (n > 0 && n < I("fim")) ga("quiz_etapa", { etapa: TELAS[n] });
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
      var wpp = (EMBED && CFG.linkWhatsappPaginaFormacao) || CFG.linkWhatsapp;
      if (CFG.origemNaMensagem !== false && window.IVOrigem && IVOrigem.comOrigem) wpp = IVOrigem.comOrigem(wpp, st.codigo ? "código " + st.codigo : "");
      acao.innerHTML = '<a class="btn-principal btn-wa" href="' + esc(wpp) + '" target="_blank" rel="noopener" id="btn-principal">Ir para o WhatsApp</a>' +
        '<a class="link-sec" href="' + esc(CFG.linkConhecerMais || "../../aulas/virtologia/") + '"' + (EMBED ? ' target="_top"' : "") + '>Quero conhecer mais antes de decidir</a>';
      acao.hidden = false;
      $("#btn-principal").addEventListener("click", function () {
        var canal = window.IVOrigem && IVOrigem.canalAtual ? IVOrigem.canalAtual() : "";
        fbCustom("WhatsAppClick", { content_name: "Formação em Virtologia", canal: canal });
        ga("whatsapp_click", { pagina: "formacao_interesse", canal: canal, popup: EMBED ? "sim" : "nao" });
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
    /* canal guardado por 90 dias: primeiro e último contato e pontos importantes */
    if (window.IVOrigem && IVOrigem.toques) {
      var tq = IVOrigem.toques();
      corpo.canal_origem = IVOrigem.resumoCanal();
      corpo.primeiro_contato = tq.primeiro || null;
      corpo.ultimo_contato = tq.ultimo || null;
      corpo.pontos_contato = tq.pontos || null;
    }
    corpo.via_popup = EMBED;

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
        try { history.replaceState({ fi: I("fim") }, ""); } catch (e) {}
        st.etapa = I("fim"); salvar(); desenhar(1);
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
