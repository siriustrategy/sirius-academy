'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Lock, Sparkles, Brain, Target, Zap, Star, ChevronRight } from 'lucide-react'

const ADMIN_EMAIL = 'breno.nobre@gruporiomais.com.br'

const FRAMEWORKS = [
  { icon: Brain,   label: 'Gay Hendricks',   desc: 'Zona de Gênio',            color: '#7C3AED' },
  { icon: Star,    label: 'CliftonStrengths', desc: 'Forças Naturais',          color: '#3B5BDB' },
  { icon: Target,  label: 'Dan Sullivan',     desc: 'Habilidade Única',         color: '#0891B2' },
  { icon: Zap,     label: 'Wealth Dynamics',  desc: 'Perfil de Riqueza',        color: '#059669' },
  { icon: Sparkles,label: 'Alex Hormozi',     desc: 'Equação de Valor',         color: '#D97706' },
  { icon: Brain,   label: 'Kolbe',            desc: 'Modo de Ação',             color: '#DC2626' },
  { icon: Star,    label: 'Sally Hogshead',   desc: 'Vantagem de Fascínio',     color: '#DB2777' },
]

export default function GenialidadePage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasBluePrint, setHasBluePrint] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      if (session.user.email === ADMIN_EMAIL) setIsAdmin(true)

      const { data } = await supabase
        .from('genius_blueprints')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
      if (data) setHasBluePrint(true)
      setLoading(false)
    }
    check()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const canAccess = isAdmin

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 20, padding: '6px 14px', marginBottom: 20,
        }}>
          <Sparkles size={13} color="#7C3AED" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
            ZONA DE GENIALIDADE
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 36, fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 14, lineHeight: 1.15,
        }}>
          Descubra onde vive o seu<br />
          <span style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>gênio natural</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>
          Um mapeamento profundo baseado em 7 metodologias de elite usadas por coaches e empresas Fortune 500.
          Descubra em que você é verdadeiramente excepcional — e como usar isso para expandir com IA.
        </p>
      </div>

      {/* Frameworks grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 36 }}>
        {FRAMEWORKS.map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 12, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: `${f.color}15`,
                border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={f.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{f.desc}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{f.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* What you get */}
      <div className="glass-card" style={{ padding: '28px 32px', marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18 }}>
          O que você recebe ao final
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['Sua Zona de Gênio identificada', '#7C3AED'],
            ['Top 5 Forças CliftonStrengths', '#3B5BDB'],
            ['Habilidade Única definida', '#0891B2'],
            ['Perfil de Riqueza mapeado', '#059669'],
            ['Equação de Valor personalizada', '#D97706'],
            ['Modo de Ação Kolbe', '#DC2626'],
            ['Posicionamento de Fascínio', '#DB2777'],
            ['Plano de Ação 90 dias com IA', '#7C3AED'],
          ].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {canAccess ? (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {hasBluePrint && (
            <Link href="/genialidade/resultado" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: 10, padding: '14px 24px',
                color: '#7C3AED', fontWeight: 700, fontSize: 15,
                fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Ver meu Blueprint
                <ChevronRight size={16} />
              </button>
            </Link>
          )}
          <Link href="/genialidade/quiz" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
              border: 'none',
              borderRadius: 10, padding: '14px 28px',
              color: '#fff', fontWeight: 700, fontSize: 15,
              fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {hasBluePrint ? 'Refazer o Quiz' : 'Iniciar Mapeamento'}
              <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      ) : (
        <div style={{
          background: 'rgba(124,58,237,0.06)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 14, padding: '28px 32px',
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, flexShrink: 0,
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={22} color="#7C3AED" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 6 }}>
              Conteúdo Premium — Em breve disponível
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              O Mapeamento de Zona de Genialidade estará disponível como parte da assinatura premium da Sirius Academy. Fique ligado!
            </div>
          </div>
          <button disabled style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
            border: 'none', borderRadius: 10, padding: '12px 24px',
            color: '#fff', fontWeight: 700, fontSize: 14,
            fontFamily: 'Space Grotesk, sans-serif', cursor: 'not-allowed',
            opacity: 0.5, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap',
          }}>
            <Lock size={14} />
            Iniciar Mapeamento
          </button>
        </div>
      )}
    </div>
  )
}
