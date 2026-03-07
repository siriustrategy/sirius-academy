export type QuestionType = 'scale' | 'choice' | 'multi' | 'text'

export type Question = {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  maxSelect?: number
  scaleLabels?: [string, string]
}

export type QuizSection = {
  id: string
  title: string
  subtitle: string
  description: string
  color: string
  colorLight: string
  framework: string
  questions: Question[]
}

export const QUIZ_SECTIONS: QuizSection[] = [
  {
    id: 'hendricks',
    title: 'Zona de Gênio',
    subtitle: 'Gay Hendricks',
    description: 'Identificando em qual zona você opera e onde seu potencial máximo vive.',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.12)',
    framework: 'Gay Hendricks — The Big Leap',
    questions: [
      {
        id: 'h1',
        text: 'Em quais tipos de atividade o tempo "passa voando" sem você perceber, e você sai com mais energia do que entrou?',
        type: 'text',
      },
      {
        id: 'h2',
        text: 'Com que frequência você sente que está usando seu potencial máximo nas suas atividades do dia a dia?',
        type: 'scale',
        scaleLabels: ['Quase nunca', 'O tempo todo'],
      },
      {
        id: 'h3',
        text: 'Quando as coisas começam a ir muito bem na sua vida, como você costuma reagir?',
        type: 'choice',
        options: [
          'Aproveito ao máximo e expando ainda mais',
          'Fico com medo que algo de errado aconteça',
          'Sabooto sem perceber (crio conflito, adoeço, cometo erros)',
          'Me sinto indigno(a) e começo a duvidar de mim',
        ],
      },
      {
        id: 'h4',
        text: 'Selecione as atividades que te deixam com mais energia ao final (pode marcar até 3):',
        type: 'multi',
        maxSelect: 3,
        options: [
          'Criar e inovar — gerar ideias novas',
          'Ensinar e explicar conceitos',
          'Resolver problemas complexos',
          'Liderar e influenciar pessoas',
          'Analisar dados e padrões',
          'Construir sistemas e processos',
          'Conectar pessoas entre si',
          'Vender e persuadir',
        ],
      },
      {
        id: 'h5',
        text: 'O que você faz com tanta naturalidade que chega a subestimar como valor — algo que as pessoas te pedem ajuda constantemente?',
        type: 'text',
      },
      {
        id: 'h6',
        text: 'Em que zona você acredita que passa a maior parte do tempo profissional atualmente?',
        type: 'choice',
        options: [
          'Incompetência — fazendo o que não sei fazer bem',
          'Competência — fazendo o que sei, mas não me destaco',
          'Excelência — fazendo muito bem, mas sem paixão real',
          'Gênio — fazendo o que amo e tenho talento único',
        ],
      },
    ],
  },
  {
    id: 'clifton',
    title: 'Forças de CliftonStrengths',
    subtitle: 'Gallup',
    description: 'Mapeando seus domínios naturais de talento e como você cria valor.',
    color: '#3B5BDB',
    colorLight: 'rgba(59,91,219,0.12)',
    framework: 'CliftonStrengths 34 — Gallup',
    questions: [
      {
        id: 'c1',
        text: 'Qual domínio melhor descreve como você entrega valor?',
        type: 'choice',
        options: [
          'Execução — faço as coisas acontecerem de verdade',
          'Influência — convença, vendo e comunico com impacto',
          'Relacionamentos — construo conexões profundas e times fortes',
          'Pensamento Estratégico — analiso, conecto ideias e planejo',
        ],
      },
      {
        id: 'c2',
        text: 'O que seus colegas, clientes ou amigos mais pedem sua ajuda?',
        type: 'multi',
        maxSelect: 3,
        options: [
          'Organizar e executar projetos',
          'Tomar decisões difíceis',
          'Resolver conflitos',
          'Criar novas ideias',
          'Vender ou convencer',
          'Analisar dados',
          'Dar suporte emocional',
          'Ensinar ou explicar',
        ],
      },
      {
        id: 'c3',
        text: 'Numa equipe, qual papel você assume naturalmente?',
        type: 'choice',
        options: [
          'O executor — garante que o trabalho seja feito',
          'O motivador — inspira e puxa energia do grupo',
          'O conector — cria harmonia e relações',
          'O estrategista — pensa no futuro e nos padrões',
        ],
      },
      {
        id: 'c4',
        text: 'Como você se descreve melhor em relação ao seu pensamento?',
        type: 'choice',
        options: [
          'Foco total — me especializo fundo em um tema',
          'Futurista — vejo oportunidades antes dos outros',
          'Aprendiz — adoro absorver conhecimento novo',
          'Analítico — preciso entender o "porquê" de tudo',
          'Ideativo — conecto ideias que outros não conectam',
          'Contexto — aprendo com o passado para guiar o presente',
        ],
      },
      {
        id: 'c5',
        text: 'Qual é seu maior diferencial percebido pelas pessoas ao seu redor?',
        type: 'text',
      },
      {
        id: 'c6',
        text: 'O que mais te motiva e energiza no trabalho?',
        type: 'choice',
        options: [
          'Atingir metas e ver resultados concretos',
          'Influenciar e impactar pessoas',
          'Construir relações duradouras',
          'Aprender e criar novas soluções',
        ],
      },
    ],
  },
  {
    id: 'sullivan',
    title: 'Habilidade Única',
    subtitle: 'Dan Sullivan',
    description: 'Descobrindo a interseção entre paixão, excelência e energia.',
    color: '#0891B2',
    colorLight: 'rgba(8,145,178,0.12)',
    framework: 'Unique Ability — Dan Sullivan / Strategic Coach',
    questions: [
      {
        id: 's1',
        text: 'O que você faz com tão pouco esforço que chega a subestimar — algo que surpreende as pessoas pela qualidade?',
        type: 'text',
      },
      {
        id: 's2',
        text: 'Se você pudesse trabalhar em apenas UMA atividade pelo resto da vida e seria completamente realizado(a), qual seria?',
        type: 'text',
      },
      {
        id: 's3',
        text: 'Qual destas combinações mais descreve sua Habilidade Única atual?',
        type: 'choice',
        options: [
          'Criar visões e estratégias que inspiram times',
          'Conectar pessoas e construir comunidades',
          'Transformar ideias complexas em soluções simples',
          'Vender e comunicar valor com autenticidade',
          'Construir sistemas que escalam sem mim',
          'Ensinar e acelerar o crescimento de outros',
          'Analisar e resolver problemas que ninguém mais consegue',
          'Executar com excelência e consistência',
        ],
      },
      {
        id: 's4',
        text: 'Com que frequência você está fazendo atividades que são sua Habilidade Única no seu trabalho atual?',
        type: 'scale',
        scaleLabels: ['Quase nunca', 'Quase sempre'],
      },
      {
        id: 's5',
        text: 'Quando você está no seu fluxo máximo, como seu ambiente reage a você?',
        type: 'choice',
        options: [
          'As pessoas me procuram para tomar decisões',
          'Inspiro outros sem nem perceber',
          'Resolvo em minutos o que outros levam dias',
          'Faço as coisas acontecerem de forma fluida',
        ],
      },
      {
        id: 's6',
        text: 'Quais compromissos você jamais se cansa de honrar, mesmo quando está cansado?',
        type: 'text',
      },
    ],
  },
  {
    id: 'wealth',
    title: 'Perfil de Riqueza',
    subtitle: 'Roger Hamilton',
    description: 'Identificando como você naturalmente gera valor e riqueza.',
    color: '#059669',
    colorLight: 'rgba(5,150,105,0.12)',
    framework: 'Wealth Dynamics — Roger James Hamilton',
    questions: [
      {
        id: 'w1',
        text: 'Como você prefere criar valor para o mercado?',
        type: 'choice',
        options: [
          'Criando inovações e produtos únicos (Creator)',
          'Apoiando e potencializando outros líderes (Supporter)',
          'Construindo sistemas e estruturas (Mechanic)',
          'Negociando e conectando recursos (Trader)',
          'Acumulando e gerando retorno sobre ativos (Accumulator)',
          'Gerando novos negócios com velocidade (Deal Maker)',
          'Comunicando e criando audiência (Star)',
          'Conectando pessoas e oportunidades (Lord)',
        ],
      },
      {
        id: 'w2',
        text: 'Qual é seu estilo natural quando começa algo novo?',
        type: 'choice',
        options: [
          'Imagino o produto ou ideia do zero',
          'Monto a equipe certa e a apoio',
          'Projeto o processo e a estrutura',
          'Busco o negócio certo para fazer',
          'Analiso e espero o momento certo',
          'Acelero e escalo o que já funciona',
          'Construo minha presença e marca pessoal',
          'Faço as conexões e cuido dos bastidores',
        ],
      },
      {
        id: 'w3',
        text: 'Como você prefere trabalhar?',
        type: 'choice',
        options: [
          'Sozinho, no meu ritmo e espaço',
          'Apoiando um líder visionário',
          'Com processos claros e uma equipe estruturada',
          'Em movimento constante, fechando negócios',
          'Com estabilidade e análise cuidadosa',
          'Em múltiplos projetos simultaneamente',
          'Na frente, sendo o rosto do projeto',
          'Nos bastidores, gerenciando sistemas',
        ],
      },
      {
        id: 'w4',
        text: 'Qual é seu maior talento em relação a criar riqueza?',
        type: 'choice',
        options: [
          'Crio produtos únicos que o mercado ama',
          'Ajudo líderes a serem melhores',
          'Otimizo processos para escalarem',
          'Faço negócios acontecerem rapidamente',
          'Identifico e acumulo ativos de valor',
          'Faço qualquer negócio crescer',
          'Construo uma marca inesquecível',
          'Conecto pessoas e crio alavancagem',
        ],
      },
      {
        id: 'w5',
        text: 'Como você lida com networking e conexões?',
        type: 'choice',
        options: [
          'Prefiro criar sozinho do que conectar',
          'Me conecto profundamente com poucos',
          'Construo sistemas de relacionamento',
          'Conecto-me para fechar negócios',
          'Conecto-me com cautela e propósito',
          'Conecto-me com muitos de forma rápida',
          'Sou a pessoa que todos querem conhecer',
          'Conecto os outros entre si estrategicamente',
        ],
      },
      {
        id: 'w6',
        text: 'Qual é sua maior dificuldade ao gerar riqueza?',
        type: 'choice',
        options: [
          'Transformar ideias em dinheiro real',
          'Agir sem um líder que me inspire',
          'Improvisar quando os planos mudam',
          'Aprofundar em um único projeto',
          'Agir com velocidade e risco',
          'Manter o foco em um projeto só',
          'Trabalhar nos bastidores sem reconhecimento',
          'Ser o rosto e assumir protagonismo',
        ],
      },
    ],
  },
  {
    id: 'hormozi',
    title: 'Equação de Valor',
    subtitle: 'Alex Hormozi',
    description: 'Como você entrega e comunica valor de forma irresistível.',
    color: '#D97706',
    colorLight: 'rgba(217,119,6,0.12)',
    framework: 'Value Equation — Alex Hormozi ($100M Offers)',
    questions: [
      {
        id: 'v1',
        text: 'Como você comunica o valor do que oferece naturalmente?',
        type: 'choice',
        options: [
          'Mostro resultados concretos e números',
          'Conto histórias de transformação',
          'Demonstro ao vivo como funciona',
          'Uso lógica e argumentos técnicos',
          'Apelo para a dor e urgência do problema',
          'Foco no sonho e no destino desejado',
        ],
      },
      {
        id: 'v2',
        text: 'O que seus clientes/colegas mais valorizam no seu trabalho?',
        type: 'multi',
        maxSelect: 3,
        options: [
          'Velocidade de entrega',
          'Qualidade impecável',
          'Clareza e simplicidade',
          'Inovação e criatividade',
          'Confiabilidade e consistência',
          'Personalização e atenção',
          'Resultados mensuráveis',
          'Facilidade de trabalhar junto',
        ],
      },
      {
        id: 'v3',
        text: 'Como você lida com a percepção de risco do cliente ou parceiro?',
        type: 'choice',
        options: [
          'Ofereço garantias e resultados comprovados',
          'Mostro provas sociais e depoimentos',
          'Começo com projetos menores para gerar confiança',
          'Sou transparente sobre o processo e riscos',
        ],
      },
      {
        id: 'v4',
        text: 'Qual é sua abordagem para entregar resultados rapidamente para o outro?',
        type: 'choice',
        options: [
          'Crio processos que geram resultados rápidos',
          'Priorizo o que tem maior impacto imediato',
          'Trabalho intensamente por períodos curtos',
          'Uso sistemas e automações para acelerar',
        ],
      },
      {
        id: 'v5',
        text: 'Como você minimiza o esforço necessário do cliente para obter resultados?',
        type: 'choice',
        options: [
          'Faço a maior parte do trabalho por eles',
          'Simplifico e documento tudo',
          'Uso tecnologia para automatizar',
          'Treino e capacito para se tornarem independentes',
        ],
      },
      {
        id: 'v6',
        text: 'Descreva seu maior resultado entregue a um cliente ou organização:',
        type: 'text',
      },
    ],
  },
  {
    id: 'kolbe',
    title: 'Modo de Ação',
    subtitle: 'Kathy Kolbe',
    description: 'Como você age instintivamente ao resolver problemas e iniciar projetos.',
    color: '#DC2626',
    colorLight: 'rgba(220,38,38,0.12)',
    framework: 'Kolbe A Index — Kathy Kolbe',
    questions: [
      {
        id: 'k1',
        text: 'Quando você inicia um projeto novo, qual é seu primeiro instinto?',
        type: 'choice',
        options: [
          'Pesquiso profundamente antes de agir (Fact Finder)',
          'Organizo tudo e estabeleço o passo a passo (Follow Thru)',
          'Começo logo e experimento pelo caminho (Quick Start)',
          'Construo algo tangível ou protótipo (Implementor)',
        ],
      },
      {
        id: 'k2',
        text: 'Como você prefere organizar informações?',
        type: 'choice',
        options: [
          'Com muitos detalhes e referências claras',
          'Com processos e estruturas definidas',
          'De forma resumida e flexível',
          'Em modelos ou objetos físicos/visuais',
        ],
      },
      {
        id: 'k3',
        text: 'Quando enfrenta um desafio inesperado, como você reage naturalmente?',
        type: 'choice',
        options: [
          'Pesquiso mais dados para entender o problema',
          'Reviso meu plano e reorganizo as prioridades',
          'Improviso e encontro uma solução criativa',
          'Construo ou modelo uma solução concreta',
        ],
      },
      {
        id: 'k4',
        text: 'Como você funciona melhor em termos de estrutura?',
        type: 'choice',
        options: [
          'Com muita pesquisa e informação antes de decidir',
          'Com planos detalhados e etapas claras',
          'Com liberdade para experimentar e adaptar',
          'Com projetos concretos que posso construir',
        ],
      },
      {
        id: 'k5',
        text: 'Como você lida com prazos e urgências?',
        type: 'choice',
        options: [
          'Preciso de tempo adequado para pesquisar bem',
          'Cumpro prazos quando tenho um plano claro',
          'Trabalho melhor com a pressão do prazo',
          'Entrego quando o produto estiver físicamente completo',
        ],
      },
      {
        id: 'k6',
        text: 'Qual é sua maior fonte de frustração no trabalho?',
        type: 'choice',
        options: [
          'Ter que decidir sem dados suficientes',
          'Trabalhar sem processos ou estrutura claros',
          'Ser forçado a seguir regras rígidas sem flexibilidade',
          'Trabalhar só com ideias abstratas, sem nada concreto',
        ],
      },
    ],
  },
  {
    id: 'hogshead',
    title: 'Vantagem de Fascínio',
    subtitle: 'Sally Hogshead',
    description: 'Como você fascina e é percebido(a) pelos outros naturalmente.',
    color: '#DB2777',
    colorLight: 'rgba(219,39,119,0.12)',
    framework: 'Fascination Advantage — Sally Hogshead',
    questions: [
      {
        id: 'f1',
        text: 'O que as pessoas dizem sobre você depois que você sai da sala?',
        type: 'choice',
        options: [
          '"Que pessoa confiável e profissional"',
          '"Que energia incrível, me sinto motivado"',
          '"Que visão única, nunca pensei assim"',
          '"Que pessoa cuidadosa, me sinto ouvido"',
          '"Que domínio do assunto, é referência"',
          '"Que mistério, quero saber mais sobre ela/ele"',
          '"Que urgência, preciso agir agora"',
        ],
      },
      {
        id: 'f2',
        text: 'Como você naturalmente influencia as pessoas?',
        type: 'choice',
        options: [
          'Pela minha consistência e confiabilidade (Trust)',
          'Pela minha energia e entusiasmo (Passion)',
          'Pelas minhas ideias inovadoras (Innovation)',
          'Pela minha empatia e conexão (Mystique)',
          'Pelo meu conhecimento e autoridade (Prestige)',
          'Pela minha discrição e profundidade (Mystique)',
          'Pela urgência e velocidade que trago (Alert)',
        ],
      },
      {
        id: 'f3',
        text: 'Qual é seu "superpoder" de comunicação?',
        type: 'choice',
        options: [
          'Faço as pessoas se sentirem seguras e confiantes',
          'Gero entusiasmo e movimento nas pessoas',
          'Apresento perspectivas que ninguém viu',
          'Faço as pessoas se sentirem profundamente compreendidas',
          'Transmito autoridade e expertise imediata',
          'Crio intriga — as pessoas querem me conhecer mais',
          'Gero senso de urgência e ação imediata',
        ],
      },
      {
        id: 'f4',
        text: 'Como você se destaca num grupo de pessoas igualmente inteligentes?',
        type: 'choice',
        options: [
          'Pela minha consistência e palavra que vale ouro',
          'Pela minha intensidade e paixão pelo que faço',
          'Pelo meu ângulo diferente sobre qualquer tema',
          'Pela qualidade do meu produto ou trabalho',
          'Pelo meu nível de profundidade e conhecimento',
          'Pelo ar de mistério e sofisticação',
          'Por tornar tudo mais urgente e relevante',
        ],
      },
      {
        id: 'f5',
        text: 'O que te torna inesquecível para quem te conhece?',
        type: 'text',
      },
      {
        id: 'f6',
        text: 'Como você prefere ser percebido(a) profissionalmente?',
        type: 'choice',
        options: [
          'Como alguém absolutamente confiável e consistente',
          'Como uma força da natureza, cheia de energia',
          'Como um visionário que vê o que os outros não veem',
          'Como alguém que realmente se importa e escuta',
          'Como a maior referência em seu campo',
          'Como alguém intrigante e de profundidade única',
          'Como alguém que sempre entrega com excelência e no prazo',
        ],
      },
    ],
  },
]

export const TOTAL_QUESTIONS = QUIZ_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0)

export function getSectionProgress(sectionIndex: number, questionIndex: number) {
  const prev = QUIZ_SECTIONS.slice(0, sectionIndex).reduce((acc, s) => acc + s.questions.length, 0)
  const current = prev + questionIndex + 1
  return { current, total: TOTAL_QUESTIONS, percent: Math.round((current / TOTAL_QUESTIONS) * 100) }
}
