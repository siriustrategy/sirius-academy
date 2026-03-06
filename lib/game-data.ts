export type Module = {
  id: string
  title: string
  subtitle: string
  duration: string
  xp: number
  type: 'leitura' | 'exercicio' | 'quiz' | 'pratica'
  content: ModuleContent
}

export type ModuleContent = {
  intro: string
  sections: Section[]
  exercise?: Exercise
  quiz?: QuizQuestion[]
  prompts?: PromptExample[]
}

export type Section = {
  title: string
  body: string
  tip?: string
  prompts?: PromptExample[]
}

export type PromptExample = {
  label: string
  bad?: string
  good: string
  explanation: string
}

export type Exercise = {
  title: string
  description: string
  steps: string[]
}

export type QuizQuestion = {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export type Phase = {
  id: number
  area?: string
  level?: string
  title: string
  subtitle: string
  icon: string
  color: string
  xpBonus: number
  modules: Module[]
}

export const LEVELS = [
  { min: 0,    max: 299,   level: 1, title: 'Iniciante',      color: '#6B7A9E' },
  { min: 300,  max: 699,   level: 2, title: 'Aprendiz',       color: '#3B5BDB' },
  { min: 700,  max: 1299,  level: 3, title: 'Praticante',     color: '#7C3AED' },
  { min: 1300, max: 2099,  level: 4, title: 'Especialista',   color: '#059669' },
  { min: 2100, max: 99999, level: 5, title: 'Mestre da IA',   color: '#D97706' },
]

export function getLevelInfo(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) ?? LEVELS[0]
}

export function getXPToNextLevel(xp: number) {
  const current = getLevelInfo(xp)
  if (current.level === 5) return { current: xp, needed: current.max, percent: 100 }
  const next = LEVELS[current.level]
  const needed = next.min - current.min
  const progress = xp - current.min
  return {
    current: progress,
    needed,
    percent: Math.min(100, Math.round((progress / needed) * 100))
  }
}

