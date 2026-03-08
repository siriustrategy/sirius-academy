'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurso, ADMIN_EMAIL_CURSOS, type CursoFase } from '@/lib/curso-data'
import { ArrowLeft, Lock, CheckCircle2, ChevronRight, BookOpen, Dumbbell, HelpCircle, Wrench, Zap } from 'lucide-react'

type Progress = { module_id: string; completed: boolean }

const LEVEL_ORDER = ['basico', 'intermediario', 'avancado'] as const
const LEVEL_LABELS: Record<string, string> = {
  basico: 'Basico',
  intermediario: 'Intermediario',
  avancado: 'Avancado',
}
const LEVEL_DESCRIPTIONS: Record<string, string> = {
  basico: 'Fundamentos e primeiros passos — gratuito para todos',
  intermediario: 'Tecnicas avancadas e projetos praticos',
  avancado: 'Estrategias de elite e sistemas completos',
}

const TYPE_ICONS = {
  leitura: BookOpen,
  exercicio: Dumbbell,
  quiz: HelpCircle,
  pratica: Wrench,
}
const TYPE_LABELS: Record<string, string> = {
  leitura: 'Leitura',
  exercicio: 'Exercicio',
  quiz: 'Quiz',
  pratica: 'Pratica',
}

export default function CursoPage() {
  const params = useParams()
  const cursoId = params.id as string
  const curso = getCurso(cursoId)

  const [isAdmin, setIsAdmin] = useState(false)
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      if (session.user.email === ADMIN_EMAIL_CURSOS) setIsAdmin(true)
      const { data } = await supabase
        .from('academy_progress')
        .select('module_id, completed')
        .eq('user_id', session.user.id)
      if (data) setProgress(data)
      setLoading(false)
    }
    load()
  }, [])

  if (!curso) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>Curso nao encontrado</h1>
        <Link href="/especializacoes" style={{ color: '#3B5BDB' }}>Ver todos os cursos</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: curso.color, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Acesso completamente bloqueado (cursos 4 e 5) para não-admins
  const isFullyLocked = curso.access === 'fullPaid' && !isAdmin

  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.module_id))

  function isLevelAccessible(level: string): boolean {
    if (isAdmin) return true
    if (curso?.access === 'fullPaid') return false
    if (curso?.access === 'freeBasic' && level !== 'basico') return false
    return true
  }

  const fasesByLevel = LEVEL_ORDER.reduce((acc, level) => {
    acc[level] = curso.fases.filter(f => f.level === level)
    return acc
  }, {} as Record<string, CursoFase[]>)

  const totalModules = curso.fases.reduce((a, f) => a + f.modules.length, 0)
  const doneModules = curso.fases
    .flatMap(f => f.modules)
    .filter(m => completedIds.has(m.id)).length
  const overallPct = totalModules ? Math.round((doneModules / totalModules) * 100) : 0

  return (
    <div style={{ padding: '40px 48px' }}>

      {/* Back */}
      <Link href="/especializacoes" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 28, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
        <ArrowLeft size={15} strokeWidth={2} />
        Especializacoes
      </Link>

      {/* Header do curso */}
      <div className="glass-card" style={{ padding: '24px 28px', marginBottom: 36, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: curso.color }} />
        <div style={{ paddingLeft: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 52, height: 52, flexShrink: 0,
              background: `${curso.color}15`, border: `1px solid ${curso.color}30`, borderRadius: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={24} color={curso.color} strokeWidth={1.7} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {curso.title}
                </h1>
                <span className="section-label" style={{ color: curso.color, borderColor: `${curso.color}30`, background: `${curso.color}10` }}>
                  {curso.tag}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 16px 0', lineHeight: 1.6 }}>
                {curso.subtitle}
              </p>
              {!isFullyLocked && totalModules > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, background: 'var(--progress-track)', borderRadius: 4, height: 5, overflow: 'hidden', maxWidth: 300 }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        background: `linear-gradient(90deg, ${curso.color}, ${curso.color}bb)`,
                        width: `${overallPct}%`, transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: curso.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                      {overallPct}% completo
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>
                    {doneModules} de {totalModules} modulos concluidos
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fully locked overlay for fullPaid courses */}
      {isFullyLocked ? (
        <div style={{
          background: 'rgba(107,122,158,0.06)',
          border: '1px solid rgba(107,122,158,0.2)',
          borderRadius: 14, padding: '40px 36px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
            background: 'rgba(107,122,158,0.1)', border: '1px solid rgba(107,122,158,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={28} color="#6B7A9E" strokeWidth={1.5} />
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 12 }}>
            Curso Premium
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 28px' }}>
            {curso.teaser ?? curso.description}
          </p>
          <div style={{
            display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28,
          }}>
            {curso.fases.map(f => (
              <div key={f.id} style={{
                background: 'rgba(107,122,158,0.08)', border: '1px solid rgba(107,122,158,0.15)',
                borderRadius: 8, padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Lock size={11} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {f.title}
                </span>
              </div>
            ))}
          </div>
          <button disabled style={{
            background: `linear-gradient(135deg, ${curso.color}, ${curso.color}aa)`,
            border: 'none', borderRadius: 10, padding: '14px 32px',
            color: '#fff', fontWeight: 700, fontSize: 15,
            fontFamily: 'Space Grotesk, sans-serif', cursor: 'not-allowed',
            opacity: 0.5, display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <Lock size={14} />
            Em breve — Adquirir acesso
          </button>
        </div>
      ) : (
        /* Levels */
        LEVEL_ORDER.map((level) => {
          const fases = fasesByLevel[level] || []
          if (fases.length === 0) return null
          const accessible = isLevelAccessible(level)

          return (
            <div key={level} style={{ marginBottom: 36 }}>
              {/* Level Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: accessible ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {LEVEL_LABELS[level]}
                  </span>
                  {!accessible && (
                    <span className="section-label" style={{ color: 'var(--text-secondary)', borderColor: 'rgba(107,122,158,0.2)', background: 'rgba(107,122,158,0.06)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={9} />
                      PAGO
                    </span>
                  )}
                  {accessible && level === 'basico' && (
                    <span className="section-label" style={{ color: '#059669', borderColor: 'rgba(5,150,105,0.25)', background: 'rgba(5,150,105,0.08)' }}>
                      GRATIS
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {LEVEL_DESCRIPTIONS[level]}
                </span>
              </div>

              {/* Fases */}
              {fases.map(fase => {
                const faseMods = fase.modules.map(m => m.id)
                const doneFase = faseMods.filter(id => completedIds.has(id)).length
                const pct = faseMods.length ? Math.round((doneFase / faseMods.length) * 100) : 0

                return (
                  <div key={fase.id} style={{ marginBottom: 20 }}>
                    {/* Fase title */}
                    <div style={{ marginBottom: 10, paddingLeft: 4 }}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: accessible ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: 2 }}>
                        {fase.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {fase.subtitle}
                      </div>
                    </div>

                    {/* Módulos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {fase.modules.map((mod, idx) => {
                        const isDone = completedIds.has(mod.id)
                        const TypeIcon = TYPE_ICONS[mod.type] || BookOpen
                        const typeColor = { leitura: '#3B5BDB', exercicio: '#059669', quiz: '#D97706', pratica: '#7C3AED' }[mod.type] || '#3B5BDB'

                        return (
                          <div key={mod.id}>
                            {accessible ? (
                              <Link href={`/curso/${cursoId}/modulo/${mod.id}`} style={{ textDecoration: 'none' }}>
                                <div className="glass-card" style={{
                                  padding: '13px 18px',
                                  display: 'flex', alignItems: 'center', gap: 14,
                                  cursor: 'pointer',
                                  borderColor: isDone ? `${curso.color}30` : undefined,
                                }}>
                                  <div style={{
                                    width: 32, height: 32, flexShrink: 0, borderRadius: 8,
                                    background: isDone ? `${curso.color}15` : `${typeColor}12`,
                                    border: `1px solid ${isDone ? `${curso.color}30` : `${typeColor}25`}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    {isDone
                                      ? <CheckCircle2 size={15} color={curso.color} strokeWidth={1.8} />
                                      : <TypeIcon size={14} color={typeColor} strokeWidth={1.8} />
                                    }
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>
                                      {mod.title}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                      {mod.subtitle}
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                    <span className="section-label" style={{ color: typeColor, borderColor: `${typeColor}30`, background: `${typeColor}10`, fontSize: 9 }}>
                                      {TYPE_LABELS[mod.type]}
                                    </span>
                                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                                      {mod.duration}
                                    </span>
                                    <span style={{ fontSize: 10, color: curso.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                                      +{mod.xp}XP
                                    </span>
                                    <ChevronRight size={14} color="var(--text-muted)" strokeWidth={2} />
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <div className="glass-card" style={{
                                padding: '13px 18px',
                                display: 'flex', alignItems: 'center', gap: 14,
                                opacity: 0.45, cursor: 'default',
                              }}>
                                <div style={{
                                  width: 32, height: 32, flexShrink: 0, borderRadius: 8,
                                  background: 'var(--muted-bg)', border: '1px solid var(--border)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <Lock size={14} color="var(--text-muted)" strokeWidth={1.8} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>
                                    {mod.title}
                                  </div>
                                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mod.subtitle}</div>
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                                  +{mod.xp}XP
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Paywall card para levels pagos */}
              {!accessible && !isAdmin && (
                <div style={{
                  background: 'rgba(107,122,158,0.04)',
                  border: '1px dashed rgba(107,122,158,0.2)',
                  borderRadius: 12, padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 16, marginTop: 12,
                }}>
                  <Lock size={20} color="#6B7A9E" strokeWidth={1.5} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {LEVEL_LABELS[level]} — Conteudo Premium
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Adquira o acesso para desbloquear todos os modulos deste nivel.
                    </div>
                  </div>
                  <button disabled style={{
                    background: `${curso.color}15`,
                    border: `1px solid ${curso.color}30`,
                    borderRadius: 8, padding: '8px 16px',
                    color: curso.color, fontWeight: 700, fontSize: 12,
                    fontFamily: 'Space Grotesk, sans-serif', cursor: 'not-allowed',
                    opacity: 0.6,
                  }}>
                    Em breve
                  </button>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
