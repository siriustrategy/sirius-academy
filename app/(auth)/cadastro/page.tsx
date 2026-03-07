'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export default function CadastroPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

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

  async function handleGoogleSignUp() {
    setGoogleLoading(true)
    setError('')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
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

        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Criar conta
          </h1>
          <p style={{ color: '#6B7A9E', fontSize: 15, marginBottom: 32 }}>
            Comece sua jornada de domínio da IA
          </p>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '13px 20px',
              color: '#E8EEFF',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15,
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              opacity: googleLoading ? 0.7 : 1,
              marginBottom: 20,
              transition: 'all 0.2s',
            }}
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecionando...' : 'Criar conta com Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(59,91,219,0.15)' }} />
            <span style={{ color: '#4A5680', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>ou com email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(59,91,219,0.15)' }} />
          </div>

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
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                className="input-field"
              />
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
