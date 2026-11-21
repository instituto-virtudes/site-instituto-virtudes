/* =====================================================================
   AULAS AO VIVO - CONFIGURAÇÃO CENTRAL (um único lugar para tudo)

   Este arquivo alimenta:
   - as páginas de inscrição: /aulas/virtologia/ e /aulas/humanizacao/
   - o convite logo abaixo do vídeo das aulas gravadas:
     /aula1/ (Virtologia), /aula2/ e /aularh/ (Humanização 2.0)

   PARA A PRÓXIMA AULA DE UMA TRILHA
   1. Copie o bloco da aula dentro de "aulas: [ ... ]" da trilha e cole
      logo abaixo, separado por vírgula.
   2. No bloco novo, troque: id, inicio, titulo, subtitulo, apresentacao,
      temas, capa e grupoUrl. A data por extenso e o horário são
      calculados sozinhos a partir de "inicio".
   3. Em img/aulas/ vão a capa (16:9, usada na imagem de compartilhamento)
      e a "foto": só o Eduardo, recortada da capa, sem nenhum texto. É a
      foto que aparece nas páginas, ao lado do texto.
   4. O mesmo id precisa existir na tabela "aulas" do Supabase, com o
      link do grupo (é o Supabase que decide para qual grupo a pessoa vai).
   Nunca reaproveite o id de uma aula que já aconteceu.

   Quando uma aula termina (início + duração), as páginas passam sozinhas
   para a próxima aula da lista. Se não houver próxima, o convite das aulas
   gravadas some e a página de inscrição avisa que a aula já aconteceu.
   ===================================================================== */
