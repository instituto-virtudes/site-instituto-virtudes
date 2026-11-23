/* =====================================================================
   /aula1/ - LANDING DAS AULAS ABERTAS DE VIRTOLOGIA
   O cadastro (o mesmo formulário das aulas ao vivo, aulas/inscricao.js)
   mostra dois passos: 1) entrar no grupo das aulas ao vivo de Virtologia
   e 2) acessar as aulas, na página /aulas/acesso/, onde as duas aulas
   ficam abertas. A inscrição vai para a aula ao vivo anunciada em
   aulas/config.js (hoje, "virtologia-proxima", sem tema e sem data).

   O cadastro fica guardado no navegador (localStorage): quem volta vê os
   dois passos, sem preencher de novo. Para ver o formulário outra vez
   (por exemplo, para testar), abra /aula1/?formulario

   Se o formulário não puder receber inscrições (sem aula configurada,
   envio desligado), a página mostra o caminho para as aulas, para não
   travar ninguém.
   ===================================================================== */
(function () {
  "use strict";
  var CHAVE = "iv_aulas_abertas_virtologia";
  var PAGINA = "aula1";
  var ACESSO = "../aulas/acesso/";
  var html = document.documentElement;
  var IV = window.IVAulas;
  var sit = IV ? IV.situacao("virtologia") : null;
  var cartao = document.getElementById("liberar");
  var caixa = document.getElementById("lp-form");
  var forcarFormulario = /[?&]formulario\b/.test(location.search);
  var api = null;

  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function grupoAtual() {
    var feito = null;
    try { if (sit) feito = sessionStorage.getItem("aula_feita_" + sit.aula.id); } catch (e) {}
    return feito || ler(CHAVE + "_grupo") || (sit && sit.aula.grupoUrl) || "";
  }
  function mostrarGrupo() {
    var link = grupoAtual(), a = document.getElementById("lp-link-grupo"), passo = document.getElementById("lp-passo-grupo");
    if (/^https:\/\/chat\.whatsapp\.com\//.test(link)) a.setAttribute("href", link);
    else if (passo) passo.hidden = true;
  }

  /* com acesso, os cartões das aulas levam à página das aulas */
  function apontarCartoes() {
    Array.prototype.forEach.call(document.querySelectorAll('.au-card[href^="#aula-"]'), function (a) {
      a.setAttribute("href", ACESSO + a.getAttribute("href"));
    });
  }

  function liberar(agora, semCadastro) {
    if (!semCadastro) {
      gravar(CHAVE, "1");
      var g = grupoAtual();
      if (g) gravar(CHAVE + "_grupo", g);
    }
    html.classList.add("aulas-liberadas");
    mostrarGrupo();
    apontarCartoes();
    if (semCadastro) {
      var selo = document.querySelector(".lp-ok-selo"); if (selo) selo.hidden = true;
      document.getElementById("lp-ok-tit").textContent = "As duas aulas estão abertas";
    }
    if (agora) {
      if (IV) IV.evento("aulas_liberadas", { pagina: PAGINA, aula_id: sit ? sit.aula.id : "" });
      var r = cartao.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.5) cartao.scrollIntoView({ behavior: "smooth", block: "start" });
      var t = document.getElementById("lp-ok-tit");
      setTimeout(function () { try { t.focus({ preventScroll: true }); } catch (e) {} }, 350);
    }
  }

  /* próxima aula ao vivo com data: mostra tema e data na lista do topo */
  function mostrarProxima() {
    var el = document.getElementById("lp-proxima");
    if (!el || !sit || (sit.estado !== "futura" && sit.estado !== "acontecendo")) return;
    var D = IV.datas(sit.aula);
    el.innerHTML = sit.estado === "acontecendo"
      ? "<strong>Acontecendo agora:</strong> " + IV.esc(sit.aula.titulo)
      : "<strong>Próxima aula ao vivo:</strong> " + IV.esc(sit.aula.titulo) + " · " + IV.esc(D.semanaCurta) + ", " + IV.esc(D.dia) + ", " + D.hora + " (horário de Brasília)";
    el.hidden = false;
  }

  /* as UTMs reais de quem chega (anúncio, link com UTM) são mantidas;
     sem UTM, a inscrição leva estas, para identificar a página */
  function utmsFixas() {
    var o = (window.IVOrigem && window.IVOrigem.ler) ? window.IVOrigem.ler() : {};
    var tem = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].some(function (k) { return !!o[k]; });
    if (tem) return null;
    return Object.assign({}, (IV && IV.config.utmAulaGravada) || {}, { utm_campaign: PAGINA, utm_content: "landing-aulas" });
  }

  mostrarProxima();
  var semFormulario = !IV || !sit || sit.estado === "encerrada" || !IV.config.envioAtivo || !IV.config.endpoint;

  if (semFormulario) {
    liberar(false, true);
  } else if (ler(CHAVE) === "1" && !forcarFormulario) {
    liberar(false);
  } else {
    if (forcarFormulario) { try { sessionStorage.removeItem("aula_feita_" + sit.aula.id); } catch (e) {} }
    api = IV.montarFormulario(caixa, {
      sit: sit,
      pagina: PAGINA,
      grupo: "botoes",
      utmFixas: utmsFixas(),
      rolarPara: cartao,
      textos: {
        titulo1: "Seus dados de contato",
        texto1: "São três etapas curtas.",
        antesBotao: "Ao clicar no botão abaixo, você recebe o link do grupo das aulas ao vivo de Virtologia e o acesso às duas aulas. É pelo grupo que avisamos as próximas aulas ao vivo e enviamos o link do Zoom.",
        botaoFinal: "Concluir e receber as aulas",
        statusOk: "Inscrição concluída. Siga os dois passos para entrar no grupo e assistir às aulas.",
        sucessoTitulo: "Cadastro concluído",
        sucessoTexto: "Entre no grupo das aulas ao vivo e, depois, acesse as aulas.",
        botaoGrupo: "Entrar no grupo"
      },
      aoConcluir: function () { liberar(true); }
    });
    if (api.jaInscrito()) liberar(false);
  }

  /* passo 1 feito: o número vira um visto */
  var linkGrupo = document.getElementById("lp-link-grupo");
  if (linkGrupo) linkGrupo.addEventListener("click", function () {
    var passo = document.getElementById("lp-passo-grupo");
    if (passo) passo.classList.add("feito");
    if (IV) IV.evento("entrar_grupo", { pagina: PAGINA });
  });
  var linkAulas = document.getElementById("lp-link-aulas");
  if (linkAulas) linkAulas.addEventListener("click", function () {
    if (IV) IV.evento("acessar_aulas", { pagina: PAGINA });
  });

  /* botões "Receber as aulas": levam ao formulário e já põem o cursor no campo */
  Array.prototype.forEach.call(document.querySelectorAll("[data-ir-form]"), function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      if (IV) IV.evento("inscricao_cta", { pagina: PAGINA, origem_botao: b.getAttribute("data-origem") || (b.closest(".lp-player") ? "video" : (b.closest(".lp-final") ? "final" : "passos")) });
      cartao.scrollIntoView({ behavior: "smooth", block: "start" });
      if (api) setTimeout(function () { api.focarPrimeiro(); }, 550);
    });
  });
})();
