'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Sparkles, MessageSquare, Image, Video, Code2, Zap, Crown } from 'lucide-react'

const PHASES = [
  { Icon: Sparkles, title: 'O Despertar',   desc: 'Fundamentos de IA',          color: '#5B7BFF' },
  { Icon: MessageSquare, title: 'O Maestro', desc: 'Dominando o Claude',         color: '#7C3AED' },
  { Icon: Image,     title: 'O Criador',    desc: 'Marketing e Redes Sociais',   color: '#10b981' },
  { Icon: Video,     title: 'O Artista',    desc: 'Gemini & Nano Banana',        color: '#f59e0b' },
  { Icon: Code2,     title: 'O Diretor',    desc: 'Higgsfield & Kling',          color: '#ef4444' },
  { Icon: Zap,       title: 'O Arquiteto',  desc: 'Avatares & Consistência',     color: '#06b6d4' },
  { Icon: Crown,     title: 'O Construtor', desc: 'Lovable & Sites (Bônus)',     color: '#f59e0b' },
]

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
        <div style={{
          width: 40, height: 40,
          border: '3px solid #0C1566',
          borderTopColor: '#3B5BDB',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(59,91,219,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(59,91,219,0.8))', animation: 'float 3s ease-in-out infinite' }}>
          <Sparkles size={64} color="#3B5BDB" strokeWidth={1.2} />
        </div>

        <div className="phase-badge" style={{ marginBottom: 24 }}>SIRIUS ACADEMY</div>

        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          maxWidth: 800,
          marginBottom: 24,
        }}>
          A sua revolução com{' '}
          <span className="gradient-text">IA começa aqui</span>
        </h1>

        <p style={{ color: '#6B7A9E', fontSize: 20, maxWidth: 560, lineHeight: 1.6, marginBottom: 48, fontFamily: 'DM Sans, sans-serif' }}>
          Do zero ao avançado. Aprenda a usar IA para marketing, criar conteúdo viral, imagens, vídeos e sites — jogando.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
              Começar agora — é grátis
            </button>
          </Link>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(59,91,219,0.4)',
              color: '#E8EEFF',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              borderRadius: 8,
              padding: '14px 32px',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              Já tenho conta
            </button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 48, marginTop: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '7', label: 'Fases do jogo' },
            { value: '5', label: 'Níveis de domínio' },
            { value: '0', label: 'Conhecimento prévio necessário' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 900, color: '#3B5BDB' }}>
                {stat.value}
              </div>
              <div style={{ color: '#6B7A9E', fontSize: 14, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Phases */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            7 fases. Uma transformação.
          </h2>
          <p style={{ color: '#6B7A9E', fontSize: 17 }}>
            Cada fase desbloqueada te dá XP e te aproxima do domínio total da IA para marketing.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {PHASES.map((phase, i) => (
            <div key={phase.title} className="glass-card" style={{ padding: 24, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 52, height: 52,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${phase.color}15`, border: `1px solid ${phase.color}30`,
                borderRadius: 12, flexShrink: 0,
              }}>
                <phase.Icon size={22} color={phase.color} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ color: '#6B7A9E', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>FASE {i + 1}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{phase.title}</div>
                <div style={{ color: '#6B7A9E', fontSize: 14 }}>{phase.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto',
          background: 'rgba(10,10,20,0.8)',
          border: '1px solid rgba(59,91,219,0.3)',
          borderRadius: 20, padding: '48px 32px',
        }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <Sparkles size={40} color="#3B5BDB" strokeWidth={1.4} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            Pronto para começar?
          </h2>
          <p style={{ color: '#6B7A9E', marginBottom: 32, fontSize: 16 }}>
            Crie sua conta em 30 segundos e comece a Fase 1 agora.
          </p>
          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px 40px' }}>
              Criar conta grátis
            </button>
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </main>
  )
}
