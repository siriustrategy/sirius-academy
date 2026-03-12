'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CadastroPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
        setError('Este email já está cadastrado. Faça login.')
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    if (data.user && !data.session) {
      setError('Ative a confirmação de email desabilitada no Supabase: Authentication → Providers → Email → desative "Confirm email"')
      setLoading(false)
      return
    }

    if (data.user && data.session) {
      const baseUsername = email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase()
      const username = `${baseUsername}_${Math.floor(Math.random() * 9000) + 1000}`

      const { error: profileError } = await supabase.from('academy_profiles').insert({
        id: data.user.id,
        username,
        email,
        xp: 0,
        level: 1,
        title: 'Iniciante',
        onboarding_complete: false,
      })

      if (profileError && !profileError.message.includes('duplicate')) {
        setError('Conta criada! Mas erro ao salvar perfil: ' + profileError.message)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(59,91,219,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12, filter: 'drop-shadow(0 0 12px rgba(59,91,219,0.8))' }}>✦</div>
          <div className="phase-badge" style={{ display: 'inline-flex' }}>SIRIUS ACADEMY</div>
        </div>

        <div className="glass-card auth-card-inner" style={{ padding: '40px 36px' }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Criar conta
          </h1>
          <p style={{ color: '#6B7A9E', fontSize: 15, marginBottom: 32 }}>
            Comece sua jornada de domínio da IA
          </p>

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6B7A9E', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em' }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6B7A9E', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em' }}>
                SENHA
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                  className="input-field"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: '#6B7A9E', display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: 8, padding: '12px 16px', color: '#FCA5A5', fontSize: 14,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 8, opacity: loading ? 0.7 : 1, fontSize: 16, padding: '14px' }}
            >
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, color: '#6B7A9E', fontSize: 14 }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: '#3B5BDB', textDecoration: 'none', fontWeight: 600 }}>
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
