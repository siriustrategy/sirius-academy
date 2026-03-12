'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { CURSOS } from '@/lib/curso-data'
import { FadeInSection, StaggerSection, StaggerItem } from '@/components/animations'
import StarfieldCanvas from '@/components/StarfieldCanvas'
import {
  Megaphone, TrendingUp, BarChart2, ArrowRight,
  BookOpen, Zap, Award, ChevronRight, ChevronDown, ChevronUp, X, Sun, Moon,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// ── Sirius Logo ───────────────────────────────────────────────
function SiriusLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="lp-g1" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lp-g2" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="19" y1="8"  x2="28" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="19" y1="8"  x2="10" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="28" y1="17" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="10" y1="17" x2="14" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="14" y1="27" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <circle cx="10" cy="17" r="1.3" fill="#7B9FFF" filter="url(#lp-g1)" />
      <circle cx="28" cy="17" r="1.3" fill="#7B9FFF" filter="url(#lp-g1)" />
      <circle cx="14" cy="27" r="1.1" fill="#5C7FFF" filter="url(#lp-g1)" />
      <circle cx="24" cy="27" r="1.1" fill="#5C7FFF" filter="url(#lp-g1)" />
      <circle cx="19" cy="8"  r="3.2" fill="#3B5BDB" filter="url(#lp-g2)" />
      <circle cx="19" cy="8"  r="1.6" fill="#E8EEFF" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────
const AREAS = [
  {
    Icon: Megaphone,
    title: 'Marketing',
    color: '#3B5BDB',
    cursoId: 'ia-conteudo',
    desc: 'Criação de conteúdo, campanhas, SEO, copy e automação de marketing com IA.',
    tags: ['Copy com IA', 'Conteúdo em escala', 'Estratégia digital'],
  },
  {
    Icon: TrendingUp,
    title: 'Vendas',
    color: '#059669',
    cursoId: 'vendas-crm',
    desc: 'Prospecção inteligente, scripts personalizados, follow-up e fechamento de negócios com IA.',
    tags: ['Cold email com IA', 'Scripts de vendas', 'Preparação de reuniões'],
  },
  {
    Icon: BarChart2,
    title: 'Financeiro',
    color: '#D97706',
    cursoId: 'dados-bi',
    desc: 'Análise de dados, relatórios executivos, automação de tarefas e decisões financeiras com IA.',
    tags: ['Análise de planilhas', 'Relatórios em minutos', 'Detecção de anomalias'],
  },
]

const LEVEL_LABELS: Record<string, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}
const LEVEL_COLORS: Record<string, string> = {
  basico: '#10b981',
  intermediario: '#3B5BDB',
  avancado: '#7C3AED',
}
const TYPE_LABELS: Record<string, string> = {
  leitura: 'Leitura',
  exercicio: 'Exercício',
  quiz: 'Quiz',
  pratica: 'Prática',
}

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Escolha sua área',
    desc: 'Marketing, Vendas ou Financeiro. Trilhas construídas para a sua realidade profissional.',
    color: '#3B5BDB',
  },
  {
    n: '02',
    title: 'Aprenda fazendo',
    desc: 'Módulos curtos com prompts reais, exercícios práticos e quizzes. Nada de teoria sem aplicação.',
    color: '#7C3AED',
  },
  {
    n: '03',
    title: 'Aplique amanhã',
    desc: 'Cada módulo termina com um desafio para usar no seu trabalho no dia seguinte.',
    color: '#059669',
  },
]

