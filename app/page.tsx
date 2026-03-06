'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  Megaphone, TrendingUp, BarChart2, ArrowRight,
  BookOpen, Zap, Award, ChevronRight,
} from 'lucide-react'

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
    modules: 12,
    desc: 'Criação de conteúdo, campanhas, SEO, copy e automação de marketing com IA.',
    tags: ['Copy com IA', 'Conteúdo em escala', 'Estratégia digital'],
  },
  {
    Icon: TrendingUp,
    title: 'Vendas',
    color: '#059669',
    modules: 15,
    desc: 'Prospecção inteligente, scripts personalizados, follow-up e fechamento de negócios com IA.',
    tags: ['Cold email com IA', 'Scripts de vendas', 'Preparação de reuniões'],
  },
  {
    Icon: BarChart2,
    title: 'Financeiro',
    color: '#D97706',
    modules: 15,
    desc: 'Análise de dados, relatórios executivos, automação de tarefas e decisões financeiras com IA.',
    tags: ['Análise de planilhas', 'Relatórios em minutos', 'Detecção de anomalias'],
  },
]

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

const DIFFERENTIALS = [
  { Icon: BookOpen, label: '45+ módulos práticos', sub: 'Conteúdo direto ao ponto, sem enrolação', color: '#3B5BDB' },
  { Icon: Zap,      label: 'Aprenda em 10 min/dia', sub: 'Módulos curtos para quem tem pouco tempo', color: '#7C3AED' },
  { Icon: Award,    label: 'Gamificado com XP',     sub: 'Evolua de nível enquanto aprende de verdade', color: '#D97706' },
]

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

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

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,7,16,0.85)',
        borderBottom: '1px solid rgba(59,91,219,0.12)',
        backdropFilter: 'blur(16px)',
        padding: '0 48px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SiriusLogo size={32} />
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14, color: '#E8EEFF', letterSpacing: '0.06em', lineHeight: 1.1 }}>SIRIUS</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 9, color: '#6B7A9E', letterSpacing: '0.16em' }}>ACADEMY</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ textDecoration: 'none', color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, padding: '8px 16px' }}>
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
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(59,91,219,0.1)',
          border: '1px solid rgba(59,91,219,0.25)',
          borderRadius: 20, padding: '6px 16px',
          marginBottom: 32,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B5BDB', boxShadow: '0 0 8px #3B5BDB' }} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: '#7B9FFF', letterSpacing: '0.12em' }}>
            SIRIUS ACADEMY — IA PARA PROFISSIONAIS
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
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
        <p style={{
          color: '#8B9CC8',
          fontSize: 'clamp(16px, 2vw, 20px)',
          maxWidth: 580,
          lineHeight: 1.65,
          marginBottom: 20,
        }}>
          A plataforma de aprendizado de IA feita para profissionais de Marketing, Vendas e Financeiro que querem resultados reais — não só teoria.
        </p>
        <p style={{
          color: '#6B7A9E',
          fontSize: 15,
          maxWidth: 480,
          lineHeight: 1.6,
          marginBottom: 48,
        }}>
          Módulos práticos de 10 minutos. Prompts prontos para usar. Exercícios reais do seu dia a dia.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
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
              color: '#C5CCEE',
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
        <div style={{
          display: 'flex', gap: 56, flexWrap: 'wrap', justifyContent: 'center',
          paddingTop: 40,
          borderTop: '1px solid rgba(59,91,219,0.12)',
        }}>
          {[
            { value: '3', label: 'Áreas profissionais' },
            { value: '45+', label: 'Módulos práticos' },
            { value: '10min', label: 'Por módulo' },
            { value: '0', label: 'Conhecimento técnico exigido' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 900, color: '#3B5BDB', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: '#6B7A9E', fontSize: 13, marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Propósito ── */}
      <section style={{ padding: '80px 24px', maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <span className="section-label" style={{ marginBottom: 20, display: 'inline-block' }}>POR QUÊ EXISTE</span>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 24, letterSpacing: '-0.02em' }}>
          A IA já está no seu setor.<br />A questão é: quem vai usá-la primeiro?
        </h2>
        <p style={{ color: '#8B9CC8', fontSize: 17, lineHeight: 1.75, maxWidth: 680, margin: '0 auto 20px' }}>
          Profissionais que dominam IA não trabalham mais — trabalham melhor. Eles fazem em 30 minutos o que antes levava o dia inteiro. Criam campanhas melhores, abordam mais prospects, analisam dados mais rápido.
        </p>
        <p style={{ color: '#6B7A9E', fontSize: 16, lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
          A Sirius Academy existe para que sua equipe não fique para trás. Cada módulo foi construído para gerar resultado prático imediato — não para parecer sofisticado.
        </p>
      </section>

      {/* ── Áreas ── */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label" style={{ marginBottom: 16, display: 'inline-block' }}>TRILHAS DE APRENDIZADO</span>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Aprenda IA na sua área de atuação
          </h2>
          <p style={{ color: '#6B7A9E', fontSize: 16 }}>
            Conteúdo específico para a realidade do seu trabalho — não cursos genéricos.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {AREAS.map(area => (
            <div key={area.title} className="glass-card" style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
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
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 19, color: '#E8EEFF' }}>
                    {area.title}
                  </div>
                  <div style={{ fontSize: 12, color: area.color, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {area.modules} módulos · 3 níveis
                  </div>
                </div>
              </div>

              <p style={{ color: '#8B9CC8', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
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

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: area.color, fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                Ver trilha completa <ChevronRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label" style={{ marginBottom: 16, display: 'inline-block' }}>COMO FUNCIONA</span>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Do primeiro acesso ao resultado real
          </h2>
          <p style={{ color: '#6B7A9E', fontSize: 16 }}>
            Simples, direto e construído para quem tem pouco tempo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.n} style={{ position: 'relative' }}>
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
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 10, color: '#E8EEFF' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#8B9CC8', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {DIFFERENTIALS.map(d => (
            <div key={d.label} className="glass-card" style={{ padding: '22px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                background: `${d.color}14`, border: `1px solid ${d.color}25`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <d.Icon size={18} color={d.color} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', marginBottom: 4 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 12, color: '#6B7A9E', lineHeight: 1.5 }}>
                  {d.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section style={{ padding: '80px 24px 100px', textAlign: 'center' }}>
        <div style={{
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

          <p style={{ color: '#8B9CC8', fontSize: 16, lineHeight: 1.65, marginBottom: 36 }}>
            Crie sua conta grátis, escolha sua área e complete o primeiro módulo em menos de 10 minutos.
          </p>

          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '15px 44px', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Criar conta grátis
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </Link>

          <div style={{ marginTop: 20, color: '#6B7A9E', fontSize: 13 }}>
            Sem cartão de crédito · Acesso imediato
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(59,91,219,0.1)',
        padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SiriusLogo size={22} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#6B7A9E' }}>
            Sirius Academy
          </span>
        </div>
        <span style={{ fontSize: 12, color: '#4A5270' }}>
          Feito para profissionais que não param de evoluir.
        </span>
      </footer>

    </main>
  )
}
