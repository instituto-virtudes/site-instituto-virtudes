/* =====================================================================
   FORMAÇÃO EM VIRTOLOGIA - PÁGINA DE INTERESSE (/formacao/interesse/)
   Tudo o que pode mudar sem mexer no código fica aqui.
   ===================================================================== */
window.INTERESSE_CONFIG = {

  /* Função do Supabase que grava o interessado (projeto geyegibuqyzwjrlgenoz).
     Com "envioAtivo: false" a página não deixa finalizar. */
  endpoint: "https://geyegibuqyzwjrlgenoz.supabase.co/functions/v1/interesse-formacao",
  envioAtivo: true,

  /* Link do botão final (WhatsApp da equipe de matrícula, com a mensagem já escrita).
     Use exatamente o link que o atendimento reconhece. */
  linkWhatsapp: "https://api.whatsapp.com/send/?phone=5511965419449&text=Ol%C3%A1%21+Vim+do+form+do+site+e+quero+saber+mais+sobre+a+Forma%C3%A7%C3%A3o+em+Virtologia&type=phone_number&app_absent=0",

  /* Link secundário da última tela. */
  linkConhecerMais: "../../aulas/virtologia/",

  /* Mude se o texto de autorização de contato mudar. */
  versaoAviso: "interesse-formacao-2026-11-v1"
};