const FAQ_ITEMS = [
  {
    q: 'O que é a Sirius Academy?',
    a: 'É uma plataforma de aprendizado de IA feita para profissionais de Marketing, Vendas e Financeiro. Você aprende a usar ferramentas de IA no seu trabalho real — com módulos práticos de 10 minutos, prompts prontos para usar e exercícios do dia a dia.',
  },
  {
    q: 'Preciso saber programar ou entender de tecnologia?',
    a: 'Não. Zero. A Sirius Academy foi construída para quem nunca usou IA antes. Tudo é explicado de forma simples, com exemplos práticos direto para a sua área de atuação.',
  },
  {
    q: 'O acesso é gratuito?',
    a: 'Sim. Você cria sua conta grátis e já tem acesso ao conteúdo. Algumas ferramentas extras, como o Mapeamento de Zona de Genialidade, têm um custo avulso de R$ 12,90 — mas os cursos principais são gratuitos.',
  },
  {
    q: 'Quanto tempo preciso dedicar por dia?',
    a: 'Cada módulo leva em média 10 minutos. Você aprende no seu ritmo, quando quiser. Não tem prazo, não tem aula ao vivo obrigatória.',
  },
  {
    q: 'Para quem é a Sirius Academy?',
    a: 'Para profissionais que trabalham com Marketing, Vendas ou Financeiro e querem usar IA para trabalhar mais rápido e com mais qualidade. Não importa o nível — do analista ao gestor, todos saem aplicando.',
  },
  {
    q: 'O que é o Mapeamento de Zona de Genialidade?',
    a: 'É uma ferramenta exclusiva que analisa seu perfil com base em 7 metodologias usadas por coaches e empresas Fortune 500 (Gay Hendricks, CliftonStrengths, Kolbe e outras). No final, você recebe um relatório personalizado com sua zona de gênio, forças naturais e um plano de 90 dias com IA.',
  },
  {
    q: 'O conteúdo é atualizado com frequência?',
    a: 'Sim. A IA evolui rápido — e a Sirius Academy também. Novos módulos e atualizações são adicionados regularmente para refletir as ferramentas e técnicas mais recentes do mercado.',
  },
]

