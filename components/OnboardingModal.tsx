'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AVATARS, AvatarIcon, type AvatarId } from './Avatars'

type Props = {
  userId: string
  onComplete: (displayName: string, avatarId: AvatarId) => void
}

export default function OnboardingModal({ userId, onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [displayName, setDisplayName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFinish() {
    if (!selectedAvatar) return
    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('academy_profiles')
      .update({ display_name: displayName.trim(), avatar_id: selectedAvatar })
      .eq('id', userId)

    if (err) {
      setError('Erro ao salvar. Tente novamente.')
      setLoading(false)
      return
    }

    onComplete(displayName.trim(), selectedAvatar)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(5,5,8,0.92)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(59,91,219,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 520,
        background: 'rgba(10,10,20,0.98)',
        border: '1px solid rgba(59,91,219,0.3)',
        borderRadius: 20,
        padding: '40px 36px',
        position: 'relative',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              height: 4, flex: 1, borderRadius: 2,
              background: step >= s ? '#3B5BDB' : 'rgba(12,21,102,0.6)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Star icon */}
        <div style={{ fontSize: 36, marginBottom: 16, filter: 'drop-shadow(0 0 12px rgba(59,91,219,0.8))' }}>
          ✦
        </div>

        {step === 1 ? (
          <>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
              Bem-vindo à Sirius Academy!
            </h2>
            <p style={{ color: '#6B7A9E', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              Antes de começar, como posso te chamar?
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 700,
                color: '#6B7A9E', letterSpacing: '0.08em',
                fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10,
              }}>
                SEU NOME
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Ex: Breno, Maria, João..."
                className="input-field"
                style={{ fontSize: 18, padding: '14px 18px' }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && displayName.trim().length >= 2) setStep(2)
                }}
                autoFocus
              />
              {displayName.trim().length > 0 && displayName.trim().length < 2 && (
                <div style={{ color: '#6B7A9E', fontSize: 12, marginTop: 6 }}>Mínimo 2 caracteres</div>
              )}
            </div>

            <button
              onClick={() => { if (displayName.trim().length >= 2) setStep(2) }}
              className="btn-primary"
              disabled={displayName.trim().length < 2}
              style={{ width: '100%', fontSize: 16, padding: '14px', opacity: displayName.trim().length < 2 ? 0.5 : 1 }}
            >
              Continuar →
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
              Olá, {displayName}!
            </h2>
            <p style={{ color: '#6B7A9E', fontSize: 16, marginBottom: 28 }}>
              Escolha seu avatar — ele vai representar você na academia.
            </p>

            {/* Avatar grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 28,
            }}>
              {AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  style={{
                    background: selectedAvatar === avatar.id
                      ? `${avatar.color}18`
                      : 'rgba(10,10,20,0.6)',
                    border: `2px solid ${selectedAvatar === avatar.id ? avatar.color : 'rgba(12,21,102,0.5)'}`,
                    borderRadius: 14,
                    padding: '16px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                    boxShadow: selectedAvatar === avatar.id
                      ? `0 0 20px ${avatar.color}40`
                      : 'none',
                  }}
                >
                  <AvatarIcon
                    id={avatar.id}
                    size={64}
                    selected={selectedAvatar === avatar.id}
                  />
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 12, fontWeight: 700,
                    color: selectedAvatar === avatar.id ? avatar.color : '#6B7A9E',
                    transition: 'color 0.2s',
                    letterSpacing: '0.03em',
                  }}>
                    {avatar.label.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: 8, padding: '12px 16px',
                color: '#FCA5A5', fontSize: 14, marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(59,91,219,0.3)',
                  color: '#6B7A9E', borderRadius: 8,
                  padding: '14px 20px', cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                  fontSize: 14,
                }}
              >
                ← Voltar
              </button>
              <button
                onClick={handleFinish}
                className="btn-primary"
                disabled={!selectedAvatar || loading}
                style={{
                  flex: 1, fontSize: 16, padding: '14px',
                  opacity: !selectedAvatar || loading ? 0.5 : 1,
                }}
              >
                {loading ? 'Entrando na academia...' : 'Entrar na Academia ✦'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
