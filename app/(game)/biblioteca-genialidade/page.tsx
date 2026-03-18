'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AvatarIcon, InitialsAvatar, type AvatarId } from '@/components/Avatars'
import {
  Library, Search, Brain, Star, Target, Zap, Sparkles, Users, TrendingUp,
  ChevronDown, ChevronUp, AlertTriangle,
} from 'lucide-react'

// ── Constantes ────────────────────────────────────────────────
const ADMIN_EMAIL = 'breno.nobre@gruporiomais.com.br'

// ── Types ─────────────────────────────────────────────────────
interface ChartData {
  arquetipo: string
  alinhamento_pct: number
  zona_atual_pct: number
  potencial_pct: number
  zonas_atual: { genialidade: number; excelencia: number; competencia: number; incompetencia: number }
  zonas_meta_60d: { genialidade: number; excelencia: number; competencia: number; incompetencia: number }
  convergencia_radar: number[]
  clifton_top5: { nome: string; score: number }[]
  kolbe: { quickStart: number; factFinder: number; followThru: number; implementor: number }
  hormozi_score: number
  hormozi_bars: { resultadoSonhado: number; probabilidadePercebida: number; tempoEspera: number; esforcoSacrificio: number }
  nao_fazer: string[]
}

type BlueprintEntry = {
  userId: string
  name: string
  email: string
  avatarId: string | null
  blueprintMd: string
  chartData: ChartData | null
  sections: { key: string; content: string }[]
  generatedAt: string
}

// ── Seções do blueprint ───────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────
function extractChartData(md: string): { chartData: ChartData | null; cleanMd: string } {
  const match = md.match(/<chart_data>([\s\S]*?)<\/chart_data>/)
  if (!match) return { chartData: null, cleanMd: md }
  try {
    const chartData = JSON.parse(match[1].trim()) as ChartData
    const cleanMd = md.replace(/<chart_data>[\s\S]*?<\/chart_data>/, '').replace(/\n{3,}/g, '\n\n').trim()
    return { chartData, cleanMd }
  } catch {
    return { chartData: null, cleanMd: md }
  }
}

function parseBlueprint(md: string): { key: string; content: string }[] {
  const sections: { key: string; content: string }[] = []
  const parts = md.split(/^## /m).filter(Boolean)
  for (const part of parts) {
    const lineEnd = part.indexOf('\n')
    const heading = part.slice(0, lineEnd).toUpperCase()
    const content = part.slice(lineEnd + 1).trim()
    const meta = SECTION_META.find(m => heading.includes(m.key))
    if (meta) sections.push({ key: meta.key, content })
  }
  return sections
}

function renderMarkdown(text: string, color: string): React.ReactNode {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <div key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color, marginTop: 14, marginBottom: 5 }}>{line.slice(4)}</div>
    if (line.match(/^\*\*(.+)\*\*$/)) return <div key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginTop: 8 }}>{line.replace(/\*\*/g, '')}</div>
    if (line.match(/^- \*\*(.+?)\*\*/)) {
      const [, bold, rest] = line.match(/^- \*\*(.+?)\*\*(.*)/) || []
      return <div key={i} style={{ display: 'flex', gap: 8, marginTop: 5, alignItems: 'flex-start' }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 7 }} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--text-primary)' }}>{bold}</strong>{rest}
        </span>
      </div>
    }
    if (line.startsWith('- ') || line.match(/^\d+\. /)) return (
      <div key={i} style={{ display: 'flex', gap: 8, marginTop: 5, alignItems: 'flex-start' }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 7 }} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{line.replace(/^- /, '').replace(/^\d+\. /, '')}</span>
      </div>
    )
    if (line.startsWith('> ')) return <div key={i} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 12, marginTop: 10, color: 'var(--text-primary)', fontSize: 14, fontStyle: 'italic', lineHeight: 1.65 }}>{line.slice(2)}</div>
    if (!line.trim() || line.startsWith('---')) return <div key={i} style={{ height: 5 }} />
    if (line.trim()) return <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '3px 0' }}>{line.replace(/\*\*(.+?)\*\*/g, '$1')}</p>
    return null
  })
}

