// ─────────────────────────────────────────────────────────────────
// CURSOS DE ESPECIALIZAÇÃO — Sirius Academy
// ─────────────────────────────────────────────────────────────────

export type CursoAccess = 'freeBasic' | 'fullPaid'
export type CursoLevel = 'basico' | 'intermediario' | 'avancado'

export type CursoModuleContent = {
  intro: string
  sections: { title: string; body: string; tip?: string }[]
  exercise?: { title: string; description: string; steps: string[] }
  quiz?: { question: string; options: string[]; correct: number; explanation: string }[]
}

export type CursoModule = {
  id: string
  title: string
  subtitle: string
  duration: string
  xp: number
  type: 'leitura' | 'exercicio' | 'quiz' | 'pratica'
  content: CursoModuleContent
}

export type CursoFase = {
  id: string
  level: CursoLevel
  title: string
  subtitle: string
  xpBonus: number
  modules: CursoModule[]
}

export type CursoDef = {
  id: string
  title: string
  subtitle: string
  description: string
  color: string
  access: CursoAccess
  tag: string
  fases: CursoFase[]
  teaser?: string
}

// ─────────────────────────────────────────────────────────────────
// CURSO 1 — Lovable + Supabase: Sites & Dashboards
// ─────────────────────────────────────────────────────────────────
const cursoLovable: CursoDef = {
  id: 'lovable-supabase',
  title: 'Lovable + Supabase',
  subtitle: 'Sites e Dashboards profissionais do zero ao avançado',
  description: 'Aprenda a criar sites, dashboards, sistemas de CRM e estoque completos usando IA no Lovable com dados reais no Supabase. Do branding ao deploy com domínio próprio.',
  color: '#E85D04',
  access: 'freeBasic',
  tag: 'DESTAQUE',
  fases: [
    // ── BÁSICO ──────────────────────────────────────────────────
    {
      id: 'lov-1',
      level: 'basico',
      title: 'Descobrindo o Lovable',
      subtitle: 'Entenda a ferramenta que vai transformar sua forma de criar',
      xpBonus: 150,
      modules: [
        {
          id: 'lov-1-m1',
          title: 'O que é o Lovable e como ele funciona?',
          subtitle: 'A ferramenta que cria sites com IA em minutos',
          duration: '8 min',
          xp: 50,
          type: 'leitura',
          content: {
            intro: 'O Lovable é uma ferramenta que transforma texto em sites e aplicativos reais. Você descreve o que quer — em português — e a IA constrói o código por você. Sem precisar saber programar.',
            sections: [
              {
                title: 'Como o Lovable funciona na prática',
                body: `O Lovable usa IA para gerar código real (React + TypeScript) a partir das suas instruções em texto. Você não vê o código — você vê o resultado final, funcionando, que pode ser editado com mais instruções.\n\n**O fluxo básico:**\n1. Você descreve o projeto em texto\n2. O Lovable gera o site/app\n3. Você pede ajustes com mais texto\n4. Conecta ao Supabase para ter banco de dados real\n5. Publica com um clique`,
                tip: 'O segredo do Lovable é dar instruções claras e detalhadas. Quanto mais específico você for, melhor o resultado.'
              },
              {
                title: 'O que você pode criar com o Lovable',
                body: `**Sites institucionais:** landing pages, portfólios, sites de empresas\n\n**Dashboards:** painéis com gráficos, KPIs, análise de dados\n\n**Sistemas internos:** CRM, estoque, gestão de tarefas\n\n**Apps funcionais:** calculadoras, formulários, ferramentas\n\nTudo com visual profissional e código real que funciona.`,
              },
              {
                title: 'Lovable vs fazer do zero',
                body: `Antes do Lovable, criar um dashboard profissional exigia: um desenvolvedor sênior, semanas de trabalho, e R$5.000+ em custos.\n\nCom o Lovable: você descreve o que quer, conecta seus dados e publica em horas — sem código, sem desenvolvedor.`,
                tip: 'O Lovable não substitui um desenvolvedor para sistemas complexos. Mas para 90% do que uma pequena empresa ou profissional precisa, ele resolve sozinho.'
              }
            ],
            quiz: [
              {
                question: 'O que o Lovable faz quando você descreve um projeto em texto?',
                options: [
                  'Mostra um template para você escolher',
                  'Gera o código real e o site funcionando automaticamente',
                  'Abre um editor de código para você escrever',
                  'Busca sites parecidos na internet'
                ],
                correct: 1,
                explanation: 'O Lovable gera código React real a partir das suas instruções em texto. O site fica funcionando imediatamente, sem você ver uma linha de código.'
              }
            ]
          }
        },
        {
          id: 'lov-1-m2',
          title: 'Criando sua conta e explorando a interface',
          subtitle: 'Primeiros passos — do cadastro ao seu primeiro projeto',
          duration: '6 min',
          xp: 30,
          type: 'pratica',
          content: {
            intro: 'Vamos criar sua conta no Lovable e entender cada parte da interface antes de começar a construir.',
            sections: [
              {
                title: 'Criando sua conta no Lovable',
                body: `**Passo 1:** Acesse lovable.dev\n**Passo 2:** Clique em "Sign up" ou "Get started"\n**Passo 3:** Entre com Google ou crie conta com email\n\n**Planos disponíveis:**\n- **Gratuito:** Projetos públicos, limitado — bom para experimentar\n- **Starter (~$20/mês):** Projetos privados, mais gerações — recomendado para uso real`,
                tip: 'Para este curso, o plano gratuito é suficiente para aprender. Só vai precisar do pago quando for publicar projetos profissionais.'
              },
              {
                title: 'A interface do Lovable — o que é cada coisa',
                body: `**Painel lateral esquerdo:** Lista dos seus projetos\n\n**Área central:** Preview do seu site em tempo real\n\n**Campo de texto (embaixo):** Onde você digita instruções para a IA\n\n**Botão "Publish":** Publica o site com um link único\n\n**Botão de integração (Supabase):** Conecta ao banco de dados`,
              }
            ],
            exercise: {
              title: 'Exercício: Crie sua conta e explore',
              description: 'Vamos criar sua conta e fazer seu primeiro contato com o Lovable.',
              steps: [
                'Acesse lovable.dev no seu navegador',
                'Clique em "Get started" e crie sua conta com Google',
                'Após entrar, observe o painel — veja onde ficam os projetos',
                'Clique em "New project" para criar um projeto vazio',
                'No campo de texto, escreva: "Crie uma landing page simples com título e botão" e pressione Enter',
                'Observe a IA gerar o site em segundos — explore o resultado!'
              ]
            }
          }
        }
      ]
    },
    {
      id: 'lov-2',
      level: 'basico',
      title: 'Branding & Estratégia com IA',
      subtitle: 'Construa a identidade do seu projeto antes de criar qualquer tela',
      xpBonus: 200,
      modules: [
        {
          id: 'lov-2-m1',
          title: 'Criando o branding do seu projeto com IA',
          subtitle: 'Nome, identidade visual e posicionamento em 30 minutos',
          duration: '12 min',
          xp: 75,
          type: 'leitura',
          content: {
            intro: 'Antes de criar qualquer tela no Lovable, você precisa ter claro o branding do projeto. A IA vai reproduzir o que você descreve — se você chegar com identidade definida, o resultado será muito mais profissional.',
            sections: [
              {
                title: 'Os 4 elementos de branding que o Lovable usa',
                body: `**1. Nome e tagline:** O nome do projeto e a frase que resume o valor\n\n**2. Paleta de cores:** As cores principais (ex: azul-marinho #1E3A8A e laranja #F97316)\n\n**3. Estilo visual:** Moderno e limpo? Corporativo? Minimalista? Colorido?\n\n**4. Tom de voz:** Formal? Descontraído? Técnico? Humano?\n\nCom esses 4 elementos definidos, seu prompt para o Lovable fica muito mais poderoso.`,
                tip: 'Guarde esses 4 elementos num documento. Você vai usar em TODOS os projetos que criar.'
              },
              {
                title: 'Como usar o Claude para criar o branding',
                body: `Use este prompt no Claude para gerar seu branding completo:\n\n*"Você é um especialista em branding. Vou criar um [tipo de projeto: dashboard de vendas / site de empresa / sistema de CRM]. O público é [descreva]. O objetivo é [descreva]. Crie: 1) Nome e tagline, 2) Paleta de cores com códigos hex, 3) Estilo visual recomendado, 4) Tom de voz. Seja específico e profissional."*`,
              },
              {
                title: 'Levando o branding para o Lovable',
                body: `Com o branding definido, seu primeiro prompt no Lovable deve incluir tudo:\n\n*"Crie um dashboard chamado [nome]. Cores: primária [#hex], secundária [#hex]. Estilo: [descreva]. O dashboard deve ter: [funcionalidades]. Visual moderno, profissional, com sidebar de navegação."*\n\nA diferença de um prompt assim vs um prompt vago é enorme.`,
                tip: 'Nunca comece no Lovable sem o branding definido. É como pintar uma parede antes de escolher a cor.'
              }
            ]
          }
        },
        {
          id: 'lov-2-m2',
          title: 'Construindo seu PRD com IA',
          subtitle: 'O documento que garante que você não esqueça nada no projeto',
          duration: '20 min',
          xp: 100,
          type: 'exercicio',
          content: {
            intro: 'PRD significa Product Requirements Document — o blueprint do seu projeto. É o documento que descreve tudo que o projeto deve ter ANTES de você começar a construir. Com IA, você cria isso em 20 minutos.',
            sections: [
              {
                title: 'Por que um PRD antes de ir para o Lovable?',
                body: `Sem um PRD, você vai construir e reconstruir. A IA do Lovable vai na direção que você mandar — se você não tiver clareza, ela vai errar.\n\nCom um PRD, você:\n- Sabe exatamente o que pedir para a IA\n- Não esquece funcionalidades importantes\n- Economiza gerações (que custam créditos)\n- Tem um documento para mostrar para clientes`,
              },
              {
                title: 'A estrutura do PRD para projetos no Lovable',
                body: `**1. Visão geral:** O que é o projeto, para quem, qual problema resolve\n\n**2. Páginas/Telas:** Lista de todas as páginas que precisa ter\n\n**3. Funcionalidades por página:** O que cada tela faz\n\n**4. Dados necessários:** Que informações precisam ser salvas (para o Supabase)\n\n**5. Visual:** Cores, estilo, referências\n\n**6. Fluxo do usuário:** Como o usuário navega pelo sistema`,
              },
              {
                title: 'Prompt para gerar seu PRD no Claude',
                body: `Use este template:\n\n*"Atue como um Product Manager sênior. Vou criar [descreva o projeto] no Lovable (ferramenta de criação com IA) conectado ao Supabase (banco de dados). Crie um PRD completo com: 1) Visão geral do produto, 2) Lista de páginas/telas, 3) Funcionalidades detalhadas de cada tela, 4) Estrutura de dados (tabelas necessárias), 5) Fluxo de navegação do usuário. O projeto é: [descreva detalhadamente]."*`,
                tip: 'Guarde o PRD num arquivo de texto. Você vai usar partes dele diretamente como prompts no Lovable.'
              }
            ],
            exercise: {
              title: 'Exercício: Crie o PRD do seu primeiro projeto',
              description: 'Vamos criar o PRD de um projeto real que você vai construir nas próximas fases.',
              steps: [
                'Abra o Claude (claude.ai)',
                'Pense em um projeto que você quer criar: um dashboard de vendas, site institucional, sistema de estoque, ou CRM',
                'Use o prompt de PRD do módulo anterior, substituindo pelo seu projeto',
                'Leia o PRD gerado e peça ao Claude para detalhar qualquer parte que ficou vaga',
                'Copie o PRD final para um documento (Google Docs ou Notion)',
                'Identifique quais dados precisam ser salvos — esses vão para o Supabase mais tarde'
              ]
            }
          }
        }
      ]
    },
    {
      id: 'lov-3',
      level: 'basico',
      title: 'Primeiro Site e Conexão com Supabase',
      subtitle: 'Construa seu primeiro projeto real com banco de dados',
      xpBonus: 250,
      modules: [
        {
          id: 'lov-3-m1',
          title: 'Seu primeiro site do zero no Lovable',
          subtitle: 'Passo a passo para criar um site profissional com IA',
          duration: '15 min',
          xp: 100,
          type: 'pratica',
          content: {
            intro: 'Chegou a hora de colocar a mão na massa. Vamos construir seu primeiro site completo no Lovable, usando o branding e o PRD que você criou.',
            sections: [
              {
                title: 'O prompt de criação inicial — o mais importante',
                body: `O primeiro prompt é o mais crítico. Ele define a base de todo o projeto. Use este formato:\n\n*"Crie [tipo de projeto] chamado [nome]. [Descrição do que é]. Cores: primária [#hex], secundária [#hex]. Estilo: [descreva]. Páginas: [liste as páginas do PRD]. Na página inicial deve ter: [descreva o que quer ver]. Visual moderno e profissional."*\n\nMais detalhe = menos retrabalho.`,
                tip: 'Não tente criar tudo de uma vez. Comece com a estrutura e navegação. Depois adicione cada funcionalidade com prompts separados.'
              },
              {
                title: 'Refinando com prompts iterativos',
                body: `Após a geração inicial, refine com prompts específicos:\n\n**Para ajustar cores:** *"Mude o botão principal para a cor #E85D04 e adicione bordas arredondadas"*\n\n**Para adicionar seção:** *"Adicione uma seção de depoimentos com 3 cards logo abaixo do hero"*\n\n**Para corrigir layout:** *"A sidebar está muito larga, reduza para 240px e mude a cor de fundo para #1a1a2e"*\n\nSeja específico sobre o que quer mudar e onde.`,
              },
              {
                title: 'Publicando seu primeiro site',
                body: `Quando estiver satisfeito com o resultado:\n\n1. Clique em **"Publish"** no canto superior direito\n2. O Lovable gera um link público (ex: meuprojeto.lovable.app)\n3. Compartilhe e teste em diferentes dispositivos\n\nSeu site já está no ar — acessível por qualquer pessoa com o link.`,
                tip: 'Sempre teste no celular. O Lovable gera sites responsivos, mas vale confirmar que tudo ficou bem no mobile.'
              }
            ],
            exercise: {
              title: 'Exercício: Crie seu primeiro site completo',
              description: 'Use seu PRD para criar um site real no Lovable.',
              steps: [
                'Abra o Lovable e crie um novo projeto',
                'Escreva o prompt inicial usando seu branding + PRD (use o formato do módulo)',
                'Aguarde a IA gerar — observe as escolhas que ela fez',
                'Faça pelo menos 3 refinamentos com prompts específicos',
                'Publique o site e copie o link',
                'Abra no celular e verifique se tudo está correto',
                'Compartilhe o link com alguém para feedback'
              ]
            }
          }
        },
        {
          id: 'lov-3-m2',
          title: 'Criando sua conta no Supabase',
          subtitle: 'O banco de dados gratuito que vai guardar seus dados reais',
          duration: '10 min',
          xp: 75,
          type: 'pratica',
          content: {
            intro: 'O Supabase é um banco de dados gratuito e poderoso que vai guardar todos os dados do seu projeto — usuários, pedidos, produtos, leads, qualquer coisa. É o "cérebro" dos dados que o Lovable vai usar.',
            sections: [
              {
                title: 'O que é o Supabase e por que usar',
                body: `O Supabase é um serviço de banco de dados baseado em PostgreSQL (o mesmo que grandes empresas usam). É gratuito para começar e se integra perfeitamente com o Lovable.\n\n**O que você pode guardar:**\n- Usuários e senhas (autenticação completa)\n- Dados do negócio (produtos, vendas, clientes)\n- Arquivos e imagens\n- Qualquer estrutura de dados que você precisar`,
                tip: 'O plano gratuito do Supabase suporta até 500MB de dados e 50.000 requisições por mês — mais que suficiente para aprender e para projetos pequenos/médios.'
              },
              {
                title: 'Criando sua conta',
                body: `**Passo 1:** Acesse supabase.com\n**Passo 2:** Clique em "Start your project"\n**Passo 3:** Entre com GitHub (recomendado) ou crie conta com email\n**Passo 4:** Clique em "New project"\n**Passo 5:** Escolha um nome (ex: meu-dashboard), defina uma senha forte, escolha a região "South America (São Paulo)"\n**Passo 6:** Clique em "Create new project" e aguarde 2 minutos`,
              },
              {
                title: 'Entendendo a interface do Supabase',
                body: `**Table Editor:** Onde você vê e edita os dados (como uma planilha)\n\n**SQL Editor:** Para comandos avançados (não precisamos agora)\n\n**Authentication:** Gerencia usuários e login\n\n**Storage:** Para arquivos e imagens\n\n**API:** As chaves que conectam o Lovable ao Supabase`,
                tip: 'Guarde a URL do projeto e as chaves de API (Project Settings > API). Você vai precisar delas para conectar ao Lovable.'
              }
            ],
            exercise: {
              title: 'Exercício: Configure seu Supabase',
              description: 'Crie sua conta e projeto no Supabase.',
              steps: [
                'Acesse supabase.com e crie sua conta com GitHub',
                'Crie um novo projeto com o nome do seu projeto do Lovable',
                'Selecione a região "South America (São Paulo)" para melhor performance',
                'Aguarde o projeto inicializar (1-2 minutos)',
                'Vá em Project Settings > API e copie a "Project URL" e "anon public key"',
                'Salve essas informações — você vai usar no próximo módulo'
              ]
            }
          }
        },
        {
          id: 'lov-3-m3',
          title: 'Conectando o Lovable ao Supabase',
          subtitle: 'Faça seu site ganhar memória — dados reais salvos no banco',
          duration: '15 min',
          xp: 100,
          type: 'exercicio',
          content: {
            intro: 'Com Lovable + Supabase conectados, seu site deixa de ser estático e passa a salvar e ler dados reais. É aqui que a mágica acontece.',
            sections: [
              {
                title: 'Como conectar — o processo oficial',
                body: `**No Lovable:**\n1. Abra seu projeto\n2. Clique no ícone de integração (cubo/database) na barra lateral\n3. Selecione "Supabase"\n4. Cole a Project URL e a anon key do Supabase\n5. Clique em "Connect"\n\nA partir daqui, a IA do Lovable sabe que existe um banco de dados e pode criar funcionalidades que salvam e leem dados.`,
                tip: 'Após conectar, diga para a IA o que você quer salvar. Ex: "Agora que temos o Supabase conectado, crie um formulário de contato que salva nome, email e mensagem na tabela contatos".'
              },
              {
                title: 'Pedindo para a IA criar as tabelas',
                body: `Você não precisa criar as tabelas manualmente. Basta pedir para a IA:\n\n*"Crie a tabela de [produtos] no Supabase com os campos: nome (texto), preco (número), estoque (número), categoria (texto). E crie a tela de cadastro de produtos que salva nessa tabela."*\n\nO Lovable vai gerar o código da tabela E a tela de cadastro ao mesmo tempo.`,
              },
              {
                title: 'Testando que os dados estão salvando',
                body: `Após criar um formulário ou tela de cadastro:\n\n1. Preencha e salve um registro de teste\n2. Abra o Supabase > Table Editor\n3. Selecione a tabela criada\n4. Veja se o registro apareceu lá\n\nSe apareceu — a integração está funcionando perfeitamente.`,
                tip: 'Sempre teste com um dado real antes de mostrar para um cliente. Bugs na conexão são mais fáceis de resolver cedo.'
              }
            ],
            exercise: {
              title: 'Exercício: Conecte e teste a integração',
              description: 'Conecte Lovable ao Supabase e salve seu primeiro dado real.',
              steps: [
                'No Lovable, abra o painel de integrações e conecte ao Supabase com suas chaves',
                'Peça para a IA criar uma tabela simples (ex: tabela de contatos com nome e email)',
                'Peça para criar um formulário que salva nessa tabela',
                'Preencha o formulário e clique em salvar',
                'Abra o Supabase > Table Editor e confirme que o registro apareceu',
                'Comemore — você acabou de criar um sistema real com banco de dados!'
              ]
            }
          }
        }
      ]
    },
    // ── INTERMEDIÁRIO ──────────────────────────────────────────
    {
      id: 'lov-4',
      level: 'intermediario',
      title: 'Dashboard com Dados Reais',
      subtitle: 'KPIs, gráficos e análise conectados ao seu banco de dados',
      xpBonus: 300,
      modules: [
        {
          id: 'lov-4-m1',
          title: 'Conectando planilha ao Supabase',
          subtitle: 'Importe seus dados existentes para o banco de dados',
          duration: '20 min',
          xp: 125,
          type: 'pratica',
          content: {
            intro: 'Você provavelmente já tem dados em planilhas do Excel ou Google Sheets. Vamos importar esses dados para o Supabase para criar dashboards com informações reais.',
            sections: [
              {
                title: 'Exportando da planilha para CSV',
                body: `**Google Sheets:** Arquivo > Download > CSV\n**Excel:** Arquivo > Salvar Como > CSV\n\nO CSV é o formato universal para importar dados em qualquer banco.`,
              },
              {
                title: 'Importando CSV no Supabase',
                body: `1. No Supabase, abra o Table Editor\n2. Clique em "Create a new table"\n3. Nomeie a tabela (ex: vendas, produtos)\n4. Clique nos 3 pontos da tabela > "Import data from CSV"\n5. Faça upload do arquivo e confirme os campos\n\nO Supabase detecta automaticamente os tipos de cada coluna.`,
                tip: 'Antes de importar, limpe a planilha: remova linhas em branco, padronize formatos de data e elimine caracteres especiais nos cabeçalhos.'
              },
              {
                title: 'Pedindo para o Lovable exibir os dados importados',
                body: `Com os dados no Supabase, vá ao Lovable e peça:\n\n*"Crie um dashboard que lê a tabela [nome] do Supabase e exibe: total de vendas, vendas por mês em gráfico de barras, e uma tabela com os últimos 20 registros."*\n\nA IA vai gerar o código completo para ler e exibir seus dados reais.`,
              }
            ]
          }
        },
        {
          id: 'lov-4-m2',
          title: 'KPIs, gráficos e análise com dados reais',
          subtitle: 'Transforme dados brutos em inteligência visual',
          duration: '25 min',
          xp: 150,
          type: 'exercicio',
          content: {
            intro: 'Um bom dashboard não é só números — é uma história visual que permite tomar decisões. Vamos criar KPIs, gráficos e análises que realmente ajudam.',
            sections: [
              {
                title: 'Os 5 tipos de visualização mais úteis',
                body: `**1. Cartão de KPI:** Um número grande com label (ex: "Vendas do Mês: R$48.250")\n\n**2. Gráfico de Barras:** Comparação entre períodos ou categorias\n\n**3. Gráfico de Linha:** Evolução ao longo do tempo\n\n**4. Gráfico de Pizza:** Distribuição percentual\n\n**5. Tabela com filtros:** Lista detalhada com busca e ordenação`,
                tip: 'Comece com 3-4 KPIs principais e 2-3 gráficos. Dashboard com excesso de informação confunde mais do que ajuda.'
              },
              {
                title: 'Prompts para criar cada tipo de visualização',
                body: `**KPIs:**\n*"Adicione 3 cards de KPI no topo: Total de Vendas do Mês (soma da coluna valor), Número de Pedidos, e Ticket Médio. Use ícones e cores diferentes para cada um."*\n\n**Gráfico de barras:**\n*"Crie um gráfico de barras mostrando vendas por mês dos últimos 6 meses, lendo da tabela vendas. Use a cor #E85D04."*\n\n**Filtros:**\n*"Adicione filtro por data e por categoria no topo do dashboard."*`,
              }
            ]
          }
        },
        {
          id: 'lov-4-m3',
          title: 'Metas, insights e alertas automáticos com IA',
          subtitle: 'Faça o dashboard trabalhar por você',
          duration: '20 min',
          xp: 125,
          type: 'exercicio',
          content: {
            intro: 'Um dashboard inteligente não apenas mostra o passado — ele sinaliza o que precisa de atenção agora e ajuda a atingir metas.',
            sections: [
              {
                title: 'Adicionando metas e indicadores visuais',
                body: `*"Adicione uma barra de progresso em cada KPI mostrando o percentual atingido em relação à meta mensal. Se abaixo de 70%, mostre em vermelho; entre 70-90%, amarelo; acima de 90%, verde."*\n\nEsse tipo de visualização torna imediato perceber onde há problema.`,
              },
              {
                title: 'Insights automáticos com IA no dashboard',
                body: `*"Adicione uma seção 'Insights da IA' que analisa os dados da tabela e gera 3 observações automáticas sobre tendências, anomalias ou oportunidades. Use o Claude AI via API para gerar esses insights."*\n\nCom isso, o dashboard não só mostra dados — ele interpreta e sugere ações.`,
                tip: 'Para integrar Claude AI via API no Lovable, você vai precisar de uma API key da Anthropic. O Lovable sabe como fazer essa integração se você pedir diretamente.'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'lov-5',
      level: 'intermediario',
      title: 'Sistemas Completos: CRM e Estoque',
      subtitle: 'Construa sistemas funcionais de gestão com IA',
      xpBonus: 350,
      modules: [
        {
          id: 'lov-5-m1',
          title: 'Sistema de Estoque no Lovable + Supabase',
          subtitle: 'Controle de produtos, entradas, saídas e alertas',
          duration: '30 min',
          xp: 175,
          type: 'pratica',
          content: {
            intro: 'Um sistema de estoque é um dos projetos mais práticos e requisitados. Vamos criar um completo com produtos, movimentações e alertas de estoque baixo.',
            sections: [
              {
                title: 'Estrutura do sistema de estoque',
                body: `O sistema vai precisar de:\n\n**Tabelas no Supabase:**\n- produtos (id, nome, codigo, preco, quantidade, minimo_estoque)\n- movimentacoes (id, produto_id, tipo, quantidade, data, motivo)\n\n**Telas no Lovable:**\n- Cadastro de produtos\n- Listagem com busca e filtros\n- Entrada/saída de estoque\n- Relatório de movimentações\n- Alerta de itens abaixo do mínimo`,
              },
              {
                title: 'Prompt para criar o sistema completo',
                body: `*"Crie um sistema de controle de estoque completo. As tabelas produtos e movimentacoes já existem no Supabase (estrutura: [descreva os campos]). Crie as telas: 1) Dashboard com total de itens, valor total em estoque, e alertas de produtos abaixo do mínimo, 2) Listagem de produtos com busca e filtro por categoria, 3) Formulário de entrada/saída de estoque que registra na tabela movimentacoes, 4) Histórico de movimentações com filtro por produto e período."*`,
                tip: 'Crie as tabelas no Supabase primeiro, depois peça para o Lovable criar as telas. Assim a IA conhece a estrutura exata dos dados.'
              }
            ]
          }
        },
        {
          id: 'lov-5-m2',
          title: 'CRM completo com IA',
          subtitle: 'Pipeline de vendas, acompanhamento de leads e automações',
          duration: '30 min',
          xp: 175,
          type: 'pratica',
          content: {
            intro: 'Um CRM (Customer Relationship Management) ajuda a acompanhar prospects, clientes e o pipeline de vendas. Vamos criar um funcional e profissional.',
            sections: [
              {
                title: 'O que um CRM básico mas funcional precisa ter',
                body: `**Gestão de contatos:** Nome, empresa, email, telefone, status\n\n**Pipeline visual:** Cards em colunas (Prospecção > Proposta > Negociação > Fechado)\n\n**Histórico de interações:** Registro de ligações, emails, reuniões\n\n**Tarefas e follow-ups:** Lembretes de próxima ação por contato\n\n**Relatórios:** Taxa de conversão, tempo médio de ciclo`,
              },
              {
                title: 'Prompt para criar o CRM',
                body: `*"Crie um CRM de vendas. Tabelas no Supabase: contatos (id, nome, empresa, email, telefone, status, criado_em) e interacoes (id, contato_id, tipo, descricao, data). Crie: 1) Kanban board com colunas Novo Lead, Qualificado, Proposta, Negociação, Fechado — com drag and drop, 2) Formulário de cadastro de contato, 3) Página de detalhes do contato com histórico de interações, 4) Dashboard com total de leads por status e taxa de conversão."*`,
                tip: 'O drag-and-drop no Kanban é uma instrução específica que o Lovable sabe implementar. Sempre mencione quando quiser essa funcionalidade.'
              }
            ]
          }
        }
      ]
    },
    // ── AVANÇADO ──────────────────────────────────────────────
    {
      id: 'lov-6',
      level: 'avancado',
      title: 'Deploy e Domínio Próprio',
      subtitle: 'Publique seu projeto com endereço profissional',
      xpBonus: 300,
      modules: [
        {
          id: 'lov-6-m1',
          title: 'Conectando domínio próprio ao seu projeto',
          subtitle: 'Saia do .lovable.app para o seu .com.br',
          duration: '15 min',
          xp: 125,
          type: 'pratica',
          content: {
            intro: 'Um site profissional precisa de um domínio próprio. Vamos conectar seu domínio (comprado no Registro.br ou GoDaddy) ao seu projeto no Lovable.',
            sections: [
              {
                title: 'Comprando um domínio (se ainda não tem)',
                body: `**Registro.br** (domínios .com.br): R$40/ano — recomendado para empresas brasileiras\n**GoDaddy** (.com, .net, etc.): a partir de R$30/ano\n**Cloudflare** (melhor opção técnica): preço de custo + DNS gratuito\n\nEscolha um nome curto, fácil de digitar e sem hifens ou números desnecessários.`,
              },
              {
                title: 'Conectando o domínio no Lovable',
                body: `**No Lovable:**\n1. Vá em Settings > Domains\n2. Clique em "Add custom domain"\n3. Digite seu domínio (ex: meusite.com.br)\n4. O Lovable vai te mostrar os registros DNS para configurar\n\n**No seu registrador de domínio (GoDaddy/Registro.br):**\n1. Acesse o gerenciamento de DNS\n2. Adicione os registros CNAME que o Lovable indicou\n3. Aguarde propagação (1-24 horas)`,
                tip: 'A propagação de DNS pode demorar até 24h, mas geralmente fica pronta em menos de 1 hora. Você pode checar em whatsmydns.net.'
              }
            ]
          }
        },
        {
          id: 'lov-6-m2',
          title: 'Deploy profissional e otimização',
          subtitle: 'Performance, SEO e boas práticas antes de ir ao ar',
          duration: '12 min',
          xp: 100,
          type: 'leitura',
          content: {
            intro: 'Antes de divulgar seu site para clientes ou o público, há algumas otimizações importantes que fazem diferença na experiência e no SEO.',
            sections: [
              {
                title: 'Checklist pré-lançamento',
                body: `**Conteúdo:**\n- Todos os textos revisados?\n- Imagens carregam rápido?\n- Formulários funcionam e salvam no Supabase?\n\n**SEO básico:**\n- Título da página correto?\n- Descrição meta configurada?\n- Imagem de compartilhamento (og:image) definida?\n\n**Teste:**\n- Funcionou no celular?\n- Testou em Chrome, Safari e Firefox?\n- Link do domínio está ativo?`,
              },
              {
                title: 'Pedindo otimizações para a IA do Lovable',
                body: `*"Otimize o site para SEO: adicione meta title '[Seu Título]', meta description '[Sua Descrição]', e og:image. Também reduza o tamanho das imagens para melhorar a velocidade de carregamento."*\n\n*"Adicione um favicon com as iniciais [XY] na cor [#hex] e fundo [#hex]."*`,
              }
            ]
          }
        }
      ]
    },
    {
      id: 'lov-7',
      level: 'avancado',
      title: 'Back-end com Claude Code + n8n',
      subtitle: 'Automatize e escale com ferramentas avançadas',
      xpBonus: 500,
      modules: [
        {
          id: 'lov-7-m1',
          title: 'Claude Code como back-end do dashboard',
          subtitle: 'Use IA para processar dados complexos e gerar análises',
          duration: '40 min',
          xp: 200,
          type: 'exercicio',
          content: {
            intro: 'O Claude Code permite criar scripts e automações que processam dados, geram relatórios e alimentam o dashboard de forma automática — tudo com IA.',
            sections: [
              {
                title: 'Quando usar Claude Code junto com o Lovable',
                body: `O Lovable é excelente para front-end e operações básicas de CRUD. Para lógica mais complexa, use Claude Code:\n\n- Calcular métricas avançadas que o Supabase não faz nativamente\n- Gerar relatórios em PDF\n- Processar dados de múltiplas fontes\n- Criar endpoints de API personalizados\n- Automações que rodam em horários programados`,
              },
              {
                title: 'Integrando Claude Code com Supabase',
                body: `Com Claude Code, você pode criar scripts Node.js que:\n1. Conectam ao Supabase via SDK\n2. Processam dados e calculam métricas\n3. Salvam os resultados de volta no Supabase\n4. O Lovable então lê esses resultados calculados\n\nÉ a separação perfeita: Lovable = visual, Claude Code = lógica, Supabase = dados.`,
                tip: 'Esta abordagem serve para qualquer volume de dados. Quando o projeto crescer, você tem a fundação técnica certa.'
              }
            ]
          }
        },
        {
          id: 'lov-7-m2',
          title: 'Automações com n8n — conectando tudo',
          subtitle: 'Workflows automáticos que trabalham enquanto você dorme',
          duration: '35 min',
          xp: 200,
          type: 'exercicio',
          content: {
            intro: 'O n8n é uma ferramenta de automação visual que conecta apps e serviços. Junto com Lovable e Supabase, você cria pipelines automáticos completos.',
            sections: [
              {
                title: 'O que o n8n pode fazer pelo seu projeto',
                body: `**Exemplos práticos:**\n- Novo lead no CRM → enviar email de boas-vindas automaticamente\n- Planilha atualizada → sincronizar dados no Supabase\n- Estoque abaixo do mínimo → notificação no WhatsApp\n- Nova venda → atualizar dashboard e enviar relatório por email\n- Formulário respondido → criar tarefa no sistema`,
              }
            ]
          }
        },
        {
          id: 'lov-7-m3',
          title: 'Projeto Final: App completo do zero ao avançado',
          subtitle: 'Construa um sistema real integrando tudo que aprendeu',
          duration: '60 min',
          xp: 300,
          type: 'pratica',
          content: {
            intro: 'O projeto final integra tudo: Lovable (visual), Supabase (banco), Claude Code (lógica), n8n (automações) e domínio próprio. Você vai construir um sistema completo do zero.',
            sections: [
              {
                title: 'O desafio final',
                body: `Escolha um dos desafios:\n\n**Opção A — Sistema de Gestão Comercial:**\nDashboard + CRM + Estoque + Relatórios automáticos + Domínio próprio\n\n**Opção B — Dashboard de Análise de Dados:**\nImporte dados reais, crie KPIs, gráficos, insights com IA, relatório PDF automático\n\n**Opção C — Site Completo com Back-office:**\nSite público + área admin para gerenciar conteúdo + Supabase + Domínio`,
              }
            ],
            exercise: {
              title: 'Projeto Final',
              description: 'Construa seu sistema escolhido e publique com domínio próprio.',
              steps: [
                'Escolha uma das 3 opções de projeto',
                'Crie o PRD completo com Claude',
                'Configure as tabelas no Supabase',
                'Construa o visual completo no Lovable',
                'Adicione automações com n8n (pelo menos 2)',
                'Configure domínio próprio',
                'Documente o projeto e compartilhe o link'
              ]
            }
          }
        }
      ]
    }
  ]
}

// ─────────────────────────────────────────────────────────────────
// CURSO 2 — IA para Criação de Conteúdo Profissional
// ─────────────────────────────────────────────────────────────────
const cursoConteudo: CursoDef = {
  id: 'ia-conteudo',
  title: 'IA para Conteúdo',
  subtitle: 'Copy, imagens, vídeos e estratégia — tudo com IA',
  description: 'Domine as ferramentas de IA para criar conteúdo profissional: textos de alto impacto, imagens que convertem, vídeos com IA e estratégia de conteúdo automatizada.',
  color: '#7C3AED',
  access: 'freeBasic',
  tag: 'POPULAR',
  fases: [
    {
      id: 'cont-1',
      level: 'basico',
      title: 'Copy e Textos de Impacto com IA',
      subtitle: 'Escreva textos que vendem usando IA',
      xpBonus: 150,
      modules: [
        {
          id: 'cont-1-m1',
          title: 'Os frameworks de copy que a IA domina',
          subtitle: 'AIDA, PAS, storytelling — aplicados com IA',
          duration: '10 min',
          xp: 60,
          type: 'leitura',
          content: {
            intro: 'Copy é a arte de escrever texto que leva à ação. Com IA, você aplica os melhores frameworks de copy em segundos — para anúncios, emails, posts e landing pages.',
            sections: [
              {
                title: 'Os 3 frameworks de copy mais poderosos',
                body: `**AIDA (Atenção > Interesse > Desejo > Ação):**\nIdeal para anúncios e headlines. A IA aplica perfeitamente quando você indica o framework.\n\n**PAS (Problema > Agitação > Solução):**\nIdeal para emails e páginas de vendas. Foca na dor do cliente antes de apresentar a solução.\n\n**Storytelling:**\nIdeal para posts de marca pessoal e conteúdo de engajamento. A IA escreve histórias autênticas se você der os fatos reais.`,
                tip: 'Sempre diga para a IA qual framework usar. "Escreva um post usando o framework PAS sobre [tema]" gera resultado muito superior a apenas "escreva um post sobre [tema]".'
              },
              {
                title: 'O prompt de copy profissional',
                body: `**Template universal:**\n*"Você é um copywriter especializado em [nicho]. Usando o framework [AIDA/PAS/storytelling], escreva [tipo de texto: post, email, anúncio] para [produto/serviço]. Público: [descreva]. Objetivo: [conversão/engajamento/educação]. Tom: [formal/descontraído]. Limite de [X] palavras."*\n\nCom esse template, você tem a IA como seu copywriter pessoal.`,
              }
            ],
            quiz: [
              {
                question: 'Para escrever um email de vendas que foca primeiro na dor do cliente, qual framework usar?',
                options: ['AIDA', 'Storytelling', 'PAS (Problema-Agitação-Solução)', 'FAB (Features-Advantages-Benefits)'],
                correct: 2,
                explanation: 'O PAS começa identificando o Problema, depois Agita (aprofunda a dor) e então apresenta a Solução. Perfeito para emails de vendas.'
              }
            ]
          }
        },
        {
          id: 'cont-1-m2',
          title: 'Imagens profissionais com IA',
          subtitle: 'Gemini, Midjourney e prompts visuais que funcionam',
          duration: '12 min',
          xp: 75,
          type: 'pratica',
          content: {
            intro: 'Criar imagens profissionais não requer designer. Com IA de imagem, você gera fotos, ilustrações e arte digital de alta qualidade com texto.',
            sections: [
              {
                title: 'Qual ferramenta de imagem usar',
                body: `**Gemini (Nano Banana / Imagen 3):** Melhor para imagens realistas, fotos de produto, pessoas. Integrado ao Google.\n\n**Midjourney:** Melhor para arte, ilustrações, estilos artísticos. Resultado mais criativo.\n\n**DALL-E (ChatGPT):** Bom equilíbrio, melhor para mockups e infográficos.\n\n**Canva Magic Studio:** Mais fácil de usar, ótimo para começar.`,
              },
              {
                title: 'A anatomia de um prompt de imagem que funciona',
                body: `**Estrutura:** [Sujeito] + [Contexto] + [Estilo] + [Técnica/Câmera] + [Iluminação] + [Cor]\n\n**Exemplo ruim:** "foto de produto"\n\n**Exemplo bom:** "Produto: caneca de café minimalista branca, sobre mesa de madeira escura, estúdio fotográfico com iluminação suave e difusa, bokeh ao fundo, estilo editorial, alta resolução, cores quentes"`,
                tip: 'Quanto mais específico o prompt, mais previsível o resultado. Salve prompts que funcionaram — eles são reutilizáveis com outras marcas.'
              }
            ],
            exercise: {
              title: 'Exercício: Crie 3 imagens para seu projeto',
              description: 'Use o Gemini ou Midjourney para criar imagens profissionais.',
              steps: [
                'Escolha um produto ou serviço que você quer representar visualmente',
                'Escreva um prompt usando a estrutura do módulo (sujeito + contexto + estilo + iluminação + cor)',
                'Gere a imagem no Gemini (gemini.google.com) ou Midjourney',
                'Se o resultado não for o esperado, ajuste 1 elemento do prompt e gere novamente',
                'Gere 3 variações diferentes para o mesmo produto/serviço',
                'Salve o prompt que deu o melhor resultado'
              ]
            }
          }
        }
      ]
    },
    {
      id: 'cont-2',
      level: 'intermediario',
      title: 'Vídeo e Estratégia Automatizada',
      subtitle: 'Vídeos com IA e pipeline de conteúdo automatizado',
      xpBonus: 250,
      modules: [
        {
          id: 'cont-2-m1',
          title: 'Vídeos com IA — do roteiro ao final',
          subtitle: 'Higgsfield, Kling e como criar vídeos profissionais sem câmera',
          duration: '20 min',
          xp: 125,
          type: 'pratica',
          content: {
            intro: 'A IA de vídeo evoluiu ao ponto de criar conteúdo profissional sem câmera. Vamos usar as melhores ferramentas para criar vídeos de marketing, apresentações e reels.',
            sections: [
              {
                title: 'Ferramentas de vídeo com IA em 2025',
                body: `**Higgsfield:** Melhor para vídeos realistas com pessoas. Controle preciso de movimentos.\n\n**Kling:** Excelente qualidade geral, bom para produtos e cenas dinâmicas.\n\n**Runway Gen-3:** Mais criativo e artístico. Ótimo para edição de vídeos existentes.\n\n**HeyGen:** Especializado em avatares que falam — perfeito para apresentações com porta-voz de IA.`,
              }
            ]
          }
        },
        {
          id: 'cont-2-m2',
          title: 'Estratégia de conteúdo automatizada com IA',
          subtitle: 'Crie 30 dias de conteúdo em 2 horas',
          duration: '25 min',
          xp: 150,
          type: 'exercicio',
          content: {
            intro: 'Conteúdo consistente é o segredo do crescimento orgânico. Com IA, você planeja, cria e agenda 30 dias de posts em uma tarde.',
            sections: [
              {
                title: 'O framework de calendário de conteúdo com IA',
                body: `**Passo 1:** Peça para o Claude criar um calendário editorial de 30 dias para [nicho]\n**Passo 2:** Para cada post, use o Claude para escrever o texto\n**Passo 3:** Use Gemini para criar as imagens\n**Passo 4:** Use Make ou Zapier para agendar automaticamente no Instagram/LinkedIn\n\nIsso é literalmente um mês de conteúdo profissional em uma tarde de trabalho.`,
              }
            ]
          }
        }
      ]
    },
    {
      id: 'cont-3',
      level: 'avancado',
      title: 'Pipeline Completo de Conteúdo',
      subtitle: 'Sistema de produção de conteúdo em escala com IA',
      xpBonus: 400,
      modules: [
        {
          id: 'cont-3-m1',
          title: 'Pipeline de produção em escala',
          subtitle: 'Automatize toda a cadeia de criação de conteúdo',
          duration: '45 min',
          xp: 250,
          type: 'pratica',
          content: {
            intro: 'No nível avançado, você não cria conteúdo — você cria sistemas que criam conteúdo. Vamos montar um pipeline completo que vai do briefing ao post publicado de forma semiautomática.',
            sections: [
              {
                title: 'O pipeline de conteúdo com IA',
                body: `**Etapa 1: Briefing** (Notion/Google Sheets)\n→ Você define tema, objetivo e público\n\n**Etapa 2: Pesquisa** (Perplexity AI)\n→ IA pesquisa tendências e dados atuais\n\n**Etapa 3: Roteiro/Copy** (Claude)\n→ IA escreve o texto final\n\n**Etapa 4: Visual** (Gemini/Midjourney)\n→ IA gera imagens\n\n**Etapa 5: Publicação** (n8n/Zapier)\n→ Automação posta nos canais configurados\n\nTodo o pipeline orquestrado por n8n, do briefing ao post publicado.`,
              }
            ]
          }
        }
      ]
    }
  ]
}

// ─────────────────────────────────────────────────────────────────
// CURSO 3 — Gestão de Dados & Business Intelligence
// ─────────────────────────────────────────────────────────────────
const cursoDadosBI: CursoDef = {
  id: 'dados-bi',
  title: 'Dados & Business Intelligence',
  subtitle: 'Transforme dados em decisões com IA e dashboards profissionais',
  description: 'Aprenda a coletar, organizar e visualizar dados para tomar decisões estratégicas. Do básico ao avançado: Supabase, KPIs, dashboards BI e análises preditivas.',
  color: '#059669',
  access: 'freeBasic',
  tag: 'NOVO',
  fases: [
    {
      id: 'bi-1',
      level: 'basico',
      title: 'Dados para Não-Técnicos',
      subtitle: 'Entenda dados sem saber programar',
      xpBonus: 150,
      modules: [
        {
          id: 'bi-1-m1',
          title: 'Por que dados são o ativo mais valioso do seu negócio',
          subtitle: 'O que são dados, como coletá-los e por que importa',
          duration: '10 min',
          xp: 60,
          type: 'leitura',
          content: {
            intro: 'Dados são registros de tudo que acontece no seu negócio: vendas, cliques, acessos, ligações, pedidos. Quem sabe ler dados toma decisões com evidência — não com intuição.',
            sections: [
              {
                title: 'Os 3 tipos de dados que todo negócio tem',
                body: `**1. Dados de operação:** O que aconteceu — vendas, pedidos, atendimentos\n\n**2. Dados de comportamento:** Como as pessoas agem — cliques, tempo no site, jornada do usuário\n\n**3. Dados de resultado:** O impacto do que aconteceu — receita, churn, NPS, custo de aquisição\n\nA maioria das empresas só olha os dados de operação. Os melhores também olham comportamento e resultado.`,
                tip: 'Antes de criar qualquer dashboard, responda: "Que decisão eu vou tomar com esse dado?" Se não tiver resposta, o dado não precisa estar no dashboard.'
              },
              {
                title: 'Onde os dados do seu negócio estão',
                body: `**Vendas:** CRM, sistema de notas fiscais, planilhas\n**Marketing:** Google Analytics, Meta Ads, relatórios de redes sociais\n**Financeiro:** Contador, banco, sistema de gestão\n**Atendimento:** WhatsApp, CRM, sistema de tickets\n\nO desafio não é falta de dados — é reunir tudo em um lugar para ter visão completa.`,
              }
            ],
            quiz: [
              {
                question: 'Qual é a pergunta certa a fazer antes de criar um KPI no dashboard?',
                options: [
                  'Qual é a fórmula matemática desse indicador?',
                  'Que decisão eu vou tomar com esse dado?',
                  'Qual cor usar para visualizar esse dado?',
                  'Quantas pessoas vão ver esse dashboard?'
                ],
                correct: 1,
                explanation: 'Um KPI só tem valor se gera uma decisão. "Receita do mês" é um dado. "Receita do mês vs meta, com semáforo vermelho/amarelo/verde" é um KPI que gera ação.'
              }
            ]
          }
        },
        {
          id: 'bi-1-m2',
          title: 'Conectando suas planilhas ao Supabase',
          subtitle: 'Centralize todos os dados do negócio em um banco de dados',
          duration: '15 min',
          xp: 75,
          type: 'pratica',
          content: {
            intro: 'Planilhas são ótimas para começar, mas chegam ao limite. O Supabase resolve: centraliza tudo, permite múltiplos usuários, e serve como base para dashboards profissionais.',
            sections: [
              {
                title: 'O que o Supabase resolve que a planilha não consegue',
                body: `**Planilha:** Limite de linhas, difícil compartilhar, versões conflitantes, sem automação real\n\n**Supabase:** Ilimitado, multi-usuário com permissões, API para conectar qualquer sistema, automações nativas`,
              },
              {
                title: 'Estratégia de migração de planilha para Supabase',
                body: `**Passo 1:** Identifique as planilhas mais importantes (vendas, clientes, produtos)\n**Passo 2:** Limpe os dados: remova duplicatas, padronize formatos\n**Passo 3:** Exporte como CSV\n**Passo 4:** Crie as tabelas no Supabase (com ajuda da IA)\n**Passo 5:** Importe os CSVs\n**Passo 6:** Conecte ao Lovable ou Google Data Studio para visualizar`,
                tip: 'Comece com UMA planilha, migre, veja funcionando, depois migre as outras. Não tente fazer tudo de uma vez.'
              }
            ],
            exercise: {
              title: 'Exercício: Migre uma planilha real para o Supabase',
              description: 'Escolha uma planilha do seu negócio e migre para o banco de dados.',
              steps: [
                'Escolha a planilha mais importante do seu negócio (ex: planilha de vendas)',
                'Abra no Google Sheets e identifique os campos principais',
                'Peça ao Claude para sugerir a estrutura de tabela ideal para esses dados',
                'Crie a tabela no Supabase (Table Editor > Create table)',
                'Exporte a planilha como CSV e importe no Supabase',
                'Verifique se todos os dados foram importados corretamente'
              ]
            }
          }
        }
      ]
    },
    {
      id: 'bi-2',
      level: 'intermediario',
      title: 'Dashboard BI Profissional',
      subtitle: 'KPIs, metas e análises que geram decisões',
      xpBonus: 300,
      modules: [
        {
          id: 'bi-2-m1',
          title: 'Construindo um dashboard BI completo',
          subtitle: 'Métricas, filtros e visualizações para gestão estratégica',
          duration: '30 min',
          xp: 175,
          type: 'pratica',
          content: {
            intro: 'Um dashboard BI profissional é a diferença entre gestão reativa (reagir ao que já aconteceu) e gestão proativa (antecipar problemas e oportunidades).',
            sections: [
              {
                title: 'Os componentes de um dashboard BI eficiente',
                body: `**Nível 1 — Resumo executivo:** 3-5 KPIs principais, status vs meta, tendência (seta para cima ou baixo)\n\n**Nível 2 — Análise por dimensão:** Gráficos por período, por produto, por região, por vendedor\n\n**Nível 3 — Detalhe operacional:** Tabela filtrável com todos os registros\n\n**Filtros globais:** Por data, por produto, por usuário — que afetam todos os componentes`,
              }
            ]
          }
        },
        {
          id: 'bi-2-m2',
          title: 'Análises preditivas simples com IA',
          subtitle: 'Preveja tendências e antecipe problemas com IA',
          duration: '25 min',
          xp: 150,
          type: 'exercicio',
          content: {
            intro: 'Você não precisa ser cientista de dados para fazer previsões. Com IA, você faz análises preditivas simples que ajudam a antecipar o futuro do negócio.',
            sections: [
              {
                title: 'Análise de tendência com o Claude',
                body: `Exporte os últimos 6 meses de dados como CSV e use este prompt no Claude:\n\n*"Analise estes dados de vendas. Identifique: 1) Tendência geral (crescimento ou queda), 2) Sazonalidade (há padrões mensais?), 3) Previsão para os próximos 3 meses, 4) Alertas (algo que merece atenção imediata). Seja direto e use linguagem de negócios, não técnica."*`,
                tip: 'O Claude não é um modelo estatístico formal, mas para análises de negócio do dia a dia, as insights que ele gera são muito valiosas e acionáveis.'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'bi-3',
      level: 'avancado',
      title: 'Data Warehouse e Relatórios Executivos',
      subtitle: 'Infraestrutura de dados profissional para escala',
      xpBonus: 450,
      modules: [
        {
          id: 'bi-3-m1',
          title: 'Arquitetura de dados para PMEs',
          subtitle: 'Do dado bruto ao relatório executivo automatizado',
          duration: '50 min',
          xp: 300,
          type: 'pratica',
          content: {
            intro: 'No nível avançado, você vai estruturar uma arquitetura de dados profissional: coleta, transformação, armazenamento e visualização — tudo automatizado.',
            sections: [
              {
                title: 'A stack de dados para PMEs com IA',
                body: `**Coleta:** Google Analytics + Zapier/n8n (captura dados de múltiplas fontes)\n**Armazenamento:** Supabase (banco centralizado)\n**Transformação:** n8n (processa e limpa os dados)\n**Visualização:** Lovable ou Google Looker Studio\n**Análise:** Claude AI (interpretação e insights)\n\nEssa stack resolve 90% das necessidades de análise de uma PME sem custo de cientista de dados.`,
              }
            ]
          }
        }
      ]
    }
  ]
}

// ─────────────────────────────────────────────────────────────────
// CURSO 4 — Automação Inteligente com n8n (TOTALMENTE BLOQUEADO)
// ─────────────────────────────────────────────────────────────────
const cursoN8n: CursoDef = {
  id: 'automacao-n8n',
  title: 'Automação com n8n',
  subtitle: 'Workflows automáticos que eliminam tarefas repetitivas',
  description: 'Aprenda a criar automações poderosas com n8n: conecte apps, automatize processos e construa sistemas que trabalham enquanto você dorme. Do básico ao avançado.',
  color: '#D97706',
  access: 'fullPaid',
  tag: 'PREMIUM',
  teaser: 'Neste curso você aprende a automatizar qualquer processo do seu negócio: notificações automáticas, sincronização de dados entre sistemas, geração de relatórios agendados, integração com WhatsApp, email marketing automático, e muito mais — tudo com n8n + IA.',
  fases: [
    {
      id: 'n8n-1',
      level: 'basico',
      title: 'Fundamentos do n8n',
      subtitle: 'Entenda como funciona a automação visual',
      xpBonus: 200,
      modules: [
        {
          id: 'n8n-1-m1',
          title: 'O que é o n8n e por que ele é superior ao Zapier',
          subtitle: 'A ferramenta de automação que profissionais usam',
          duration: '10 min',
          xp: 60,
          type: 'leitura',
          content: {
            intro: 'Conteúdo disponível para assinantes premium.',
            sections: [{ title: 'Conteúdo Premium', body: 'Adquira o acesso para desbloquear este módulo.' }]
          }
        }
      ]
    }
  ]
}

// ─────────────────────────────────────────────────────────────────
// CURSO 5 — Vendas & CRM com IA (TOTALMENTE BLOQUEADO)
// ─────────────────────────────────────────────────────────────────
const cursoVendasCRM: CursoDef = {
  id: 'vendas-crm',
  title: 'Vendas & CRM com IA',
  subtitle: 'Prospecte mais, converta melhor e feche mais negócios',
  description: 'Use IA para turbinar seu processo de vendas: prospecção automatizada, scripts personalizados, follow-up inteligente, CRM com IA e análise de pipeline completa.',
  color: '#DC2626',
  access: 'fullPaid',
  tag: 'PREMIUM',
  teaser: 'Neste curso você aprende a usar IA em cada etapa do processo de vendas: identificar e qualificar leads automaticamente, criar scripts ultra-personalizados para cada prospect, automatizar follow-ups sem parecer robótico, construir um CRM com IA integrada e analisar seu pipeline para prever o fechamento do mês.',
  fases: [
    {
      id: 'vendas-1',
      level: 'basico',
      title: 'Prospecção com IA',
      subtitle: 'Encontre e qualifique leads automaticamente',
      xpBonus: 200,
      modules: [
        {
          id: 'vendas-1-m1',
          title: 'Prospecção automatizada com IA',
          subtitle: 'Identifique leads ideais em escala',
          duration: '12 min',
          xp: 75,
          type: 'leitura',
          content: {
            intro: 'Conteúdo disponível para assinantes premium.',
            sections: [{ title: 'Conteúdo Premium', body: 'Adquira o acesso para desbloquear este módulo.' }]
          }
        }
      ]
    }
  ]
}

// ─────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────
export const CURSOS: CursoDef[] = [
  cursoLovable,
  cursoConteudo,
  cursoDadosBI,
  cursoN8n,
  cursoVendasCRM,
]

export function getCurso(id: string): CursoDef | undefined {
  return CURSOS.find(c => c.id === id)
}

export function getCursoModule(cursoId: string, moduleId: string): { module: CursoModule; fase: CursoFase } | null {
  const curso = getCurso(cursoId)
  if (!curso) return null
  for (const fase of curso.fases) {
    const module = fase.modules.find(m => m.id === moduleId)
    if (module) return { module, fase }
  }
  return null
}

export function getCursoProgress(curso: CursoDef): { total: number; byLevel: Record<string, number> } {
  const byLevel: Record<string, number> = { basico: 0, intermediario: 0, avancado: 0 }
  let total = 0
  for (const fase of curso.fases) {
    byLevel[fase.level] = (byLevel[fase.level] || 0) + fase.modules.length
    total += fase.modules.length
  }
  return { total, byLevel }
}

export const ADMIN_EMAIL_CURSOS = 'breno.nobre@gruporiomais.com.br'
