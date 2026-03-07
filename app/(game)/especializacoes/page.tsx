'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { CURSOS, ADMIN_EMAIL_CURSOS, getCursoProgress, type CursoDef } from '@/lib/curso-data'
import { Lock, ChevronRight, Star, Zap, BookOpen } from 'lucide-react'

const COURSE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  'lovable-supabase': Zap,
  'ia-conteudo': Star,
  'dados-bi': BookOpen,
  'automacao-n8n': Zap,
  'vendas-crm': Star,
}

export default function EspecializacoesPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      if (session.user.email === ADMIN_EMAIL_CURSOS) setIsAdmin(true)
      setLoading(false)
    }
    check()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: '#E85D04', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(232,93,4,0.1)', border: '1px solid rgba(232,93,4,0.25)',
          borderRadius: 20, padding: '6px 14px', marginBottom: 20,
        }}>
          <Zap size={12} color="#E85D04" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#E85D04', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
            ESPECIALIZACOES
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 34, fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 12, lineHeight: 1.15,
        }}>
          Cursos de Especialização
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, maxWidth: 600 }}>
          Aprofunde seu conhecimento em ferramentas específicas. Cada curso vai do básico ao avançado com exercícios práticos e projetos reais.
        </p>

        {!isAdmin && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
            background: 'rgba(107,122,158,0.08)', border: '1px solid rgba(107,122,158,0.18)',
            borderRadius: 8, padding: '8px 14px',
          }}>
            <Lock size={12} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Modulos basico gratuitos — Intermediario e Avancado requerem assinatura
            </span>
          </div>
        )}
      </div>

      {/* Grid de cursos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CURSOS.map(curso => (
          <CursoCard key={curso.id} curso={curso} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  )
}

function CursoCard({ curso, isAdmin }: { curso: CursoDef; isAdmin: boolean }) {
  const prog = getCursoProgress(curso)
  const isFullyLocked = curso.access === 'fullPaid' && !isAdmin
  const CourseIcon = COURSE_ICONS[curso.id] || BookOpen

  const levelCounts = [
    { label: 'Basico', key: 'basico' as const, color: '#059669' },
    { label: 'Intermediario', key: 'intermediario' as const, color: '#3B5BDB' },
    { label: 'Avancado', key: 'avancado' as const, color: '#7C3AED' },
  ]

  return (
    <div className="glass-card" style={{
      padding: '24px 28px',
      opacity: isFullyLocked ? 0.75 : 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Stripe de cor */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
        background: curso.color,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, paddingLeft: 8 }}>

        {/* Ícone */}
        <div style={{
          width: 52, height: 52, flexShrink: 0,
          background: `${curso.color}15`,
          border: `1px solid ${curso.color}30`,
          borderRadius: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isFullyLocked
            ? <Lock size={22} color={curso.color} strokeWidth={1.7} />
            : <CourseIcon size={22} color={curso.color} strokeWidth={1.7} />
          }
        </div>

        {/* Conteúdo */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {curso.title}
            </h2>
            <span className="section-label" style={{
              color: curso.color,
              borderColor: `${curso.color}30`,
              background: `${curso.color}10`,
            }}>
              {curso.tag}
            </span>
            {isFullyLocked && (
              <span className="section-label" style={{ color: '#6B7A9E', borderColor: 'rgba(107,122,158,0.2)', background: 'rgba(107,122,158,0.06)' }}>
                PREMIUM
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, margin: '0 0 14px 0' }}>
            {isFullyLocked ? (curso.teaser ?? curso.description) : curso.description}
          </p>

          {/* Stats de módulos por nível */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {levelCounts.map(({ label, key, color }) => {
              const count = prog.byLevel[key] || 0
              if (count === 0) return null
              const isLevelLocked = !isAdmin && (
                (curso.access === 'fullPaid') ||
                (curso.access === 'freeBasic' && key !== 'basico')
              )
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isLevelLocked
                    ? <Lock size={10} color="var(--text-muted)" strokeWidth={2} />
                    : <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                  }
                  <span style={{ fontSize: 11, color: isLevelLocked ? 'var(--text-muted)' : 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {label}: {count} mod.
                  </span>
                </div>
              )
            })}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              {prog.total} total
            </span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ flexShrink: 0 }}>
          {isFullyLocked ? (
            <button disabled style={{
              background: 'rgba(107,122,158,0.08)',
              border: '1px solid rgba(107,122,158,0.2)',
              borderRadius: 9, padding: '10px 18px',
              color: 'var(--text-muted)', fontWeight: 700, fontSize: 13,
              fontFamily: 'Space Grotesk, sans-serif', cursor: 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Lock size={13} />
              Adquirir
            </button>
          ) : (
            <Link href={`/curso/${curso.id}`} style={{ textDecoration: 'none' }}>
              <button style={{
                background: `linear-gradient(135deg, ${curso.color}, ${curso.color}cc)`,
                border: 'none',
                borderRadius: 9, padding: '10px 20px',
                color: '#fff', fontWeight: 700, fontSize: 13,
                fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {isAdmin ? 'Acessar' : 'Iniciar gratis'}
                <ChevronRight size={14} />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
