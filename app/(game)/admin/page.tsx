'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Profile } from '@/lib/supabase'
import { PHASES } from '@/lib/game-data'
import { getLevelInfo } from '@/lib/game-data'
import { AvatarIcon, InitialsAvatar, type AvatarId } from '@/components/Avatars'
import {
  Users, Activity, BookOpen, ChevronDown, ChevronUp,
  Search, Award, ShoppingCart, DollarSign, TrendingUp, BarChart2, Package,
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

type CheckoutLead = {
  id: string
  user_id: string | null
  nome: string
  email: string
  telefone: string | null
  produto_tipo: string
  curso_id: string | null
  converted: boolean
  created_at: string
}

type Purchase = {
  id: string
  user_id: string
  produto_tipo: string
  curso_id: string | null
  status: string
  valor: number
  metodo_pagamento: string
  asaas_payment_id: string | null
  paid_at: string | null
  created_at: string
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

// ── Helpers de formatação ──────────────────────────────────────
const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

// ── SalesTab ───────────────────────────────────────────────────
function SalesTab({ leads, purchases }: { leads: CheckoutLead[]; purchases: Purchase[] }) {
  const [salesSearch, setSalesSearch] = useState('')

  const totalLeads = leads.length
  const totalPaid = purchases.filter(p => p.status === 'pago').length
  const totalPending = purchases.filter(p => p.status === 'pendente').length
  const totalRevenue = purchases.filter(p => p.status === 'pago').reduce((acc, p) => acc + Number(p.valor), 0)
  const convRate = totalLeads > 0 ? Math.round((totalPaid / totalLeads) * 100) : 0

  // Mapa de user_id → purchase
  const purchaseByUser = new Map<string, Purchase>()
  purchases.forEach(p => purchaseByUser.set(`${p.user_id}:${p.produto_tipo}`, p))

  const filteredLeads = leads.filter(l => {
    const q = salesSearch.toLowerCase()
    return !q || l.nome.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.telefone ?? '').includes(q)
  })

  const statusBadge = (lead: CheckoutLead) => {
    const key = `${lead.user_id}:${lead.produto_tipo}`
    const purchase = lead.user_id ? purchaseByUser.get(key) : null
    if (purchase?.status === 'pago') {
      return { label: 'Pago', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' }
    }
    if (purchase?.status === 'pendente') {
      return { label: 'Pendente', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' }
    }
    return { label: 'No carrinho', color: '#7A8AAE', bg: 'rgba(122,138,174,0.08)', border: 'rgba(122,138,174,0.2)' }
  }

  const produtoLabel = (tipo: string, cursoId: string | null) =>
    tipo === 'genialidade' ? 'Zona de Genialidade' : `Curso: ${cursoId ?? '-'}`

  const metodoLabel = (m: string) =>
    m === 'card' ? 'Cartão' : m === 'pix' ? 'Pix' : 'Boleto'

  const card = (label: string, value: string | number, Icon: React.ElementType, color: string) => (
    <div key={label} className="glass-card" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={color} strokeWidth={1.8} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color }}>{value}</div>
    </div>
  )

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
        {card('Leads no carrinho', totalLeads, ShoppingCart, '#3B5BDB')}
        {card('Pagamentos confirmados', totalPaid, Award, '#10b981')}
        {card('Aguardando pagamento', totalPending, Activity, '#f59e0b')}
        {card('Taxa de conversão', `${convRate}%`, TrendingUp, '#7C3AED')}
        {card('Receita confirmada', fmt(totalRevenue), DollarSign, '#0ea5e9')}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search size={15} color="#6B7A9E" strokeWidth={2} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          className="input-field"
          placeholder="Buscar por nome, email ou telefone..."
          value={salesSearch}
          onChange={e => setSalesSearch(e.target.value)}
          style={{ paddingLeft: 36, width: '100%' }}
        />
      </div>

      {/* Tabela de leads */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1.2fr 1.5fr 1.2fr 1fr',
          padding: '8px 16px',
          fontSize: 10, fontWeight: 700, color: '#6B7A9E',
          fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const,
        }}>
          <div>Nome</div>
          <div>Email / Telefone</div>
          <div>Produto</div>
          <div>Método</div>
          <div>Data</div>
          <div>Status</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6B7A9E' }}>
              {salesSearch ? 'Nenhum resultado.' : 'Ainda não há leads. Assim que alguém preencher o carrinho, aparecerá aqui.'}
            </div>
          ) : filteredLeads.map(lead => {
            const badge = statusBadge(lead)
            const key = `${lead.user_id}:${lead.produto_tipo}`
            const purchase = lead.user_id ? purchaseByUser.get(key) : null

            return (
              <div key={lead.id} style={{
                background: 'rgba(8,12,24,0.7)',
                border: '1px solid rgba(59,91,219,0.12)',
                borderRadius: 10,
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1.2fr 1.5fr 1.2fr 1fr',
                alignItems: 'center',
                padding: '13px 16px',
                gap: 8,
              }}>
                {/* Nome */}
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.nome}
                </div>

                {/* Email + telefone */}
                <div>
                  <div style={{ fontSize: 12, color: '#C5CCEE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.email}
                  </div>
                  {lead.telefone && (
                    <div style={{ fontSize: 11, color: '#6B7A9E', marginTop: 2 }}>{lead.telefone}</div>
                  )}
                </div>

                {/* Produto */}
                <div style={{ fontSize: 12, color: '#7A8AAE' }}>
                  {produtoLabel(lead.produto_tipo, lead.curso_id)}
                </div>

                {/* Método + valor */}
                <div>
                  {purchase ? (
                    <>
                      <div style={{ fontSize: 12, color: '#C5CCEE' }}>{metodoLabel(purchase.metodo_pagamento)}</div>
                      <div style={{ fontSize: 11, color: '#6B7A9E', fontFamily: 'JetBrains Mono, monospace' }}>{fmt(Number(purchase.valor))}</div>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: '#4A5680' }}>—</span>
                  )}
                </div>

                {/* Data */}
                <div style={{ fontSize: 11, color: '#6B7A9E', fontFamily: 'JetBrains Mono, monospace' }}>
                  {fmtDate(lead.created_at)}
                </div>

                {/* Badge */}
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
                    color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`,
                    borderRadius: 6, padding: '3px 8px', display: 'inline-block',
                  }}>
                    {badge.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Breakdown por produto ── */}
      {purchases.length > 0 && (
        <div style={{ marginTop: 40, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={13} strokeWidth={2} />
            Análise por Produto
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {(() => {
              // Agrupar por produto_tipo + curso_id
              const map = new Map<string, { label: string; paid: number; pending: number; revenue: number; leads: number }>()

              leads.forEach(l => {
                const key = l.produto_tipo === 'genialidade' ? 'genialidade' : `curso:${l.curso_id}`
                const label = l.produto_tipo === 'genialidade' ? 'Zona de Genialidade' : `Curso: ${l.curso_id ?? '-'}`
                if (!map.has(key)) map.set(key, { label, paid: 0, pending: 0, revenue: 0, leads: 0 })
                map.get(key)!.leads += 1
              })

              purchases.forEach(p => {
                const key = p.produto_tipo === 'genialidade' ? 'genialidade' : `curso:${p.curso_id}`
                const label = p.produto_tipo === 'genialidade' ? 'Zona de Genialidade' : `Curso: ${p.curso_id ?? '-'}`
                if (!map.has(key)) map.set(key, { label, paid: 0, pending: 0, revenue: 0, leads: 0 })
                const entry = map.get(key)!
                if (p.status === 'pago') { entry.paid += 1; entry.revenue += Number(p.valor) }
                else if (p.status === 'pendente') entry.pending += 1
              })

              return Array.from(map.values()).map(prod => (
                <div key={prod.label} style={{
                  background: 'rgba(8,12,24,0.7)',
                  border: '1px solid rgba(59,91,219,0.14)',
                  borderRadius: 12, padding: '18px 20px',
                }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', marginBottom: 14 }}>
                    {prod.label}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Leads', value: prod.leads, color: '#3B5BDB' },
                      { label: 'Pagos', value: prod.paid, color: '#10b981' },
                      { label: 'Pendentes', value: prod.pending, color: '#f59e0b' },
                      { label: 'Receita', value: fmt(prod.revenue), color: '#0ea5e9' },
                    ].map(m => (
                      <div key={m.label}>
                        <div style={{ fontSize: 10, color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.07em', marginBottom: 3 }}>
                          {m.label.toUpperCase()}
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: m.color }}>
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {prod.leads > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, color: '#6B7A9E' }}>
                        <span>Conversão</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {prod.leads > 0 ? Math.round((prod.paid / prod.leads) * 100) : 0}%
                        </span>
                      </div>
                      <div style={{ background: 'var(--border)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          background: 'linear-gradient(90deg, #3B5BDB, #10b981)',
                          width: `${prod.leads > 0 ? Math.round((prod.paid / prod.leads) * 100) : 0}%`,
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              ))
            })()}
          </div>
        </div>
      )}

      {/* Compras sem lead (pagamentos diretos) */}
      {purchases.filter(p => !leads.some(l => l.user_id === p.user_id && l.produto_tipo === p.produto_tipo)).length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
            Compras sem registro de lead
          </div>
          {purchases
            .filter(p => !leads.some(l => l.user_id === p.user_id && l.produto_tipo === p.produto_tipo))
            .map(p => (
              <div key={p.id} style={{
                background: 'rgba(8,12,24,0.7)', border: '1px solid rgba(59,91,219,0.12)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 6, fontSize: 12, color: '#7A8AAE',
                display: 'flex', gap: 24, alignItems: 'center',
              }}>
                <span style={{ color: '#C5CCEE' }}>{produtoLabel(p.produto_tipo, p.curso_id)}</span>
                <span>{metodoLabel(p.metodo_pagamento)}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#10b981' }}>{fmt(Number(p.valor))}</span>
                <span style={{ color: p.status === 'pago' ? '#10b981' : '#f59e0b' }}>{p.status}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmtDate(p.created_at)}</span>
              </div>
            ))}
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
  const [rlsBlocked, setRlsBlocked] = useState(false)
  const [activeTab, setActiveTab] = useState<'alunos' | 'vendas'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#vendas') return 'vendas'
    return 'alunos'
  })
  const [leads, setLeads] = useState<CheckoutLead[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // Proteção: só o admin acessa
      if (session.user.email !== ADMIN_EMAIL) {
        setNotAdmin(true)
        setLoading(false)
        return
      }

      // Busca todos os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('academy_profiles')
        .select('*')
        .order('xp', { ascending: false })

      if (profilesError) console.error('Profiles error:', profilesError)

      // Se retornou vazio mas o próprio admin existe, é bloqueio de RLS
      if (!profiles || profiles.length === 0) {
        setRlsBlocked(true)
        setLoading(false)
        return
      }

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

      // Busca dados de vendas via API (service role)
      try {
        const salesRes = await fetch('/api/admin/sales', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (salesRes.ok) {
          const salesData = await salesRes.json()
          setLeads(salesData.leads ?? [])
          setPurchases(salesData.purchases ?? [])
        }
      } catch {
        // silencioso — vendas não bloqueiam o carregamento do painel
      }

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

  if (rlsBlocked) {
    return (
      <div style={{ padding: '48px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: '#E8EEFF', marginBottom: 8 }}>
          Painel de Alunos
        </div>
        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 12, padding: '24px 28px', marginTop: 24,
        }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#fcd34d', marginBottom: 12 }}>
            Configure o Supabase para liberar o acesso
          </div>
          <p style={{ color: '#C5CCEE', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            O banco de dados está bloqueando a visualização de outros usuários (proteção RLS). Para liberar, rode o SQL abaixo no <strong>Supabase SQL Editor</strong>:
          </p>
          <div style={{
            background: 'rgba(5,7,16,0.9)',
            border: '1px solid rgba(59,91,219,0.25)',
            borderRadius: 8, padding: '16px 18px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12, color: '#93c5fd',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            marginBottom: 16,
          }}>
{`-- Cole e execute no Supabase → SQL Editor

CREATE POLICY "Admin ve todos perfis"
ON academy_profiles FOR SELECT
USING (
  auth.uid() = id
  OR auth.jwt() ->> 'email' = 'breno.nobre@gruporiomais.com.br'
);

CREATE POLICY "Admin ve todo progresso"
ON academy_progress FOR SELECT
USING (
  auth.uid() = user_id
  OR auth.jwt() ->> 'email' = 'breno.nobre@gruporiomais.com.br'
);`}
          </div>
          <p style={{ color: '#6B7A9E', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Após rodar o SQL, recarregue esta página. Os alunos vão aparecer.
          </p>
        </div>
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
      <div style={{ marginBottom: 28 }}>
        <span className="section-label" style={{ marginBottom: 12, display: 'inline-block' }}>ADMINISTRADOR</span>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Painel de Gestão
        </h1>
        <p style={{ color: '#6B7A9E', fontSize: 14 }}>
          Acompanhe alunos, vendas e leads em tempo real.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(59,91,219,0.15)', marginBottom: 28, gap: 0 }}>
        {([
          { id: 'alunos', label: 'Alunos', Icon: Users },
          { id: 'vendas', label: 'Análise de Vendas', Icon: BarChart2 },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #3B5BDB' : '2px solid transparent',
              color: activeTab === tab.id ? '#5B7BFF' : '#6B7A9E',
              cursor: 'pointer', transition: 'all 0.15s',
              marginBottom: -1,
            }}
          >
            <tab.Icon size={15} strokeWidth={2} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ABA ALUNOS ── */}
      {activeTab === 'alunos' && (
        <>
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
        </>
      )}

      {/* ── ABA VENDAS ── */}
      {activeTab === 'vendas' && (
        <SalesTab leads={leads} purchases={purchases} />
      )}
    </div>
  )
}