export const PHASES: Phase[] = [
  {
    id: 1,
    title: 'O Despertar',
    subtitle: 'Fundamentos de IA — do zero ao consciente',
    icon: 'cosmos',
    color: '#3B5BDB',
    xpBonus: 200,
    modules: [
      {
        id: 'p1-m1',
        title: 'O que é Inteligência Artificial?',
        subtitle: 'Desmistificando a IA para não técnicos',
        duration: '8 min',
        xp: 50,
        type: 'leitura',
        content: {
          intro: 'Antes de usar qualquer ferramenta de IA, você precisa entender o que ela é. Não precisamos virar engenheiros — mas precisamos entender o básico para usar bem.',
          sections: [
            {
              title: 'A analogia perfeita: um funcionário que leu tudo',
              body: 'Imagine que você contratou um funcionário que leu milhões de livros, artigos, posts, conversas. Ele não "pensa" como humano — ele reconhece padrões e gera respostas baseadas em tudo que leu. Isso é a IA de linguagem (LLM): um preditor de texto muito, muito avançado.',
              tip: 'A IA não tem opinião própria. Ela gera o que estatisticamente faz mais sentido dado o que você pediu. Por isso seu prompt é tudo.'
            },
            {
              title: 'Os 3 tipos de IA que você vai usar',
              body: `**1. IA de texto (LLM):** Claude, ChatGPT, Gemini — respondem perguntas, escrevem, analisam, criam estratégias.\n\n**2. IA de imagem:** Gemini (Nano Banana), Midjourney — geram imagens a partir de descrições.\n\n**3. IA de vídeo:** Higgsfield, Kling — geram ou transformam vídeos com IA.`,
            },
            {
              title: 'Por que usar IA no marketing?',
              body: 'Quem usa IA no marketing não trabalha mais — trabalha diferente. Você cria em horas o que levaria dias. Você testa 10 ideias onde antes testava 2. Você mantém consistência de marca sem depender de memória.',
              tip: 'IA não substitui sua criatividade. Ela amplifica. Você ainda precisa ter a ideia, a visão, o contexto do cliente. A IA executa mais rápido.'
            }
          ],
          quiz: [
            {
              question: 'O que é um LLM (Large Language Model)?',
              options: [
                'Um robô físico que escreve textos',
                'Um sistema que reconhece padrões em texto e gera respostas baseadas nisso',
                'Um banco de dados de respostas prontas',
                'Um humano digitando muito rápido'
              ],
              correct: 1,
              explanation: 'Correto! LLMs aprendem padrões de bilhões de textos e usam isso para gerar respostas. Não é magia — é estatística avançada.'
            },
            {
              question: 'Para que serve um bom prompt?',
              options: [
                'Para ativar a IA',
                'Para dar contexto e direção precisos, gerando respostas melhores',
                'Para economizar créditos da ferramenta',
                'Para deixar a IA mais rápida'
              ],
              correct: 1,
              explanation: 'O prompt é a diferença entre uma resposta genérica e uma resposta excelente. É a sua principal habilidade.'
            }
          ]
        }
      },
      {
        id: 'p1-m2',
        title: 'Claude vs GPT vs Gemini: qual usar?',
        subtitle: 'Entendendo as diferenças entre os modelos',
        duration: '10 min',
        xp: 50,
        type: 'leitura',
        content: {
          intro: 'Existem vários modelos de IA disponíveis. Cada um tem pontos fortes. Aqui vai um guia prático de quando usar cada um.',
          sections: [
            {
              title: 'Claude (Anthropic) — O analista estratégico',
              body: `**Melhor para:** Análise profunda, escrita longa e coerente, estratégia, documentos, projetos com contexto longo.\n\n**Versões:**\n- **Haiku:** Mais rápido e barato — bom para tarefas simples\n- **Sonnet:** Equilíbrio perfeito — use para marketing e conteúdo\n- **Opus:** O mais poderoso — para análises complexas\n\n**Diferencial:** Segue instruções com mais precisão. Excelente para manter contexto de marca através de Projetos.`,
              tip: 'Use Claude quando precisar de consistência, análise ou quando o contexto da sua marca precisar ser lembrado.'
            },
            {
              title: 'ChatGPT / GPT-4 (OpenAI) — O generalista',
              body: `**Melhor para:** Tarefas cotidianas, brainstorming, código simples, perguntas diretas.\n\n**Diferencial:** Grande ecossistema de plugins e GPTs personalizados. Interface muito popular.`,
            },
            {
              title: 'Gemini (Google) — O conectado',
              body: `**Melhor para:** Pesquisa atualizada (conectado ao Google), criação de imagens (Nano Banana), integração com Google Workspace.\n\n**Diferencial:** Acesso a informações em tempo real. Excelente para criar imagens com o Gemini Image (Nano Banana).`,
              tip: 'Para criar imagens, use o Gemini. Para análise de marca e estratégia, use o Claude.'
            },
            {
              title: 'Regra de ouro: use o certo para cada tarefa',
              body: `**Claude:** Estratégia, copy longa, projetos com contexto de marca\n**Gemini:** Pesquisa atual, criação de imagens (Nano Banana), integração Google\n**ChatGPT:** Tarefas rápidas, brainstorming geral`,
            }
          ],
          quiz: [
            {
              question: 'Você quer criar imagens para o Instagram da sua marca. Qual ferramenta usar?',
              options: ['Claude Opus', 'Gemini (Nano Banana)', 'ChatGPT texto', 'Nenhuma — IA não gera imagens'],
              correct: 1,
              explanation: 'O Gemini tem o gerador de imagens Nano Banana (Imagen 3) integrado, perfeito para criar imagens de marketing.'
            },
            {
              question: 'Você quer criar um projeto onde a IA sempre lembra o tom de voz da sua marca. Qual usar?',
              options: ['Gemini', 'ChatGPT', 'Claude com Projetos', 'Higgsfield'],
              correct: 2,
              explanation: 'O sistema de Projetos do Claude permite salvar instruções permanentes de marca que são aplicadas em todas as conversas do projeto.'
            }
          ]
        }
      },
    ]
  },
  {
    id: 2,
    title: 'O Maestro',
    subtitle: 'Dominando o Claude — da conta ao prompt perfeito',
    icon: 'brain',
    color: '#7C3AED',
    xpBonus: 200,
    modules: [
      {
        id: 'p2-m1',
        title: 'Criando sua conta e entendendo a interface',
        subtitle: 'Primeiros passos no Claude',
        duration: '5 min',
        xp: 30,
        type: 'leitura',
        content: {
          intro: 'Vamos começar do zero. Você vai criar sua conta no Claude e entender cada parte da interface antes de sair usando.',
          sections: [
            {
              title: 'Criando sua conta',
              body: `**Passo 1:** Acesse claude.ai\n**Passo 2:** Clique em "Sign up"\n**Passo 3:** Entre com Google ou crie conta com email\n**Passo 4:** Escolha o plano\n\n**Qual plano?**\n- **Gratuito:** Limitado — bom para experimentar\n- **Pro ($20/mês):** Recomendado — acesso ao Sonnet e Opus, sem limite de mensagens`,
              tip: 'Para uso profissional de marketing, o plano Pro vale cada centavo. São cerca de R$110/mês.'
            },
            {
              title: 'A interface do Claude — o que é cada coisa',
              body: `**Sidebar esquerda:** Histórico de conversas anteriores\n\n**Botão "Projetos":** OURO — aqui você cria projetos com instruções permanentes da sua marca\n\n**Campo de texto:** Onde você digita seus prompts\n\n**Modelos (ícone no canto):** Haiku (rápido), Sonnet (padrão), Opus (poderoso)`,
            },
            {
              title: 'O que são Projetos e por que mudam tudo',
              body: `Projetos são como "salas de trabalho" com memória.\n\nDentro de um Projeto você pode:\n- Adicionar **instruções permanentes** (ex: "sempre escreva no tom de voz da minha marca")\n- **Subir arquivos** (brandbook, guia de tom de voz, exemplos de posts)\n- O Claude vai **lembrar tudo isso em toda conversa** do projeto\n\nIsso é o que permite a IA manter consistência de marca.`,
              tip: 'Crie um Projeto chamado "Marketing [Nome da Marca]" e suba seu brandbook. A partir daí, toda IA já sabe quem você é.'
            }
          ],
          exercise: {
            title: 'Exercício: Criando seu primeiro Projeto de Marca',
            description: 'Vamos criar um Projeto no Claude que vai lembrar a identidade da sua marca.',
            steps: [
              'Acesse claude.ai e faça login',
              'Clique em "Projetos" na sidebar esquerda',
              'Clique em "Novo Projeto"',
              'Dê o nome: "Marketing [Nome da sua empresa]"',
              'Clique em "Instruções do projeto" e escreva: "Você é um especialista em marketing da [nome da empresa]. Nosso tom de voz é [descreva]. Nosso público é [descreva]. Sempre escreva neste estilo."',
              'Clique em "Salvar" — seu projeto está pronto!'
            ]
          }
        }
      },
      {
        id: 'p2-m2',
        title: 'A anatomia de um prompt perfeito',
        subtitle: 'Por que 90% das pessoas usam mal a IA',
        duration: '15 min',
        xp: 75,
        type: 'exercicio',
        content: {
          intro: 'A maioria das pessoas trata a IA como um motor de busca. Jogam 3 palavras e esperam milagre. Prompts ruins = resultados ruins. Vamos mudar isso.',
          sections: [
            {
              title: 'Os 5 elementos de um prompt poderoso',
              body: `**1. PAPEL:** Quem a IA deve ser\n**2. CONTEXTO:** O cenário e informações relevantes\n**3. TAREFA:** O que exatamente você quer\n**4. FORMATO:** Como deve ser a resposta\n**5. RESTRIÇÕES:** O que NÃO fazer`,
              tip: 'Você não precisa usar os 5 sempre. Mas quanto mais contexto, melhor a resposta.'
            },
            {
              title: 'Bom vs Ruim — veja a diferença na prática',
              body: 'Compare os exemplos abaixo e observe como o contexto transforma completamente o resultado.',
              prompts: [
                {
                  label: 'Exemplo 1: Caption para Instagram',
                  bad: 'Escreve uma legenda para o Instagram da minha empresa',
                  good: `Você é um copywriter especialista em Instagram para marcas de consultoria B2B.\n\nMinha empresa é a Sirius Strategy — consultoria que substitui equipes inteiras por sistemas autônomos de IA. Nosso tom é: direto, provocador, confiante. Sem clichês corporativos.\n\nCrie uma caption para um post sobre como empresas perdem dinheiro com call centers humanos.\n\nFormato: 3 parágrafos curtos + 5 hashtags relevantes. Máximo 150 palavras.`,
                  explanation: 'O prompt ruim dá zero contexto. A IA vai inventar uma empresa genérica. O prompt bom define quem você é, o tom, o assunto, o formato e o tamanho. O resultado vai ser publicável direto.'
                },
                {
                  label: 'Exemplo 2: Estratégia de conteúdo',
                  bad: 'Me dá ideias de conteúdo para o meu Instagram',
                  good: `Contexto: Sou dono de uma agência de marketing digital em São Paulo. Foco em PMEs do setor de saúde. Já tenho 3.200 seguidores, posto 3x por semana.\n\nMeu objetivo: aumentar engajamento e gerar leads qualificados (clínicas e consultórios).\n\nCrie um calendário editorial de 2 semanas (14 posts) com:\n- Tema de cada post\n- Tipo de conteúdo (carrossel, reels, estático)\n- Gancho de abertura (primeira linha)\n- CTA sugerido\n\nBase os temas em problemas reais de clínicas médicas com marketing digital.`,
                  explanation: 'O prompt ruim vai gerar ideias genéricas. O bom vai gerar um plano acionável específico para o seu contexto.'
                }
              ]
            },
            {
              title: 'Técnicas avançadas de prompting',
              body: `**Chain of thought:** Peça para a IA "pensar passo a passo" antes de responder — melhora análises complexas.\n\n**Few-shot:** Dê 2-3 exemplos do que você quer antes de pedir. "Aqui está o estilo que quero. [exemplos]. Agora crie um sobre X."\n\n**Role play:** "Você é um especialista em X com 15 anos de experiência. Como você abordaria Y?"\n\n**Iteração:** Nunca aceite a primeira resposta como final. Refine: "Bom, mas deixe mais direto e adicione um dado estatístico."`,
              tip: 'Prompting é uma conversa, não um pedido único. Itere, refine, melhore.'
            }
          ],
          quiz: [
            {
              question: 'Qual prompt vai gerar um resultado mais útil?',
              options: [
                '"Me ajuda com marketing"',
                '"Você é especialista em marketing para academias. Crie 5 posts para Instagram que gerem agendamentos de visita. Tom: motivacional mas realista. Formato: texto da legenda + sugestão de visual."',
                '"Marketing academia instagram posts"',
                '"Preciso de ajuda com meus posts"'
              ],
              correct: 1,
              explanation: 'O segundo prompt tem papel (especialista), contexto (academias), tarefa (5 posts), objetivo (agendamentos), tom e formato. É o único que vai gerar algo publicável.'
            },
            {
              question: 'O que significa "iterar" no contexto de prompting?',
              options: [
                'Repetir o mesmo prompt várias vezes',
                'Refinar e melhorar a resposta através de pedidos complementares',
                'Deletar a conversa e começar do zero',
                'Usar o modelo mais caro'
              ],
              correct: 1,
              explanation: 'Iterar é o processo de afinar a resposta. "Bom, mas encurte. / Mais criativo. / Adicione um dado real." Assim você chega na perfeição.'
            }
          ]
        }
      },
      {
        id: 'p2-m3',
        title: 'Projetos: fazendo a IA lembrar sua marca para sempre',
        subtitle: 'O segredo da consistência com IA',
        duration: '12 min',
        xp: 60,
        type: 'pratica',
        content: {
          intro: 'Este é um dos recursos mais poderosos e menos usados do Claude. Com Projetos, sua marca nunca mais precisa ser explicada do zero.',
          sections: [
            {
              title: 'Como configurar um Projeto de marca do zero',
              body: `**O que colocar nas instruções do Projeto:**\n\n1. **Quem você é:** Nome, segmento, diferenciais\n2. **Tom de voz:** Formal? Descontraído? Provocador?\n3. **Público-alvo:** Quem é seu cliente ideal?\n4. **O que nunca dizer:** Palavras e frases que não combinam com a marca\n5. **Exemplos de posts que você aprova:** Cole 3-5 exemplos reais\n\nQuando bem configurado, o Claude vai escrever como se fosse um membro sênior do seu time.`,
              tip: 'Suba seu brandbook como arquivo no Projeto. O Claude vai ler e aplicar automaticamente.'
            },
            {
              title: 'Como fazer a IA seguir o contexto da marca em posts',
              body: `Dentro do projeto, basta pedir naturalmente:\n\n"Crie uma caption para nosso post de segunda sobre X"\n\nO Claude já sabe:\n- Seu tom de voz\n- Seu público\n- Seu estilo\n- O que evitar\n\n**O segredo:** Quanto melhor suas instruções do projeto, menos você precisa explicar em cada conversa.`,
              prompts: [
                {
                  label: 'Template de instrução de Projeto (copie e adapte)',
                  good: `Você é o assistente de marketing da [NOME DA EMPRESA].\n\n**Sobre a empresa:**\n[Nome] é uma [tipo de empresa] que [o que faz]. Nosso diferencial é [diferencial].\n\n**Tom de voz:** [ex: direto, sem corporativês, usa humor sutil, nunca usa exclamação em excesso]\n\n**Público-alvo:** [ex: donos de PMEs com 10-50 funcionários, entre 30-50 anos, no Brasil]\n\n**Nunca use:**\n- Palavras: [ex: "transformação digital", "soluções inovadoras"]\n- Tom: [ex: nunca seja vago, nunca prometa sem provas]\n\n**Exemplos de posts que aprovamos:**\n[Cole 2-3 posts reais que você publicou e gostou]`,
                  explanation: 'Este template faz o Claude se tornar um especialista na sua marca. Quanto mais detalhes, melhor.'
                }
              ]
            }
          ],
          exercise: {
            title: 'Exercício prático: Configure seu Projeto de Marca',
            description: 'Use o template acima para criar as instruções do seu Projeto no Claude. Após criar, teste pedindo uma caption para Instagram.',
            steps: [
              'Abra o Claude e vá em Projetos',
              'Crie um novo projeto com o nome da sua marca',
              'Cole o template de instruções adaptado para sua empresa',
              'Suba seu brandbook ou guia de comunicação como arquivo (se tiver)',
              'Teste: "Crie uma caption para o Instagram sobre [tema relevante]"',
              'Avalie: a IA soou como sua marca? Ajuste as instruções até soar certo'
            ]
          }
        }
      }
    ]
  },
  {
    id: 3,
    title: 'O Criador',
    subtitle: 'Marketing para Instagram e TikTok com IA',
    icon: 'mobile',
    color: '#DC2626',
    xpBonus: 250,
    modules: [
      {
        id: 'p3-m1',
        title: 'A mentalidade de conteúdo viral',
        subtitle: 'Por que alguns posts explodem e outros não',
        duration: '12 min',
        xp: 60,
        type: 'leitura',
        content: {
          intro: 'Antes de criar conteúdo com IA, você precisa entender o que faz um post ser viral. A IA vai executar — mas a estratégia é sua.',
          sections: [
            {
              title: 'O algoritmo quer uma coisa: retenção',
              body: `Instagram e TikTok medem o sucesso por uma coisa: as pessoas ficaram ou foram embora?\n\n**O que gera retenção:**\n- Gancho forte nos primeiros 2 segundos\n- Promessa de algo útil ou surpreendente\n- Formato que convida à interação (salvar, compartilhar, comentar)\n\n**O que mata o alcance:**\n- Começar com o nome da empresa\n- Primeiro frame com muito texto\n- Conteúdo que só fala de você (sem valor para quem assiste)`,
              tip: 'Regra de ouro: se você fosse um seguidor aleatório, pararia de rolar o feed por esse post? Se não, reescreva o gancho.'
            },
            {
              title: 'Os 5 formatos que mais viralizam em 2026',
              body: `**1. Desmistificação:** "Pare de acreditar que X. A verdade é Y."\n**2. Lista de hacks:** "5 coisas que [público] faz errado (e como corrigir)"\n**3. Antes e depois:** Mostre transformação real com evidência\n**4. POV/Cenário:** "POV: você finalmente [benefício]"\n**5. Polêmica inteligente:** Uma opinião contrária à maioria, bem fundamentada`,
              tip: 'Você não precisa criar conteúdo novo todo dia. Pegue UM insight bom e adapte para os 5 formatos. São 5 posts.'
            },
            {
              title: 'Consistência de marca no conteúdo',
              body: `Viral sem identidade é só ruído. Você quer viralizar E ser reconhecido.\n\n**Como manter consistência:**\n- Paleta de cores fixa (sempre as mesmas 3-4 cores)\n- Fonte padrão em todos os posts\n- Tom de voz igual (não muda de formal a meme de um post para outro)\n- Elemento visual recorrente (moldura, elemento gráfico, sua assinatura)\n\nCom IA: crie um template no Canva + instrução no Claude com o estilo. Pronto.`,
            }
          ],
          quiz: [
            {
              question: 'Qual gancho tem mais chance de parar o scroll?',
              options: [
                '"A Empresa X está lançando seu novo serviço!"',
                '"Você está perdendo clientes por causa disso (e nem sabe)"',
                '"Olá pessoal, tudo bem? Hoje vou falar sobre..."',
                '"#marketing #negócios #empreendedorismo"'
              ],
              correct: 1,
              explanation: 'O segundo cria curiosidade imediata e aponta para uma dor do público. Os outros começam com foco na empresa, não no seguidor.'
            }
          ]
        }
      },
      {
        id: 'p3-m2',
        title: 'Prompts para Instagram e TikTok',
        subtitle: 'Scripts, captions e estratégias prontos para usar',
        duration: '18 min',
        xp: 100,
        type: 'exercicio',
        content: {
          intro: 'Aqui você vai receber prompts prontos e exemplos reais de resultado. Copie, adapte e publique.',
          sections: [
            {
              title: 'Prompts para Captions virais no Instagram',
              body: 'Use estes prompts no Claude (dentro do seu Projeto de Marca):',
              prompts: [
                {
                  label: 'Caption para engajamento (salvar e compartilhar)',
                  good: `Crie uma caption para Instagram sobre [TEMA].\n\nObjetivo: fazer as pessoas salvarem o post.\nFormato:\n- Linha 1: gancho poderoso (máx. 8 palavras, sem emoji no começo)\n- Parágrafo 2-3 linhas: o conteúdo de valor\n- Lista com 3-5 pontos práticos\n- CTA: peça para salvar porque "vão precisar disso"\n- 5 hashtags relevantes (mistura nicho + amplo)\n\nTom: [seu tom de voz]\nPúblico: [seu público]`,
                  explanation: 'Este formato gera salvamentos porque entrega valor real e pede explicitamente. Salvamentos são o sinal mais forte de conteúdo bom para o algoritmo.'
                },
                {
                  label: 'Script para Reels / TikTok (talking head)',
                  good: `Crie um script para um Reel de 30-45 segundos sobre [TEMA].\n\nFormato:\n- [0-3s] GANCHO: frase de impacto visual/verbal\n- [3-15s] PROBLEMA: agite a dor do público\n- [15-30s] SOLUÇÃO: seu método/insight\n- [30-45s] CTA: o que fazer agora\n\nEstilo: direto, sem "ã", sem "né", sem rodeios.\nCada bloco deve caber em 1-2 frases curtas.\nUse linguagem conversacional, não de apresentação formal.`,
                  explanation: 'Scripts bem estruturados com tempos definidos fazem a edição ser mais fácil e garantem que o conteúdo seja consumido até o final (aumentando retenção).'
                },
                {
                  label: 'Carrossel educativo (mais salvo formato do Instagram)',
                  good: `Crie o texto de um carrossel de 7 slides sobre [TEMA].\n\nSlide 1 (capa): Título provocador que gere curiosidade\nSlide 2-6 (conteúdo): Um ponto por slide, texto curto (máx 30 palavras por slide)\nSlide 7 (CTA): Resumo + pedido de ação\n\nCada slide deve:\n- Ter um título (máx 5 palavras)\n- Ter o corpo (máx 25 palavras)\n- Fluir naturalmente para o próximo\n\nTema do carrossel: [seu tema]\nPúblico: [seu público]`,
                  explanation: 'Carrosséis educativos são o formato com maior taxa de salvamento no Instagram. Um bom carrossel sobre o nicho certo pode salvar meses de crescimento.'
                }
              ]
            },
            {
              title: 'Manter consistência de marca nas legendas',
              body: `A IA pode escrever com a voz da sua marca, mas você precisa ensinar essa voz.\n\n**Como ensinar:**\n1. Cole no Projeto 3-5 posts que você publicou e gostou\n2. Diga: "Este é o tom que quero. Analise e mantenha este estilo em tudo."\n3. Quando pedir novos posts, a IA vai espelhar o estilo\n\n**Como testar:**\nDepois de criar um post, pergunte: "Este post soa como minha marca ou parece genérico? O que mudar?"`,
            }
          ],
          exercise: {
            title: 'Desafio: crie sua semana de conteúdo',
            description: 'Use os prompts acima para criar 5 posts para a sua semana (1 por dia).',
            steps: [
              'Abra seu Projeto de Marca no Claude',
              'Escolha 5 temas relevantes para o seu nicho',
              'Use o prompt de caption para segunda e quarta',
              'Use o prompt de Reels para terça',
              'Use o prompt de carrossel para quinta',
              'Sexta: passe tudo por revisão: "Estes 5 posts soam consistentes com minha marca? O que ajustar?"'
            ]
          }
        }
      }
    ]
  },
  {
    id: 4,
    title: 'O Artista',
    subtitle: 'Criando imagens incríveis com Gemini (Nano Banana)',
    icon: 'palette',
    color: '#059669',
    xpBonus: 250,
    modules: [
      {
        id: 'p4-m1',
        title: 'Gemini Image (Nano Banana) — o básico',
        subtitle: 'Seu novo designer visual com IA',
        duration: '10 min',
        xp: 60,
        type: 'leitura',
        content: {
          intro: 'O Gemini tem um gerador de imagens integrado chamado Nano Banana (Imagen 3 Pro). É um dos melhores do mundo para fotos realistas, com texto perfeito e consistência de personagem.',
          sections: [
            {
              title: 'Acessando o Nano Banana no Gemini',
              body: `**Passo a passo:**\n1. Acesse gemini.google.com\n2. Na caixa de mensagem, clique no ícone de imagem OU diga "Gere uma imagem de..."\n3. O Gemini vai usar o Imagen 3 automaticamente\n\n**Versões disponíveis:**\n- **Nano Banana 2 (Flash):** Rápido, gratuito — bom para testes\n- **Nano Banana Pro (Gemini Advanced):** O mais poderoso — imagens em 4K, texto perfeito, consistência de personagem`,
              tip: 'Para uso profissional, o Gemini Advanced (com Nano Banana Pro) vale o investimento. Ele gera imagens que parecem produção profissional.'
            },
            {
              title: 'Anatomia de um prompt de imagem perfeito',
              body: `**Fórmula:** [Sujeito] + [Ação/Estado] + [Ambiente] + [Estilo fotográfico] + [Iluminação] + [Câmera/Composição]\n\n**Exemplo básico:** "Mulher"\n**Exemplo bom:** "Mulher de 35 anos em terno azul navy, olhando para a câmera com expressão confiante, escritório moderno com janelas grandes ao fundo, fotografia corporativa profissional, iluminação natural suave lateral, f/2.8 portrait, cor quente"`,
              tip: 'Quanto mais detalhes visuais específicos, mais controle você tem sobre o resultado.'
            }
          ],
          prompts: [
            {
              label: 'Prompt para foto de produto (Instagram)',
              good: `Uma [PRODUTO] em [COR], sobre uma mesa de mármore branco com pétalas de flores secas ao redor, fundo levemente desfocado em tons creme, iluminação de estúdio suave com sombra dramática do lado esquerdo, fotografia de produto premium, estilo editorial de moda, resolução 4K`,
              explanation: 'Este tipo de prompt gera fotos de produto que custam centenas de reais em estúdio. Com IA, você gera em segundos.'
            },
            {
              label: 'Prompt para post de marca pessoal (LinkedIn/Instagram)',
              good: `[Descreva a pessoa: gênero, idade, estilo], sorrindo naturalmente em um café moderno com paredes de concreto e plantas, segurando um copo de café, roupas casuais profissionais em tons neutros, fotografia lifestyle autêntica, luz natural da janela, bokeh sutil ao fundo, tom de cor quente e acolhedor`,
              explanation: 'Perfeito para criar conteúdo de marca pessoal sem precisar de uma sessão fotográfica toda vez.'
            }
          ]
        }
      },
      {
        id: 'p4-m2',
        title: 'Criando avatares e personagens consistentes',
        subtitle: 'O segredo para manter o mesmo personagem',
        duration: '15 min',
        xp: 80,
        type: 'pratica',
        content: {
          intro: 'Um dos superpoderes da IA de imagem é criar personagens que aparecem em múltiplos contextos — sempre iguais. Veja como fazer isso.',
          sections: [
            {
              title: 'Por que a consistência de personagem importa no marketing',
              body: `Imagina um mascote da sua marca que aparece em todo conteúdo — sempre igual, em situações diferentes. Ou um avatar de influencer que você usa para representar sua empresa.\n\nCom IA, você pode:\n- Criar um personagem base\n- Coloca-lo em infinitas situações\n- Manter aparência, roupa e personalidade idênticas\n\nIsso cria reconhecimento de marca instantâneo.`,
            },
            {
              title: 'Técnica do "Character Sheet" para consistência',
              body: `Para manter um personagem consistente, crie um "Character Sheet" — uma descrição ultra detalhada:\n\n**Inclua:**\n- Gênero, idade aproximada, etnia\n- Cor e estilo do cabelo (exato)\n- Cor dos olhos\n- Estrutura facial (jawline forte, rosto redondo, etc)\n- Roupa padrão (se tiver)\n- Tom de pele exato ("pele morena clara com subtom dourado")\n\nSempre comece seus prompts com este Character Sheet antes de descrever a cena.`,
              prompts: [
                {
                  label: 'Template de Character Sheet',
                  good: `[Nome do personagem]: Mulher de aproximadamente 28 anos, cabelo preto liso na altura do ombro com franja lateral, olhos castanhos escuros amendoados, pele morena clara com subtom dourado, rosto oval com maçãs do rosto suaves, expressão padrão: sorriso natural confiante.\n\nRoupa padrão: blazer azul marinho sobre camiseta branca.\n\nAgora crie: [NOME] em [SITUAÇÃO/CENA], [ESTILO FOTOGRÁFICO], [ILUMINAÇÃO]`,
                  explanation: 'Usando sempre este Character Sheet no início do prompt, o Gemini vai gerar o mesmo personagem em cenas diferentes. Combine com o seed (número aleatório) para mais consistência ainda.'
                }
              ]
            },
            {
              title: 'Personagens animados e estilizados (não só realistas)',
              body: `A IA não gera só fotos realistas. Você pode criar:\n\n**Estilo anime:** "no estilo anime japonês dos anos 90, vibrante, linhas definidas"\n**Estilo cartoon:** "estilo cartoon moderno 2D, traços limpos, paleta de cores limitada"\n**Estilo 3D:** "render 3D estilo Pixar/DreamWorks, textura suave, iluminação cinematográfica"\n**Estilo ilustração:** "ilustração digital em aquarela, traços suaves, estilo editorial"\n**Estilo mascote:** "mascote vetorial minimalista, estilo flat design, cores da marca [cor1, cor2]"`,
              tip: 'Para mascotes de marca, o estilo vetorial flat é o mais versátil — funciona em qualquer tamanho e contexto.'
            }
          ],
          exercise: {
            title: 'Crie seu personagem de marca',
            description: 'Vamos criar um personagem ou mascote para usar no seu conteúdo.',
            steps: [
              'Decida: personagem realista ou animado/mascote?',
              'Escreva o Character Sheet detalhado (use o template)',
              'Gere a primeira imagem no Gemini com a descrição completa',
              'Se não ficou certo, refine: "Mantenha o personagem mas mude X"',
              'Salve o Character Sheet — você vai usar em todo conteúdo futuro',
              'Teste em 3 cenas diferentes para verificar consistência'
            ]
          }
        }
      }
    ]
  },
  {
    id: 5,
    title: 'O Diretor',
    subtitle: 'Vídeos virais com Higgsfield e Kling',
    icon: 'video',
    color: '#D97706',
    xpBonus: 300,
    modules: [
      {
        id: 'p5-m1',
        title: 'Higgsfield — criando vídeos cinematográficos',
        subtitle: 'A ferramenta favorita dos criadores virais',
        duration: '15 min',
        xp: 80,
        type: 'leitura',
        content: {
          intro: 'O Higgsfield é uma das melhores ferramentas de vídeo com IA para conteúdo viral em redes sociais. Ele tem presets específicos para TikTok e Instagram Reels.',
          sections: [
            {
              title: 'O que é o Higgsfield e como acessar',
              body: `Higgsfield.ai é uma plataforma de geração de vídeo com IA que:\n- Gera vídeos a partir de texto (text-to-video)\n- Transforma fotos em vídeos animados\n- Tem presets específicos para viralizar em redes sociais\n- Usa tecnologia Sora 2 (OpenAI) + modelos próprios\n\n**Acesso:** higgsfield.ai — crie uma conta. Tem plano gratuito para testar.`,
              tip: 'Comece testando no plano gratuito. Quando ver o potencial, o plano pago se paga com 1 cliente novo.'
            },
            {
              title: 'Os presets mais virais do Higgsfield',
              body: `O Higgsfield tem presets prontos que funcionam no algoritmo:\n\n**Para TikTok/Reels rápidos:**\n- "Gen-Z TikTok Edit" — cortes rápidos, meme-timing, altamente viral\n- "Viral Cut" — pacing alto, transições marcadas, ritmo de beat\n\n**Para Instagram (mais slow):**\n- "Cinematic Calm" — movimento suave, atmosfera luxo/fashion\n- "Luxury Ad" — apresentação lenta e premium para produtos\n\n**Para marcas:**\n- "Dynamic Sport Ad" — montagem rápida, ideal para sapatos/moda esporte\n- "Minimalist Corporate" — pacing equilibrado, tech e serviços`,
              tip: 'Teste a mesma cena com 2 pacing diferentes: lento para Instagram, rápido para TikTok. Dobre seu conteúdo sem dobrar o trabalho.'
            },
            {
              title: 'Prompts poderosos para o Higgsfield',
              body: 'A estrutura de prompt para vídeo é diferente de imagem. Você precisa descrever o movimento.',
              prompts: [
                {
                  label: 'Prompt para vídeo de produto viral (TikTok)',
                  good: `Um [PRODUTO] em [COR] é revelado lentamente — começa desfocado e vai ganhando nitidez. A câmera faz um arco suave ao redor do produto. Iluminação dramática com rim light branco. Fundo escuro. O produto tem pequenas gotículas de água que refletem a luz. Movimento de câmera: dolly zoom. Estilo: commercial photography, premium product reveal. Duração 5-8 segundos.`,
                  explanation: 'Descreva sempre: o que acontece, como a câmera se move, a iluminação, o mood. Vídeos sem descrição de movimento ficam estáticos.'
                },
                {
                  label: 'Prompt para vídeo de marca pessoal (Instagram)',
                  good: `[Pessoa: descrição] caminhando em direção à câmera em uma rua de paralelepípedo com árvores ao fundo, outono, folhas caindo lentamente. Câmera levemente baixa, ângulo de 15 graus. Movimento da câmera: steadicam tracking shot para trás enquanto a pessoa avança. Luz dourada do final da tarde (golden hour). Estilo: lifestyle editorial, magazine shoot. Slow motion 50%.`,
                  explanation: 'Para marca pessoal, vídeos de movimento no ambiente real funcionam muito melhor do que fundos neutros. O contexto conta história.'
                }
              ]
            },
            {
              title: 'Criando um influencer virtual com Higgsfield',
              body: `O Higgsfield tem uma funcionalidade chamada "AI Influencer" — você cria um personagem e ele aparece em vídeos diferentes.\n\nComo usar:\n1. Suba uma foto de referência do seu personagem/mascote\n2. Descreva a cena em que ele deve aparecer\n3. O Higgsfield anima o personagem na cena\n\nIsso é perfeito para marcas que querem um rosto consistente sem contratar influenciador.`,
              tip: 'Combine: crie o personagem no Gemini (Nano Banana), depois use esse personagem no Higgsfield para vídeos. Pipeline completo de conteúdo.'
            }
          ]
        }
      },
      {
        id: 'p5-m2',
        title: 'Kling — vídeos longos e realistas',
        subtitle: 'Para quando você precisa de mais duração e qualidade',
        duration: '12 min',
        xp: 70,
        type: 'leitura',
        content: {
          intro: 'O Kling AI é especialista em vídeos mais longos e cinematograficamente realistas. É o favorito para campanhas e vídeos que precisam parecer produção profissional.',
          sections: [
            {
              title: 'Quando usar Kling vs Higgsfield',
              body: `**Use Higgsfield quando:**\n- Conteúdo rápido para TikTok/Reels\n- Presets virais prontos\n- Personagem AI Influencer\n- Conteúdo de produto em estilo ad\n\n**Use Kling quando:**\n- Precisa de vídeo mais longo (até 3 minutos)\n- Quer realismo cinematográfico máximo\n- Cenas complexas com múltiplos elementos\n- Qualidade de campanha publicitária`,
            },
            {
              title: 'Os 4 elementos do prompt Kling perfeito',
              body: `**1. Sujeito:** O que/quem aparece no vídeo\n**2. Ação:** O que acontece (seja ESPECÍFICO com movimento)\n**3. Câmera:** Como a câmera se comporta\n**4. Atmosfera:** Luz, cor, humor\n\n**Erro mais comum:** Escrever "faça o vídeo se mover". Isso é vago demais. Escreva: "câmera faz tracking shot da esquerda para direita, 20cm acima do chão, velocidade constante".`,
              prompts: [
                {
                  label: 'Prompt Kling para vídeo de serviço/empresa',
                  good: `Uma mulher de negócios em terno bege caminha com confiança por um corredor de escritório moderno com paredes de vidro. Câmera: dolly shot seguindo ela de lado, à altura dos ombros. Profundidade de campo rasa (f/1.8), colegas de trabalho desfocados ao fundo. Luz: fluorescente fria do teto + luz natural das janelas criando contraste suave. Tom: confiante, executivo, moderno. Duração: 8 segundos. Sem cortes.`,
                  explanation: 'Note como cada elemento está descrito com precisão: posição da câmera, abertura, qualidade da luz, duração. O Kling responde muito bem a direção cinematográfica específica.'
                },
                {
                  label: 'Prompt Kling para vídeo de lifestyle (produto)',
                  good: `Mãos femininas com unhas em nude seguram uma [PRODUTO] enquanto está sentada em um café minimalista ao fundo desfocado. A câmera faz um lento push-in (zoom aproximado), partindo de plano médio para close-up nas mãos. A luz entra pela janela à esquerda criando um facho de luz quente. Uma bebida quente ao lado, vapor visível. Movimento extremamente suave, quase imperceptível. Mood: aconchegante, luxo cotidiano. 6 segundos.`,
                  explanation: 'Vídeos de produto com hands-on têm muito mais engajamento do que produto estático. A "ação" do humano segurando cria conexão emocional.'
                }
              ]
            }
          ],
          quiz: [
            {
              question: 'Para criar um Reel rápido e viral de produto para TikTok, qual ferramenta usar?',
              options: ['Kling (mais realismo)', 'Higgsfield com preset Gen-Z TikTok Edit', 'Qualquer uma, tanto faz', 'Nenhuma — IA não faz Reels'],
              correct: 1,
              explanation: 'Higgsfield tem presets específicos para pacing viral do TikTok/Reels. Para conteúdo rápido e viral, Higgsfield é a escolha certa.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 6,
    title: 'O Arquiteto',
    subtitle: 'Avatares, personagens e identidade visual consistente',
    icon: 'robot',
    color: '#7C3AED',
    xpBonus: 250,
    modules: [
      {
        id: 'p6-m1',
        title: 'Sistema completo de avatares para sua marca',
        subtitle: 'Do conceito ao personagem definitivo',
        duration: '20 min',
        xp: 100,
        type: 'pratica',
        content: {
          intro: 'Vamos criar um sistema completo de personagens para sua marca — desde o conceito até o uso em todas as plataformas.',
          sections: [
            {
              title: 'O pipeline completo de criação de personagem',
              body: `**Etapa 1 — Conceito (Claude):**\nDescreva o personagem para o Claude e peça para criar um Character Sheet completo\n\n**Etapa 2 — Imagem base (Gemini/Nano Banana):**\nUse o Character Sheet para gerar a imagem de referência\n\n**Etapa 3 — Variações:**\nGere o mesmo personagem em 5-10 situações diferentes\n\n**Etapa 4 — Animação (Higgsfield):**\nAnime o personagem usando as fotos como referência\n\n**Etapa 5 — Biblioteca:**\nCrie uma pasta com todas as variações — sua biblioteca de personagem está pronta`,
              prompts: [
                {
                  label: 'Prompt para criar Character Sheet no Claude',
                  good: `Vou criar um personagem/mascote para a minha marca [NOME].\n\nNossa marca é [descrição breve]. Nosso público é [público]. Nossa paleta de cores é [cores].\n\nCrie um Character Sheet completo para um personagem que:\n- Represente os valores da marca\n- Seja memorável e único\n- Funcione tanto realista quanto animado\n- Tenha personalidade definida\n\nO Character Sheet deve incluir:\n1. Descrição física ultra-detalhada (para usar em prompts de IA)\n2. Personalidade e expressões características\n3. Guarda-roupa padrão\n4. 5 situações ideais para usar esse personagem no conteúdo\n5. Nome sugerido`,
                  explanation: 'Deixe o Claude criar a ideia — ele vai pensar nos valores da marca, na psicologia do público e no que funciona visualmente. Você refina.'
                }
              ]
            },
            {
              title: 'Mantendo consistência entre Gemini e Higgsfield',
              body: `O maior desafio é manter o mesmo personagem entre ferramentas diferentes.\n\n**Estratégia:**\n1. Gere a imagem base no Gemini\n2. Baixe a imagem\n3. Suba como referência no Higgsfield ("Upload character reference")\n4. O Higgsfield vai animar ESSE personagem\n\nO personagem vai ser o mesmo nos dois. Isso é o seu ativo de conteúdo.`,
              tip: 'Salve o seed do Gemini quando gerar uma imagem que gostar. Usar o mesmo seed com o mesmo prompt vai gerar imagens muito similares.'
            }
          ],
          exercise: {
            title: 'Crie seu sistema de personagem completo',
            description: 'Um exercício de 4 etapas para criar sua biblioteca de personagem.',
            steps: [
              'No Claude: use o prompt do Character Sheet para criar seu personagem',
              'No Gemini: gere a imagem base usando o Character Sheet completo',
              'Gere 5 variações: escritório, ao ar livre, comemorando, pensativo, trabalhando',
              'No Higgsfield: suba a melhor foto e crie um vídeo de 5s do personagem em movimento',
              'Salve tudo em uma pasta: "Personagem [Nome] — Biblioteca"',
              'Teste: publique uma peça com o personagem e monitore o engajamento'
            ]
          }
        }
      }
    ]
  },
  {
    id: 7,
    title: 'O Construtor',
    subtitle: 'BONUS: Criando apps e sites com Lovable',
    icon: 'build',
    color: '#DC2626',
    xpBonus: 400,
    modules: [
      {
        id: 'p7-m1',
        title: 'O que é o Lovable e como funciona',
        subtitle: 'Crie sites e apps sem saber código',
        duration: '10 min',
        xp: 60,
        type: 'leitura',
        content: {
          intro: 'O Lovable é uma plataforma que transforma descrições em texto em sites e aplicativos funcionais. Com ele + Claude, você cria em horas o que levaria semanas.',
          sections: [
            {
              title: 'O fluxo Claude → Lovable',
              body: `O segredo é usar o Claude para criar o prompt perfeito ANTES de ir para o Lovable.\n\n**Fluxo correto:**\n1. Você descreve o que quer criar para o Claude\n2. Envia prints de referências visuais que você ama\n3. Claude cria um prompt ultra detalhado para o Lovable\n4. Você cola esse prompt no Lovable\n5. O Lovable gera o site/app\n\nIsso funciona porque o Claude sabe o que o Lovable precisa para gerar bons resultados.`,
            },
            {
              title: 'Como enviar referências visuais para o Claude',
              body: `**Para criar bons prompts para o Lovable, envie prints de:**\n\n- Sites que você ama o design\n- Cores e fontes que representam sua marca\n- Elementos específicos (um header que gostou, um card bonito)\n- O seu brandbook em PDF\n\n**Como fazer:**\n1. Tire print ou salve as imagens\n2. No Claude, clique no ícone de imagem no campo de texto\n3. Suba as imagens junto com a mensagem\n4. Diga: "Analise estas referências visuais e crie um prompt detalhado para o Lovable criar [o que você quer], seguindo este estilo"`,
              tip: 'Quanto mais referências específicas você der, mais o resultado vai parecer com o que você imaginava.'
            },
            {
              title: 'Enviando o site inteiro para análise',
              body: `Você também pode pedir para o Claude analisar um site inteiro:\n\n**Como fazer:**\n1. Tire screenshots do site de referência (página por página)\n2. Suba todos os screenshots no Claude\n3. Diga: "Analise a estrutura, hierarquia visual e elementos de UI/UX deste site. Depois crie um prompt para o Lovable recriar algo com o mesmo nível de qualidade para [minha empresa], mas com identidade única."\n\nIsso é como um especialista em UI/UX faria — você analisa o que funciona e adapta.`,
            }
          ],
          prompts: [
            {
              label: 'Prompt para pedir ao Claude um prompt de Lovable',
              good: `Vou criar uma landing page para [EMPRESA/PRODUTO] usando o Lovable.\n\nAnexei:\n- [Screenshots de sites de referência]\n- [Brandbook ou guia de cores]\n\nAnálise as referências e crie um prompt detalhado para o Lovable que:\n1. Descreva a estrutura das seções (hero, features, testimonials, CTA)\n2. Especifique as cores exatas (hex codes da minha marca)\n3. Descreva a tipografia e hierarquia\n4. Liste os elementos de UI (cards, botões, formulários)\n5. Descreva o mood e estilo visual\n6. Inclua os textos de placeholder para cada seção\n\nA landing page é para [objetivo da página: gerar leads / vender produto / apresentar serviço].`,
              explanation: 'Este prompt faz o Claude criar um brief completo que o Lovable vai entender perfeitamente. É a diferença entre um resultado genérico e um resultado profissional.'
            },
            {
              label: 'UI/UX: como explicar o que você quer para o Claude',
              good: `Quero criar [tipo de página]. Analise esta referência de UI/UX [envie print].\n\nMe explique:\n1. O que está funcionando bem neste design e por quê\n2. Como adaptar este estilo para minha marca [descreva]\n3. Quais elementos eu devo manter vs substituir\n4. Crie o prompt para o Lovable recriar este nível de qualidade\n\nMinha marca: [cores, fontes, estilo]\nMeu público: [público-alvo]\nObjetivo da página: [objetivo]`,
              explanation: 'Pedir ao Claude para ANALISAR antes de CRIAR gera resultados muito melhores. Ele vai entender o raciocínio de design antes de reproduzir.'
            }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // VENDAS — BÁSICO (Fase 10)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 10,
    area: 'vendas',
    level: 'basico',
    title: 'O Vendedor Aumentado',
    subtitle: 'IA aplicada ao processo comercial do início ao fim',
    icon: 'trending',
    color: '#059669',
    xpBonus: 250,
    modules: [
      {
        id: 'v1-m1',
        title: 'IA no processo de vendas: onde usar de verdade',
        subtitle: 'O mapa completo de como IA se encaixa na sua rotina comercial',
        duration: '10 min',
        xp: 60,
        type: 'leitura',
        content: {
          intro: 'A IA já está transformando a forma como equipes de vendas trabalham. Não é papo de futuro — é presente. Aqui você vai entender onde encaixar IA no seu dia a dia de vendas sem virar um técnico.',
          sections: [
            {
              title: 'O mapa do processo comercial com IA',
              body: `Todo processo de vendas tem etapas. A IA pode ajudar em todas — mas em algumas ela brilha de verdade.\n\n**Prospecção:** Pesquisar leads, entender o perfil ideal, encontrar empresas novas → IA economiza horas\n\n**Abordagem:** Cold emails, scripts de cold call, personalização em escala → IA multiplica resultados\n\n**Qualificação:** Perguntas certas, análise de fit, priorizar leads quentes → IA ajuda a não perder tempo\n\n**Proposta:** Apresentações adaptadas por cliente, cálculo de ROI, argumentação → IA gera rascunhos em segundos\n\n**Follow-up:** Sequências de mensagens, lembretes, reativação de leads frios → IA automatiza sem perder o toque humano\n\n**Fechamento:** Preparação para objeções, simulação de negociação → IA treina você antes da reunião real`,
              tip: 'Comece onde dói mais. Se sua maior perda de tempo é pesquisa de prospects, comece aí. Se é no follow-up, comece aí. IA serve onde você mais precisa.'
            },
            {
              title: 'O que a IA faz muito bem em vendas',
              body: `**1. Personalização em escala:** Antes, personalizar exigia tempo. Com IA, você personaliza 50 emails em 30 minutos.\n\n**2. Pesquisa de prospects:** Em 5 minutos, IA monta um briefing completo de qualquer empresa ou pessoa.\n\n**3. Scripts adaptativos:** IA cria scripts diferentes para CEO, Diretor e Analista — cada um com a linguagem certa.\n\n**4. Simulação de objeções:** IA faz o papel do cliente mais difícil para você treinar respostas antes da reunião real.\n\n**5. Análise de histórico:** "Analise essas 10 propostas perdidas e me diga o padrão de rejeição." IA identifica o que você não vê.`,
            },
            {
              title: 'O que a IA NÃO faz — e por que isso é bom para você',
              body: `IA não fecha vendas. Você fecha.\n\nRelacionamento genuíno, empatia, leitura de linguagem corporal, o timing certo de uma piada, sentir quando o cliente está prestes a ceder — isso é seu.\n\nIA amplifica sua capacidade. O vendedor que usa IA tem mais tempo para o que realmente importa: construir relacionamentos e fechar negócios.\n\n**A lógica:** IA tira de você as 4 horas de pesquisa e preparação. Sobram 4 horas a mais para estar na frente do cliente.`,
              tip: '"O vendedor que usa IA não é substituído pela IA. É promovido para o nível que outros vendedores não conseguem alcançar." — Esta é a vantagem competitiva que você está construindo agora.'
            }
          ],
          quiz: [
            {
              question: 'Em qual etapa do processo de vendas a IA tem MENOR impacto?',
              options: [
                'Pesquisa e qualificação de prospects',
                'Criação de cold emails personalizados',
                'Leitura emocional e empatia na reunião presencial',
                'Preparação de scripts e respostas a objeções'
              ],
              correct: 2,
              explanation: 'IA é excelente em tarefas analíticas, textuais e de preparação. Mas a conexão humana genuína, empatia e leitura emocional ao vivo continuam sendo seu maior diferencial.'
            },
            {
              question: 'Qual é a principal vantagem de usar IA na personalização de abordagens?',
              options: [
                'Eliminar a necessidade de um time de vendas',
                'Personalizar em escala — o que antes levaria dias, agora leva minutos',
                'Garantir que todos os emails sejam idênticos',
                'Substituir o CRM da empresa'
              ],
              correct: 1,
              explanation: 'Personalização em escala é o superpoder de IA em vendas. Você mantém a qualidade de um email altamente personalizado, mas produz em volume.'
            }
          ]
        }
      },
      {
        id: 'v1-m2',
        title: 'Cold email irresistível com IA em 5 minutos',
        subtitle: 'A técnica de escrever emails que realmente abrem portas',
        duration: '15 min',
        xp: 70,
        type: 'pratica',
        content: {
          intro: 'Cold email é a habilidade mais subestimada de vendas. Um bom email abre portas que nenhuma cold call consegue. Com IA, você cria emails personalizados e eficazes em escala — sem soar robótico.',
          sections: [
            {
              title: 'A anatomia de um cold email que funciona',
              body: `Um cold email que converte tem exatamente 5 elementos. Nenhum a mais, nenhum a menos.\n\n**1. Assunto (linha mais importante):**\nDeve parecer que você conhece a pessoa. Fuja de "Parceria Estratégica" e "Oportunidade Única".\nBom: "Vi que vocês estão expandindo para o nordeste" / "Pergunta rápida sobre [problema específico]"\n\n**2. Abertura personalizada (2 frases sobre ELES):**\nMostre que fez o dever de casa. Uma observação específica sobre a empresa ou a pessoa.\nBom: "Vi a entrevista do [CEO] no Podcast X falando sobre o desafio de [X]. Fez muito sentido para mim."\n\n**3. Proposta de valor (o problema que você resolve):**\nUma frase clara. Não fale de você — fale do problema deles que você resolve.\n\n**4. Prova social (resultado rápido):**\nUm número concreto ou um cliente conhecido. "Ajudei [Empresa Similar] a [resultado] em [tempo]."\n\n**5. CTA único e fácil:**\nUma pergunta simples. "Faz sentido conversar 20 minutos essa semana?"`,
              tip: 'O erro mais comum: falar sobre você ao invés de falar sobre eles. O prospect não liga para você. Ele liga para os problemas dele.'
            },
            {
              title: 'Como pesquisar o prospect com IA antes de escrever',
              body: `Antes de escrever qualquer email, você precisa de 3-5 minutos de pesquisa. Aqui está o processo:\n\n**Fontes que você vai usar:**\n- LinkedIn da pessoa (cargo, tempo na empresa, posts recentes)\n- Site da empresa (sobre, notícias, "casos de sucesso")\n- Google News: "[Nome da empresa] 2024/2025"\n\n**O que procurar (gatilhos de abordagem):**\n- Promoção/mudança de cargo recente → "Parabéns pela promoção para [cargo]"\n- Expansão de negócio → "Vi que abriram filial em [cidade]"\n- Contratação em escala → "Notei que estão crescendo o time de [área]"\n- Problema do setor → "Todo [setor] está enfrentando [desafio]"\n\n**Peça ao Claude:** "Analisando este perfil do LinkedIn [cole o texto] e este sobre da empresa [cole o texto], quais são os 3 melhores gatilhos de personalização para um cold email?"`,
            },
            {
              title: 'O processo completo: pesquisa → prompt → email',
              body: `Agora junte tudo:\n\n1. Pesquise o prospect (LinkedIn + site + Google News)\n2. Cole as informações no Claude\n3. Use o prompt modelo abaixo\n4. Ajuste o email gerado com sua voz\n5. Envie\n\nO resultado: emails que parecem escritos para aquela pessoa específica, mesmo quando você produz 20 por dia.`,
            }
          ],
          prompts: [
            {
              label: 'Prompt RUIM — genérico e ineficaz',
              bad: 'Escreva um cold email de vendas para um diretor de marketing.',
              good: `Escreva um cold email para [NOME], [CARGO] na [EMPRESA].\n\nContexto sobre eles:\n- A empresa está [momento atual: expandindo / passando por mudança / enfrentando desafio X]\n- Recentemente [evento relevante: lançaram produto / abriram filial / fizeram parceria]\n- O perfil do LinkedIn mostra foco em [área de interesse]\n\nMeu contexto:\n- Empresa: [SUA EMPRESA]\n- O que faço: [PROPOSTA DE VALOR EM 1 FRASE]\n- Resultado concreto que gerei: [CASE: ajudei X empresa a Y em Z tempo]\n\nEmail deve ter:\n- Assunto personalizado (não genérico)\n- Abertura que mostra que pesquisei sobre eles (1-2 frases)\n- O problema que resolvo (foco NELES, não em mim)\n- Prova social com número\n- CTA de uma única pergunta simples\n- Tom: direto, respeitoso, sem exagero\n- Máximo 150 palavras`,
              explanation: 'O bom prompt dá contexto específico sobre o prospect e sobre você. O resultado é um email que parece que você realmente conhece a pessoa — porque o Claude vai usar todos esses dados para personalizar.'
            }
          ],
          exercise: {
            title: 'Exercício: seus 3 primeiros cold emails com IA',
            description: 'Escolha 3 prospects reais da sua carteira e crie um cold email personalizado para cada um usando o processo deste módulo.',
            steps: [
              'Escolha 3 prospects reais (ou potenciais) que você quer abordar',
              'Para cada um: pesquise LinkedIn + site da empresa por 3 minutos',
              'Cole as informações no Claude usando o prompt modelo deste módulo',
              'Revise e ajuste o email com sua voz pessoal',
              'Compare os 3 emails: qual parece mais personalizado? O que mudaria?',
              'BÔNUS: envie um deles hoje e anote a resposta'
            ]
          }
        }
      },
      {
        id: 'v1-m3',
        title: 'Pesquisa de prospects com IA',
        subtitle: 'Saiba tudo sobre seu lead antes de fazer qualquer contato',
        duration: '12 min',
        xp: 65,
        type: 'exercicio',
        content: {
          intro: 'Conhecer seu prospect antes de abordar é a diferença entre "mais um vendedor tentando vender" e "esse cara realmente entende do meu negócio". IA faz essa pesquisa profunda em minutos.',
          sections: [
            {
              title: 'O que você precisa saber antes de abordar',
              body: `**Sobre a empresa:**\n- Segmento e modelo de negócio\n- Tamanho (faturamento, colaboradores)\n- Momento atual: crescendo, estável, em transformação?\n- Principais desafios do setor hoje\n- Concorrentes diretos\n- Notícias recentes (últimos 90 dias)\n\n**Sobre a pessoa:**\n- Cargo e responsabilidades reais\n- Tempo na empresa e cargo anterior\n- Posts e conteúdo recente no LinkedIn (o que ela fala)\n- Projetos em andamento\n- Tom de comunicação (formal? casual? técnico?)\n\n**Contexto comercial:**\n- Já usam solução similar? Qual?\n- Qual o tamanho do problema que você resolve para eles?\n- Quem mais influencia a decisão (além da pessoa que você vai falar)?`,
              tip: 'Você não precisa de tudo isso sempre. Para um cold email, 3-4 pontos chave já fazem diferença enorme. Para uma reunião de negociação, pesquise tudo.'
            },
            {
              title: 'Criando um Briefing de Prospect com IA',
              body: `**O processo:**\n1. Cole o texto do LinkedIn da pessoa no Claude\n2. Cole o texto do "Sobre" e "Serviços" do site da empresa\n3. Adicione o resultado de uma busca no Google News\n4. Peça ao Claude para montar um briefing estruturado\n\n**O que o briefing deve ter:**\n- Resumo da empresa (3-5 linhas)\n- Perfil da pessoa (2-3 linhas)\n- Momento atual e principais desafios (onde você encaixa)\n- 3 gatilhos de abordagem personalizados\n- Possíveis objeções antecipadas\n- Sugestão de ângulo de abordagem`,
            },
            {
              title: 'Qualificando leads com IA — BANT simplificado',
              body: `BANT é o framework clássico de qualificação: Budget (Orçamento), Authority (Autoridade), Need (Necessidade), Timeline (Prazo).\n\nUse IA para responder essas 4 perguntas antes de investir horas em um prospect:\n\n**Budget:** "Empresa do tamanho de [X] tipicamente tem budget para [solução] na faixa de?" — Claude te dá um benchmarking\n\n**Authority:** "Quem normalmente toma a decisão de contratar [tipo de solução] em empresas desse porte?" — Saiba se está falando com a pessoa certa\n\n**Need:** "Quais são os maiores desafios de [setor] em relação a [problema que você resolve] atualmente?" — Conecte seu produto ao cenário deles\n\n**Timeline:** Identifique urgência pelos sinais: expansão recente, problemas públicos, mudança de liderança — todos indicam timing favorável`,
              tip: 'Lembre: IA dá estimativas e padrões gerais. Valide as informações mais críticas diretamente com o prospect ou via sua rede.'
            }
          ],
          exercise: {
            title: 'Exercício: Briefing completo de 3 prospects',
            description: 'Crie um briefing profissional para 3 prospects usando o processo de IA deste módulo.',
            steps: [
              'Escolha 3 prospects que você quer abordar esta semana',
              'Para cada um: acesse o LinkedIn e copie o perfil + posts recentes',
              'Acesse o site da empresa e copie a seção "Sobre" e "Serviços"',
              'Busque no Google: "[empresa] 2025" e copie 2-3 notícias relevantes',
              'Cole tudo no Claude e peça: "Monte um briefing de prospect completo com o formato: Resumo da empresa, Perfil da pessoa, Momento atual, 3 gatilhos de abordagem, Possíveis objeções, Ângulo de abordagem sugerido"',
              'Compare os 3 briefings: qual prospect tem mais fit? Priorize.'
            ]
          }
        }
      },
      {
        id: 'v1-m4',
        title: 'Script de vendas personalizado com IA',
        subtitle: 'Scripts que soam naturais para cada tipo de cliente',
        duration: '15 min',
        xp: 70,
        type: 'pratica',
        content: {
          intro: 'Script não é decoreba — é estrutura. E IA te ajuda a ter estruturas flexíveis e adaptadas para cada cenário, cliente e objeção. Nunca mais você vai entrar numa call sem saber o que dizer.',
          sections: [
            {
              title: 'Os 4 scripts essenciais que todo vendedor precisa ter',
              body: `**1. Script de Cold Call (30, 60 e 3 minutos):**\n- 30s: Abertura + proposta de valor + uma pergunta\n- 60s: + contexto do problema + qualificação básica\n- 3 min: + histórico + interesse em próximo passo\n\n**2. Script de Demo/Apresentação:**\n- Abertura que mostra que pesquisou sobre eles\n- Estrutura: problema → agitação → solução → prova → CTA\n\n**3. Scripts de Objeção (os 5 mais comuns):**\n- "Está caro" / "Preciso de desconto"\n- "Estou satisfeito com o atual"\n- "Precisamos envolver mais pessoas"\n- "Deixa eu pensar e te retorno"\n- "Nosso concorrente cobra menos"\n\n**4. Script de Fechamento:**\n- Como criar urgência sem pressionar\n- Como confirmar compromisso e próximos passos`,
              tip: 'Crie variações de cada script: uma para CEO, uma para Diretor técnico, uma para tomador de decisão financeiro. A linguagem certa para cada perfil muda tudo.'
            },
            {
              title: 'Como criar scripts que soam 100% naturais',
              body: `O erro mais comum: "ChatGPT, escreva um script de vendas." O resultado parece robótico porque falta contexto.\n\n**O que o Claude precisa para gerar um script excelente:**\n- **Quem você é:** sua empresa, proposta de valor, diferencial\n- **Quem é o cliente:** cargo, setor, tamanho da empresa\n- **O cenário:** cold call? Demo? Reunião de fechamento?\n- **Seu tom:** formal/casual, direto/consultivo, técnico/executivo\n- **As objeções comuns que você já ouviu:** Claude vai incluir respostas\n- **Cases reais:** os resultados que você já gerou para outros clientes\n\nQuanto mais contexto você der, mais o script vai parecer que você escreveu — não um robô.`,
            },
            {
              title: 'Adaptando scripts por perfil de comprador',
              body: `**CEO/Fundador:** Foco em impacto no negócio, crescimento, risco e retorno. Seja direto, sem rodeios. Demonstre que entende o negócio deles, não só o produto.\n\n**Diretor/VP:** Foco em resultados mensuráveis, alinhamento com estratégia do time, facilidade de implementação. Mostre como vai facilitar a vida do time dele.\n\n**Gerente/Analista:** Foco em como vai facilitar o dia a dia deles, features e funcionalidades, suporte e onboarding. Mostre que você vai estar junto na implementação.\n\n**Financeiro/Controladoria:** ROI, payback period, custo total de propriedade, riscos. Tenha números. Fale de custo de não agir.`,
              tip: 'Antes de qualquer reunião, pergunte ao Claude: "Estou apresentando para um [cargo] em uma empresa de [segmento]. Como devo adaptar minha abordagem?"'
            }
          ],
          prompts: [
            {
              label: 'Prompt para criar script de cold call personalizado',
              good: `Crie um script de cold call de 60 segundos para mim.\n\nMeu contexto:\n- Empresa: [NOME] — [O QUE FAZ em 1 frase]\n- Proposta de valor: [O PROBLEMA QUE RESOLVO]\n- Case de sucesso: [RESULTADO CONCRETO com número]\n\nProspect:\n- Nome: [NOME DO PROSPECT]\n- Cargo: [CARGO] na [EMPRESA]\n- Momento da empresa: [CONTEXTO RELEVANTE]\n\nEstrutura do script:\n1. Abertura (5s): identificação + gancho de atenção personalizado\n2. Proposta de valor (15s): problema que resolvo + para quem\n3. Prova social (10s): case rápido com número\n4. Qualificação (20s): uma pergunta para validar fit\n5. CTA (10s): proposta de próximo passo claro\n\nTom: [direto / consultivo / técnico]\nEvitar: [jargões / linguagem muito formal / pressão excessiva]`,
              explanation: 'Este prompt dá ao Claude todo o contexto necessário para criar um script que parece escrito por você — não por uma máquina. O resultado é um script que você vai realmente usar.'
            }
          ],
          exercise: {
            title: 'Exercício: Sua biblioteca de scripts',
            description: 'Crie 3 scripts essenciais para a sua rotina de vendas usando IA.',
            steps: [
              'Escreva sua proposta de valor em 1 frase clara (o que você faz e para quem)',
              'Liste os 3 tipos de cliente que você mais aborda (ex: CEO de startup, Diretor de RH de empresa média, Gerente de Marketing)',
              'Use o prompt modelo para criar um cold call de 60s para cada perfil',
              'Use Claude para criar respostas às 3 objeções que você mais ouve: diga "Meu produto é [X], as 3 objeções mais comuns são [liste]. Crie respostas consultivas para cada uma."',
              'Leia os scripts em voz alta. O que soa estranho? Ajuste.',
              'Salve em um documento: sua biblioteca de scripts está pronta.'
            ]
          }
        }
      },
      {
        id: 'v1-m5',
        title: 'Preparando reuniões e negociações com IA',
        subtitle: 'Entre em cada call 100% preparado e nunca mais improvise',
        duration: '12 min',
        xp: 65,
        type: 'quiz',
        content: {
          intro: 'Os melhores vendedores entram em qualquer reunião com uma vantagem injusta: preparação total. IA faz esse briefing completo em 5 minutos. Você nunca mais vai entrar numa call de improviso.',
          sections: [
            {
              title: 'O briefing de reunião perfeito',
              body: `Antes de qualquer reunião, você precisa saber:\n\n**Sobre os participantes:**\n- Quem vai estar lá e qual o papel de cada um na decisão\n- Estilo de comunicação de cada pessoa\n- O que cada um precisa ouvir para avançar\n\n**Sobre o histórico:**\n- O que foi discutido nas reuniões anteriores\n- Quais objeções já surgiram e como foram tratadas\n- Qual o status atual: está avançando ou esfriando?\n\n**Sobre o momento deles:**\n- Alguma novidade na empresa que muda o contexto?\n- Alguma pressão externa (competidores, resultados, prazos)?\n\n**Para a reunião:**\n- 3 objetivos claros: o que precisa acontecer para ser um sucesso\n- Possíveis objeções e suas respostas preparadas\n- Próximos passos que você quer propor ao final`,
              tip: 'Coloque o histórico de emails e conversas no Claude e peça: "Analise este histórico de negociação e me diga: onde está o projeto, quais são os principais riscos de perder, e o que devo focar nesta próxima reunião."'
            },
            {
              title: 'Usando IA como simulador de objeções',
              body: `Esta é uma das funcionalidades mais poderosas de IA para vendas: treinar antes da reunião real.\n\n**Como fazer:**\n1. Dê ao Claude o contexto do prospect e da reunião\n2. Peça: "Faça o papel do [cargo] desta empresa durante uma reunião de proposta. Seja cético e levante as objeções mais difíceis que esse perfil costuma ter"\n3. Responda às objeções como faria na reunião real\n4. Peça feedback: "Como foram minhas respostas? O que poderia ser melhor?"\n\nIsso é como ter um parceiro de treino disponível 24h. Você chega na reunião real já tendo respondido as objeções mais difíceis — mentalmente e verbalmente.`,
            },
            {
              title: 'Adaptando sua apresentação por cliente com IA',
              body: `Mesma proposta, abordagem completamente diferente para cada cliente.\n\n**Diga ao Claude:**\n"Tenho uma apresentação padrão sobre [produto/serviço]. Vou apresentar para [cargo] de uma empresa de [setor] que está [situação/desafio]. Como devo adaptar minha abertura, o destaque de benefícios e o CTA para este perfil específico?"\n\n**Claude vai sugerir:**\n- Como abrir para capturar atenção deste perfil\n- Quais benefícios destacar primeiro (financeiro? operacional? estratégico?)\n- Qual tom usar (executivo direto? técnico detalhado? consultivo?)\n- Como propor o próximo passo de forma natural`,
            }
          ],
          quiz: [
            {
              question: 'Qual é o melhor uso de IA para preparação de reuniões de vendas?',
              options: [
                'Substituir totalmente a preparação humana',
                'Gerar briefing de prospect, simular objeções e adaptar a abordagem para o perfil',
                'Enviar a reunião por email e cancelar o presencial',
                'Criar apresentações com muitos slides detalhados'
              ],
              correct: 1,
              explanation: 'IA é uma ferramenta de amplificação da sua preparação. Briefing de prospect, simulação de objeções e adaptação de abordagem são as três aplicações de maior impacto.'
            },
            {
              question: 'Ao usar IA para simular objeções antes de uma reunião, qual é a prática mais eficaz?',
              options: [
                'Pedir ao Claude para ser gentil e não complicar',
                'Dar contexto detalhado do prospect e pedir que Claude seja cético e levante as objeções mais difíceis',
                'Usar um script genérico sem contexto',
                'Ignorar objeções e focar só nos pontos positivos'
              ],
              correct: 1,
              explanation: 'Quanto mais realista o simulador, melhor o treino. Dar contexto detalhado e pedir que Claude seja cético é o que torna o treino realmente útil — você vai ouvir as objeções difíceis antes de enfrentá-las ao vivo.'
            },
            {
              question: 'Por que adaptar sua apresentação por perfil de comprador é importante?',
              options: [
                'Para que cada cliente acredite que a proposta é exclusiva para ele',
                'Porque CEOs, Diretores e Gerentes têm motivações e preocupações diferentes — a linguagem certa para cada um aumenta a taxa de conversão',
                'Para impressionar com variedade de conteúdo',
                'Porque é exigência legal para propostas comerciais'
              ],
              correct: 1,
              explanation: 'Um CEO quer impacto no negócio, um Diretor quer facilitar a gestão do time, um Gerente quer facilidade de uso. Falar a linguagem certa para cada perfil não é manipulação — é comunicação eficaz.'
            }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // FINANCEIRO — BÁSICO (Fase 20)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 20,
    area: 'financeiro',
    level: 'basico',
    title: 'O Analista Inteligente',
    subtitle: 'IA para transformar dados em decisões no financeiro',
    icon: 'chart',
    color: '#D97706',
    xpBonus: 250,
    modules: [
      {
        id: 'f1-m1',
        title: 'IA para análise de planilhas e dados financeiros',
        subtitle: 'Transforme horas de análise em minutos com IA',
        duration: '10 min',
        xp: 60,
        type: 'leitura',
        content: {
          intro: 'O departamento financeiro é o que mais tem a ganhar com IA. Dados, números, padrões, anomalias — exatamente onde IA brilha. Veja como transformar sua rotina analítica.',
          sections: [
            {
              title: 'O problema com planilhas hoje',
              body: `A maioria das equipes financeiras passa 60-70% do tempo coletando e organizando dados — e apenas 30-40% analisando e decidindo. IA inverte essa proporção.\n\n**O que toma mais tempo hoje:**\n- Consoldar dados de múltiplas fontes manualmente\n- Criar fórmulas complexas para cada análise\n- Formatar relatórios para diferentes públicos (board, gestores, operacional)\n- Verificar inconsistências linha por linha\n- Explicar números para não financeiros\n\n**O que IA faz por você:**\n- Analisa planilhas inteiras em segundos\n- Identifica padrões e anomalias automaticamente\n- Gera narrativas sobre os números\n- Responde perguntas em linguagem natural ("qual o custo por cliente?")`,
              tip: 'Você não precisa saber programação. O ChatGPT e o Claude entendem planilhas coladas diretamente na conversa — copie e cole os dados, faça perguntas.'
            },
            {
              title: 'As ferramentas e como usá-las',
              body: `**ChatGPT + Advanced Data Analysis:**\n- Envie arquivos Excel/CSV diretamente\n- Peça análises, gráficos, comparações\n- Funciona com Python por baixo — mas você só pergunta em português\n\n**Claude + dados colados:**\n- Copie os dados da planilha (até 100k linhas funciona bem)\n- Faça perguntas livres: "Qual mês teve pior desempenho de margem?"\n- Peça narrativas: "Escreva um parágrafo explicando estes resultados para o conselho"\n\n**Google Sheets + Fórmulas de IA:**\n- Use Claude para criar fórmulas complexas em linguagem natural\n- "Crie uma fórmula que calcule o crescimento MoM considerando meses com zero venda"\n\n**Excel + Copilot (Microsoft 365):**\n- IA integrada diretamente no Excel\n- Análise, gráficos e insights sem sair da ferramenta`,
            },
            {
              title: 'Tipos de análise que você pode fazer com IA hoje',
              body: `**Análise descritiva (o que aconteceu):**\n- Variações de receita, custo, margem por período\n- Comparativos: mês a mês, ano a ano, vs. orçamento\n- Ranking de produtos/clientes por rentabilidade\n\n**Análise diagnóstica (por que aconteceu):**\n- "Qual a principal causa da queda de margem em março?"\n- Correlações entre variáveis (aumento de custo X queda de volume)\n\n**Análise preditiva (o que pode acontecer):**\n- Projeções de fluxo de caixa baseadas em histórico\n- "Se a inadimplência seguir essa tendência, qual o impacto no caixa em 60 dias?"\n\n**Análise prescritiva (o que fazer):**\n- "Dado este cenário de custos, quais as 3 alavancas de maior impacto para melhorar EBITDA?"`,
              tip: 'Comece pela análise descritiva — é onde você ganha tempo imediato. Depois evolua para análises mais complexas à medida que ganha confiança com a ferramenta.'
            }
          ],
          quiz: [
            {
              question: 'Qual é o principal benefício de usar IA na análise financeira?',
              options: [
                'Eliminar a necessidade de profissionais de finanças',
                'Inverter o tempo gasto: menos coleta/formatação, mais análise e decisão',
                'Substituir o sistema ERP da empresa',
                'Tornar os números mais imprecisos para simplificar'
              ],
              correct: 1,
              explanation: 'IA não substitui o profissional financeiro — amplifica seu tempo para o que realmente importa: análise estratégica e tomada de decisão.'
            },
            {
              question: 'Como você pode usar Claude para analisar uma planilha sem saber programação?',
              options: [
                'É impossível sem saber Python',
                'Precisa instalar um plugin especial',
                'Copie e cole os dados da planilha na conversa e faça perguntas em português',
                'Apenas com arquivos .csv de no máximo 10 linhas'
              ],
              correct: 2,
              explanation: 'Claude e ChatGPT entendem dados em texto. Basta copiar os dados da planilha, colar na conversa e fazer perguntas em linguagem natural — sem nenhum conhecimento técnico.'
            }
          ]
        }
      },
      {
        id: 'f1-m2',
        title: 'Relatórios financeiros em minutos com ChatGPT',
        subtitle: 'Do dado bruto ao relatório executivo em tempo recorde',
        duration: '15 min',
        xp: 70,
        type: 'pratica',
        content: {
          intro: 'Criar relatórios financeiros claros e bem escritos costuma levar horas. Com IA, você vai do dado bruto a um relatório executivo completo em minutos — mantendo qualidade profissional.',
          sections: [
            {
              title: 'Os tipos de relatório que IA gera muito bem',
              body: `**Relatório de DRE (Demonstrativo de Resultado):**\nIA transforma os números em narrativa: "A receita cresceu X%, impulsionada por Y, enquanto os custos de Z aumentaram por causa de W. O EBITDA ficou em [%], acima/abaixo do orçado em função de..."\n\n**Relatório de Fluxo de Caixa:**\n"O saldo final foi de R$ X. Os principais consumidores de caixa foram... As entradas vieram majoritariamente de... A empresa tem X dias de caixa operacional."\n\n**Relatório de Inadimplência:**\n"A inadimplência em [período] foi de X%, [aumento/queda] de Y pp em relação ao mês anterior. Os segmentos mais impactados foram..."\n\n**Report executivo para conselho/sócios:**\nIA adapta a linguagem técnica para executiva, destaca o que mais importa para esse público e sugere formatação clara.`,
              tip: 'A chave: diga ao Claude PARA QUEM é o relatório. Um relatório para o CFO é diferente de um para o conselho, que é diferente de um para gestores operacionais.'
            },
            {
              title: 'O processo: dado → análise → relatório',
              body: `**Passo 1 — Prepare os dados:**\nOrganize em uma tabela simples: período, métricas principais. Não precisa ser perfeito.\n\n**Passo 2 — Cole no Claude com contexto:**\n"Aqui estão os dados financeiros de [período]. Nossa empresa é [tipo], segmento [X]. O orçado era [Y]."\n\n**Passo 3 — Peça a análise:**\n"Analise estes resultados e me aponte: 3 pontos de destaque positivo, 3 alertas/riscos, e a principal recomendação."\n\n**Passo 4 — Peça o relatório:**\n"Agora escreva um relatório executivo de 1 página com: resumo executivo (3 frases), análise de receita, análise de custos, resultado líquido, e 3 próximos passos recomendados. Tom: executivo direto."\n\n**Passo 5 — Revise e finalize:**\nVerifique os números, ajuste o tom, personalize. 10 minutos de revisão vs. 3 horas de criação.`,
            },
            {
              title: 'Adaptando a linguagem para diferentes públicos',
              body: `O mesmo resultado financeiro precisa de comunicações completamente diferentes:\n\n**Para o conselho/sócios:** visão estratégica, impacto no valuation, decisões necessárias\n\n**Para gestores:** o que está sob controle deles, variações vs. orçado, ações corretivas\n\n**Para a equipe operacional:** metas, o que está funcionando, o que mudar\n\n**Para o banco/financiadores:** saúde financeira, capacidade de pagamento, perspectivas\n\nUse o Claude para adaptar: "Tenho este relatório financeiro. Adapte-o para [público], focando no que é mais relevante para eles, com tom [executivo/direto/técnico/acessível]."`,
              tip: 'Nunca envie o mesmo relatório para públicos diferentes sem adaptação. IA torna essa adaptação instantânea — você cria uma vez e distribui versões customizadas.'
            }
          ],
          prompts: [
            {
              label: 'Prompt para gerar relatório executivo financeiro',
              good: `Analise os dados financeiros abaixo e gere um relatório executivo completo.\n\n[COLE OS DADOS AQUI — pode ser tabela, lista, ou os números diretamente]\n\nContexto:\n- Empresa: [segmento e modelo de negócio]\n- Período: [mês/trimestre/ano]\n- Comparativo: [vs mês anterior / vs mesmo período ano anterior / vs orçado]\n- Público do relatório: [conselho / diretoria / gestores / banco]\n\nO relatório deve conter:\n1. Resumo executivo (3-5 frases, linguagem clara e direta)\n2. Análise de receita (variações, principais drivers)\n3. Análise de custos (desvios, alertas)\n4. Resultado líquido e EBITDA (vs comparativo)\n5. Principais riscos e oportunidades\n6. Recomendações (3 ações concretas)\n\nTom: executivo, direto, sem jargão excessivo\nFormato: use títulos e bullet points para facilitar leitura`,
              explanation: 'Com este prompt, o Claude tem todo o contexto para gerar um relatório que parece escrito por um analista sênior. O segredo é especificar o público — isso muda completamente o tom e o foco do relatório.'
            }
          ],
          exercise: {
            title: 'Exercício: Seu primeiro relatório com IA',
            description: 'Crie um relatório executivo real usando dados financeiros da sua empresa ou de um exemplo.',
            steps: [
              'Escolha um relatório que você faz regularmente (DRE, fluxo de caixa, inadimplência)',
              'Reúna os dados do último mês (pode ser um exemplo fictício se preferir)',
              'Cole os dados no Claude com o contexto da empresa e público-alvo',
              'Use o prompt modelo deste módulo para gerar o relatório',
              'Compare com o relatório que você criaria manualmente: o que ficou melhor? O que precisaria ajustar?',
              'BÔNUS: Peça ao Claude para criar 3 versões do mesmo relatório para 3 públicos diferentes'
            ]
          }
        }
      },
      {
        id: 'f1-m3',
        title: 'Identificando padrões e anomalias com IA',
        subtitle: 'Detecte o que os olhos humanos deixam passar',
        duration: '12 min',
        xp: 65,
        type: 'exercicio',
        content: {
          intro: 'Anomalias financeiras — fraudes, erros, ineficiências, oportunidades escondidas — frequentemente se escondem em dados que analistas humanos revisam rápido demais. IA lê esses padrões em segundos.',
          sections: [
            {
              title: 'O que IA detecta que humanos perdem',
              body: `**Anomalias de gasto:**\n- Fornecedor com valores que crescem mais rápido que o volume contratado\n- Despesas duplicadas (mesmo valor, mesmo fornecedor, datas próximas)\n- Compras fora do padrão histórico de um departamento\n- Sazonalidade quebrada: meses que deveriam ser altos mas estão baixos\n\n**Padrões de receita:**\n- Concentração excessiva em poucos clientes (risco de churn)\n- Clientes com queda progressiva de compra (churn em câmera lenta)\n- Produtos com margem caindo consistentemente\n- Ciclos de receita que indicam problema de recorrência\n\n**Riscos de inadimplência:**\n- Clientes com padrão de atraso crescente\n- Concentração de vencimentos em datas críticas\n- Exposição a setores em dificuldade`,
              tip: 'Quanto maior o volume de dados, mais valiosa é a IA. Com 100 linhas, humano consegue revisar. Com 10.000 linhas, IA encontra o que humano perderia.'
            },
            {
              title: 'Técnicas de análise por padrão com IA',
              body: `**Análise de tendência:**\n"Olhando estes dados dos últimos 12 meses, identifique as 3 principais tendências — positivas e negativas — e o que elas indicam para os próximos 3 meses."\n\n**Detecção de outliers:**\n"Analise estes dados de despesas. Identifique qualquer valor que fuja significativamente do padrão histórico e me explique o que pode indicar."\n\n**Análise de correlação:**\n"Existe correlação entre [variável A] e [variável B] nestes dados? Se sim, é positiva ou negativa? O que isso significa operacionalmente?"\n\n**Benchmarking interno:**\n"Compare o desempenho destes 10 departamentos nas métricas de custo por entrega. Quais estão acima da média? Qual é o padrão dos que têm melhor performance?"`,
            },
            {
              title: 'Criando alertas inteligentes com IA',
              body: `Você pode usar IA para criar sistemas simples de alerta financeiro:\n\n**Alerta de fluxo de caixa:**\n"Com base no histórico deste fluxo de caixa, crie uma fórmula de alerta que dispara quando o saldo projetado cair abaixo de X dias de caixa operacional."\n\n**Alerta de margem:**\n"Crie uma regra condicional para esta planilha que destaque em vermelho qualquer produto/serviço com margem abaixo de X% por mais de 2 meses consecutivos."\n\n**Alerta de concentração:**\n"Identifique quando a concentração de receita nos 5 maiores clientes ultrapassar Y% do total — e me avise sobre o risco."\n\nClaud gera as fórmulas para Excel/Google Sheets, você só aplica.`,
              tip: 'Lembre: IA identifica padrões, mas você valida. Antes de tomar ações baseadas em anomalias detectadas por IA, confirme com a operação se há uma explicação legítima.'
            }
          ],
          exercise: {
            title: 'Exercício: Caçada de padrões nos seus dados',
            description: 'Use IA para analisar dados reais da sua empresa e encontrar pelo menos 3 insights que você não havia identificado.',
            steps: [
              'Pegue uma planilha financeira real: extrato bancário, DRE dos últimos 6 meses, ou relatório de despesas',
              'Remova dados sensíveis se necessário (substitua nomes de clientes por Empresa A, B, C)',
              'Cole os dados no Claude e diga: "Analise estes dados financeiros e identifique: anomalias, tendências preocupantes, e oportunidades de melhoria"',
              'Peça um segundo nível: "Destes achados, quais os 3 que merecem ação imediata e por quê?"',
              'Documente os 3 insights mais relevantes e valide com a operação se fazem sentido',
              'BÔNUS: Peça ao Claude para criar uma fórmula de alerta para o risco mais crítico identificado'
            ]
          }
        }
      },
      {
        id: 'f1-m4',
        title: 'Automação de tarefas repetitivas do financeiro',
        subtitle: 'Elimine o trabalho manual que consome horas toda semana',
        duration: '15 min',
        xp: 70,
        type: 'pratica',
        content: {
          intro: 'Conciliação bancária, lançamentos manuais, formatação de relatórios, consolidação de planilhas — são tarefas essenciais, mas não precisam consumir seu tempo. IA automatiza boa parte disso.',
          sections: [
            {
              title: 'Mapeie o que roubar o seu tempo',
              body: `Antes de automatizar, mapeie:\n\n**Tarefas candidatas à automação com IA:**\n- Classificação de despesas por categoria\n- Conciliação de extrato bancário com lançamentos\n- Transformação de extratos PDF em planilhas estruturadas\n- Cálculo de impostos sobre notas fiscais\n- Geração de fórmulas Excel para análises específicas\n- Criação de templates de relatório\n- Comunicados de cobrança personalizados\n- Resposta a dúvidas frequentes da equipe sobre procedimentos\n\n**Estimativa de impacto:**\nAntes de cada tarefa que você vai automatizar, cronômetro: quanto tempo você leva hoje? Isso vira o ROI da automação.`,
              tip: 'Comece pela tarefa que mais te irrita ou que você mais adia. É onde você vai sentir mais o impacto imediato da automação.'
            },
            {
              title: 'Automatizando classificação de despesas',
              body: `Esta é uma das tarefas mais tediosas do financeiro. IA classifica com precisão e explica o raciocínio.\n\n**Como fazer:**\n1. Cole o extrato bancário ou lista de despesas no Claude\n2. Forneça seu plano de contas (a lista de categorias que você usa)\n3. Peça: "Classifique cada linha abaixo de acordo com este plano de contas. Para itens ambíguos, explique sua classificação e pergunte."\n4. Revise apenas os itens marcados como ambíguos\n\n**Resultado:** você revisa 5-10% dos lançamentos ao invés de 100%.`,
            },
            {
              title: 'IA para criar fórmulas Excel e automações de planilha',
              body: `Você não precisa saber criar fórmulas complexas. Diga ao Claude o que você quer, ele entrega a fórmula pronta.\n\n**Exemplos que funcionam muito bem:**\n\n"Crie uma fórmula que calcule o prazo médio de recebimento considerando que às vezes há pagamentos parciais em datas diferentes"\n\n"Crie uma tabela dinâmica que consolide automaticamente os dados das abas Janeiro a Dezembro quando eu adicionar uma aba nova"\n\n"Crie uma fórmula de validação que alerte quando um valor de despesa ultrapassar 10% acima da média dos últimos 3 meses para a mesma categoria"\n\n"Monte uma estrutura de fluxo de caixa projetado usando os dados históricos de sazonalidade destas abas"\n\n**Como usar:** Copie a fórmula que o Claude gera e cole diretamente no Excel. Se não funcionar, cole o erro de volta e peça correção.`,
              tip: 'Claude conhece Excel, Google Sheets, e também pode criar macros VBA simples. Sempre especifique qual ferramenta você usa.'
            }
          ],
          prompts: [
            {
              label: 'Prompt para automatizar classificação de despesas',
              good: `Preciso classificar as despesas abaixo de acordo com o meu plano de contas.\n\nMeu plano de contas:\n[liste as categorias: ex: Pessoal, Marketing, Infraestrutura, Impostos, Fornecedores, etc.]\n\nDespesas para classificar:\n[cole a lista de despesas do extrato]\n\nPara cada item, informe:\n- Categoria sugerida\n- Subcategoria (se houver)\n- Nível de certeza (alta/média/baixa)\n- Para itens de baixa certeza: explique a dúvida e sugira como eu devo decidir\n\nFormato de saída: tabela com colunas: Descrição | Categoria | Subcategoria | Certeza | Observação`,
              explanation: 'Pedir o nível de certeza e as observações é o diferencial. Em vez de revisar tudo, você foca só nos itens marcados como "baixa certeza" — o resto está classificado automaticamente.'
            }
          ],
          exercise: {
            title: 'Exercício: Automatize uma tarefa que você faz toda semana',
            description: 'Identifique e automatize com IA a tarefa financeira repetitiva que mais consome seu tempo.',
            steps: [
              'Liste 5 tarefas repetitivas que você faz toda semana ou todo mês no financeiro',
              'Estime o tempo que cada uma leva: anote em minutos',
              'Escolha a que mais tempo consome e que parece candidata à automação',
              'Descreva a tarefa em detalhes para o Claude e peça uma solução de automação',
              'Teste a solução com dados reais (ou fictícios)',
              'Meça o tempo que levou com a automação vs. sem — e documente o resultado'
            ]
          }
        }
      },
      {
        id: 'f1-m5',
        title: 'Comunicação financeira clara e objetiva com IA',
        subtitle: 'Transforme números em histórias que qualquer um entende',
        duration: '12 min',
        xp: 65,
        type: 'quiz',
        content: {
          intro: 'Comunicar resultados financeiros para não financeiros é uma habilidade rara e valiosa. IA te ajuda a transformar qualquer dado complexo em comunicação clara, impactante e adaptada ao público.',
          sections: [
            {
              title: 'O problema da comunicação financeira tradicional',
              body: `Você já apresentou um resultado financeiro perfeito e as pessoas ficaram com cara de interrogação?\n\nO problema não é o número — é a tradução.\n\n**Os erros mais comuns:**\n- Excesso de jargão (EBITDA, DSCR, WACC) sem explicação para o público\n- Foco em detalhes técnicos quando o executivo quer ver o impacto estratégico\n- Tabelas gigantes sem destaque para o que é relevante\n- Narrativa ausente: os números estão lá, mas ninguém sabe o que fazer com eles\n\n**O que IA resolve:**\nDada a mesma planilha, Claude escreve versões diferentes para o CEO, para o gestor comercial e para o time operacional — cada um recebendo exatamente o que precisa saber.`,
              tip: '"Qualquer dado financeiro precisa responder 3 perguntas para o seu público: O que aconteceu? Por que aconteceu? O que fazemos agora?" — IA te ajuda a responder as 3 de forma clara.'
            },
            {
              title: 'Técnicas de comunicação financeira com IA',
              body: `**1. Transformar tabelas em narrativas:**\n"Dada esta tabela de resultados, escreva um parágrafo explicativo para o [público] que destaque os 2 pontos mais importantes e termine com uma recomendação de ação."\n\n**2. Simplificar conceitos técnicos:**\n"Como eu explico EBITDA para um gestor comercial que nunca estudou finanças, de forma que ele entenda por que essa métrica importa para o negócio dele?"\n\n**3. Criar visualizações escritas:**\n"Descreva este fluxo de caixa como se fosse uma história: começando pelo saldo do início do mês, contando o que entrou, o que saiu, e onde terminamos."\n\n**4. Antecipar perguntas difíceis:**\n"Vou apresentar estes resultados para o conselho. Quais as 5 perguntas mais difíceis que podem me fazer? Prepare respostas para cada uma."`,
            },
            {
              title: 'Comunicados de cobrança humanizados com IA',
              body: `Comunicação de cobrança é onde mais se perde relacionamento. IA ajuda a manter o tom certo: firme mas respeitoso.\n\n**Escalonamento inteligente:**\n- 1º aviso (amigável): "Percebemos que a fatura de [data] ainda não foi liquidada. Caso tenha alguma dúvida, estamos à disposição."\n- 2º aviso (mais direto): informação sobre a pendência e possibilidade de negociação\n- 3º aviso (formal): consequências e prazo final\n\n**Personalização por perfil:**\nCliente estratégico recebe um comunicado diferente de um cliente pequeno inadimplente recorrente. IA gera o tom certo para cada situação.\n\n**Como fazer:** "Crie um comunicado de cobrança para [situação específica]. Tom: profissional mas amigável, sem ameaças, com foco em resolver juntos."`,
            }
          ],
          quiz: [
            {
              question: 'Qual é o erro mais comum na comunicação financeira para não financeiros?',
              options: [
                'Apresentar resultados mensalmente ao invés de diariamente',
                'Excesso de jargão técnico sem tradução e falta de narrativa sobre o que os números significam',
                'Usar gráficos coloridos demais',
                'Apresentar os números cedo demais antes de terminar o mês'
              ],
              correct: 1,
              explanation: 'Comunicação financeira eficaz responde "o que aconteceu, por que aconteceu e o que fazemos agora" na linguagem do público. Jargão sem explicação e dados sem narrativa criam distância entre quem faz finanças e quem toma decisões.'
            },
            {
              question: 'Como IA pode ajudar a adaptar um mesmo relatório para públicos diferentes?',
              options: [
                'Só é possível criar relatórios idênticos com IA',
                'IA pode reescrever o mesmo conteúdo com tom, foco e nível de detalhe diferente para cada público-alvo',
                'IA só funciona para relatórios técnicos, não para executivos',
                'É necessário criar planilhas separadas para cada público'
              ],
              correct: 1,
              explanation: 'Essa é uma das maiores vantagens de IA na comunicação financeira: você cria uma vez, adapta para múltiplos públicos em minutos. CEO, gestores, time operacional — cada um recebe a versão certa.'
            },
            {
              question: 'Qual a melhor abordagem ao usar IA para antecipar perguntas de uma apresentação financeira?',
              options: [
                'Pedir as perguntas mais fáceis para se preparar bem',
                'Ignorar — o público raramente pergunta',
                'Pedir ao Claude as perguntas mais difíceis que o público pode fazer e preparar respostas para cada uma',
                'Evitar perguntas limitando o tempo de apresentação'
              ],
              correct: 2,
              explanation: 'Simular as perguntas mais difíceis com IA é como ter um ensaio antes da apresentação real. Você chega preparado para os questionamentos mais críticos do conselho ou diretoria.'
            }
          ]
        }
      }
    ]
  }
]

// ─────────────────────────────────────────────────────────────────
// AREAS — Estrutura de Áreas e Níveis
// ─────────────────────────────────────────────────────────────────

export type AreaId = 'marketing' | 'vendas' | 'financeiro'
export type LevelId = 'basico' | 'intermediario' | 'avancado'

export type AreaDef = {
  id: AreaId
  title: string
  subtitle: string
  color: string
  description: string
  levels: {
    basico: number[]
    intermediario: number[]
    avancado: number[]
  }
}

export const AREAS: AreaDef[] = [
  {
    id: 'marketing',
    title: 'Marketing',
    subtitle: 'IA aplicada ao marketing digital e criação de conteúdo',
    color: '#3B5BDB',
    description: 'Aprenda a usar IA para criar conteúdo, automatizar campanhas e amplificar seus resultados de marketing.',
    levels: {
      basico: [1, 2, 3, 4, 5],
      intermediario: [6, 7],
      avancado: []
    }
  },
  {
    id: 'vendas',
    title: 'Vendas',
    subtitle: 'IA para prospecção, scripts, negociação e fechamento',
    color: '#059669',
    description: 'Use IA para prospectar mais rápido, personalizar abordagens e fechar mais negócios com menos esforço.',
    levels: {
      basico: [10],
      intermediario: [],
      avancado: []
    }
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    subtitle: 'IA para análise de dados, relatórios e decisões financeiras',
    color: '#D97706',
    description: 'Transforme planilhas em insights, automatize relatórios e tome decisões financeiras com apoio da IA.',
    levels: {
      basico: [20],
      intermediario: [],
      avancado: []
    }
  }
]

export const LEVEL_LABELS: Record<LevelId, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado'
}

export function getPhaseArea(phaseId: number): { area: AreaDef; level: LevelId } | null {
  for (const area of AREAS) {
    for (const [level, phaseIds] of Object.entries(area.levels)) {
      if ((phaseIds as number[]).includes(phaseId)) {
        return { area, level: level as LevelId }
      }
    }
  }
  return null
}

export function getAreaPhases(areaId: AreaId, level?: LevelId): Phase[] {
  const area = AREAS.find(a => a.id === areaId)
  if (!area) return []
  if (level) {
    return PHASES.filter(p => area.levels[level].includes(p.id))
  }
  const allIds = [...area.levels.basico, ...area.levels.intermediario, ...area.levels.avancado]
  return PHASES.filter(p => allIds.includes(p.id))
}

export function getAreaTotalModules(areaId: AreaId): number {
  return getAreaPhases(areaId).reduce((acc, p) => acc + p.modules.length, 0)
}

export function getAreaLevelModules(areaId: AreaId, level: LevelId): number {
  return getAreaPhases(areaId, level).reduce((acc, p) => acc + p.modules.length, 0)
}
