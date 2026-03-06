'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Profile } from '@/lib/supabase'
import { PHASES } from '@/lib/game-data'
import { getLevelInfo } from '@/lib/game-data'
import { AvatarIcon, InitialsAvatar, type AvatarId } from '@/components/Avatars'
import {
  Users, Activity, BookOpen, TrendingUp, ChevronDown, ChevronUp,
  Search, Award,
} from 'lucide-react'

// ── Só Breno acessa ──────────────────────────────────────────
const ADMIN_EMAIL = 'breno.nobre@gruporiomais.com.br'

// ── Tipos ─────────────────────────────────────────────────────
type UserProgress = { module_id: string; phase_id: number; completed: boolean; completed_at: string | null }

type UserData = {
  profile: Profile
  progress: UserProgress[]
  email: string
}

// ── Helpers ───────────────────────────────────────────────────
const TOTAL_MODULES = PHASES.reduce((acc, p) => acc + p.modules.length, 0)

function getCompletedCount(progress: UserProgress[]) {
  return progress.filter(p => p.completed).length
}

function getCurrentStudying(progress: UserProgress[]): string {
  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.module_id))
  for (const phase of PHASES) {
    for (const mod of phase.modules) {
      if (!completedIds.has(mod.id)) {
        return `${phase.title} — ${mod.title}`
      }
    }
  }
  return 'Trilha concluída!'
}

function getLastActivity(progress: UserProgress[]): string {
  const dates = progress
    .filter(p => p.completed && p.completed_at)
    .map(p => new Date(p.completed_at!).getTime())
  if (!dates.length) return 'Sem atividade'
  const last = new Date(Math.max(...dates))
  const diff = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  if (diff < 7) return `${diff} dias atrás`
  if (diff < 30) return `${Math.floor(diff / 7)} sem. atrás`
  return `${Math.floor(diff / 30)} mes. atrás`
}

