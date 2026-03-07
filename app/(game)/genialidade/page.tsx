'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Lock, Sparkles, Brain, Target, Zap, Star, ChevronRight, X, ArrowRight, Lightbulb, User } from 'lucide-react'

const ADMIN_EMAIL = 'breno.nobre@gruporiomais.com.br'

type Framework = {
  icon: React.ElementType
  label: string
  desc: string
  color: string
  fullTitle: string
  year: string
  about: string
  methodology: string
  howItHelps: string
  keyQuestion: string
}

const FRAMEWORKS: Framework[] = [
  {
    icon: Brain,
    label: 'Gay Hendricks',
    desc: 'Zona de Gênio',
    color: '#7C3AED',
    fullTitle: 'The Big Leap — Gay Hendricks',
    year: '2009',
    about: 'Gay Hendricks é PhD em Psicologia, fundador do conceito de Zona de Genialidade e autor do bestseller "The Big Leap". Ele descobriu que humanos têm um "termostato interno de sucesso" que os impede de chegar ao próximo nível — e criou o sistema das 4 Zonas para quebrar esse padrão.',
    methodology: 'Identifica 4 zonas de atuação: Incompetência, Competência, Excelência e Gênio. A Zona de Gênio é onde você opera com prazer espontâneo, habilidade única e resultados que parecem fluir sem esforço — onde o tempo passa voando e os resultados surgem naturalmente.',
    howItHelps: 'Com IA, você delega as tarefas das zonas inferiores e concentra 80% do seu tempo no que só você faz com excelência genuína. A IA cuida da Excelência; você foca no Gênio.',
    keyQuestion: 'Em quais atividades você perde totalmente a noção do tempo e, no final, pensa "foi fácil demais para ser real"?',
  },
  {
    icon: Star,
    label: 'CliftonStrengths',
    desc: 'Forças Naturais',
    color: '#3B5BDB',
    fullTitle: 'CliftonStrengths — Don Clifton / Gallup',
    year: '1998',
    about: 'Don Clifton, o "Pai da Psicologia Positiva" e CEO da Gallup, criou a ferramenta de mapeamento de forças mais usada do mundo. Mais de 26 milhões de pessoas já identificaram seus talentos com essa metodologia. Parte da premissa que é mais eficiente amplificar forças do que corrigir fraquezas.',
    methodology: 'Mapeia 34 temas de talentos agrupados em 4 domínios: Execução, Influência, Construção de Relacionamentos e Pensamento Estratégico. Seus Top 5 são os talentos que definem como você naturalmente pensa, sente e age em qualquer situação.',
    howItHelps: 'Conhecer seus Top 5 permite usar IA de forma estratégica: você configura agentes e prompts alinhados com suas forças, e automatiza o que exige seus pontos cegos — criando uma equipe IA-humano complementar.',
    keyQuestion: 'Quais atividades você aprende naturalmente mais rápido que os outros ao seu redor, como se você "já soubesse" de alguma forma?',
  },
  {
    icon: Target,
    label: 'Dan Sullivan',
    desc: 'Habilidade Única',
    color: '#0891B2',
    fullTitle: 'Unique Ability — Dan Sullivan / Strategic Coach',
    year: '2000',
    about: 'Dan Sullivan é co-fundador do Strategic Coach, o programa de coaching para empreendedores mais longo do mundo (mais de 30 anos contínuos). Criou o conceito de "Unique Ability" para ajudar fundadores de alto desempenho a identificar com precisão cirúrgica onde estão no topo absoluto do que fazem.',
    methodology: 'Define 4 categorias: Incompetência, Competência, Excelência e Unique Ability. A Habilidade Única é a intersecção rara de: paixão genuína, habilidade superior reconhecida pelos outros, e criação de valor contínuo que você entrega de forma inigualável e que nunca se esgota.',
    howItHelps: 'IA pode assumir 70-80% das tarefas que não são sua Unique Ability — liberando você para operar exclusivamente no que nenhuma IA substitui: a sua contribuição irreplicável para o mundo.',
    keyQuestion: 'O que as pessoas consistentemente te elogiam e pedem para repetir — e você acha que "qualquer um faria isso"? (spoiler: não faria)',
  },
  {
    icon: Zap,
    label: 'Wealth Dynamics',
    desc: 'Perfil de Riqueza',
    color: '#059669',
    fullTitle: 'Wealth Dynamics — Roger Hamilton',
    year: '2002',
    about: 'Roger Hamilton é empreendedor serial, filósofo de negócios e fundador do Entrepreneurs Institute. Criou o Wealth Dynamics baseado nos 64 hexagramas do I Ching, mapeando como diferentes tipos de pessoas criam riqueza de formas distintas — e por que o mesmo negócio falha para um e funciona para outro.',
    methodology: '8 perfis de riqueza: Creator (inventa), Star (inspira), Supporter (conecta), Deal Maker (negocia), Trader (compra e vende), Accumulator (acumula), Lord (sistematiza) e Mechanic (otimiza). Cada perfil tem um fluxo natural de criação de valor e uma estratégia de negócios específica.',
    howItHelps: 'Entender seu perfil muda como você usa IA: Creators usam IA para iterar ideias rapidamente; Lords usam IA para automatizar e otimizar sistemas; Stars usam IA para amplificar conteúdo e presença. Sem isso, você usa IA contra sua natureza.',
    keyQuestion: 'Quando você cria valor, você prefere: inovar e inventar, inspirar e liderar, conectar pessoas, negociar, comprar/vender, acumular e proteger, ou otimizar sistemas existentes?',
  },
  {
    icon: Sparkles,
    label: 'Alex Hormozi',
    desc: 'Equação de Valor',
    color: '#D97706',
    fullTitle: '$100M Offers — Alex Hormozi',
    year: '2021',
    about: 'Alex Hormozi construiu um portfólio de empresas gerando mais de $200M/ano partindo do zero aos 23 anos. Em "$100M Offers" ele revelou a equação matemática que torna qualquer oferta irrecusável — independente do nicho, produto ou preço. O livro vendeu mais de 500.000 cópias sem marketing pago.',
    methodology: 'Valor = (Sonho × Probabilidade de Conquista) ÷ (Tempo × Esforço). A metodologia mapeia como maximizar o valor percebido pelo cliente usando 4 alavancas: aumentar o sonho, aumentar a probabilidade de sucesso, reduzir o tempo para resultado e reduzir o esforço percebido.',
    howItHelps: 'Com IA, você cria e testa múltiplas variações de ofertas em escala — personaliza propostas em tempo real, analisa o que aumenta o "Sonho" de cada segmento e gera scripts que reduzem a fricção do cliente em cada etapa.',
    keyQuestion: 'Qual é o sonho máximo (resultado final desejado) que seu produto entrega? E qual é o maior medo ou obstáculo que impede seu cliente de comprar agora?',
  },
  {
    icon: Brain,
    label: 'Kolbe',
    desc: 'Modo de Ação',
    color: '#DC2626',
    fullTitle: 'Kolbe A Index — Kathy Kolbe',
    year: '1984',
    about: 'Kathy Kolbe é filha de E.F. Wonderlic (criador do teste de QI corporativo) e descobriu que a parte "conativa" da mente — como você age — é completamente independente do QI e da personalidade. O Kolbe A Index mede instintos naturais de ação, não o que você pode fazer ou quer fazer, mas como você naturalmente faz.',
    methodology: '4 modos de ação mensurados de 1-10: Fact Finder (coleta e verifica informação), Follow Thru (organiza e cria sistemas), Quick Start (improvisa e assume riscos), Implementor (trabalha com o concreto e tangível). Seu "código Kolbe" (ex: 7-3-8-2) revela seu instinto natural de resolução de problemas.',
    howItHelps: 'Seu código Kolbe revela como você deve configurar sua relação com IA: Quick Starts altos usam IA para prototipar e iterar rapidamente; Fact Finders altos usam IA para pesquisa profunda e validação de dados; Follow Thrus usam IA para criar sistemas e fluxos automatizados.',
    keyQuestion: 'Quando você enfrenta um problema novo e urgente, seu instinto é: pesquisar exaustivamente, criar um plano estruturado, experimentar de cara sem plan, ou já tentar construir algo físico/concreto?',
  },
  {
    icon: Star,
    label: 'Sally Hogshead',
    desc: 'Vantagem de Fascínio',
    color: '#DB2777',
    fullTitle: 'How to Fascinate — Sally Hogshead',
    year: '2010',
    about: 'Sally Hogshead é ex-redatora publicitária premiada com mais de 20 Cannes Lions e a única pessoa no mundo a transformar a neurociência do fascínio em uma metodologia aplicável a negócios. Sua descoberta central: você não precisa ser fascinante para todos — você precisa ser irresistível para as pessoas certas.',
    methodology: '7 vantagens primárias de fascínio: Inovação (criatividade), Paixão (emoção e conexão), Poder (confiança e liderança), Prestígio (excelência e padrões), Confiança (consistência e lealdade), Misticismo (profundidade e curiosidade) e Alerta (detalhes e precisão). Cada pessoa tem uma combinação única — sua "dupla de fascínio".',
    howItHelps: 'Com IA, você amplifica sua vantagem de fascínio na criação de conteúdo, marca pessoal e comunicação — produzindo mensagens que ressoam com autenticidade irreproduzível, porque nascem da sua essência e não de templates genéricos.',
    keyQuestion: 'Quando as pessoas te descrevem para alguém que não te conhece, quais 3 palavras elas usam? E pelo que você é genuinamente reconhecido(a) sem precisar forçar?',
  },
]

