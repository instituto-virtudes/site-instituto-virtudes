/* =====================================================================
   COLEÇÃO ESPECIAL EDUARDO CASAROTTO - CONFIGURAÇÃO CENTRAL
   Tudo o que muda na campanha se altera AQUI, e a página inteira acompanha.
   ===================================================================== */
window.COLECAO = {

  nome: "Coleção Especial Eduardo Casarotto",
  quantidadeLivros: 14,

  /* ---------- preço ---------- */
  precoRegular: 2997.00,       // soma dos preços regulares dos 14 títulos
  precoPreVenda: 1997.00,      // preço da coleção na pré-venda
  freteIncluso: true,

  /* ---------- checkout ----------
     PENDENTE: colar aqui o link oficial do checkout da Greenn.
     Enquanto estiver vazio, os botões aparecem desativados com o aviso
     "Link de compra em configuração". */
  checkoutUrl: "https://payfast.greenn.com.br/201598/offer/H9Vgpc",

  /* nome do produto no checkout enquanto houver autógrafos (aparece na caixa do pedido e no FAQ) */
  nomeProdutoAutografado: "14 Obras | Coleção Especial - Autografada à mão pelo autor",
  formasPagamento: "cartão de crédito (em um ou dois cartões), Pix, boleto e Google Pay",

  /* ---------- campanha ----------
     "auto"      -> abre sozinha na data/hora de "abertura"
     "aberta"    -> vendas abertas agora, ignorando a data
     "encerrada" -> botões desativados e aviso de encerramento */
  statusCampanha: "aberta",
  abertura: "2026-10-31T19:00:00-03:00",   // 19h de Brasília

  /* ---------- autógrafos ----------
     "disponivel" -> mostra a condição dos 100 primeiros
     "encerrado"  -> retira a promessa de autógrafos da página inteira
     A troca é MANUAL: quem acompanha os pedidos com pagamento confirmado
     na Greenn muda para "encerrado" assim que o 100º for confirmado. */
  statusAutografos: "disponivel",
  limiteAutografos: 100,

  /* ---------- informações ainda não definidas ----------
     Deixar "" enquanto não houver informação oficial.
     A página só mostra o que estiver preenchido. */
  dataEnvio: "25 de novembro de 2026",   // data em que os envios começam (aparece em toda a página)
  dataEnvioCurta: "25 de novembro",      // versão curta, usada no topo e na barra do celular
  encerramentoVendas: "", // ex.: "A pré-venda vai até 30 de novembro de 2026."

  /* ---------- suporte ---------- */
  suporte: {
    whatsapp: "5564996428026",
    whatsappTexto: "Olá! Tenho uma dúvida sobre a pré-venda da Coleção Especial Eduardo Casarotto.",
    email: "grupo@institutovirtudes.com.br"
  },

  /* ---------- imagens ---------- */
  imagens: {
    autor: "img/autor.webp",
    autorAlt: "Dr. Eduardo Casarotto em palestra, ao lado de exemplares de seus livros.",
    logoClaro: "img/logo-editora-branco.webp",     // usado sobre fundos escuros
    logoEscuro: "img/logo-editora-colorido.webp",  // usado sobre fundos claros
    compartilhamento: "https://institutovirtudes.com.br/14-obras/img/og-colecao.jpg"
  },

  /* ---------- os 14 livros ----------
     capa: "" -> a página mostra uma capa provisória identificada,
     até o arquivo real ser colocado na pasta img/. */
  grupos: [
    { id: "fundamentos", nome: "Fundamentos e prática da Virtologia" },
    { id: "pensamentos", nome: "Os três pensamentos para uma nova sociedade" },
    { id: "sociedade",   nome: "Desenvolvimento humano e transformação social" },
    { id: "educacao",    nome: "As virtudes na educação" }
  ],

  livros: [
    { id: "fundamentos", grupo: "fundamentos", titulo: "Fundamentos da Virtologia", sub: "3ª edição, 2026",
      capa: "img/fundamentos-da-virtologia.webp", ficha: "Cerca de 1.194 páginas · formato A4",
      texto: "A arquitetura teórica da Virtologia: funcionamento humano, personalidade, necessidades, Faixas de Evolução, aparelho psíquico, Lei do Fluxo, Leis da Vida, Inconsciente Operacional, substrato biológico, neuroplasticidade e as 33 virtudes, com mais de 400 páginas dedicadas a elas." },

    { id: "manejos", grupo: "fundamentos", titulo: "Manejos, Técnicas e Supervisão", sub: "",
      capa: "img/manejos-tecnicas-supervisao.webp", ficha: "Mais de 600 páginas · formato A4",
      texto: "A Virtologia em aplicação: investigação, condução clínica, técnicas, procedimentos e supervisão. O grande complemento prático dos Fundamentos." },

    { id: "terceira-onda", grupo: "pensamentos", titulo: "A Terceira Onda do Trabalho", sub: "",
      capa: "img/a-terceira-onda-do-trabalho.webp", ficha: "Trabalho",
      texto: "Trabalhar para viver, trabalhar para valer, trabalhar para ser. Uma leitura histórica da evolução do trabalho e dos novos sistemas que o trabalho por propósito exige." },

    { id: "america", grupo: "pensamentos", titulo: "Deus Abençoe a América", sub: "",
      capa: "img/deus-abencoe-a-america.webp", ficha: "Cultura",
      texto: "O americanismo estrutural e a influência de modelos de poder, competição, status, consumo e reconhecimento sobre a personalidade, o comportamento e as relações." },

    { id: "pedagogia", grupo: "pensamentos", titulo: "Pedagogia da Inscrição", sub: "",
      capa: "img/pedagogia-da-inscricao.webp", ficha: "Educação",
      texto: "Uma educação que vai além do conteúdo: formação da personalidade, desenvolvimento intencional das virtudes e transformação dos sistemas educacionais." },

    { id: "competencias", grupo: "sociedade", titulo: "Competências", sub: "O Manual Decifrado",
      capa: "img/competencias.webp", ficha: "Pessoas e organizações",
      texto: "As competências humanas, como se desenvolvem e como se aplicam na formação de pessoas e no funcionamento das organizações." },

    { id: "raiz", grupo: "sociedade", titulo: "A Raiz do Crime", sub: "",
      capa: "img/a-raiz-do-crime.webp", ficha: "Criminalidade",
      texto: "As origens do comportamento criminoso lidas pela Virtologia: personalidade, virtudes, violência, sistema prisional e ressocialização." },

    { id: "inteiras", grupo: "sociedade", titulo: "Inteiras", sub: "",
      capa: "img/inteiras.webp", ficha: "Violência contra a mulher",
      texto: "As raízes dos padrões de violência contra a mulher e a transformação das relações humanas pela formação da personalidade e das virtudes." },

    { id: "charuto", grupo: "sociedade", titulo: "Às vezes um charuto é só um charuto", sub: "",
      capa: "img/as-vezes-um-charuto.webp", ficha: "Identidade",
      texto: "Identidade, temperamento, desejos e defesas: o que é autêntico no indivíduo e o que foi construído para proteção ou reconhecimento." },

    { id: "sistemas", grupo: "sociedade", titulo: "Sistemas Humanizados", sub: "Humanização 2.0 · 2ª edição, 2026",
      capa: "img/sistemas-humanizados.webp", ficha: "792 páginas · 46 capítulos",
      texto: "Em vez de apenas tratar quem sofre em ambientes desumanizados, transformar as estruturas que produzem esse sofrimento: Cinco Filtros, governança, gestão de pessoas, saúde mental, riscos psicossociais, NR-1, compliance e instrumentos de implantação." },

    { id: "guia-infantil", grupo: "educacao", titulo: "Guia das Virtudes", sub: "Educação Infantil",
      capa: "img/guia-educacao-infantil.webp", ficha: "Educação Infantil", texto: "" },
    { id: "guia-iniciais", grupo: "educacao", titulo: "Guia das Virtudes", sub: "Anos Iniciais",
      capa: "img/guia-anos-iniciais.webp", ficha: "Anos Iniciais", texto: "" },
    { id: "guia-finais", grupo: "educacao", titulo: "Guia das Virtudes", sub: "Anos Finais",
      capa: "img/guia-anos-finais.webp", ficha: "Anos Finais", texto: "" },
    { id: "guia-professor", grupo: "educacao", titulo: "Guia das Virtudes", sub: "Livro do Professor",
      capa: "img/guia-livro-do-professor.webp", ficha: "Para educadores", texto: "" }
  ]
};
