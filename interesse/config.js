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

  /* Mensagem de quem preencheu pelo pop-up da página da Formação (/formacao/).
     Quem preenche direto em /formacao/interesse/ continua com a mensagem acima. */
  linkWhatsappPaginaFormacao: "https://api.whatsapp.com/send/?phone=5511965419449&text=Ol%C3%A1%21+Vim+da+p%C3%A1gina+da+Forma%C3%A7%C3%A3o+em+Virtologia+e+quero+saber+mais+sobre+o+curso&type=phone_number&app_absent=0",

  /* Acrescenta no fim da mensagem do WhatsApp de onde a pessoa veio e o código
     do cadastro: "(Cheguei pela aula gravada · código VF-ABC123)".
     Se a IA do WhatsApp deixar de reconhecer a mensagem, troque para false. */
  origemNaMensagem: true,

  /* Depois de enviar o formulário, o WhatsApp abre sozinho, com a mensagem pronta.
     O botão "Ir para o WhatsApp" continua na tela, para quem fechar sem querer.
     Com false, volta ao jeito antigo: o WhatsApp só abre pelo botão. */
  abrirWhatsappSozinho: true,

  /* Black Friday: quem chegou por anúncio (ou por link com "black" no utm_campaign)
     leva a marca no fim da mensagem do WhatsApp:
     "(Cheguei por um anúncio · Black Friday · código VF-ABC123)".
     "ate" é o fim do dia 30/11 no horário de Brasília; depois disso a marca some sozinha. */
  blackFriday: { marca: "Black Friday", ate: "2026-12-01T00:00:00-03:00" },

  /* Link secundário da última tela. */
  linkConhecerMais: "../../aulas/virtologia/",

  /* Mude se o texto de autorização de contato mudar. */
  versaoAviso: "interesse-formacao-2026-11-v1"
};