export default function GenialidadePage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasBluePrint, setHasBluePrint] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Framework | null>(null)

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      if (session.user.email === ADMIN_EMAIL) setIsAdmin(true)

      const { data } = await supabase
        .from('genius_blueprints')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
      if (data) setHasBluePrint(true)
      setLoading(false)
    }
    check()
  }, [])

  // Fechar modal com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const canAccess = true

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes neon-pulse {
          0%, 100% {
            box-shadow: 0 0 12px rgba(124,58,237,0.5), 0 0 28px rgba(124,58,237,0.3), 0 0 50px rgba(124,58,237,0.15);
          }
          50% {
            box-shadow: 0 0 20px rgba(219,39,119,0.6), 0 0 40px rgba(124,58,237,0.4), 0 0 70px rgba(124,58,237,0.2);
          }
        }
        @keyframes cta-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .framework-card {
          cursor: pointer;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .framework-card:hover {
          transform: translateY(-2px);
        }
        .neon-btn {
          animation: neon-pulse 2.4s ease-in-out infinite;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .neon-btn:hover {
          transform: scale(1.015);
          opacity: 0.92;
        }
        .neon-btn:active {
          transform: scale(0.99);
        }
      `}</style>

      {/* ── Modal de detalhes ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(4,6,15,0.82)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 16px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #0D1225 0%, #111827 100%)',
              border: `1px solid ${selected.color}40`,
              borderRadius: 20,
              width: '100%', maxWidth: 620,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px 32px',
              position: 'relative',
              animation: 'modal-in 0.22s ease',
              boxShadow: `0 0 60px ${selected.color}20, 0 30px 80px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Fechar */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#6B7A9E',
              }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 52, height: 52, flexShrink: 0, borderRadius: 14,
                background: `${selected.color}18`,
                border: `1.5px solid ${selected.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 20px ${selected.color}20`,
              }}>
                <selected.icon size={22} color={selected.color} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: selected.color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', marginBottom: 4 }}>
                  {selected.desc.toUpperCase()} · {selected.year}
                </div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 800, color: '#E8EEFF', lineHeight: 1.25, marginRight: 44 }}>
                  {selected.fullTitle}
                </h2>
              </div>
            </div>

            {/* Sobre */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <User size={14} color={selected.color} />
                <span style={{ fontSize: 11, fontWeight: 700, color: selected.color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>SOBRE O CRIADOR</span>
              </div>
              <p style={{ color: '#8B9CC8', fontSize: 14, lineHeight: 1.75 }}>
                {selected.about}
              </p>
            </div>

            <div style={{ height: 1, background: `${selected.color}20`, marginBottom: 20 }} />

            {/* Metodologia */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Brain size={14} color={selected.color} />
                <span style={{ fontSize: 11, fontWeight: 700, color: selected.color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>A METODOLOGIA</span>
              </div>
              <p style={{ color: '#8B9CC8', fontSize: 14, lineHeight: 1.75 }}>
                {selected.methodology}
              </p>
            </div>

            <div style={{ height: 1, background: `${selected.color}20`, marginBottom: 20 }} />

            {/* Como a IA ajuda */}
            <div style={{
              background: `${selected.color}0D`,
              border: `1px solid ${selected.color}25`,
              borderRadius: 12, padding: '18px 20px', marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Zap size={14} color={selected.color} />
                <span style={{ fontSize: 11, fontWeight: 700, color: selected.color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>COMO A IA POTENCIALIZA</span>
              </div>
              <p style={{ color: '#C5CCEE', fontSize: 14, lineHeight: 1.75 }}>
                {selected.howItHelps}
              </p>
            </div>

            {/* Pergunta-chave */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Lightbulb size={14} color='#D97706' />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>PERGUNTA-CHAVE</span>
              </div>
              <p style={{ color: '#E8EEFF', fontSize: 15, lineHeight: 1.7, fontStyle: 'italic' }}>
                "{selected.keyQuestion}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <div style={{ padding: '40px 24px', maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 20, padding: '6px 14px', marginBottom: 20,
          }}>
            <Sparkles size={13} color="#7C3AED" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
              ZONA DE GENIALIDADE
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 14, lineHeight: 1.15,
          }}>
            Descubra onde vive o seu<br />
            <span style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>gênio natural</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>
            Um mapeamento profundo baseado em 7 metodologias de elite usadas por coaches e empresas Fortune 500.
            Toque em qualquer metodologia para entender o que ela revela sobre você.
          </p>
        </div>

        {/* Frameworks grid — flex centralizado */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 36,
          justifyContent: 'center',
        }}>
          {FRAMEWORKS.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="framework-card"
                onClick={() => setSelected(f)}
                style={{
                  background: 'var(--card-bg)',
                  border: `1px solid var(--border)`,
                  borderRadius: 12, padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: 'calc(50% - 6px)',
                  maxWidth: 280,
                  minWidth: 200,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={f.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{f.desc}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{f.label}</div>
                </div>
                <ChevronRight size={13} color={f.color} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </div>
            )
          })}
        </div>

        {/* What you get */}
        <div className="glass-card" style={{ padding: '28px 32px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18 }}>
            O que você recebe ao final
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {[
              ['Sua Zona de Gênio identificada', '#7C3AED'],
              ['Top 5 Forças CliftonStrengths', '#3B5BDB'],
              ['Habilidade Única definida', '#0891B2'],
              ['Perfil de Riqueza mapeado', '#059669'],
              ['Equação de Valor personalizada', '#D97706'],
              ['Modo de Ação Kolbe', '#DC2626'],
              ['Posicionamento de Fascínio', '#DB2777'],
              ['Plano de Ação 90 dias com IA', '#7C3AED'],
            ].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {canAccess ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {hasBluePrint && (
              <Link href="/genialidade/resultado" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.4)',
                  borderRadius: 14, padding: '16px 24px',
                  color: '#7C3AED', fontWeight: 700, fontSize: 15,
                  fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  Ver meu Blueprint
                  <ChevronRight size={16} />
                </button>
              </Link>
            )}
            <Link href="/genialidade/quiz" style={{ textDecoration: 'none' }}>
              <button
                className="neon-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  border: 'none',
                  borderRadius: 14, padding: '18px 28px',
                  color: '#fff', fontWeight: 800, fontSize: 17,
                  fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  letterSpacing: '0.01em',
                }}
              >
                <Sparkles size={18} strokeWidth={2} />
                {hasBluePrint ? 'Refazer o Mapeamento' : 'Iniciar Mapeamento de Genialidade'}
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <div style={{
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: 14, padding: '24px 28px',
              display: 'flex', alignItems: 'center', gap: 16,
              marginBottom: 16, flexWrap: 'wrap',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={20} color="#7C3AED" />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 5 }}>
                  Mapeamento Premium — R$ 12,90
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Acesso completo ao quiz de 42 perguntas + Blueprint personalizado gerado por IA com base nas 7 metodologias.
                </div>
              </div>
            </div>
            <Link href="/checkout?produto=genialidade" style={{ textDecoration: 'none' }}>
              <button
                className="neon-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  border: 'none',
                  borderRadius: 14, padding: '18px 28px',
                  color: '#fff', fontWeight: 800, fontSize: 17,
                  fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                <Sparkles size={18} />
                Desbloquear Mapeamento — R$ 12,90
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
