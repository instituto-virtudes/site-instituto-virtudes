/* Monta o carrossel de depoimentos em <div class="dc" data-depoimentos></div>.
   Dados: window.DEPOIMENTOS_VIRTOLOGIA (js/depoimentos-dados.js). */
(function () {
  var dados = window.DEPOIMENTOS_VIRTOLOGIA || [];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function inicial(n) { var m = String(n).replace(/[^A-Za-zÀ-ú]/g, ""); return (m.charAt(0) || "?").toUpperCase(); }
  document.querySelectorAll("[data-depoimentos]").forEach(function (caixa, k) {
    if (!dados.length) { caixa.remove(); return; }
    var id = "dc-trilho-" + k;
    caixa.innerHTML =
      '<div class="dc-cab"><span class="dc-cont" aria-live="polite"></span>' +
      '<div class="dc-setas"><button type="button" class="dc-seta" data-dir="-1" aria-controls="' + id + '" aria-label="Depoimentos anteriores">&larr;</button>' +
      '<button type="button" class="dc-seta" data-dir="1" aria-controls="' + id + '" aria-label="Próximos depoimentos">&rarr;</button></div></div>' +
      '<ul class="dc-trilho" id="' + id + '" tabindex="0" aria-label="Depoimentos: use as setas ou arraste para o lado">' +
      dados.map(function (d, i) {
        return '<li class="dc-item"><figure class="dc-card">' +
          (d.tags && d.tags.length ? '<ul class="dc-tags" aria-label="Virtudes trabalhadas">' + d.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") +
          '<blockquote class="dc-texto">' + d.texto.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</blockquote>" +
          (d.nota ? '<p class="dc-nota">' + esc(d.nota) + "</p>" : "") +
          '<button type="button" class="dc-mais" hidden aria-expanded="false">Ler completo</button>' +
          '<figcaption class="dc-quem"><span class="dc-av" aria-hidden="true">' + inicial(d.nome) + "</span><span><b>" + esc(d.nome) + "</b><small>" + esc(d.info) + "</small></span></figcaption>" +
          "</figure></li>";
      }).join("") + "</ul>" +
      '<p class="dc-dica" aria-hidden="true">Arraste para o lado ou use as setas</p>';
    var trilho = caixa.querySelector(".dc-trilho"), itens = caixa.querySelectorAll(".dc-item"),
        setas = caixa.querySelectorAll(".dc-seta"), cont = caixa.querySelector(".dc-cont");
    function porVez() { var w = itens[0].getBoundingClientRect().width; return Math.max(1, Math.round((trilho.clientWidth + 16) / (w + 16))); }
    function passo() { return itens[0].getBoundingClientRect().width + parseFloat(getComputedStyle(trilho).columnGap || 16); }
    function estado() {
      var max = trilho.scrollWidth - trilho.clientWidth - 2, n = porVez();
      var ini = Math.round(trilho.scrollLeft / passo()) + 1, fim = Math.min(dados.length, ini + n - 1);
      cont.textContent = (n > 1 ? ini + "-" + fim : ini) + " de " + dados.length;
      setas[0].disabled = trilho.scrollLeft <= 2; setas[1].disabled = trilho.scrollLeft >= max;
    }
    function clampTextos() {
      caixa.querySelectorAll(".dc-card").forEach(function (c) {
        var t = c.querySelector(".dc-texto"), b = c.querySelector(".dc-mais"), nota = c.querySelector(".dc-nota");
        if (c.classList.contains("aberto")) return;
        var corta = t.scrollHeight > t.clientHeight + 2; t.classList.toggle("corta", corta); b.hidden = !(corta || nota);
      });
    }
    setas.forEach(function (b) { b.addEventListener("click", function () { trilho.scrollBy({ left: +b.getAttribute("data-dir") * passo() * porVez(), behavior: "smooth" }); }); });
    trilho.addEventListener("scroll", function () { window.requestAnimationFrame(estado); }, { passive: true });
    trilho.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { trilho.scrollBy({ left: passo(), behavior: "smooth" }); e.preventDefault(); }
      if (e.key === "ArrowLeft") { trilho.scrollBy({ left: -passo(), behavior: "smooth" }); e.preventDefault(); }
    });
    caixa.addEventListener("click", function (e) {
      var b = e.target.closest(".dc-mais"); if (!b) return;
      var c = b.closest(".dc-card"), aberto = c.classList.toggle("aberto");
      b.textContent = aberto ? "Ler menos" : "Ler completo"; b.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    window.addEventListener("resize", function () { estado(); clampTextos(); });
    estado(); clampTextos();
  });
})();
