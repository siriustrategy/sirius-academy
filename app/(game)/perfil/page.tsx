'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Profile } from '@/lib/supabase'
import { PHASES, getLevelInfo, getXPToNextLevel, LEVELS } from '@/lib/game-data'
import { AvatarIcon, InitialsAvatar, AVATARS, type AvatarId } from '@/components/Avatars'

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)

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

  async function handleAvatarChange(avatarId: AvatarId) {
    if (!profile) return
    setSavingAvatar(true)
    await supabase.from('academy_profiles').update({ avatar_id: avatarId }).eq('id', profile.id)
    setProfile(prev => prev ? { ...prev, avatar_id: avatarId } : null)
    setShowAvatarPicker(false)
    setSavingAvatar(false)
  }

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
    <div style={{ padding: '40px 48px' }}>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, marginBottom: 32 }}>
        Seu Perfil
      </h1>

      {/* Player card big */}
      <div className="glass-card" style={{
        padding: '36px',
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(59,91,219,0.08) 0%, rgba(10,10,20,0.9) 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
          {/* Avatar com botão de trocar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {profile.avatar_id ? (
              <AvatarIcon id={profile.avatar_id as AvatarId} size={80} />
            ) : (
              <InitialsAvatar name={profile.display_name || profile.username} size={80} />
            )}
            <button
              onClick={() => setShowAvatarPicker(v => !v)}
              style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 26, height: 26, borderRadius: '50%',
                background: '#3B5BDB', border: '2px solid #0a0a14',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4,
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
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => setShowAvatarPicker(v => !v)}
                style={{
                  background: 'transparent', border: '1px solid rgba(59,91,219,0.3)',
                  borderRadius: 8, padding: '5px 12px',
                  color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                }}
              >
                {showAvatarPicker ? 'Cancelar' : 'Trocar avatar'}
              </button>
            </div>
          </div>
        </div>

        {/* Avatar picker */}
        {showAvatarPicker && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.07em', marginBottom: 12 }}>
              ESCOLHA SEU AVATAR
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {AVATARS.map(avatar => {
                const isSelected = profile.avatar_id === avatar.id
                return (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarChange(avatar.id)}
                    disabled={savingAvatar}
                    style={{
                      background: isSelected ? `${avatar.color}18` : 'rgba(10,10,20,0.6)',
                      border: `2px solid ${isSelected ? avatar.color : 'rgba(12,21,102,0.5)'}`,
                      borderRadius: 12, padding: '12px 8px',
                      cursor: savingAvatar ? 'wait' : 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      transition: 'all 0.15s',
                      boxShadow: isSelected ? `0 0 14px ${avatar.color}40` : 'none',
                      opacity: savingAvatar ? 0.6 : 1,
                    }}
                  >
                    <AvatarIcon id={avatar.id} size={44} selected={isSelected} />
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      fontFamily: 'Space Grotesk, sans-serif',
                      color: isSelected ? avatar.color : '#6B7A9E',
                      letterSpacing: '0.04em',
                    }}>
                      {avatar.label.toUpperCase()}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

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
          <div style={{ background: 'var(--progress-track)', borderRadius: 6, height: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', borderRadius: 6,
              background: `linear-gradient(90deg, #3B5BDB, #7C3AED)`,
              width: `${xpInfo.percent}%`,
              boxShadow: '0 0 12px rgba(59,91,219,0.6)',
              transition: 'width 1s ease',
            }} />
          </div>
          {profile.level < 5 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
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
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Módulos completados</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>de {totalModules} totais</div>
        </div>
        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 900, color: '#7C3AED', marginBottom: 4 }}>
            {Math.round((completedCount / totalModules) * 100)}%
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Progresso total</div>
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
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
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