// ── User Row ──────────────────────────────────────────────────
function UserRow({ user }: { user: UserData }) {
  const [expanded, setExpanded] = useState(false)
  const { profile, progress } = user
  const completed = getCompletedCount(progress)
  const percent = Math.round((completed / TOTAL_MODULES) * 100)
  const levelInfo = getLevelInfo(profile.xp)
  const currentStudying = getCurrentStudying(progress)
  const lastActivity = getLastActivity(progress)
  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.module_id))
  const avatarId = profile.avatar_id as AvatarId | null
  const displayName = profile.display_name || profile.username

  return (
    <div style={{
      background: 'rgba(8,12,24,0.7)',
      border: '1px solid rgba(59,91,219,0.12)',
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Main row */}
      <div
        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          {avatarId
            ? <AvatarIcon id={avatarId} size={40} />
            : <InitialsAvatar name={displayName} size={40} />
          }
        </div>

        {/* Name + email */}
        <div style={{ flex: '0 0 200px', minWidth: 0 }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', marginBottom: 2 }}>
            {displayName}
          </div>
          <div style={{ fontSize: 11, color: '#6B7A9E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </div>
        </div>

        {/* Level */}
        <div style={{ flex: '0 0 140px' }}>
          <div style={{ fontSize: 11, color: levelInfo.color, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 2 }}>
            Nv.{profile.level} — {profile.title}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6B7A9E' }}>
            {profile.xp} XP
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#6B7A9E' }}>{completed}/{TOTAL_MODULES} módulos</span>
            <span style={{ fontSize: 11, color: '#3B5BDB', fontFamily: 'JetBrains Mono, monospace' }}>{percent}%</span>
          </div>
          <div style={{ background: 'rgba(12,21,102,0.5)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: `linear-gradient(90deg, #3B5BDB, #7C3AED)`,
              width: `${percent}%`,
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Studying now */}
        <div style={{ flex: '0 0 220px', minWidth: 0 }}>
          <div style={{ fontSize: 10, color: '#6B7A9E', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.07em', marginBottom: 3 }}>
            ESTUDANDO AGORA
          </div>
          <div style={{ fontSize: 12, color: '#C5CCEE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentStudying}
          </div>
        </div>

        {/* Last activity */}
        <div style={{ flex: '0 0 90px', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#6B7A9E' }}>{lastActivity}</div>
        </div>

        {/* Expand icon */}
        <div style={{ flexShrink: 0, color: '#6B7A9E' }}>
          {expanded ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
        </div>
      </div>

      {/* Expanded: detalhe por fase */}
      {expanded && (
        <div style={{
          borderTop: '1px solid rgba(59,91,219,0.12)',
          padding: '16px 20px',
          background: 'rgba(5,8,20,0.5)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7A9E', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 14 }}>
            PROGRESSO POR FASE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {PHASES.map(phase => {
              const phaseMods = phase.modules.map(m => m.id)
              const phaseDone = phaseMods.filter(id => completedIds.has(id)).length
              const phaseTotal = phaseMods.length
              const phasePct = Math.round((phaseDone / phaseTotal) * 100)
              const allDone = phaseDone === phaseTotal

              return (
                <div key={phase.id} style={{
                  background: allDone ? `${phase.color}08` : 'rgba(8,12,24,0.8)',
                  border: `1px solid ${allDone ? `${phase.color}25` : 'rgba(12,21,102,0.4)'}`,
                  borderRadius: 8, padding: '10px 14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: allDone ? phase.color : '#E8EEFF' }}>
                      Fase {phase.id}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7A9E', fontFamily: 'JetBrains Mono, monospace' }}>
                      {phaseDone}/{phaseTotal}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7A9E', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {phase.title}
                  </div>
                  <div style={{ background: 'rgba(12,21,102,0.5)', borderRadius: 2, height: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: allDone ? phase.color : '#3B5BDB',
                      width: `${phasePct}%`,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [notAdmin, setNotAdmin] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // Proteção: só o admin acessa
      if (ADMIN_EMAIL && session.user.email !== ADMIN_EMAIL) {
        setNotAdmin(true)
        setLoading(false)
        return
      }

      // Busca todos os perfis
      const { data: profiles } = await supabase
        .from('academy_profiles')
        .select('*')
        .order('xp', { ascending: false })

      if (!profiles?.length) { setLoading(false); return }

      // Busca todo o progresso de todos os usuários
      const { data: allProgress } = await supabase
        .from('academy_progress')
        .select('user_id, module_id, phase_id, completed, completed_at')

      // Monta lista de usuários com dados
      const userData: UserData[] = profiles.map(profile => ({
        profile,
        progress: (allProgress || []).filter(p => p.user_id === profile.id),
        email: profile.email || profile.username,
      }))

      setUsers(userData)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #0C1566', borderTopColor: '#3B5BDB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (notAdmin) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#E8EEFF', marginBottom: 8 }}>
          Acesso restrito
        </div>
        <div style={{ color: '#6B7A9E', fontSize: 14 }}>Esta área é exclusiva para administradores.</div>
      </div>
    )
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return !q || (u.profile.display_name || u.profile.username).toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  const totalXP = users.reduce((acc, u) => acc + u.profile.xp, 0)
  const totalCompleted = users.reduce((acc, u) => acc + getCompletedCount(u.progress), 0)
  const activeToday = users.filter(u => {
    const last = u.progress.filter(p => p.completed_at).sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0]
    if (!last?.completed_at) return false
    return new Date(last.completed_at).toDateString() === new Date().toDateString()
  }).length

  return (
    <div style={{ padding: '40px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span className="section-label" style={{ marginBottom: 12, display: 'inline-block' }}>ADMINISTRADOR</span>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Painel de Alunos
        </h1>
        <p style={{ color: '#6B7A9E', fontSize: 14 }}>
          Acompanhe o progresso e engajamento de cada aluno em tempo real.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total de Alunos', value: users.length, Icon: Users, color: '#3B5BDB' },
          { label: 'XP Distribuído', value: totalXP.toLocaleString('pt-BR'), Icon: Award, color: '#7C3AED' },
          { label: 'Módulos Completos', value: totalCompleted, Icon: BookOpen, color: '#10b981' },
          { label: 'Ativos Hoje', value: activeToday, Icon: Activity, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${stat.color}15`, border: `1px solid ${stat.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.Icon size={15} color={stat.color} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <Search size={15} color="#6B7A9E" strokeWidth={2} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          className="input-field"
          placeholder="Buscar aluno..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 36, width: '100%' }}
        />
      </div>

      {/* Table header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '8px 20px', marginBottom: 8,
        fontSize: 10, fontWeight: 700, color: '#6B7A9E',
        fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        <div style={{ flex: '0 0 40px' }}></div>
        <div style={{ flex: '0 0 200px' }}>Aluno</div>
        <div style={{ flex: '0 0 140px' }}>Nível</div>
        <div style={{ flex: 1 }}>Progresso</div>
        <div style={{ flex: '0 0 220px' }}>Estudando</div>
        <div style={{ flex: '0 0 90px', textAlign: 'right' }}>Atividade</div>
        <div style={{ flex: '0 0 16px' }}></div>
      </div>

      {/* Users list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6B7A9E' }}>
            Nenhum aluno encontrado.
          </div>
        ) : (
          filtered.map(user => <UserRow key={user.profile.id} user={user} />)
        )}
      </div>
    </div>
  )
}
