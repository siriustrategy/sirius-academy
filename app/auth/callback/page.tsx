'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    async function handle() {
      // 1. Se houver ?code= na URL (PKCE flow), troca pelo token
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      }

      // 2. Aguarda a sessão ficar disponível (até 3 seg)
      let session = null
      for (let i = 0; i < 10; i++) {
        const { data } = await supabase.auth.getSession()
        if (data.session) { session = data.session; break }
        await new Promise(r => setTimeout(r, 300))
      }

      if (!session) {
        router.replace('/login')
        return
      }

      // 3. Cria perfil se ainda não existir
      const { data: profile } = await supabase
        .from('academy_profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        const email = session.user.email || ''
        const base = email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase()
        const username = `${base}_${Math.floor(Math.random() * 9000) + 1000}`
        await supabase.from('academy_profiles').insert({
          id: session.user.id,
          username,
          email,
          xp: 0,
          level: 1,
          title: 'Iniciante',
          onboarding_complete: false,
        })
      }

      router.replace('/dashboard')
    }

    handle()
  }, [router])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: '#080C18',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid rgba(59,91,219,0.2)',
        borderTopColor: '#3B5BDB',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#6B7A9E', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>
        Autenticando com Google...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
