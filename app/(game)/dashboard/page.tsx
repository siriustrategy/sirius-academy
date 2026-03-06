'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Profile } from '@/lib/supabase'
import {
  PHASES,
  AREAS,
  getLevelInfo,
  getAreaPhases,
  getAreaTotalModules,
  type AreaDef,
  type LevelId,
} from '@/lib/game-data'
import {
  Activity, Award, Layers, TrendingUp, BarChart2,
  Megaphone, ArrowRight, Lock, Star, CheckCircle2,
} from 'lucide-react'

type Progress = { module_id: string; completed: boolean }

const AREA_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  marketing: Megaphone,
  vendas: TrendingUp,
  financeiro: BarChart2,
}

const LEVEL_ORDER: LevelId[] = ['basico', 'intermediario', 'avancado']
const LEVEL_LABELS: Record<LevelId, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const [profileRes, progressRes] = await Promise.all([
        supabase.from('academy_profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('academy_progress').select('module_id, completed').eq('user_id', session.user.id),
      ])
      if (profileRes.data) setProfile(profileRes.data)
      if (progressRes.data) setProgress(progressRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.module_id))

  // ── helpers ──────────────────────────────────────────────
  function getModuleProgress(moduleIds: string[]) {
    const done = moduleIds.filter(id => completedIds.has(id)).length
    return { done, total: moduleIds.length, percent: moduleIds.length ? Math.round((done / moduleIds.length) * 100) : 0 }
  }

  function getAreaProgress(area: AreaDef) {
    const phases = getAreaPhases(area.id)
    const allIds = phases.flatMap(p => p.modules.map(m => m.id))
    return getModuleProgress(allIds)
  }

  function getAreaLevelLabel(area: AreaDef): string {
    for (const level of LEVEL_ORDER) {
      const phaseIds = area.levels[level]
      if (!phaseIds.length) continue
      const phases = PHASES.filter(p => phaseIds.includes(p.id))
      const ids = phases.flatMap(p => p.modules.map(m => m.id))
      const { done, total } = getModuleProgress(ids)
      if (done < total) return LEVEL_LABELS[level]
    }
    return 'Avançado'
  }

  // Next module to continue
  function getNextModule() {
    for (const phase of PHASES) {
      for (const mod of phase.modules) {
        if (!completedIds.has(mod.id)) {
          return { phase, mod }
        }
      }
    }
    return null
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #0C1566', borderTopColor: '#3B5BDB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const levelInfo = profile ? getLevelInfo(profile.xp) : null
  const totalCompleted = completedIds.size
  const totalModules = PHASES.reduce((acc, p) => acc + p.modules.length, 0)
  const nextItem = getNextModule()
  const displayName = profile?.display_name || profile?.username || 'Aluno'

  const motivationalQuotes = [
    'Cada módulo concluído é uma versão melhor de você.',
    'Aprendizado é o investimento com maior retorno.',
    'Quem domina IA hoje lidera amanhã.',
    'Consistência supera talento todos os dias.',
  ]
  const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length]

  return (
    <div style={{ padding: '40px 48px', maxWidth: 980, margin: '0 auto' }}>

      {/* ── Greeting ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="section-label">MEU PAINEL</span>
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
          Olá, <span style={{ color: '#3B5BDB' }}>{displayName}</span>! Bem-vindo de volta.
        </h1>
        <p style={{ color: '#6B7A9E', fontSize: 14, fontStyle: 'italic' }}>
          "{quote}"
        </p>
      </div>

      {/* ── Continuar de onde parou ── */}
      {nextItem && (
        <Link href={`/modulo/${nextItem.mod.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(59,91,219,0.18) 0%, rgba(124,58,237,0.12) 100%)',
            border: '1px solid rgba(59,91,219,0.35)',
            borderRadius: 14,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            className="continue-card"
          >
            <div style={{
              width: 52, height: 52, flexShrink: 0,
              background: 'rgba(59,91,219,0.2)',
              border: '1px solid rgba(59,91,219,0.4)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ArrowRight size={24} color="#3B5BDB" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#3B5BDB', letterSpacing: '0.1em', marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                CONTINUAR DE ONDE PAROU
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: '#E8EEFF', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextItem.mod.title}
              </div>
              <div style={{ fontSize: 13, color: '#6B7A9E' }}>
                Fase {nextItem.phase.id} — {nextItem.phase.title}
              </div>
            </div>
            <div style={{
              background: '#3B5BDB',
              borderRadius: 8,
              padding: '8px 20px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              color: '#fff',
              flexShrink: 0,
            }}>
              Continuar
            </div>
          </div>
        </Link>
      )}

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}>
        {[
          { label: 'XP Total', value: `${profile?.xp ?? 0}`, Icon: Activity, color: '#3B5BDB' },
          { label: 'Nível', value: `${profile?.level ?? 1} — ${profile?.title ?? 'Iniciante'}`, Icon: Award, color: levelInfo?.color ?? '#6B7A9E' },
          { label: 'Módulos', value: `${totalCompleted}/${totalModules}`, Icon: Layers, color: '#10b981' },
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: `${stat.color}15`, border: `1px solid ${stat.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.Icon size={16} color={stat.color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Minha Evolução por Área ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span className="section-label">MINHA EVOLUÇÃO POR ÁREA</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {AREAS.map(area => {
          const prog = getAreaProgress(area)
          const currentLevel = getAreaLevelLabel(area)
          const AreaIcon = AREA_ICONS[area.id] || Layers
          const started = prog.done > 0
          const finished = prog.done === prog.total && prog.total > 0

          return (
            <Link key={area.id} href={`/area/${area.id}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 42, height: 42, flexShrink: 0,
                  background: `${area.color}15`,
                  border: `1px solid ${area.color}30`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AreaIcon size={20} color={area.color} strokeWidth={1.8} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#E8EEFF' }}>
                      {area.title}
                    </span>
                    {finished && <span className="section-label green">COMPLETO ✓</span>}
                    {!finished && started && (
                      <span className="section-label" style={{ color: area.color, borderColor: `${area.color}30`, background: `${area.color}10` }}>
                        {currentLevel}
                      </span>
                    )}
                    {!started && (
                      <span className="section-label" style={{ color: '#6B7A9E', borderColor: 'rgba(107,122,158,0.2)', background: 'rgba(107,122,158,0.06)' }}>
                        COMEÇAR
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, background: 'rgba(12,21,102,0.5)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        background: `linear-gradient(90deg, ${area.color}, ${area.color}bb)`,
                        width: `${prog.percent}%`,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#6B7A9E', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                      {prog.percent}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7A9E', marginTop: 4 }}>
                    {prog.done}/{prog.total} módulos
                  </div>
                </div>

                <ArrowRight size={16} color="#6B7A9E" strokeWidth={2} style={{ flexShrink: 0 }} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Em Alta na Sirius Academy ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span className="section-label">EM ALTA NA SIRIUS ACADEMY</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}>
        {PHASES.slice(0, 3).map(phase => {
          const prog = getModuleProgress(phase.modules.map(m => m.id))
          const done = prog.done === prog.total && prog.total > 0
          return (
            <Link key={phase.id} href={`/fase/${phase.id}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ padding: '16px 18px', cursor: 'pointer', height: '100%' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${phase.color}15`,
                  border: `1px solid ${phase.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Star size={16} color={phase.color} strokeWidth={1.8} />
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF', marginBottom: 4, lineHeight: 1.3 }}>
                  {phase.title}
                </div>
                <div style={{ fontSize: 11, color: '#6B7A9E', marginBottom: 10, lineHeight: 1.4 }}>
                  {phase.modules.length} módulos
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {done
                    ? <CheckCircle2 size={13} color="#10b981" strokeWidth={2} />
                    : <div style={{ width: 13, height: 13, borderRadius: '50%', border: `2px solid ${phase.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                  }
                  <span style={{ fontSize: 10, color: done ? '#10b981' : '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                    {done ? 'Completo' : `${prog.done}/${prog.total} módulos`}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Certificados ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span className="section-label">MEUS CERTIFICADOS</span>
      </div>

      {(() => {
        const completed = PHASES.filter(phase => {
          const ids = phase.modules.map(m => m.id)
          return ids.length > 0 && ids.every(id => completedIds.has(id))
        })

        if (!completed.length) {
          return (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <Lock size={28} color="#6B7A9E" strokeWidth={1.5} style={{ marginBottom: 10 }} />
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, color: '#6B7A9E', marginBottom: 6 }}>
                Ainda sem certificados
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Complete uma fase inteira para ganhar seu primeiro certificado.
              </div>
            </div>
          )
        }

        return (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {completed.map(phase => (
              <div key={phase.id} style={{
                background: `linear-gradient(135deg, ${phase.color}18, ${phase.color}08)`,
                border: `1px solid ${phase.color}35`,
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <CheckCircle2 size={22} color={phase.color} strokeWidth={1.8} />
                <div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF' }}>
                    {phase.title}
                  </div>
                  <div style={{ fontSize: 11, color: phase.color, fontWeight: 600 }}>
                    Fase {phase.id} Completa
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      })()}

      <style>{`
        .continue-card:hover {
          border-color: rgba(59,91,219,0.55) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(59,91,219,0.15);
        }
      `}</style>
    </div>
  )
}
