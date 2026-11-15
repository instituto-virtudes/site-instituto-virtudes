/* =====================================================================
   CADERNO DE EXERCÍCIOS - formulário de download
   Grava o contato no Supabase e libera o PDF. Usa js/origem.js para a
   origem do contato (UTMs e canal guardado por 90 dias).
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.CADERNO_CONFIG || {};
  var form = document.getElementById("cad-form");
  if (!form) return;
  var caixa = document.getElementById("cad-caixa"), aviso = document.getElementById("cad-erro");

  function $(s) { return form.querySelector(s); }
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
  function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "").trim()); }

  // máscara simples do telefone brasileiro
  var tel = $("#cad-tel");
  tel.addEventListener("input", function () {
    var v = tel.value;
    if (v.trim().charAt(0) === "+") return;
    var d = soDigitos(v).slice(0, 11);
    if (d.length > 6) tel.value = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    else if (d.length > 2) tel.value = "(" + d.slice(0, 2) + ") " + d.slice(2);
    else tel.value = d;
  });

  function marcarErro(campo, msg) {
    var bloco = campo.closest(".cad-campo");
    if (bloco) { bloco.classList.add("erro"); var m = bloco.querySelector(".cad-msg"); if (m) m.textContent = msg; }
  }
  function limparErros() {
    Array.prototype.forEach.call(form.querySelectorAll(".cad-campo.erro"), function (b) { b.classList.remove("erro"); var m = b.querySelector(".cad-msg"); if (m) m.textContent = ""; });
    aviso.hidden = true;
  }
  function valorRadio(nome) { var r = form.querySelector('input[name="' + nome + '"]:checked'); return r ? r.value : ""; }

  function chaveIdem() {
    var k; try { k = localStorage.getItem("caderno_idem"); } catch (e) {}
    if (!k) { k = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ("k" + Date.now() + Math.random().toString(16).slice(2)); try { localStorage.setItem("caderno_idem", k); } catch (e) {} }
    return k;
  }

  var enviando = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (enviando) return;
    limparErros();
    var nome = $("#cad-nome").value.trim().replace(/\s+/g, " "), email = $("#cad-email").value.trim().toLowerCase(), telefone = tel.value.trim();
    var area = $("#cad-area").value, quer = valorRadio("formacao");
    var erros = [];
    if (nome.length < 2 || !/[A-Za-zÀ-ú]/.test(nome)) { marcarErro($("#cad-nome"), "Escreva o seu nome."); erros.push($("#cad-nome")); }
    if (!emailValido(email)) { marcarErro($("#cad-email"), "Confira o e-mail."); erros.push($("#cad-email")); }
    if (!telefoneValido(telefone)) { marcarErro(tel, "Confira o número, com DDD."); erros.push(tel); }
    if (!area) { marcarErro($("#cad-area"), "Escolha uma opção."); erros.push($("#cad-area")); }
    if (!quer) { marcarErro(form.querySelector('input[name="formacao"]'), "Escolha uma opção."); erros.push(form.querySelector('input[name="formacao"]')); }
    if (erros.length) { erros[0].focus(); return; }
    if ($("#cad-site").value) return; // armadilha para robôs

    var origem = window.IVOrigem ? IVOrigem.ler() : {};
    var corpo = {
      nome: nome, email: email, telefone_original: telefone, area_atuacao: area,
      interesse_formacao: quer === "sim", aceite_novidades: $("#cad-novidades").checked,
      versao_aviso: CFG.versaoAviso || "", pagina_url: location.href, referencia_origem: document.referrer || "",
      chave_idempotencia: chaveIdem()
    };
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "campaign_id", "adset_id", "ad_id", "fbclid"].forEach(function (k) { corpo[k] = origem[k] || null; });
    if (window.IVOrigem && IVOrigem.toques) {
      var tq = IVOrigem.toques();
      corpo.canal_origem = IVOrigem.resumoCanal();
      corpo.primeiro_contato = tq.primeiro || null; corpo.ultimo_contato = tq.ultimo || null; corpo.pontos_contato = tq.pontos || null;
    }

    var btn = $("#cad-enviar"), rot = btn.textContent;
    enviando = true; btn.disabled = true; btn.textContent = "Enviando...";

    function liberar(codigo) {
      enviando = false;
      try { if (window.fbq) fbq("track", "Lead", { content_name: "Caderno de exercícios", content_category: "caderno" }, codigo ? { eventID: codigo } : undefined); } catch (x) {}
      try { if (window.gtag) gtag("event", "generate_lead", { pagina: "caderno", quer_formacao: quer }); } catch (x) {}
      var wpp = CFG.linkWhatsapp;
      if (window.IVOrigem && IVOrigem.comOrigem) wpp = IVOrigem.comOrigem(wpp, codigo ? "código " + codigo : "");
      caixa.innerHTML =
        '<div class="cad-pronto" tabindex="-1">' +
          '<p class="cad-ok">Pronto, ' + esc(nome.split(" ")[0]) + '!</p>' +
          '<h2>Seu caderno está liberado</h2>' +
          '<p>O download começou. Se não começou, use o botão abaixo.</p>' +
          '<a class="btn cad-baixar" href="' + esc(CFG.arquivo) + '" download="' + esc(CFG.nomeDownload) + '">Baixar o caderno (PDF, 7,9 MB)</a>' +
          (quer === "sim"
            ? '<div class="cad-wpp"><p><strong>Quer falar com a equipe sobre a Formação em Virtologia?</strong></p><a class="btn-sec" href="' + esc(wpp) + '" target="_blank" rel="noopener" data-wpp-clique>Falar no WhatsApp</a></div>'
            : '<p class="cad-dica">Faça uma virtude por vez, por no mínimo 14 dias.</p>') +
        "</div>";
      var p = caixa.querySelector(".cad-pronto");
      if (p) { try { p.focus({ preventScroll: true }); } catch (x) {} var y = caixa.getBoundingClientRect().top + window.pageYOffset - 90; window.scrollTo({ top: y, behavior: "smooth" }); }
      var w = caixa.querySelector("[data-wpp-clique]");
      if (w) w.addEventListener("click", function () { if (window.IVOrigem && IVOrigem.medirWhats) IVOrigem.medirWhats("caderno"); });
      // começa o download
      var a = document.createElement("a"); a.href = CFG.arquivo; a.download = CFG.nomeDownload; document.body.appendChild(a); a.click(); a.remove();
    }

    fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, d: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.d || !res.d.ok) throw new Error("falha");
        liberar(res.d.codigo || "");
      })
      .catch(function () {
        if (CFG.liberarSeFalhar !== false) { liberar(""); return; }
        enviando = false; btn.disabled = false; btn.textContent = rot;
        aviso.hidden = false; aviso.textContent = "Não conseguimos enviar agora. Confira a sua internet e tente de novo.";
      });
  });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
})();
