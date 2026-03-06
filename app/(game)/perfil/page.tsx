'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Profile } from '@/lib/supabase'
import { PHASES, getLevelInfo, getXPToNextLevel, LEVELS } from '@/lib/game-data'
import { AvatarIcon, InitialsAvatar, type AvatarId } from '@/components/Avatars'

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [profileRes, progressRes] = await Promise.all([
        supabase.from('academy_profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('academy_progress').select('id').eq('user_id', session.user.id).eq('completed', true),
      ])

      if (profileRes.data) setProfile(profileRes.data)
      if (progressRes.data) setCompletedCount(progressRes.data.length)
      setLoading(false)
    }
    load()
  }, [])

  if (loading || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #0C1566', borderTopColor: '#3B5BDB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const levelInfo = getLevelInfo(profile.xp)
  const xpInfo = getXPToNextLevel(profile.xp)
  const totalModules = PHASES.reduce((acc, p) => acc + p.modules.length, 0)

  return (
    <div style={{ padding: '40px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
        Seu Perfil
      </h1>

      {/* Player card big */}
      <div className="glass-card" style={{
        padding: '36px',
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(59,91,219,0.08) 0%, rgba(10,10,20,0.9) 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
          {/* Avatar */}
          {profile.avatar_id ? (
            <AvatarIcon id={profile.avatar_id as AvatarId} size={80} />
          ) : (
            <InitialsAvatar name={profile.display_name || profile.username} size={80} />
          )}
          <div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 22, fontWeight: 700, color: '#E8EEFF', marginBottom: 4,
            }}>
              {profile.display_name || profile.username}
            </div>
            <div style={{
              display: 'inline-block',
              background: `${levelInfo.color}20`,
              border: `1px solid ${levelInfo.color}40`,
              borderRadius: 20, padding: '4px 14px',
              fontSize: 13, color: levelInfo.color,
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            }}>
              Nível {profile.level} — {profile.title}
            </div>
          </div>
        </div>

        {/* XP section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14 }}>
              Experiência Total
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: '#3B5BDB' }}>
              {profile.xp} XP
            </span>
          </div>
          <div style={{ background: 'rgba(12,21,102,0.6)', borderRadius: 6, height: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', borderRadius: 6,
              background: `linear-gradient(90deg, #3B5BDB, #7C3AED)`,
              width: `${xpInfo.percent}%`,
              boxShadow: '0 0 12px rgba(59,91,219,0.6)',
              transition: 'width 1s ease',
            }} />
          </div>
          {profile.level < 5 ? (
            <div style={{ color: '#6B7A9E', fontSize: 13 }}>
              Faltam {xpInfo.needed - xpInfo.current} XP para Nível {profile.level + 1}
            </div>
          ) : (
            <div style={{ color: '#D97706', fontSize: 13, fontWeight: 600 }}>
              Nível máximo atingido!
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 900, color: '#3B5BDB', marginBottom: 4 }}>
            {completedCount}
          </div>
          <div style={{ color: '#6B7A9E', fontSize: 14 }}>Módulos completados</div>
          <div style={{ color: '#6B7A9E', fontSize: 12, marginTop: 4 }}>de {totalModules} totais</div>
        </div>
        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 900, color: '#7C3AED', marginBottom: 4 }}>
            {Math.round((completedCount / totalModules) * 100)}%
          </div>
          <div style={{ color: '#6B7A9E', fontSize: 14 }}>Progresso total</div>
        </div>
      </div>

      {/* Level roadmap */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
          Jornada de Evolução
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {LEVELS.map((lvl, i) => {
            const reached = profile.xp >= lvl.min
            const isCurrentLevel = profile.level === lvl.level

            return (
              <div key={lvl.level} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Line connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: reached ? `${lvl.color}20` : 'rgba(12,21,102,0.4)',
                    border: `2px solid ${reached ? lvl.color : 'rgba(12,21,102,0.6)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700,
                    color: reached ? lvl.color : '#6B7A9E',
                    fontFamily: 'Space Grotesk, sans-serif',
                    boxShadow: isCurrentLevel ? `0 0 16px ${lvl.color}60` : 'none',
                  }}>
                    {reached ? lvl.level : lvl.level}
                  </div>
                  {i < LEVELS.length - 1 && (
                    <div style={{
                      width: 2, height: 32,
                      background: reached ? `${lvl.color}40` : 'rgba(12,21,102,0.4)',
                    }} />
                  )}
                </div>

                {/* Level info */}
                <div style={{ paddingBottom: i < LEVELS.length - 1 ? 24 : 0 }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                    color: reached ? '#E8EEFF' : '#6B7A9E',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {lvl.title}
                    {isCurrentLevel && (
                      <span style={{
                        background: `${lvl.color}20`, border: `1px solid ${lvl.color}40`,
                        borderRadius: 12, padding: '2px 8px',
                        fontSize: 10, color: lvl.color, fontWeight: 700,
                      }}>
                        VOCÊ ESTÁ AQUI
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#6B7A9E', fontSize: 13, marginTop: 2 }}>
                    {lvl.min === 0 ? 'Início' : `${lvl.min} XP`} — {lvl.max >= 99999 ? 'Mestre' : `${lvl.max} XP`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