window.AULAS_CONFIG = {

  /* Função do Supabase que grava a inscrição.
     Com "envioAtivo: false" as páginas mostram um aviso e não deixam finalizar. */
  endpoint: "https://geyegibuqyzwjrlgenoz.supabase.co/functions/v1/inscricao-aula",
  envioAtivo: true,

  /* Versão do aviso de uso de dados mostrado na etapa 3. Mude se o texto mudar. */
  versaoAviso: "aviso-aulas-2026-11-v2",

  /* Opções do formulário (as mesmas em todas as páginas, para o CRM ler igual).
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
    ],
    /* Para quem respondeu "Sim" em "Você já é aluno(a)...?".
       Estes valores também precisam estar na lista MOMENTOS da função inscricao-aula. */
    momentoAluno: [
      { valor: "aluno_aprofundar",         rotulo: "Quero participar da aula para revisar e aprofundar o tema." },
      { valor: "aluno_aplicar_pratica",    rotulo: "Quero levar este tema para a minha prática profissional." },
      { valor: "aluno_outros_cursos",      rotulo: "Também tenho interesse em outros cursos do Instituto, como as pós-graduações." }
    ]
  },

  /* Inscrições feitas no convite das aulas gravadas levam estas UTMs,
     para separar de quem se inscreveu pela página de inscrição.
     utm_campaign recebe o nome da página (aula1, aula2, aularh). */
  utmAulaGravada: { utm_source: "site", utm_medium: "aula-gravada", utm_content: "convite-aula-ao-vivo" },

  trilhas: {

    virtologia: {
      rotulo: "Virtologia",
      cor: "#E5BE80",              /* destaque da capa (dourado) */
      fundo: "#0B2341",            /* azul da capa */
      paginaInscricao: "aulas/virtologia/",
      perguntaAluno: "Você já é aluno(a) da Formação em Virtologia?",
      aulaGravada: "aula1/",
      paraQuem: "Especialmente para psicólogos, terapeutas e profissionais que atendem pessoas, e para quem quer conhecer a proposta da Virtologia. A aula é aberta ao público e não exige formação na área.",
      bio: "Fundamentador da Escola Clínico-Filosófica Virtologia, pesquisador e professor. Forma terapeutas há 25 anos, coordena cursos de pós-graduação e é autor de mais de 20 livros, entre eles Fundamentos da Virtologia, com publicações científicas no Brazilian Journal of Health Review.",
      aulas: [
        {
          id: "virtologia-20261109-1900",
          inicio: "2026-11-09T19:00:00-03:00",
          duracaoMinutos: 150,
          titulo: "Por que o mesmo manejo funciona com um paciente e não com outro?",
          subtitulo: "O que observar antes de escolher como intervir? O segredo está na formação da personalidade.",
          /* cada item vira um parágrafo */
          apresentacao: [
            "Nesta aula aberta, o Dr. Eduardo Casarotto mostra como a Virtologia lê a pessoa por vários componentes ao mesmo tempo, como as Faixas de Evolução neurológica, o temperamento e as necessidades. É essa leitura que ajuda a entender de onde vem um comportamento, se ele está tornando a pessoa mais ou menos funcional e se de fato precisa ser alterado.",
            "Dois exemplos: quem está numa faixa mais primitiva muitas vezes precisa treinar primeiro o controle, diferente de quem já está numa faixa mais avançada. E um exercício de fazer, passado para alguém de temperamento pensador, tende a ter pouco efeito. Há casos, ainda, em que a dificuldade vem de uma necessidade desequilibrada, algo mais biológico do que psíquico.",
            "Na comparação com as dezoito maiores teorias da personalidade, feita no livro Fundamentos da Virtologia, nenhuma delas reúne num só sistema as grandes heranças da psicologia que a Virtologia integra. Essa leitura mais ampla dá uma base melhor para escolher o manejo de cada pessoa."
          ],
          temas: [
            "A formação da personalidade.",
            "O caráter.",
            "Os 12 campos do temperamento.",
            "As 51 necessidades humanas.",
            "Os mandatos de vida.",
            "As Faixas de Evolução neurológica."
          ],
          capa: "img/aulas/virtologia-2026-11-09-v2.webp",
          foto: "img/aulas/virtologia-2026-11-09-v2-foto.webp",   /* só o Eduardo, recortado da capa */
          capaAlt: "Capa da aula: Por que o mesmo manejo funciona com um paciente e não com outro? Gratuita e ao vivo, 9 de novembro, 19h.",
          grupoUrl: "https://chat.whatsapp.com/EsvtD5YU9XOGSMClks7e5B?mode=gi_t"
        },
        {
          id: "virtologia-20261119-1900",
          inicio: "2026-11-19T19:00:00-03:00",
          duracaoMinutos: 150,
          titulo: "Quando a terapia começa a apagar a personalidade do paciente?",
          subtitulo: "Como distinguir o que é fixo e o que é mutável na personalidade humana",
          /* trechos destacados em cor no título e no subtítulo da página */
          destaques: ["apagar a personalidade", "fixo", "mutável", "personalidade humana"],
          apresentacao: [
            "Sim, muitos psicoterapeutas violentam seus pacientes sem saber. Não por maldade: por propor mudanças que não cabem na personalidade daquela pessoa, ou que chegam brutas demais. Nesta aula aberta, o Dr. Eduardo Casarotto mostra onde está essa linha e como não atravessá-la.",
            "Há um risco menos visível: incentivar um comportamento novo sem que a memória de longo prazo mude no cérebro. A pessoa, sem perceber, cria uma máscara para agir daquele jeito. Ela não alterou a personalidade, só o comportamento, e passa a esconder quem é de verdade. Se isso continua e cresce, pode contribuir lá na frente para um transtorno de personalidade.",
            "E existe o próprio lugar do terapeuta. É comum o paciente ver no terapeuta alguém que o julga, e começar a esconder coisas, buscar aprovação e fingir ser quem não é, também sem perceber. A aula trata da diferença entre o terapeuta julgador e aquele que permite que as mudanças aconteçam de forma leve e natural."
          ],
          temas: [
            "O que, na personalidade e na identidade, é fixo e o que é mutável.",
            "Como a terapia pode violentar o paciente sem que o terapeuta perceba.",
            "Mudar o comportamento sem mudar a memória de longo prazo: o nascimento da máscara.",
            "O terapeuta julgador e o paciente que passa a esconder e a fingir.",
            "Como conduzir a análise para que a mudança seja leve e natural."
          ],
          capa: "img/aulas/virtologia-2026-11-19.webp",
          foto: "img/aulas/virtologia-2026-11-09-v2-foto.webp",   /* só o Eduardo, sem texto (a mesma da aula anterior) */
          capaAlt: "Capa da aula: Quando a terapia começa a apagar a personalidade do paciente? Gratuita e ao vivo, 19 de novembro, 19h.",
          /* CONFIRMAR: é o mesmo grupo da aula de 09/11. Se houver grupo novo, troque aqui e no Supabase. */
          grupoUrl: "https://chat.whatsapp.com/EsvtD5YU9XOGSMClks7e5B?mode=gi_t"
        },
        /* PRÓXIMA AULA SEM DATA (lista de espera)
           Só aparece quando não há nenhuma aula com data pela frente. As páginas
           não mostram tema nem data: a pessoa se inscreve para "a próxima aula ao
           vivo de Virtologia" e entra no grupo. Quando a próxima aula for
           divulgada, é só cadastrá-la acima, com data: ela volta a ser a anunciada
           e /aulas/virtologia/ volta a abrir normalmente.
           O mesmo id precisa existir na tabela "aulas" do Supabase. */
        {
          id: "virtologia-proxima",
          semData: true,
          titulo: "Próxima aula ao vivo de Virtologia",
          materiaisBonus: false,
          foto: "img/aulas/virtologia-2026-11-09-v2-foto.webp",
          grupoUrl: "https://chat.whatsapp.com/EsvtD5YU9XOGSMClks7e5B?mode=gi_t"
        }
      ],
      /* enquanto não houver aula com data, quem abrir /aulas/virtologia/ vai para cá */
      semAulaIrPara: "aula1/"
    },

    humanizacao: {
      rotulo: "Humanização 2.0",
      cor: "#67D3C6",              /* destaque da capa (verde-água) */
      corDestaque: "#67D3C6",      /* cor dos trechos destacados no título */
      fundo: "#081F38",
      paginaInscricao: "aulas/humanizacao/",
      perguntaAluno: "Você já é aluno(a) da Formação em Sistemas Humanizados?",
      aulaGravada: "aula2/",
      paraQuem: "Especialmente para profissionais de RH, gestores, consultores e psicólogos organizacionais. A aula é aberta ao público.",
      bio: "Fundamentador dos Sistemas Humanizados e da Humanização 2.0, pesquisador, professor e consultor empresarial. Autor do livro Sistemas Humanizados e coordenador de cursos de pós-graduação, teve seu trabalho de humanização aplicado em grandes organizações, hospitais oncológicos, escolas, órgãos públicos e sistemas prisionais no Brasil e na Colômbia.",
      aulas: [
        {
          id: "humanizacao-20261112-1900",
          inicio: "2026-11-12T19:00:00-03:00",
          duracaoMinutos: 150,
          titulo: "Indo muito além das Soft Skills: A Arquitetura das Competências Humanas",
          subtitulo: "Decodificando as 47 competências da personalidade para contratar, liderar e desenvolver talentos sem gerar máscaras e burnout.",
          destaques: ["A Arquitetura das Competências Humanas"],
          apresentacao: "Nesta aula aberta, o Dr. Eduardo Casarotto vai além das soft skills e apresenta a arquitetura das competências humanas: as 47 competências da personalidade, decodificadas para contratar, liderar e desenvolver talentos sem gerar máscaras e burnout.",
          temas: [
            "Além das soft skills: a arquitetura das competências humanas.",
            "As 47 competências da personalidade.",
            "Como usar as competências para contratar, liderar e desenvolver talentos.",
            "Como desenvolver pessoas sem gerar máscaras e burnout."
          ],
          materiaisBonus: false,   /* esta aula não tem material bônus em PDF */
          capa: "img/aulas/humanizacao-2026-11-12-v2.webp",
          foto: "img/aulas/humanizacao-2026-11-12-foto.webp",
          capaAlt: "Capa da aula: Indo muito além das Soft Skills, a Arquitetura das Competências Humanas. Gratuita e ao vivo, 12 de novembro, 19h.",
          grupoUrl: "https://chat.whatsapp.com/CoOr4I3SjBgKJy6GLEMwzZ?mode=gi_t"
        }
      ]
    }
  }
};
