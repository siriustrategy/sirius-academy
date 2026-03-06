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
    icon: '🌌',
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
    icon: '🧠',
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
    icon: '📱',
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
    icon: '🎨',
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
    icon: '🎬',
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
    icon: '🤖',
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
    icon: '🏗️',
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
  }
]
