'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError('Email ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        position: 'fixed', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
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
            Bem-vindo de volta
          </h1>
          <p style={{ color: '#6B7A9E', fontSize: 15, marginBottom: 32 }}>
            Continue de onde parou
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A9E', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>
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
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A9E', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>
                SENHA
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                className="input-field"
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: 8, padding: '12px 16px',
                color: '#FCA5A5', fontSize: 14,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, color: '#6B7A9E', fontSize: 14 }}>
            Ainda não tem conta?{' '}
            <Link href="/cadastro" style={{ color: '#3B5BDB', textDecoration: 'none', fontWeight: 600 }}>
              Criar conta grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
