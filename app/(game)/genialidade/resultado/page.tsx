'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Brain, Star, Target, Zap, Sparkles, Users, TrendingUp,
  RefreshCw, ChevronDown, ChevronUp, Lock, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'breno.nobre@gruporiomais.com.br'
const FREE_SECTIONS = 2 // quantas seções o usuário vê de graça

const SECTION_META = [
  { key: 'IDENTIDADE',       color: '#7C3AED', icon: Brain,      label: 'Identidade Estratégica'     },
  { key: 'GÊNIO',            color: '#7C3AED', icon: Sparkles,   label: 'Zona de Gênio'              },
  { key: 'CLIFTONSTRENGTHS', color: '#3B5BDB', icon: Star,       label: 'CliftonStrengths'           },
  { key: 'HABILIDADE',       color: '#0891B2', icon: Target,     label: 'Habilidade Única'           },
  { key: 'RIQUEZA',          color: '#059669', icon: TrendingUp, label: 'Perfil de Riqueza'          },
  { key: 'VALOR',            color: '#D97706', icon: Zap,        label: 'Equação de Valor'           },
  { key: 'KOLBE',            color: '#DC2626', icon: Brain,      label: 'Modo de Ação Kolbe'         },
  { key: 'FASCÍNIO',         color: '#DB2777', icon: Star,       label: 'Posicionamento de Fascínio' },
  { key: 'SQUAD',            color: '#6366F1', icon: Users,      label: 'Squad de IA Recomendado'    },
  { key: 'PLANO',            color: '#0891B2', icon: Target,     label: 'Plano 90 Dias'              },
]

function parseBlueprint(md: string): { key: string; content: string }[] {
  const sections: { key: string; content: string }[] = []
  const parts = md.split(/^## /m).filter(Boolean)
  for (const part of parts) {
    const lineEnd = part.indexOf('\n')
    const heading = part.slice(0, lineEnd).toUpperCase()
    const content = part.slice(lineEnd + 1).trim()
    const meta = SECTION_META.find(m => heading.includes(m.key))
    if (meta) {
      sections.push({ key: meta.key, content })
    }
  }
  return sections
}

function renderMarkdown(text: string, color: string): React.ReactNode {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('### ')) {
      return <div key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color, marginTop: 16, marginBottom: 6 }}>{line.slice(4)}</div>
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <div key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginTop: 10 }}>{line.replace(/\*\*/g, '')}</div>
    }
    if (line.match(/^- \*\*(.+?)\*\*/)) {
      const [, bold, rest] = line.match(/^- \*\*(.+?)\*\*(.*)/) || []
      return (
        <div key={i} style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'flex-start' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{bold}</strong>{rest}
          </span>
        </div>
      )
    }
    if (line.startsWith('- ') || line.match(/^\d+\. /)) {
      return (
        <div key={i} style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'flex-start' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{line.replace(/^- /, '').replace(/^\d+\. /, '')}</span>
        </div>
      )
    }
    if (line.startsWith('> ')) {
      return (
        <div key={i} style={{
          borderLeft: `3px solid ${color}`, paddingLeft: 14, marginTop: 12,
          color: 'var(--text-primary)', fontSize: 14, fontStyle: 'italic', lineHeight: 1.6,
          fontFamily: 'Space Grotesk, sans-serif',
        }}>
          {line.slice(2)}
        </div>
      )
    }
    if (line.trim() === '' || line.startsWith('---')) return <div key={i} style={{ height: 6 }} />
    if (line.trim()) {
      return <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '4px 0' }}>
        {line.replace(/\*\*(.+?)\*\*/g, '$1')}
      </p>
    }
    return null
  })
}

