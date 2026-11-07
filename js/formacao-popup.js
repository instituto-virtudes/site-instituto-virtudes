/* =====================================================================
   FORMAÇÃO EM VIRTOLOGIA - PRÉ-INSCRIÇÃO EM POP-UP
   Na página /formacao/, todo botão que levaria à pré-inscrição ou ao
   WhatsApp abre o formulário de interesse por cima da página, sem sair
   dela. O formulário é o mesmo de /formacao/interesse/ (que continua
   existindo para os outros casos). Sem JavaScript, os links funcionam
   como antes.
   ===================================================================== */
(function () {
  "use strict";
  var URL_FORM = "interesse/?embed=1";
  var SELETOR = 'a[href="interesse/"], a[href$="/formacao/interesse/"], a[href*="wa.me/5511965419449"], a[href*="api.whatsapp.com"], a[href*="wa.me/5564996428026"], a[data-pre-inscricao]';

  var fundo, caixa, quadro, fechar, ultimoFoco, aberto = false;

  function montar() {
    if (fundo) return;
    var css = document.createElement("style");
    css.textContent =
      ".fp-fundo{position:fixed;inset:0;z-index:1000;background:rgba(5,13,20,.62);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .2s ease}" +
      ".fp-fundo[hidden]{display:none}.fp-fundo.on{opacity:1}" +
      ".fp-caixa{position:relative;width:min(560px,100%);height:min(820px,100%);background:#F7F5F0;border-radius:6px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.35);transform:translateY(12px);transition:transform .2s ease}" +
      ".fp-fundo.on .fp-caixa{transform:none}" +
      ".fp-caixa iframe{display:block;width:100%;height:100%;border:0;background:#F7F5F0}" +
      ".fp-fechar{position:absolute;top:8px;right:8px;z-index:2;width:40px;height:40px;border-radius:50%;border:1px solid #D8DEE6;background:#fff;color:#0B2341;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
      ".fp-fechar:focus-visible{outline:2px solid #0B2341;outline-offset:2px}" +
      ".fp-carregando{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#5E6B7D;font:15px 'Avenir Next',Avenir,'Segoe UI',Arial,sans-serif}" +
      "html.fp-travado,html.fp-travado body{overflow:hidden}" +
      "@media (max-width:640px){.fp-fundo{padding:0}.fp-caixa{width:100%;height:100%;height:100dvh;border-radius:0}}" +
      "@media (prefers-reduced-motion:reduce){.fp-fundo,.fp-caixa{transition:none}}";
    document.head.appendChild(css);

    fundo = document.createElement("div");
    fundo.className = "fp-fundo";
    fundo.hidden = true;
    fundo.innerHTML =
      '<div class="fp-caixa" role="dialog" aria-modal="true" aria-label="Pré-inscrição na Formação em Virtologia">' +
        '<button type="button" class="fp-fechar" aria-label="Fechar a pré-inscrição">&times;</button>' +
        '<div class="fp-carregando">Carregando...</div>' +
      "</div>";
    document.body.appendChild(fundo);
    caixa = fundo.querySelector(".fp-caixa");
    fechar = fundo.querySelector(".fp-fechar");
    fechar.addEventListener("click", fecharPopup);
    fundo.addEventListener("click", function (e) { if (e.target === fundo) fecharPopup(); });
    document.addEventListener("keydown", function (e) {
      if (!aberto) return;
      if (e.key === "Escape") { fecharPopup(); return; }
      if (e.key === "Tab") { // mantém o foco dentro do pop-up
        var alvos = [fechar, quadro];
        var i = alvos.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); alvos[alvos.length - 1].focus(); }
        else if (!e.shiftKey && i === alvos.length - 1) { e.preventDefault(); alvos[0].focus(); }
      }
    });
  }

  function abrir(origemBotao) {
    montar();
    ultimoFoco = document.activeElement;
    if (!quadro) {
      quadro = document.createElement("iframe");
      quadro.title = "Pré-inscrição na Formação em Virtologia";
      quadro.src = URL_FORM;
      quadro.addEventListener("load", function () { var c = caixa.querySelector(".fp-carregando"); if (c) c.remove(); });
      caixa.appendChild(quadro);
    }
    fundo.hidden = false;
    document.documentElement.classList.add("fp-travado");
    requestAnimationFrame(function () { fundo.classList.add("on"); });
    aberto = true;
    setTimeout(function () { try { quadro.focus(); } catch (e) {} }, 60);
    try { if (window.gtag) gtag("event", "preinscricao_popup", { botao: origemBotao || "", canal: window.IVOrigem && IVOrigem.canalAtual ? IVOrigem.canalAtual() : "" }); } catch (e) {}
    try { if (window.fbq) fbq("trackCustom", "PreInscricaoAberta", { content_name: "Formação em Virtologia" }); } catch (e) {}
  }

  function fecharPopup() {
    if (!aberto) return;
    aberto = false;
    fundo.classList.remove("on");
    document.documentElement.classList.remove("fp-travado");
    setTimeout(function () { if (!aberto) fundo.hidden = true; }, 200);
    if (ultimoFoco && ultimoFoco.focus) { try { ultimoFoco.focus(); } catch (e) {} }
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest(SELETOR) : null;
    if (!a) return;
    e.preventDefault();
    abrir((a.textContent || "").trim().slice(0, 60));
  });

  window.addEventListener("message", function (e) {
    if (e.origin === location.origin && e.data && e.data.tipo === "fechar-preinscricao") fecharPopup();
  });

  window.IVPreInscricao = { abrir: abrir, fechar: fecharPopup };
})();