// ── Mini Circle Metric ────────────────────────────────────────
function MiniCircle({ value, label, color }: { value: number; label: string; color: string }) {
  const S = 70, R = 26, C = 2 * Math.PI * R
  const off = C - (Math.min(value, 100) / 100) * C
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={S} height={S}>
        <circle cx={S/2} cy={S/2} r={R} fill="none" style={{ stroke: 'var(--border)' }} strokeWidth="5" />
        <circle cx={S/2} cy={S/2} r={R} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${S/2} ${S/2})`} />
        <text x={S/2} y={S/2+1} textAnchor="middle" dominantBaseline="middle"
          fontSize="14" fontWeight="800" style={{ fill: 'var(--text-primary)' }} fontFamily="Space Grotesk, sans-serif">{value}%</text>
      </svg>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textAlign: 'center', maxWidth: 70, lineHeight: 1.3 }}>{label}</span>
    </div>
  )
}

// ── Zone Bars Mini ────────────────────────────────────────────
function ZoneBarsMini({ atual, meta }: { atual: ChartData['zonas_atual']; meta: ChartData['zonas_meta_60d'] }) {
  const COLORS = { genialidade: '#7C3AED', excelencia: '#3B5BDB', competencia: '#F59E0B', incompetencia: '#EF4444' }
  const LABELS = { genialidade: 'Gênio', excelencia: 'Excelência', competencia: 'Competência', incompetencia: 'Incompet.' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['hoje', 'meta'] as const).map(tipo => {
        const data = tipo === 'hoje' ? atual : meta
        return (
          <div key={tipo}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
              {tipo === 'hoje' ? 'HOJE' : 'META 60 DIAS'}
            </div>
            <div style={{ display: 'flex', height: 18, borderRadius: 5, overflow: 'hidden', gap: 2 }}>
              {Object.entries(data).map(([k, v]) => (
                <div key={k} style={{
                  width: `${v}%`, background: COLORS[k as keyof typeof COLORS],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  {v >= 15 ? `${v}%` : ''}
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(COLORS).map(([k, c]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{LABELS[k as keyof typeof LABELS]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Blueprint expandido ───────────────────────────────────────
function BlueprintExpandido({ entry }: { entry: BlueprintEntry }) {
  const { chartData: cd, sections } = entry

  if (!cd) {
    return (
      <div style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontSize: 13 }}>
        Blueprint sem dados estruturados. Conteúdo bruto disponível.
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Métricas principais */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>
          MÉTRICAS PRINCIPAIS
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <MiniCircle value={cd.alinhamento_pct} label="Alinhamento" color="#7C3AED" />
          <MiniCircle value={cd.zona_atual_pct} label="Zona Atual" color="#3B5BDB" />
          <MiniCircle value={cd.potencial_pct} label="Potencial" color="#059669" />
        </div>
      </div>

      {/* Zona de Tempo */}
      {cd.zonas_atual && cd.zonas_meta_60d && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12 }}>
            DISTRIBUIÇÃO DE TEMPO
          </div>
          <ZoneBarsMini atual={cd.zonas_atual} meta={cd.zonas_meta_60d} />
        </div>
      )}

      {/* Top 5 CliftonStrengths */}
      {cd.clifton_top5?.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12 }}>
            TOP 5 CLIFTONSTRENGTHS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cd.clifton_top5.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: 'rgba(59,91,219,0.12)', border: '1px solid rgba(59,91,219,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#3B5BDB', fontFamily: 'Space Grotesk, sans-serif',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{c.nome}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.score}%`, background: '#3B5BDB', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#3B5BDB', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, minWidth: 32 }}>{c.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kolbe */}
      {cd.kolbe && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12 }}>
            KOLBE — MODO DE AÇÃO
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Quick Start', value: cd.kolbe.quickStart, color: '#DC2626' },
              { label: 'Fact Finder', value: cd.kolbe.factFinder, color: '#D97706' },
              { label: 'Follow Thru', value: cd.kolbe.followThru, color: '#059669' },
              { label: 'Implementor', value: cd.kolbe.implementor, color: '#3B5BDB' },
            ].map(item => (
              <div key={item.label} style={{
                flex: 1, background: `${item.color}10`, border: `1px solid ${item.color}25`,
                borderRadius: 8, padding: '10px 6px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: item.color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>{item.value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: item.color, fontFamily: 'Space Grotesk, sans-serif', marginTop: 3, letterSpacing: '0.04em' }}>{item.label.toUpperCase()}</div>
                <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: 'var(--muted-bg)' }}>
                  <div style={{ height: '100%', width: `${(item.value / 10) * 100}%`, background: item.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seções textuais */}
      {sections.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif' }}>
            ANÁLISE COMPLETA
          </div>
          {sections.map(sec => {
            const meta = SECTION_META.find(m => m.key === sec.key)
            if (!meta) return null
            const Icon = meta.icon
            return (
              <div key={sec.key} style={{
                background: 'var(--card-bg)', border: `1px solid ${meta.color}18`,
                borderRadius: 10, padding: '14px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: `${meta.color}12`, border: `1px solid ${meta.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={13} color={meta.color} />
                  </div>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                    {meta.label}
                  </span>
                </div>
                <div>{renderMarkdown(sec.content, meta.color)}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Card de colaborador ───────────────────────────────────────
function ColaboradorCard({ entry }: { entry: BlueprintEntry }) {
  const [expanded, setExpanded] = useState(false)
  const { chartData: cd } = entry
  const avatarId = entry.avatarId as AvatarId | null
  const genDate = new Date(entry.generatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })

  return (
    <div style={{
      background: 'rgba(8,12,24,0.7)',
      border: `1px solid ${expanded ? 'rgba(124,58,237,0.3)' : 'rgba(59,91,219,0.12)'}`,
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Cabeçalho do card */}
      <div style={{ padding: '18px 20px' }}>
        {/* Info do colaborador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {avatarId
            ? <AvatarIcon id={avatarId} size={44} />
            : <InitialsAvatar name={entry.name} size={44} />
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>
              {entry.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.email}
            </div>
          </div>
          {/* Arquétipo badge */}
          {cd?.arquetipo && (
            <div style={{
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 8, padding: '5px 10px',
              fontSize: 11, fontWeight: 700, color: '#7C3AED',
              fontFamily: 'Space Grotesk, sans-serif',
              flexShrink: 0, maxWidth: 120, textAlign: 'center',
            }}>
              {cd.arquetipo}
            </div>
          )}
        </div>

        {/* Métricas resumidas */}
        {cd && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Alinhamento', value: cd.alinhamento_pct, color: '#7C3AED' },
              { label: 'Zona Atual', value: cd.zona_atual_pct, color: '#3B5BDB' },
              { label: 'Potencial', value: cd.potencial_pct, color: '#059669' },
            ].map(m => (
              <div key={m.label} style={{
                flex: 1, background: `${m.color}08`, border: `1px solid ${m.color}18`,
                borderRadius: 8, padding: '10px 12px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 20, color: m.color, lineHeight: 1 }}>
                  {m.value}%
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginTop: 3 }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top 3 Clifton */}
        {cd?.clifton_top5?.length && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
              TOP 3 FORÇAS
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {cd.clifton_top5.slice(0, 3).map((c, i) => (
                <span key={i} style={{
                  background: 'rgba(59,91,219,0.1)', border: '1px solid rgba(59,91,219,0.2)',
                  borderRadius: 6, padding: '3px 8px',
                  fontSize: 11, color: '#7A9BFF', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                }}>
                  {c.nome}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer: data + botão */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            Mapeado em {genDate}
          </span>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: expanded ? 'rgba(124,58,237,0.15)' : 'rgba(59,91,219,0.08)',
              border: `1px solid ${expanded ? 'rgba(124,58,237,0.3)' : 'rgba(59,91,219,0.18)'}`,
              borderRadius: 8, padding: '6px 14px',
              fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
              color: expanded ? '#7C3AED' : '#5B7BFF',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {expanded ? <ChevronUp size={13} strokeWidth={2.5} /> : <ChevronDown size={13} strokeWidth={2.5} />}
            {expanded ? 'Fechar Blueprint' : 'Ver Blueprint Completo'}
          </button>
        </div>
      </div>

      {/* Blueprint expandido */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(124,58,237,0.15)', background: 'rgba(5,8,20,0.5)' }}>
          <BlueprintExpandido entry={entry} />
        </div>
      )}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export default function BibliotecaGenialidadePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [notAllowed, setNotAllowed] = useState(false)
  const [rlsBlocked, setRlsBlocked] = useState(false)
  const [entries, setEntries] = useState<BlueprintEntry[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // Verificar permissão: admin ou gestor de RH
      const email = session.user.email
      let allowed = email === ADMIN_EMAIL
      if (!allowed) {
        const { data: profileData } = await supabase
          .from('academy_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        allowed = profileData?.role === 'hr_manager'
      }

      if (!allowed) {
        setNotAllowed(true)
        setLoading(false)
        return
      }

      // Buscar todos os blueprints
      const { data: blueprints, error: bpError } = await supabase
        .from('genius_blueprints')
        .select('user_id, blueprint_md, generated_at')
        .order('generated_at', { ascending: false })

      if (bpError) {
        console.error('Blueprints error:', bpError)
        setRlsBlocked(true)
        setLoading(false)
        return
      }

      if (!blueprints || blueprints.length === 0) {
        setEntries([])
        setLoading(false)
        return
      }

      // Buscar perfis dos colaboradores
      const userIds = blueprints.map(b => b.user_id)
      const { data: profiles } = await supabase
        .from('academy_profiles')
        .select('id, display_name, username, email, avatar_id')
        .in('id', userIds)

      const profileMap = new Map(profiles?.map(p => [p.id, p]) ?? [])

      const result: BlueprintEntry[] = blueprints.map(b => {
        const profile = profileMap.get(b.user_id)
        const { chartData: cd, cleanMd } = extractChartData(b.blueprint_md)
        return {
          userId: b.user_id,
          name: profile?.display_name || profile?.username || 'Usuário',
          email: profile?.email || '',
          avatarId: profile?.avatar_id || null,
          blueprintMd: b.blueprint_md,
          chartData: cd,
          sections: cd ? parseBlueprint(cleanMd) : [],
          generatedAt: b.generated_at,
        }
      })

      setEntries(result)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>Carregando biblioteca...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (notAllowed) {
    return (
      <div className="page-wrap" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={24} color="#EF4444" strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Acesso restrito
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Esta área é exclusiva para gestores de RH e administradores.
        </div>
      </div>
    )
  }

  if (rlsBlocked) {
    return (
      <div className="page-wrap" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 12, padding: '24px 28px', marginTop: 24,
        }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#fcd34d', marginBottom: 12 }}>
            Configure o Supabase para liberar a Biblioteca
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            Execute o SQL de migração do arquivo <code>lib/schema.sql</code> (seção "MIGRATION: Perfil de Gestor de RH") no Supabase SQL Editor.
          </p>
        </div>
      </div>
    )
  }

  const filtered = entries.filter(e => {
    if (!search) return true
    const q = search.toLowerCase()
    return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.chartData?.arquetipo ?? '').toLowerCase().includes(q)
  })

  const comBlueprint = entries.length
  const semBlueprint = 0 // todos os que chegaram aqui já têm blueprint

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span className="section-label" style={{ marginBottom: 12, display: 'inline-block' }}>GESTÃO DE RH</span>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Library size={26} color="#7C3AED" strokeWidth={1.8} />
          Biblioteca de Zona de Genialidade
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Visualize individualmente o mapeamento de Zona de Genialidade de cada colaborador.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ padding: '16px 20px', flex: '0 0 auto', minWidth: 160 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>
            COLABORADORES MAPEADOS
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 28, color: '#7C3AED' }}>
            {comBlueprint}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '16px 20px', flex: '0 0 auto', minWidth: 160 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>
            COM ARQUÉTIPO DEFINIDO
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 28, color: '#3B5BDB' }}>
            {entries.filter(e => e.chartData?.arquetipo).length}
          </div>
        </div>
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search size={15} color="var(--text-muted)" strokeWidth={2} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          className="input-field"
          placeholder="Buscar por nome, email ou arquétipo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 36, width: '100%' }}
        />
      </div>

      {/* Lista de colaboradores */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          {search
            ? 'Nenhum colaborador encontrado para essa busca.'
            : 'Nenhum colaborador completou o mapeamento ainda.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(entry => (
            <ColaboradorCard key={entry.userId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