function LockedSectionCard({ meta }: { meta: typeof SECTION_META[0] }) {
  const Icon = meta.icon
  return (
    <div style={{
      background: 'rgba(8,12,24,0.5)',
      border: `1px solid rgba(255,255,255,0.06)`,
      borderRadius: 14, overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      position: 'relative',
    }}>
      <div style={{
        padding: '18px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: 0.5,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: `${meta.color}15`, border: `1px solid ${meta.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={meta.color} />
        </div>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
          color: 'var(--text-primary)',
        }}>
          {meta.label}
        </span>
        <Lock size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
      </div>
      <div style={{
        padding: '16px 22px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Lock size={13} color="#7C3AED" />
        <span style={{ fontSize: 13, color: '#9B7FE8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
          Desbloqueie por R$ 12,90
        </span>
      </div>
    </div>
  )
}

function SectionCard({ meta, content }: { meta: typeof SECTION_META[0]; content: string }) {
  const [expanded, setExpanded] = useState(true)
  const Icon = meta.icon

  return (
    <div style={{
      background: 'rgba(8,12,24,0.7)',
      border: `1px solid ${meta.color}20`,
      borderRadius: 14, overflow: 'hidden',
      backdropFilter: 'blur(12px)',
    }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '18px 22px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: `${meta.color}15`, border: `1px solid ${meta.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={meta.color} />
        </div>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
          color: 'var(--text-primary)', textAlign: 'left', flex: 1,
        }}>
          {meta.label}
        </span>
        {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>

      {expanded && (
        <div style={{ padding: '0 22px 20px' }}>
          <div style={{ height: 1, background: `${meta.color}15`, marginBottom: 16 }} />
          {renderMarkdown(content, meta.color)}
        </div>
      )}
    </div>
  )
}

export default function ResultadoPage() {
  const router = useRouter()
  const [blueprint, setBlueprint] = useState<string | null>(null)
  const [sections, setSections] = useState<{ key: string; content: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [hasPaid, setHasPaid] = useState(false)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // Verifica se pagou pelo mapeamento
      const isAdmin = session.user.email === ADMIN_EMAIL
      if (!isAdmin) {
        const { data: purchase } = await supabase
          .from('academy_purchases')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('produto_tipo', 'genialidade')
          .eq('status', 'pago')
          .maybeSingle()
        setHasPaid(!!purchase)
      } else {
        setHasPaid(true)
      }

      const { data } = await supabase
        .from('genius_blueprints')
        .select('blueprint_md, generated_at')
        .eq('user_id', session.user.id)
        .single()

      if (!data) { router.push('/genialidade'); return }
      setBlueprint(data.blueprint_md)
      setGeneratedAt(data.generated_at)
      setSections(parseBlueprint(data.blueprint_md))
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>Carregando seu Blueprint...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }


  const dateStr = generatedAt ? new Date(generatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

  return (
    <div style={{ padding: '40px 48px' }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 20, padding: '6px 14px', marginBottom: 18,
        }}>
          <Sparkles size={13} color="#7C3AED" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
            GENIUS ZONE BLUEPRINT
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 800,
          color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.2,
        }}>
          Seu mapeamento de{' '}
          <span style={{ background: 'linear-gradient(135deg, #7C3AED, #DB2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Zona de Genialidade
          </span>
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Gerado em {dateStr}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => router.push('/genialidade/quiz')}
              style={{
                background: 'var(--muted-bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 14px',
                color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13,
              }}
            >
              <RefreshCw size={13} />
              Refazer
            </button>
          </div>
        </div>
      </div>

      {/* Section strips */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
        {SECTION_META.map(m => (
          <div key={m.key} style={{
            height: 4, flex: 1, minWidth: 20,
            background: m.color, borderRadius: 2,
          }} />
        ))}
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Não foi possível processar o blueprint. Tente refazer o quiz.</div>
          <button onClick={() => router.push('/genialidade/quiz')} style={{ background: '#7C3AED', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
            Refazer Quiz
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sections.map((s, i) => {
            const meta = SECTION_META.find(m => m.key === s.key) || SECTION_META[i % SECTION_META.length]
            const isLocked = !hasPaid && i >= FREE_SECTIONS
            return (
              <div key={s.key} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                {isLocked ? (
                  <LockedSectionCard meta={meta} />
                ) : (
                  <SectionCard meta={meta} content={s.content} />
                )}
              </div>
            )
          })}

          {/* Banner de upgrade se não pagou */}
          {!hasPaid && sections.length > FREE_SECTIONS && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(219,39,119,0.08) 100%)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 16, padding: '28px 32px',
              textAlign: 'center', marginTop: 8,
            }}>
              <div style={{ fontSize: 13, color: '#9B7FE8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
                {sections.length - FREE_SECTIONS} ANÁLISES BLOQUEADAS
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                Desbloqueie o mapeamento completo
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                Veja todas as {sections.length} análises do seu Genius Zone Blueprint por apenas <strong style={{ color: '#7C3AED' }}>R$ 12,90</strong>
              </p>
              <Link href="/checkout?produto=genialidade" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  border: 'none', borderRadius: 12, padding: '14px 28px',
                  color: '#fff', fontWeight: 800, fontSize: 16,
                  fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                  <Sparkles size={16} />
                  Desbloquear por R$ 12,90
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Raw markdown fallback if parsing failed */}
      {sections.length === 0 && blueprint && (
        <div className="glass-card" style={{ padding: 28, marginTop: 24 }}>
          <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.7 }}>{blueprint}</pre>
        </div>
      )}
    </div>
  )
}
