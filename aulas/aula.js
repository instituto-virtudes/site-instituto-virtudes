/* =====================================================================
   AULAS AO VIVO - PÁGINA DE INSCRIÇÃO
   Monta a página a partir de aulas/config.js. Cada página só diz a trilha:
   <body data-aula="virtologia">. O formulário vem de aulas/inscricao.js.
   ===================================================================== */
(function () {
  "use strict";
  var IV = window.IVAulas;
  var main = document.getElementById("aula-main");
  if (!IV || !main) return;
  var sit = IV.situacao(document.body.getAttribute("data-aula"));
  if (!sit) return;

  var esc = IV.esc, A = sit.aula, T = sit.trilha, D = IV.datas(A);
  var encerrada = sit.estado === "encerrada", acontecendo = sit.estado === "acontecendo";
  var foto = IV.url(A.foto || A.capa);
  var CTA = "Quero participar da aula ao vivo";

  var ico = {
    vivo: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.2 21 7v10l-5.5-3.2z"/></svg>',
    perg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v10H9.5L5 19.5v-4H4z"/><circle cx="9" cy="10.5" r=".9"/><circle cx="12" cy="10.5" r=".9"/><circle cx="15" cy="10.5" r=".9"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3.7h3.7"/><path d="M12 8.5V12l2.6 1.8"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8.5L19 8v12.5H6z"/><path d="M14.5 3.5V8H19"/><path d="M9 13h6M9 16.5h6"/></svg>'
  };

  var dataHero = acontecendo
    ? '<strong>Acontecendo agora</strong><span>Começou às ' + D.hora + ', horário de Brasília</span>'
    : encerrada
      ? '<strong>Esta aula já aconteceu</strong><span>' + esc(D.semana) + ", " + esc(D.dia) + ", às " + D.hora + '</span>'
      : '<strong>' + esc(D.semanaCurta) + ", " + esc(D.dia) + ' · ' + D.hora + '</strong><span>Horário de Brasília · ao vivo pelo Zoom · ' + D.duracao + '</span>';

  /* topo: o texto é da página; da capa vem só a foto do Eduardo (sem texto) */
  var hero =
    '<section class="ev-hero" style="--ev-cor:' + esc(T.cor) + ';--ev-fundo:' + esc(T.fundo) + '">' +
      '<div class="ev-int">' +
        '<div class="ev-painel">' +
          '<p class="ev-selo"><span class="ev-ponto' + (acontecendo ? " ev-ponto-ativo" : "") + '" aria-hidden="true"></span>Gratuita • ao vivo</p>' +
          '<p class="ev-trilha"><span>' + esc(T.rotulo) + '</span></p>' +
          '<h1>' + esc(A.titulo) + '</h1>' +
          '<p class="ev-sub">' + esc(A.subtitulo) + '</p>' +
          '<p class="ev-data">' + dataHero + '</p>' +
          (encerrada
            ? (T.aulaGravada ? '<a class="ev-cta" href="' + esc(IV.url(T.aulaGravada)) + '">Assistir a uma aula gravada</a>' : "")
            : '<a class="ev-cta" href="#inscricao" data-ir-form id="cta-topo">' + CTA + '</a>' +
              '<p class="ev-perg">' + ico.perg + '<span>Participe ao vivo e faça suas perguntas diretamente ao Eduardo.</span></p>') +
        '</div>' +
        '<figure class="ev-foto"><img src="' + esc(foto) + '" alt="Dr. Eduardo Casarotto" width="587" height="715" fetchpriority="high">' +
          '<figcaption>Com <strong>Dr. Eduardo Casarotto</strong></figcaption></figure>' +
      '</div>' +
    '</section>';

  var beneficios =
    '<section class="ev-recebe"><div class="wrap">' +
      '<h2>O que você recebe ao se inscrever</h2>' +
      '<ul class="ev-ben">' +
        '<li>' + ico.vivo + '<div><strong>Aula ao vivo pelo Zoom</strong><span>' + esc(D.semanaCurta) + ", " + esc(D.dia) + ", às " + D.hora + ". Duração de " + D.duracao + '.</span></div></li>' +
        '<li>' + ico.perg + '<div><strong>Perguntas ao vivo</strong><span>Durante a aula, você pode enviar suas perguntas diretamente ao Eduardo.</span></div></li>' +
        '<li>' + ico.replay + '<div><strong>Replay por 7 dias</strong><span>Se não puder acompanhar tudo ao vivo, a gravação fica disponível por uma semana.</span></div></li>' +
        '<li>' + ico.pdf + '<div><strong>Materiais bônus em PDF</strong><span>Enviados no grupo da aula.</span></div></li>' +
      '</ul>' +
      '<p class="ev-acesso"><strong>Como você recebe o acesso:</strong> ao concluir a inscrição, você segue para o grupo da aula no WhatsApp. O link do Zoom é enviado lá no dia da aula.</p>' +
    '</div></section>';

  /* conteúdo opcional da própria página, mostrado no fim: <template id="aula-extra"> */
  var tpl = document.getElementById("aula-extra");
  var extra = tpl ? tpl.innerHTML : "";

  var conteudo =
    '<section class="ev-conteudo"><div class="wrap ev-duas">' +
      '<div><h2>O que será discutido</h2>' + [].concat(A.apresentacao).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join("") +
        ((A.temas && A.temas.length) ? '<ul class="temas">' + A.temas.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul>' : "") +
        (extra ? '<p class="tm-ver"><a href="#o-que-sera-abordado">Veja um resumo de cada tema mais abaixo</a></p>' : "") + '</div>' +
      '<aside class="ev-quem"><h3>Para quem é esta aula</h3><p>' + esc(T.paraQuem) + '</p>' +
        (encerrada ? "" : '<a class="btn" href="#inscricao" data-ir-form>' + CTA + '</a>') + '</aside>' +
    '</div></section>';

  var professor =
    '<section class="ev-prof-sec"><div class="wrap ev-prof-grade">' +
      '<img src="' + esc(IV.url("img/eduardo-palestra.webp")) + '" alt="Dr. Eduardo Casarotto em palestra." width="853" height="1067" loading="lazy">' +
      '<div><p class="kicker">Quem conduz a aula</p><h2>Dr. Eduardo Casarotto</h2><p>' + esc(T.bio) + '</p></div>' +
    '</div></section>';

  var faq = [
    ["A aula é gratuita?", "Sim. A inscrição e a participação nesta aula são gratuitas."],
    ["Quando e onde acontece?", esc(D.semana) + ", " + esc(D.dia) + " de " + D.ano + ", às " + D.hora + ", horário de Brasília, pelo Zoom. O link é enviado no grupo da aula no dia."],
    ["Quanto tempo dura?", "A duração prevista é de " + D.duracao + "."],
    ["Vou poder fazer perguntas?", "Sim. Durante a aula ao vivo, você pode enviar suas perguntas diretamente ao Eduardo."],
    ["Se eu não conseguir acompanhar ao vivo, haverá replay?", "Sim. O replay ficará disponível por uma semana."],
    ["Como recebo os materiais?", "Os materiais bônus em PDF serão enviados no grupo da aula."],
    ["Preciso ter formação na área para participar?", "Não. A aula é aberta ao público e não exige matrícula em uma formação do Instituto."],
    ["A aula oferece certificado?", "Não. Esta aula aberta não oferece certificado."]
  ].map(function (q) { return "<details><summary>" + q[0] + "</summary><p>" + q[1] + "</p></details>"; }).join("");

  var inscricao =
    '<section id="inscricao" class="inscricao"><div class="wrap estreito">' +
      (encerrada
        ? '<div class="encerrada"><h2>Esta aula já aconteceu</h2><p>As inscrições para a aula de ' + esc(D.curta) + ' foram encerradas.</p>' + (T.aulaGravada ? '<p><a class="btn-sec" href="' + esc(IV.url(T.aulaGravada)) + '">Assistir a uma aula gravada</a></p>' : "") + "</div>"
        : '<h2 class="insc-tit">Inscreva-se gratuitamente</h2>' +
          '<p class="insc-quando"><span class="ev-ponto" aria-hidden="true"></span>' + esc(D.semana) + ", " + esc(D.dia) + ", às " + D.hora + ' (horário de Brasília), ao vivo pelo Zoom.</p>' +
          '<div id="form-box"></div>') +
    '</div></section>';

  main.innerHTML = hero + beneficios + conteudo + professor + inscricao +
    '<section class="faq"><div class="wrap"><h2>Perguntas frequentes</h2>' + faq + '</div></section>' + extra +
    (encerrada ? "" : '<div class="ev-fixo" id="ev-fixo" style="--ev-cor:' + esc(T.cor) + ';--ev-fundo:' + esc(T.fundo) + '"><a href="#inscricao" data-ir-form>' + CTA + '</a><span>' + esc(D.semanaCurta) + ", " + D.curta + " · " + D.hora + '</span></div>');

  if (encerrada) {
    Array.prototype.forEach.call(main.querySelectorAll(".tm-cta"), function (el) { el.parentNode.removeChild(el); });
    return;
  }

  var secao = document.getElementById("inscricao");
  var api = IV.montarFormulario(document.getElementById("form-box"), {
    sit: sit, pagina: "inscricao", grupo: "redirecionar", rolarPara: secao,
    aoComecar: function () { atualizarFixo(); }
  });

  /* CTAs levam ao formulário e põem o cursor no primeiro campo */
  Array.prototype.forEach.call(document.querySelectorAll("[data-ir-form]"), function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      secao.scrollIntoView({ behavior: "smooth", block: "start" });
      IV.evento("inscricao_cta", { aula_id: A.id, trilha: sit.chave, pagina: "inscricao" });
      setTimeout(function () { api.focarPrimeiro(); }, 450);
    });
  });

  /* botão fixo no celular: aparece depois do topo e some perto do formulário
     ou enquanto a pessoa digita */
  var fixo = document.getElementById("ev-fixo");
  var ctaTopoVisivel = true, formVisivel = false, digitando = false;
  function atualizarFixo() {
    var mostrar = !ctaTopoVisivel && !formVisivel && !digitando;
    fixo.classList.toggle("ativo", mostrar);
    document.body.classList.toggle("com-fixo", mostrar);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { ctaTopoVisivel = es[0].isIntersecting; atualizarFixo(); }).observe(document.getElementById("cta-topo"));
    new IntersectionObserver(function (es) { formVisivel = es[0].isIntersecting; atualizarFixo(); }, { rootMargin: "0px 0px -15% 0px" }).observe(secao);
  }
  document.addEventListener("focusin", function (e) { if (e.target.matches && e.target.matches("input,select,textarea")) { digitando = true; atualizarFixo(); } });
  document.addEventListener("focusout", function () { setTimeout(function () { var a = document.activeElement; digitando = !!(a && a.matches && a.matches("input,select,textarea")); atualizarFixo(); }, 50); });
})();
