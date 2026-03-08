'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  AREAS,
  PHASES,
  LEVEL_LABELS,
  getAreaPhases,
  type AreaId,
  type AreaDef,
  type LevelId,
} from '@/lib/game-data'
import {
  ArrowLeft, Lock, CheckCircle2, TrendingUp, BarChart2, Megaphone, Layers, ChevronRight,
} from 'lucide-react'

type Progress = { module_id: string; completed: boolean }

const AREA_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  marketing: Megaphone,
  vendas: TrendingUp,
  financeiro: BarChart2,
}

const LEVEL_ORDER: LevelId[] = ['basico', 'intermediario', 'avancado']

const LEVEL_DESCRIPTIONS: Record<LevelId, string> = {
  basico: 'Fundamentos e primeiros passos com IA aplicada',
  intermediario: 'Técnicas avançadas e automações práticas',
  avancado: 'Estratégias de elite e sistemas completos',
}

export default function AreaPage() {
  const params = useParams()
  const areaId = params.id as string
  const area = AREAS.find(a => a.id === areaId)

  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('academy_progress')
        .select('module_id, completed')
        .eq('user_id', session.user.id)
      if (data) setProgress(data)
      setLoading(false)
    }
    load()
  }, [])

  if (!area) { notFound(); return null }

  const safeArea = area as AreaDef
  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.module_id))
  const AreaIcon = AREA_ICONS[area.id] || Layers

  function getModuleProgress(moduleIds: string[]) {
    const done = moduleIds.filter(id => completedIds.has(id)).length
    return { done, total: moduleIds.length, percent: moduleIds.length ? Math.round((done / moduleIds.length) * 100) : 0 }
  }

  function isLevelUnlocked(level: LevelId): boolean {
    const idx = LEVEL_ORDER.indexOf(level)
    if (idx === 0) return true
    const prevLevel = LEVEL_ORDER[idx - 1]
    const prevPhaseIds = safeArea.levels[prevLevel]
    if (!prevPhaseIds.length) return true
    const prevPhases = PHASES.filter(p => prevPhaseIds.includes(p.id))
    const prevIds = prevPhases.flatMap(p => p.modules.map(m => m.id))
    const { done, total } = getModuleProgress(prevIds)
    return done === total && total > 0
  }

  // total progress for header bar
  const allPhases = getAreaPhases(area.id as AreaId)
  const allIds = allPhases.flatMap(p => p.modules.map(m => m.id))
  const overallProg = getModuleProgress(allIds)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #0C1566', borderTopColor: '#3B5BDB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 48px' }}>

      {/* Back */}
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 28, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
        <ArrowLeft size={15} strokeWidth={2} />
        Voltar ao Painel
      </Link>

      {/* Area Header */}
      <div className="glass-card" style={{ padding: '24px 28px', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{
            width: 56, height: 56, flexShrink: 0,
            background: `${area.color}18`,
            border: `1px solid ${area.color}30`,
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AreaIcon size={30} color={area.color} strokeWidth={1.7} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {area.title}
              </h1>
              <span className="section-label" style={{ color: area.color, borderColor: `${area.color}30`, background: `${area.color}10` }}>
                {allPhases.length} FASES
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 16px 0', lineHeight: 1.5 }}>
              {area.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, background: 'var(--progress-track)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${area.color}, ${area.color}bb)`,
                  width: `${overallProg.percent}%`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontSize: 12, color: area.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, flexShrink: 0 }}>
                {overallProg.percent}% completo
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
              {overallProg.done} de {overallProg.total} módulos concluídos
            </div>
          </div>
        </div>
      </div>

      {/* Levels */}
      {LEVEL_ORDER.map((level, levelIdx) => {
        const phaseIds = area.levels[level]
        const levelPhases = PHASES.filter(p => phaseIds.includes(p.id))
        const unlocked = isLevelUnlocked(level)
        const levelIds = levelPhases.flatMap(p => p.modules.map(m => m.id))
        const levelProg = getModuleProgress(levelIds)
        const levelDone = levelProg.done === levelProg.total && levelProg.total > 0

        return (
          <div key={level} style={{ marginBottom: 32 }}>
            {/* Level Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: unlocked ? `${area.color}20` : 'var(--muted-bg)',
                border: `1px solid ${unlocked ? `${area.color}35` : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800,
                color: unlocked ? area.color : 'var(--text-secondary)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {levelIdx + 1}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: unlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {LEVEL_LABELS[level]}
                  </span>
                  {levelDone && <span className="section-label green">COMPLETO ✓</span>}
                  {!unlocked && <span className="section-label" style={{ color: 'var(--text-secondary)', borderColor: 'rgba(107,122,158,0.2)', background: 'rgba(107,122,158,0.06)' }}>BLOQUEADO</span>}
                  {unlocked && !levelDone && levelProg.total > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{levelProg.done}/{levelProg.total} módulos</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {LEVEL_DESCRIPTIONS[level]}
                </div>
              </div>
            </div>

            {/* Phases in this level */}
            {!phaseIds.length ? (
              <div className="glass-card" style={{ padding: '20px 22px', opacity: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Lock size={18} color="#6B7A9E" strokeWidth={1.8} />
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)' }}>
                      Em breve
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Módulos do nível {LEVEL_LABELS[level]} chegando em breve.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {levelPhases.map(phase => {
                  const phaseProg = getModuleProgress(phase.modules.map(m => m.id))
                  const phaseDone = phaseProg.done === phaseProg.total && phaseProg.total > 0
                  const phaseStarted = phaseProg.done > 0

                  return (
                    <Link
                      key={phase.id}
                      href={unlocked ? `/fase/${phase.id}` : '#'}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="glass-card" style={{
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        opacity: unlocked ? 1 : 0.45,
                        cursor: unlocked ? 'pointer' : 'default',
                        borderColor: phaseDone ? `${area.color}30` : undefined,
                      }}>
                        <div style={{
                          width: 40, height: 40, flexShrink: 0,
                          background: unlocked ? `${area.color}12` : 'var(--muted-bg)',
                          border: `1px solid ${unlocked ? `${area.color}25` : 'var(--border)'}`,
                          borderRadius: 9,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {unlocked
                            ? (phaseDone
                                ? <CheckCircle2 size={18} color={area.color} strokeWidth={1.8} />
                                : <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: area.color }}>F{phase.id}</span>
                              )
                            : <Lock size={16} color="var(--text-secondary)" strokeWidth={1.8} />
                          }
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                              {phase.title}
                            </span>
                            {phaseDone && <span className="section-label green" style={{ fontSize: 9 }}>COMPLETA</span>}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: unlocked ? 8 : 0 }}>
                            {phase.subtitle}
                          </div>
                          {unlocked && (
                            <div>
                              <div style={{ background: 'var(--progress-track)', borderRadius: 3, height: 3, overflow: 'hidden', maxWidth: 200 }}>
                                <div style={{
                                  height: '100%', borderRadius: 3,
                                  background: `linear-gradient(90deg, ${area.color}, ${area.color}bb)`,
                                  width: `${phaseProg.percent}%`,
                                  transition: 'width 0.8s ease',
                                }} />
                              </div>
                              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>
                                {phaseProg.done}/{phaseProg.total} módulos
                              </div>
                            </div>
                          )}
                        </div>

                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 2 }}>BÔNUS</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: area.color }}>
                            +{phase.xpBonus}XP
                          </div>
                        </div>

                        {unlocked && (
                          <ChevronRight size={16} color="#6B7A9E" strokeWidth={2} style={{ flexShrink: 0 }} />
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
