/* =====================================================================
   AULAS AO VIVO - CONFIGURAÇÃO CENTRAL
   Para a aula da próxima semana: mude só este arquivo.
   Cada aula tem um "id" ÚNICO e definitivo. Nova aula = novo id
   (nunca reaproveite o id de uma aula que já aconteceu: as inscrições
   antigas ficam guardadas com o id da aula original).
   O mesmo id precisa existir na tabela "aulas" do Supabase, com o link
   do grupo. É o Supabase que decide para qual grupo a pessoa vai.
   ===================================================================== */
window.AULAS_CONFIG = {

  /* Função do Supabase que grava a inscrição.
     Deixe "envioAtivo: false" até a função e as tabelas estarem instaladas.
     Com false, a página mostra um aviso e não deixa finalizar a inscrição. */
  endpoint: "https://geyegibuqyzwjrlgenoz.supabase.co/functions/v1/inscricao-aula",
  envioAtivo: true,

  /* Versão do aviso de uso de dados mostrado na etapa 3. Mude se o texto mudar. */
  versaoAviso: "aviso-aulas-2026-11-v2",

  /* Opções do formulário (as mesmas nas duas páginas, para o CRM ler igual).
     "valor" é o que vai para o banco: não mude um valor que já recebeu inscrições. */
  opcoes: {
    area: [
      { valor: "saude_mental",          rotulo: "Psicologia clínica ou saúde mental" },
      { valor: "rh_gestao_pessoas",     rotulo: "RH ou gestão de pessoas" },
      { valor: "consultoria_organizacional", rotulo: "Consultoria empresarial ou atuação organizacional" },
      { valor: "outra_area",            rotulo: "Outra área profissional" },
      { valor: "estudante",             rotulo: "Sou estudante" },
      { valor: "nao_atua_nessas_areas", rotulo: "Não atuo profissionalmente nessas áreas" }
    ],
    objetivo: [
      { valor: "desenvolvimento_pessoal",  rotulo: "Meu desenvolvimento pessoal" },
      { valor: "aprimorar_atuacao",        rotulo: "Aprimorar minha atuação profissional" },
      { valor: "transicao_carreira",       rotulo: "Conhecer uma possibilidade de transição de carreira" },
      { valor: "aplicar_em_organizacoes",  rotulo: "Aplicar o conteúdo em equipes ou organizações" },
      { valor: "conhecer_antes_de_decidir",rotulo: "Conhecer melhor o tema antes de decidir" }
    ],
    momento: [
      { valor: "conhecer_assunto",         rotulo: "Quero participar da aula e conhecer o assunto." },
      { valor: "formacao_mais_adiante",    rotulo: "Estou avaliando uma formação para mais adiante." },
      { valor: "formacao_em_breve",        rotulo: "Estou buscando uma formação para começar em breve." }
    ]
  },

  aulas: {

    virtologia: {
      id: "virtologia-20261109-1900",
      trilha: "virtologia",
      rotuloTrilha: "Virtologia",
      chamada: "Aula gratuita, online e ao vivo",
      titulo: "Por que pacientes com os mesmos sintomas respondem de modo diferente ao tratamento?",
      subtitulo: "O que observar no paciente antes de escolher como intervir?",
      apresentacao: "Nesta aula aberta, Eduardo Casarotto apresenta três eixos da Virtologia para discutir o que observar no paciente antes da escolha de uma intervenção: Faixas de Evolução neurológica, estado de aprendizagem e três fatores clínicos.",
      temas: [
        "Faixas de Evolução neurológica.",
        "Estado de aprendizagem.",
        "Três fatores clínicos."
      ],
      paraQuem: "Especialmente para profissionais que atendem pacientes e pessoas interessadas em compreender a proposta da Virtologia. A participação é gratuita e aberta ao público.",
      inicio: "2026-11-09T19:00:00-03:00",
      duracaoMinutos: 150,
      dataExtenso: "Segunda-feira, 9 de novembro de 2026",
      dataCurta: "09/11/2026",
      grupoUrl: "https://chat.whatsapp.com/EsvtD5YU9XOGSMClks7e5B?mode=gi_t",
      aulaGravada: "../../aula1/"
    },

    humanizacao: {
      id: "humanizacao-20261112-1900",
      trilha: "humanizacao",
      rotuloTrilha: "Humanização 2.0",
      chamada: "Aula gratuita, online e ao vivo",
      titulo: "A limitação de programas de saúde corporativa",
      subtitulo: "O que uma ação de acolhimento consegue mudar e onde ela para? Como transformar uma iniciativa de bem-estar em parte da rotina?",
      apresentacao: "Nesta aula aberta, Eduardo Casarotto discute o alcance das ações de acolhimento e o desafio de dar continuidade às iniciativas de bem-estar no cotidiano das organizações.",
      temas: [
        "O que uma ação de acolhimento consegue mudar.",
        "Onde estão os limites de uma iniciativa pontual.",
        "Como transformar uma iniciativa de bem-estar em parte da rotina."
      ],
      paraQuem: "Especialmente para profissionais de RH, gestores, consultores e psicólogos organizacionais. A participação é gratuita e aberta ao público.",
      inicio: "2026-11-12T19:00:00-03:00",
      duracaoMinutos: 150,
      dataExtenso: "Quinta-feira, 12 de novembro de 2026",
      dataCurta: "12/11/2026",
      grupoUrl: "https://chat.whatsapp.com/CoOr4I3SjBgKJy6GLEMwzZ?mode=gi_t",
      aulaGravada: "../../aula2/"
    }
  }
};
