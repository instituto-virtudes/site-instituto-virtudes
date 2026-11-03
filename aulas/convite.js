/* =====================================================================
   CONVITE PARA A PRÓXIMA AULA AO VIVO (aulas gravadas)
   Na página: <div class="convite-vivo" data-trilha="virtologia" data-pagina="aula1"></div>
   logo abaixo do vídeo. Tema, data, foto e grupo vêm de aulas/config.js.
   O formulário abre dentro do bloco; o vídeo não é tocado.
   Sem próxima aula configurada, o bloco some.
   ===================================================================== */
(function () {
  "use strict";
  var IV = window.IVAulas;
  if (!IV) return;

  Array.prototype.forEach.call(document.querySelectorAll(".convite-vivo[data-trilha]"), function (el) {
    var sit = IV.situacao(el.getAttribute("data-trilha"));
    if (!sit || sit.estado === "encerrada") { el.remove(); return; }

    var esc = IV.esc, A = sit.aula, T = sit.trilha, D = IV.datas(A);
    var pagina = el.getAttribute("data-pagina") || "aula-gravada";
    var foto = IV.url(A.foto || A.capa);
    var quando = sit.estado === "acontecendo"
      ? "<strong>Acontecendo agora</strong> <span>começou às " + D.hora + ", horário de Brasília</span>"
      : "<strong>" + esc(D.semanaCurta) + ", " + esc(D.dia) + " · " + D.hora + "</strong> <span>horário de Brasília</span>";

    el.style.setProperty("--ev-cor", T.cor);
    el.style.setProperty("--ev-fundo", T.fundo);
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Inscrição para a próxima aula ao vivo");
    el.innerHTML =
      '<div class="cv-int">' +
        '<div class="cv-texto">' +
          '<p class="cv-selo"><span class="ev-ponto' + (sit.estado === "acontecendo" ? " ev-ponto-ativo" : "") + '" aria-hidden="true"></span>Gratuita • ao vivo</p>' +
          '<h2 class="cv-tit">Participe da próxima aula ao vivo com Eduardo</h2>' +
          '<p class="cv-tema"><span>' + esc(T.rotulo) + ':</span> ' + esc(A.titulo) + '</p>' +
          '<p class="cv-data">' + quando + '</p>' +
          '<p class="cv-txt">Além de acompanhar o conteúdo, você poderá fazer perguntas ao vivo diretamente ao Eduardo. Inscreva-se gratuitamente para participar.</p>' +
          '<button type="button" class="cv-btn" aria-expanded="false">Quero participar da aula ao vivo</button>' +
          '<p class="cv-apoio">Replay por 7 dias e materiais bônus em PDF.</p>' +
        '</div>' +
        '<figure class="cv-foto"><img src="' + esc(foto) + '" alt="Dr. Eduardo Casarotto" width="587" height="715" loading="lazy"></figure>' +
      '</div>' +
      '<div class="cv-form" hidden></div>';

    var btn = el.querySelector(".cv-btn"), caixa = el.querySelector(".cv-form");
    var utm = Object.assign({}, IV.config.utmAulaGravada || {}, { utm_campaign: pagina });
    var api = null;

    btn.addEventListener("click", function () {
      if (!api) api = IV.montarFormulario(caixa, { sit: sit, pagina: pagina, grupo: "nova-aba", utmFixas: utm, rolarPara: caixa });
      caixa.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      el.classList.add("cv-aberto");
      IV.evento("inscricao_cta", { aula_id: A.id, trilha: sit.chave, pagina: pagina });
      var r = caixa.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.55 || r.top < 0) caixa.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () { api.focarPrimeiro(); }, 400);
    });
  });
})();
