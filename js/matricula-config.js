/* ============================================================
   MATRÍCULA - CONFIGURAÇÃO CENTRAL
   Fonte de verdade do FRONTEND apenas para EXIBIÇÃO.
   Quem decide preço, bolsa e checkout de verdade é o backend
   (Supabase Edge Function). Ver supabase/funcoes/matricula.
   ============================================================ */
window.MATRICULA_CONFIG = {

  /* Endpoint da Edge Function do Supabase.
     >>> SUBSTITUIR pelo endereço real do seu projeto. <<<
     Formato: https://SEU-PROJETO.supabase.co/functions/v1/matricula */
  endpoint: "https://uytprfvsvapblmbijmnz.supabase.co/functions/v1/matricula",

  /* WhatsApp de suporte (mesmo número já usado na página) */
  whatsapp: "5511965419449",

  /* Identifica de qual página veio o lead. Sobrescrito em cada página. */
  paginaOrigem: "pos_sistemas",

  /* Versão da página, para comparar testes no futuro */
  versaoPagina: "v9b",

  /* Mostrar o aviso de comprovação da categoria.
     Só ligar quando a política estiver definida oficialmente. */
  EXIGIR_COMPROVACAO_BOLSA: false,

  /* ---- Segmentos profissionais ---- */
  segmentos: [
    { valor: "setor_publico",
      rotulo: "Sou servidor(a) ou empregado(a) público(a), em qualquer área" },
    { valor: "enfermagem_fora_setor_publico",
      rotulo: "Enfermagem fora do setor público" },
    { valor: "servico_social_fora_setor_publico",
      rotulo: "Serviço Social fora do setor público" },
    { valor: "saude_fora_setor_publico",
      rotulo: "Psicologia, terapia ou outras áreas da saúde fora do setor público" },
    { valor: "gestao_fora_setor_publico",
      rotulo: "RH, gestão, liderança ou consultoria fora do setor público" },
    { valor: "profissional_liberal_outra_area",
      rotulo: "Profissional liberal ou autônomo em outra área" },
    { valor: "outra_area_fora_setor_publico",
      rotulo: "Outra área profissional fora do setor público" }
  ],

  /* ---- Ofertas (espelho do backend, só para exibir) ---- */
  ofertas: {
    regular_avista:        { rotulo: "À vista",          destaque: "R$ 6.500",          detalhe: "Pix, boleto ou cartão em 1x",  total: null },
    regular_cartao_12x:    { rotulo: "Cartão parcelado", destaque: "12x de R$ 650",     detalhe: "no cartão de crédito",         total: "Total: R$ 7.800" },
    regular_recorrente_12x:{ rotulo: "Plano recorrente", destaque: "12 mensalidades de R$ 690", detalhe: "cobrança mês a mês",   total: "Total: R$ 8.280" },
    bolsa_avista:          { rotulo: "À vista",          destaque: "R$ 2.500",          detalhe: "Pix, boleto ou cartão em 1x",  total: null },
    bolsa_cartao_12x:      { rotulo: "Cartão parcelado", destaque: "12x de R$ 250",     detalhe: "no cartão de crédito",         total: "Total: R$ 3.000" },
    bolsa_recorrente_12x:  { rotulo: "Plano recorrente", destaque: "12 mensalidades de R$ 290", detalhe: "cobrança mês a mês",   total: "Total: R$ 3.480" }
  },

  /* Âncora mostrada apenas a quem tem bolsa */
  ancoraRegular: "R$ 6.500 à vista",
  ancoraBolsa:   "R$ 2.500 à vista"
};
