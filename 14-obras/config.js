/* =====================================================================
   COLEÇÃO ESPECIAL EDUARDO CASAROTTO - CONFIGURAÇÃO CENTRAL
   Tudo o que muda na campanha se altera AQUI, e a página inteira acompanha.
   ===================================================================== */
window.COLECAO = {

  nome: "Coleção Especial Eduardo Casarotto",
  quantidadeLivros: 14,

  /* ---------- preço ---------- */
  precoRegular: 3061.00,       // soma dos 14 livros fora da coleção (precoAvulso de cada livro)
  precoPreVenda: 1997.00,      // preço da coleção na pré-venda
  freteIncluso: true,

  /* ---------- checkout ----------
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

  /* quando saem os combos menores (aparece no FAQ e na caixa do pedido).
     Deixe "" para tirar o aviso. */
  lancamentoCombosMenores: "no final de novembro",

  /* ---------- autógrafos ----------
     "disponivel" -> mostra a condição dos 100 primeiros
     "encerrado"  -> retira a promessa de autógrafos da página inteira
     A troca é MANUAL: quem acompanha os pedidos com pagamento confirmado
     na Greenn muda para "encerrado" assim que o 100º for confirmado. */
  statusAutografos: "disponivel",
  limiteAutografos: 100,

  /* ---------- envio ---------- */
  dataEnvio: "7 de dezembro de 2026",   // data em que os envios começam (aparece em toda a página)
  dataEnvioCurta: "7 de dezembro",      // versão curta, usada no topo e na barra do celular
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
    compartilhamento: "https://institutovirtudes.com.br/14-obras/img/og-14-obras.jpg"
  },

  /* ---------- as 14 obras ----------
     Cada livro é uma "peça" da Virtologia e aparece na página com o mesmo destaque.
     gancho: a frase "Sem ele, você não entende..." (o que falta a quem não tem o livro)
     texto: o que o livro traz
     precoAvulso: preço do livro fora da coleção; a soma deve bater com precoRegular.
     precoColecao: quanto o livro vale dentro da coleção; a soma deve bater com precoPreVenda.
     Os 4 volumes do Guia das Virtudes aparecem juntos, como uma peça só (ver guias, abaixo). */
  livros: [
    { id: "fundamentos", precoAvulso: 686.00, precoColecao: 458.00, titulo: "Fundamentos da Virtologia", sub: "3ª edição, 2026",
      capa: "img/fundamentos-da-virtologia.webp", ficha: "3ª edição · 1.253 páginas · formato A4",
      gancho: "Sem ele, você não entende nenhum dos outros 13.",
      texto: "É a base da escola: funcionamento humano, personalidade, necessidades, Faixas de Evolução neurológica, aparelho psíquico, Lei do Fluxo, Leis da Vida, Inconsciente Operacional, neuroplasticidade e as 33 virtudes, com mais de 400 páginas só sobre elas. Todo livro da coleção parte daqui." },

    { id: "manejos", precoAvulso: 416.00, precoColecao: 288.00, titulo: "Manejos, Técnicas e Supervisão", sub: "",
      capa: "img/manejos-tecnicas-supervisao.webp", ficha: "Mais de 700 páginas · formato A4",
      gancho: "Sem ele, você sabe a teoria e não sabe o que fazer dentro da sessão.",
      texto: "A Virtologia aplicada: como investigar, como conduzir o atendimento, cada técnica e cada procedimento, o papel do virtólogo no consultório e como funciona a supervisão. É o livro que transforma o estudo em atendimento." },

    { id: "charuto", precoAvulso: 91.00, precoColecao: 49.00, titulo: "Às vezes um charuto é só um charuto", sub: "",
      capa: "img/as-vezes-um-charuto.webp", ficha: "Identidade, temperamento e defesa",
      gancho: "Sem ele, você confunde o jeito de ser da pessoa com a defesa que ela construiu.",
      texto: "Identidade, temperamento e couraça de caráter produzem o mesmo comportamento e são confundidos o tempo todo. O livro ensina a separar as três camadas, com os 12 eixos do temperamento, os sete elementos da identidade, um caso de consultório analisado do começo ao fim e o protocolo clínico." },

    { id: "competencias", precoAvulso: 216.00, precoColecao: 128.00, titulo: "Competências", sub: "O Manual Decifrado",
      capa: "img/competencias.webp", ficha: "Pessoas e trabalho",
      gancho: "Sem ele, você não liga as virtudes ao que a pessoa consegue fazer no trabalho e na vida.",
      texto: "As 33 virtudes cruzadas com os 12 temperamentos formam as 7 competências centrais e suas subcompetências: protagonismo, liderança, disciplina, inteligência social, inteligência intrapessoal, adaptabilidade e humanização. É a ponte entre o consultório e a vida profissional de quem você atende." },

    { id: "raiz", precoAvulso: 161.00, precoColecao: 98.00, titulo: "A Raiz do Crime", sub: "",
      capa: "img/a-raiz-do-crime.webp", ficha: "Criminalidade",
      gancho: "Sem ele, você não entende o que leva uma pessoa a ferir a outra.",
      texto: "De onde vem o crime: do estágio do orgulho e do egoísmo, do quanto a pessoa enxerga o outro como outro. Ambiente, pobreza e família não são a raiz. O livro explica o crime em três tempos, a formação do caráter, a violência, o sistema prisional e a ressocialização." },

    { id: "inteiras", precoAvulso: 128.00, precoColecao: 84.00, titulo: "Inteiras", sub: "",
      capa: "img/inteiras.webp", ficha: "Violência contra a mulher",
      gancho: "Sem ele, você não reconhece os padrões que levam à violência contra a mulher.",
      texto: "Feminicídio, machismo, feminismo e reversismo lidos pela Virtologia: de onde vêm os padrões de violência contra a mulher e como a formação da personalidade e das virtudes transforma as relações." },

    { id: "pedagogia", precoAvulso: 131.00, precoColecao: 86.00, titulo: "Pedagogia da Inscrição", sub: "",
      capa: "img/pedagogia-da-inscricao.webp", ficha: "Educação",
      gancho: "Sem ele, você não entende como a escola formou a personalidade de quem você atende.",
      texto: "A escola ensina o que não diz: ela inscreve personalidade de qualquer jeito, por acaso ou com método. O livro mostra as fases do desenvolvimento, a formação da personalidade pelas virtudes e a humanização da escola." },

    { id: "guia-infantil", precoAvulso: 201.00, precoColecao: 143.00, titulo: "Guia das Virtudes", sub: "Educação Infantil",
      capa: "img/guia-educacao-infantil.webp", guia: true },
    { id: "guia-iniciais", precoAvulso: 201.00, precoColecao: 143.00, titulo: "Guia das Virtudes", sub: "Anos Iniciais",
      capa: "img/guia-anos-iniciais.webp", guia: true },
    { id: "guia-finais", precoAvulso: 201.00, precoColecao: 143.00, titulo: "Guia das Virtudes", sub: "Anos Finais",
      capa: "img/guia-anos-finais.webp", guia: true },
    { id: "guia-professor", precoAvulso: 101.00, precoColecao: 56.00, titulo: "Guia das Virtudes", sub: "Livro do Professor",
      capa: "img/guia-livro-do-professor.webp", guia: true },

    { id: "terceira-onda", precoAvulso: 121.00, precoColecao: 73.00, titulo: "A Terceira Onda do Trabalho", sub: "",
      capa: "img/a-terceira-onda-do-trabalho.webp", ficha: "Trabalho",
      gancho: "Sem ele, você não entende a angústia de quem tem trabalho e não vê sentido no que faz.",
      texto: "Trabalhar para viver, trabalhar para valer, trabalhar para ser. As três ondas do trabalho, da sobrevivência à posição e da posição ao sentido, e os novos sistemas que o trabalho por propósito exige." },

    { id: "america", precoAvulso: 131.00, precoColecao: 80.00, titulo: "Deus Abençoe a América", sub: "",
      capa: "img/deus-abencoe-a-america.webp", ficha: "Cultura",
      gancho: "Sem ele, você não percebe quanto do sofrimento de quem você atende vem de um modelo de sucesso que ninguém escolheu.",
      texto: "O americanismo estrutural: o modelo de poder, competição, status, consumo e reconhecimento que se espalhou pelo mundo, e o que ele faz com a personalidade, o comportamento e as relações. É o livro da força que impede as pessoas de mudarem." },

    { id: "sistemas", precoAvulso: 276.00, precoColecao: 168.00, titulo: "Sistemas Humanizados", sub: "Humanização 2.0 · 2ª edição, 2026",
      capa: "img/sistemas-humanizados.webp", ficha: "2ª edição · 792 páginas · 46 capítulos",
      gancho: "Sem ele, você trata a pessoa e devolve ela para o mesmo ambiente que a adoece.",
      texto: "Em vez de só tratar quem sofre em ambientes desumanizados, transformar as estruturas que produzem esse sofrimento: Cinco Filtros, governança, gestão de pessoas, saúde mental, riscos psicossociais, NR-1 e instrumentos de implantação. É o livro de quem quer levar a Virtologia para empresas, escolas e instituições." }
  ],

  /* a peça dos 4 volumes do Guia das Virtudes (aparece no lugar do primeiro Guia da lista) */
  guias: {
    titulo: "Guia das Virtudes",
    ficha: "4 volumes · Educação Infantil, Anos Iniciais, Anos Finais e Livro do Professor",
    gancho: "Sem ele, você não sabe como as virtudes são trabalhadas na infância e na adolescência.",
    texto: "A aplicação das virtudes em cada etapa, da Educação Infantil aos Anos Finais, com propostas e atividades, e um volume para o educador que conduz. Para quem atende crianças e adolescentes, orienta pais ou leva a Virtologia para a escola.",
    nota: "Todos os volumes são inéditos, inclusive o Anos Finais: mesmo com a capa igual à do Guia anterior, o conteúdo é novo."
  }
};
