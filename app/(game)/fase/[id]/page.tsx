'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PHASES } from '@/lib/game-data'
import { Sparkles, MessageSquare, Image, Video, Code2, Zap, Crown, Lock, CheckCircle2, BookOpen, Dumbbell, HelpCircle, Wrench } from 'lucide-react'

const PHASE_ICONS: Record<number, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  1: Sparkles, 2: MessageSquare, 3: Image, 4: Video, 5: Code2, 6: Zap, 7: Crown,
}

export default function FasePage() {
  const params = useParams()
  const phaseId = Number(params.id)
  const phase = PHASES.find(p => p.id === phaseId)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('academy_progress')
        .select('module_id')
        .eq('user_id', session.user.id)
        .eq('phase_id', phaseId)
        .eq('completed', true)
      if (data) setCompletedIds(new Set(data.map(d => d.module_id)))
      setLoading(false)
    }
    load()
  }, [phaseId])

  if (!phase) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Fase não encontrada</h1>
        <Link href="/dashboard" style={{ color: '#3B5BDB' }}>Voltar ao hub</Link>
      </div>
    )
  }

  const typeLabels: Record<string, string> = {
    leitura: 'Leitura',
    exercicio: 'Exercício',
    quiz: 'Quiz',
    pratica: 'Prática',
  }

  const typeColors: Record<string, string> = {
    leitura: '#3B5BDB',
    exercicio: '#059669',
    quiz: '#D97706',
    pratica: '#7C3AED',
  }

  return (
    <div style={{ padding: '40px 48px' }}>
      {/* Back */}
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6B7A9E', fontSize: 14, marginBottom: 32 }}>
        ← Voltar ao Hub
      </Link>

      {/* Phase header */}
      <div style={{
        background: 'rgba(10,10,20,0.8)',
        border: `1px solid ${phase.color}30`,
        borderRadius: 16,
        padding: '32px 36px',
        marginBottom: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          {(() => {
            const PhaseIcon = PHASE_ICONS[phase.id] || Sparkles
            return (
              <div style={{
                width: 64, height: 64,
                background: `${phase.color}15`,
                border: `1px solid ${phase.color}30`,
                borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PhaseIcon size={28} color={phase.color} strokeWidth={1.6} />
              </div>
            )
          })()}
          <div>
            <div style={{ color: '#6B7A9E', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
              FASE {phase.id}
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              {phase.title}
            </h1>
            <p style={{ color: '#6B7A9E', fontSize: 15 }}>{phase.subtitle}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#6B7A9E', fontSize: 13 }}>
              {completedIds.size}/{phase.modules.length} módulos
            </span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: phase.color, fontWeight: 700 }}>
            +{phase.xpBonus}XP bônus ao completar
          </div>
        </div>
      </div>

      {/* Modules list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {phase.modules.map((module, index) => {
          const done = completedIds.has(module.id)
          const prevDone = index === 0 || completedIds.has(phase.modules[index - 1].id)
          const unlocked = prevDone

          return (
            <Link
              key={module.id}
              href={unlocked ? `/modulo/${module.id}` : '#'}
              style={{ textDecoration: 'none' }}
            >
              <div className="glass-card" style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: unlocked ? 1 : 0.5,
                cursor: unlocked ? 'pointer' : 'default',
                transition: 'all 0.2s',
                borderColor: done ? `${phase.color}40` : 'rgba(12,21,102,0.6)',
              }}>
                {/* Status icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: done
                    ? `${phase.color}20`
                    : 'rgba(12,21,102,0.4)',
                  border: `2px solid ${done ? phase.color : 'rgba(12,21,102,0.6)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  color: done ? phase.color : 'var(--text-secondary)',
                }}>
                  {done
                    ? <CheckCircle2 size={16} color={phase.color} strokeWidth={2} />
                    : !unlocked
                    ? <Lock size={14} color="var(--text-secondary)" strokeWidth={2} />
                    : <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>{index + 1}</span>
                  }
                </div>

                {/* Module info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                    {module.title}
                  </div>
                  <div style={{ color: '#6B7A9E', fontSize: 13 }}>{module.subtitle}</div>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{
                    background: `${typeColors[module.type]}15`,
                    border: `1px solid ${typeColors[module.type]}30`,
                    color: typeColors[module.type],
                    borderRadius: 20, padding: '3px 10px',
                    fontSize: 11, fontWeight: 600,
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>
                    {typeLabels[module.type]}
                  </span>
                  <span style={{ color: '#6B7A9E', fontSize: 12 }}>{module.duration}</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13, fontWeight: 700,
                    color: done ? phase.color : '#6B7A9E',
                  }}>
                    +{module.xp}XP
                  </span>
                  {unlocked && <span style={{ color: '#6B7A9E' }}>→</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
