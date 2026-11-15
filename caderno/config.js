/* =====================================================================
   CADERNO DE EXERCÍCIOS (/caderno/) - o que pode mudar sem mexer no código
   ===================================================================== */
window.CADERNO_CONFIG = {
  /* Função do Supabase que grava o contato (projeto geyegibuqyzwjrlgenoz). */
  endpoint: "https://geyegibuqyzwjrlgenoz.supabase.co/functions/v1/caderno-lead",

  /* O PDF. O nome do arquivo não aparece na página antes do cadastro. */
  arquivo: "arquivo/exercicios-neuroplasticidade-8-virtudes-x7k2.pdf",
  nomeDownload: "Exercicios de neuroplasticidade - 8 virtudes iniciais.pdf",

  /* Se a gravação falhar (internet, Supabase fora), libera o download mesmo assim.
     Troque para false se preferir só liberar com o contato gravado. */
  liberarSeFalhar: true,

  /* WhatsApp para quem quer saber mais sobre a Formação. */
  linkWhatsapp: "https://api.whatsapp.com/send/?phone=5511965419449&text=Ol%C3%A1%21+Vim+da+p%C3%A1gina+do+caderno+de+exerc%C3%ADcios+e+quero+saber+mais+sobre+a+Forma%C3%A7%C3%A3o+em+Virtologia&type=phone_number&app_absent=0",

  versaoAviso: "caderno-2026-11-v1"
};