const DIFFERENTIALS = [
  { Icon: BookOpen, label: '45+ módulos práticos', sub: 'Conteúdo direto ao ponto, sem enrolação', color: '#3B5BDB' },
  { Icon: Zap,      label: 'Aprenda em 10 min/dia', sub: 'Módulos curtos para quem tem pouco tempo', color: '#7C3AED' },
  { Icon: Award,    label: 'Gamificado com XP',     sub: 'Evolua de nível enquanto aprende de verdade', color: '#D97706' },
]

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [checking, setChecking] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [trilhaAberta, setTrilhaAberta] = useState<string | null>(null)

  const cursoAberto = trilhaAberta ? CURSOS.find(c => c.id === trilhaAberta) : null

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/dashboard')
      else setChecking(false)
    })
  }, [router])

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #0C1566', borderTopColor: '#3B5BDB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <StarfieldCanvas />
      <style>{`
        @keyframes neon-badge {
          0%, 100% {
            box-shadow: 0 0 6px rgba(59,91,219,0.3), 0 0 16px rgba(59,91,219,0.15);
            border-color: rgba(59,91,219,0.25);
          }
          50% {
            box-shadow: 0 0 14px rgba(59,91,219,0.7), 0 0 32px rgba(59,91,219,0.35), 0 0 60px rgba(59,91,219,0.15);
            border-color: rgba(59,91,219,0.6);
          }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="landing-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
        padding: '0 48px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SiriusLogo size={32} />
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '0.06em', lineHeight: 1.1 }}>SIRIUS</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.16em' }}>ACADEMY</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--muted-bg)', border: '1px solid var(--border)',
              borderRadius: 8, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark'
              ? <Sun size={16} color="var(--text-secondary)" strokeWidth={2} />
              : <Moon size={16} color="var(--text-secondary)" strokeWidth={2} />
            }
          </button>
          <Link href="/login" className="landing-nav-entrar" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, padding: '8px 16px' }}>
            Entrar
          </Link>
          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 13, padding: '9px 20px' }}>
              Criar conta grátis
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow radial */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(59,91,219,0.10) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '60%', left: '30%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div className="hero-item hero-item-0" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(59,91,219,0.1)',
          border: '1px solid rgba(59,91,219,0.25)',
          borderRadius: 20, padding: '6px 16px',
          marginBottom: 32,
          animation: 'neon-badge 2.8s ease-in-out infinite 0.8s, hero-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards',
          opacity: 0,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B5BDB', boxShadow: '0 0 8px #3B5BDB' }} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: '#7B9FFF', letterSpacing: '0.12em' }}>
            SIRIUS ACADEMY — IA PARA PROFISSIONAIS
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-item hero-item-1" style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(38px, 6vw, 76px)',
          fontWeight: 900,
          lineHeight: 1.0,
          letterSpacing: '-0.03em',
          maxWidth: 860,
          marginBottom: 28,
        }}>
          Sua equipe com{' '}
          <span style={{
            background: 'linear-gradient(135deg, #3B5BDB 0%, #7C3AED 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            superpoderes de IA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-item hero-item-2" style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(16px, 2vw, 20px)',
          maxWidth: 580,
          lineHeight: 1.65,
          marginBottom: 20,
        }}>
          A plataforma de aprendizado de IA feita para profissionais de todas as áreas de uma empresa que querem resultados reais — não só teoria.
        </p>
        <p className="hero-item hero-item-3" style={{
          color: 'var(--text-secondary)',
          fontSize: 15,
          maxWidth: 480,
          lineHeight: 1.6,
          marginBottom: 48,
        }}>
          Módulos práticos de 10 minutos. Prompts prontos para usar. Exercícios reais do seu dia a dia.
        </p>

        {/* CTAs */}
        <div className="hero-item hero-item-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '15px 36px', display: 'flex', alignItems: 'center', gap: 8 }}>
              Começar agora — é grátis
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </Link>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(59,91,219,0.35)',
              color: 'var(--text-primary)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              borderRadius: 8, padding: '15px 32px',
              fontSize: 16, cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              Já tenho conta
            </button>
          </Link>
        </div>

        {/* Numbers */}
        <StaggerSection className="hero-item hero-item-5 landing-hero-stats" style={{
          display: 'flex', gap: 56, flexWrap: 'wrap', justifyContent: 'center',
          paddingTop: 40,
          borderTop: '1px solid rgba(59,91,219,0.12)',
        }}>
          {[
            { value: '3', label: 'Áreas profissionais' },
            { value: '45+', label: 'Módulos práticos' },
            { value: '10min', label: 'Por módulo' },
            { value: '0', label: 'Conhecimento técnico exigido' },
          ].map((stat, i) => (
            <StaggerItem key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 900, color: '#3B5BDB', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>{stat.label}</div>
            </StaggerItem>
          ))}
        </StaggerSection>
      </section>

      {/* ── Propósito ── */}
      <section style={{ padding: '80px 24px', maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <FadeInSection>
          <span className="section-label" style={{ marginBottom: 20, display: 'inline-block' }}>POR QUÊ EXISTE</span>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 24, letterSpacing: '-0.02em' }}>
            A IA já está no seu setor.<br />A questão é: quem vai usá-la primeiro?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.75, maxWidth: 680, margin: '0 auto 20px' }}>
            Profissionais que dominam IA não trabalham mais — trabalham melhor. Eles fazem em 30 minutos o que antes levava o dia inteiro. Criam campanhas melhores, abordam mais prospects, analisam dados mais rápido.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            A Sirius Academy existe para que sua equipe não fique para trás. Cada módulo foi construído para gerar resultado prático imediato — não para parecer sofisticado.
          </p>
        </FadeInSection>
      </section>

      {/* ── Áreas ── */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label" style={{ marginBottom: 16, display: 'inline-block' }}>TRILHAS DE APRENDIZADO</span>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Aprenda IA na sua área de atuação
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            Conteúdo específico para a realidade do seu trabalho — não cursos genéricos.
          </p>
        </div>

        <StaggerSection style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {AREAS.map(area => (
            <StaggerItem key={area.title} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="glass-card" style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{
                  width: 50, height: 50, flexShrink: 0,
                  background: `${area.color}14`,
                  border: `1px solid ${area.color}28`,
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <area.Icon size={22} color={area.color} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 19, color: 'var(--text-primary)' }}>
                    {area.title}
                  </div>
                  <div style={{ fontSize: 12, color: area.color, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {CURSOS.find(c => c.id === area.cursoId)?.fases.reduce((acc, f) => acc + f.modules.length, 0) || 0} módulos · {CURSOS.find(c => c.id === area.cursoId)?.fases.length || 0} fases
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                {area.desc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {area.tags.map(tag => (
                  <span key={tag} style={{
                    background: `${area.color}10`,
                    border: `1px solid ${area.color}22`,
                    borderRadius: 6, padding: '4px 10px',
                    fontSize: 11, color: area.color,
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setTrilhaAberta(area.cursoId)}
                style={{
                  marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                  color: area.color, fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                Ver trilha completa <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
            </StaggerItem>
          ))}
        </StaggerSection>
      </section>

      {/* ── Como funciona ── */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label" style={{ marginBottom: 16, display: 'inline-block' }}>COMO FUNCIONA</span>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Do primeiro acesso ao resultado real
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            Simples, direto e construído para quem tem pouco tempo.
          </p>
        </div>

        <StaggerSection className="landing-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {HOW_IT_WORKS.map((step, i) => (
            <StaggerItem key={step.n} style={{ position: 'relative' }}>
              {i < HOW_IT_WORKS.length - 1 && (
                <div style={{
                  position: 'absolute', top: 24, right: -12, zIndex: 1,
                  color: 'rgba(59,91,219,0.2)', fontSize: 20,
                }}>→</div>
              )}
              <div className="glass-card" style={{ padding: '28px 24px', height: '100%' }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                  color: step.color, letterSpacing: '0.08em',
                  marginBottom: 16, opacity: 0.8,
                }}>
                  {step.n}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 10, color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerSection>
      </section>

      {/* ── Diferenciais ── */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <StaggerSection className="landing-diff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {DIFFERENTIALS.map(d => (
            <StaggerItem key={d.label}>
            <div className="glass-card" style={{ padding: '22px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                background: `${d.color}14`, border: `1px solid ${d.color}25`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <d.Icon size={18} color={d.color} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {d.sub}
                </div>
              </div>
            </div>
            </StaggerItem>
          ))}
        </StaggerSection>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 24px', maxWidth: 760, margin: '0 auto' }}>
        <FadeInSection style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label" style={{ marginBottom: 16, display: 'inline-block' }}>PERGUNTAS FREQUENTES</span>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ficou alguma dúvida?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            As perguntas mais comuns de quem está chegando agora.
          </p>
        </FadeInSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                style={{
                  background: isOpen ? 'rgba(59,91,219,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isOpen ? 'rgba(59,91,219,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                    color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}>
                    {item.q}
                  </span>
                  <div style={{
                    width: 28, height: 28, flexShrink: 0,
                    background: isOpen ? 'rgba(59,91,219,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isOpen ? 'rgba(59,91,219,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {isOpen
                      ? <ChevronUp size={14} color="#7B9FFF" strokeWidth={2.5} />
                      : <ChevronDown size={14} color="#6B7A9E" strokeWidth={2.5} />
                    }
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <div style={{ height: 1, background: 'rgba(59,91,219,0.12)', marginBottom: 16 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section style={{ padding: '80px 24px 100px', textAlign: 'center' }}>
        <FadeInSection>
        <div className="landing-cta-box" style={{
          maxWidth: 640, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(59,91,219,0.12) 0%, rgba(124,58,237,0.08) 100%)',
          border: '1px solid rgba(59,91,219,0.28)',
          borderRadius: 20, padding: '56px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 500, height: 300,
            background: 'radial-gradient(ellipse, rgba(59,91,219,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <SiriusLogo size={48} />
          </div>

          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 30, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Comece hoje.<br />Aplique amanhã.
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.65, marginBottom: 36 }}>
            Crie sua conta grátis, escolha sua área e complete o primeiro módulo em menos de 10 minutos.
          </p>

          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '15px 44px', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Criar conta grátis
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </Link>

          <div style={{ marginTop: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
            Sem cartão de crédito · Acesso imediato
          </div>
        </div>
        </FadeInSection>
      </section>

      {/* ── Modal Trilha ── */}
      {cursoAberto && (
        <div
          onClick={() => setTrilhaAberta(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(4,6,15,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 16px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #0D1225 0%, #111827 100%)',
              border: `1px solid ${cursoAberto.color}35`,
              borderRadius: 20,
              width: '100%', maxWidth: 640,
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '32px 28px',
              position: 'relative',
              animation: 'modal-in 0.22s ease',
              boxShadow: `0 0 60px ${cursoAberto.color}18, 0 30px 80px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Fechar */}
            <button
              onClick={() => setTrilhaAberta(null)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-secondary)',
              }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: 24, paddingRight: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: cursoAberto.color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.12em', marginBottom: 8 }}>
                TRILHA COMPLETA
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 800, color: '#E8EEFF', marginBottom: 8 }}>
                {cursoAberto.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 }}>
                {cursoAberto.description}
              </p>
            </div>

            <div style={{ height: 1, background: `${cursoAberto.color}20`, marginBottom: 24 }} />

            {/* Fases e módulos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {cursoAberto.fases.map((fase, fi) => (
                <div key={fase.id}>
                  {/* Fase header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      background: `${LEVEL_COLORS[fase.level]}18`,
                      border: `1px solid ${LEVEL_COLORS[fase.level]}35`,
                      borderRadius: 6, padding: '3px 10px',
                      fontSize: 10, fontWeight: 700,
                      color: LEVEL_COLORS[fase.level],
                      fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em',
                    }}>
                      {LEVEL_LABELS[fase.level]}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#C5CCEE' }}>
                      Fase {fi + 1} — {fase.title}
                    </div>
                  </div>

                  {/* Módulos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 4 }}>
                    {fase.modules.map((mod, mi) => (
                      <div
                        key={mod.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 14px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: 8,
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          background: `${cursoAberto.color}15`,
                          border: `1px solid ${cursoAberto.color}25`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
                          color: cursoAberto.color,
                        }}>
                          {mi + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#C5CCEE', lineHeight: 1.3 }}>
                            {mod.title}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 10, color: '#4A5680', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {mod.duration}
                          </span>
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                            background: 'rgba(59,91,219,0.1)', color: '#7B9FFF',
                            fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em',
                          }}>
                            {TYPE_LABELS[mod.type]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${cursoAberto.color}18` }}>
              <Link href="/cadastro" style={{ textDecoration: 'none' }} onClick={() => setTrilhaAberta(null)}>
                <button style={{
                  width: '100%',
                  background: `linear-gradient(135deg, ${cursoAberto.color} 0%, ${cursoAberto.color}CC 100%)`,
                  border: 'none', borderRadius: 10, padding: '13px 20px',
                  color: '#fff', fontWeight: 700, fontSize: 15,
                  fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  Começar essa trilha — é grátis
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="landing-footer" style={{
        borderTop: '1px solid rgba(59,91,219,0.1)',
        padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SiriusLogo size={22} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)' }}>
            Sirius Academy
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/termos" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            Termos de Uso
          </Link>
          <Link href="/privacidade" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            Política de Privacidade
          </Link>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Feito para profissionais que não param de evoluir.
          </span>
        </div>
      </footer>

    </main>
  )
}
