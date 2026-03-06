'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Profile } from '@/lib/supabase'
import { PHASES, getLevelInfo } from '@/lib/game-data'
import { Sparkles, MessageSquare, Image, Video, Code2, Zap, Crown, Lock, Activity, Award, Layers } from 'lucide-react'

const PHASE_ICONS: Record<number, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  1: Sparkles,
  2: MessageSquare,
  3: Image,
  4: Video,
  5: Code2,
  6: Zap,
  7: Crown,
}

type Progress = { module_id: string; completed: boolean }

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

  function getPhaseProgress(phaseId: number) {
    const phase = PHASES.find(p => p.id === phaseId)
    if (!phase) return { done: 0, total: 0, percent: 0 }
    const done = phase.modules.filter(m => completedIds.has(m.id)).length
    return { done, total: phase.modules.length, percent: Math.round((done / phase.modules.length) * 100) }
  }

  function isPhaseUnlocked(phaseId: number) {
    if (phaseId === 1) return true
    const prev = getPhaseProgress(phaseId - 1)
    return prev.done === prev.total && prev.total > 0
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

  return (
    <div style={{ padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className="section-label">COHORT SIRIUS</span>
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
          Olá, <span style={{ color: '#3B5BDB' }}>{profile?.display_name || profile?.username}</span>
        </h1>
        <p style={{ color: '#6B7A9E', fontSize: 15, lineHeight: 1.6 }}>
          {totalCompleted === 0
            ? 'Sua jornada começa agora. Escolha a Fase 1 para começar.'
            : `${totalCompleted} de ${totalModules} módulos completos — continue sua jornada.`}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}>
        {[
          { label: 'XP Total',  value: `${profile?.xp ?? 0}`,           Icon: Activity, color: '#3B5BDB' },
          { label: 'Nível',     value: `${profile?.level ?? 1} — ${profile?.title ?? 'Iniciante'}`, Icon: Award,    color: levelInfo?.color ?? '#6B7A9E' },
          { label: 'Módulos',   value: `${totalCompleted}/${totalModules}`,              Icon: Layers,   color: '#10b981' },
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

      {/* Phases */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span className="section-label">TRILHA DE APRENDIZADO</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PHASES.map((phase, index) => {
          const phaseProgress = getPhaseProgress(phase.id)
          const unlocked = isPhaseUnlocked(phase.id)
          const completed = phaseProgress.done === phaseProgress.total && phaseProgress.total > 0
          const color = phase.color

          return (
            <div key={phase.id} style={{ position: 'relative' }}>
              <Link href={unlocked ? `/fase/${phase.id}` : '#'} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  opacity: unlocked ? 1 : 0.5,
                  cursor: unlocked ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  borderColor: completed ? `${color}35` : undefined,
                }}>
                  {/* Icon */}
                  {(() => {
                    const PhaseIcon = PHASE_ICONS[phase.id] || Sparkles
                    return (
                      <div style={{
                        width: 46, height: 46, flexShrink: 0,
                        background: unlocked ? `${color}15` : 'var(--muted-bg)',
                        border: `1px solid ${unlocked ? `${color}30` : 'var(--border)'}`,
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {unlocked
                          ? <PhaseIcon size={20} color={color} strokeWidth={1.8} />
                          : <Lock size={18} color="var(--text-secondary)" strokeWidth={1.8} />
                        }
                      </div>
                    )
                  })()}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#E8EEFF' }}>
                        Fase {phase.id} — {phase.title}
                      </span>
                      {completed && (
                        <span className="section-label green">COMPLETA ✓</span>
                      )}
                      {!unlocked && (
                        <span className="section-label" style={{ color: '#6B7A9E', borderColor: 'rgba(107,122,158,0.2)', background: 'rgba(107,122,158,0.06)' }}>
                          BLOQUEADA
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#6B7A9E', fontSize: 13, marginBottom: unlocked ? 10 : 0 }}>
                      {phase.subtitle}
                    </div>

                    {unlocked && (
                      <div>
                        <div style={{ background: 'rgba(12,21,102,0.5)', borderRadius: 3, height: 3, overflow: 'hidden', maxWidth: 260 }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
                            width: `${phaseProgress.percent}%`,
                            transition: 'width 0.8s ease',
                          }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7A9E', marginTop: 4 }}>
                          {phaseProgress.done}/{phaseProgress.total} módulos
                        </div>
                      </div>
                    )}
                  </div>

                  {/* XP badge */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 2 }}>
                      BÔNUS
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color }}>
                      +{phase.xpBonus}XP
                    </div>
                  </div>

                  {unlocked && (
                    <div style={{ color: '#6B7A9E', fontSize: 16, flexShrink: 0 }}>→</div>
                  )}
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Next level prompt */}
      {totalCompleted > 0 && totalCompleted < totalModules && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <div style={{ color: '#6B7A9E', fontSize: 13, marginBottom: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
            → Próximo nível
          </div>
          {PHASES.map(phase => {
            const prog = getPhaseProgress(phase.id)
            const unlocked = isPhaseUnlocked(phase.id)
            if (!unlocked || prog.done === prog.total) return null
            const nextModule = phase.modules.find(m => !completedIds.has(m.id))
            if (!nextModule) return null
            return (
              <Link key={phase.id} href={`/modulo/${nextModule.id}`} className="next-level-btn">
                {nextModule.title}
                <span className="arrow">→</span>
              </Link>
            )
          }).find(Boolean)}
        </div>
      )}
    </div>
  )
}
