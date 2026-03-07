'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        subscription.unsubscribe()

        const { data: profile } = await supabase
          .from('academy_profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          const email = session.user.email || ''
          const baseUsername = email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase()
          const username = `${baseUsername}_${Math.floor(Math.random() * 9000) + 1000}`
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

        router.push('/dashboard')
      }
    })

    // Fallback: se já tiver sessão ao chegar aqui
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        const { data: profile } = await supabase
          .from('academy_profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()
        if (!profile) {
          const email = session.user.email || ''
          const baseUsername = email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase()
          const username = `${baseUsername}_${Math.floor(Math.random() * 9000) + 1000}`
          await supabase.from('academy_profiles').insert({
            id: session.user.id, username, email,
            xp: 0, level: 1, title: 'Iniciante', onboarding_complete: false,
          })
        }
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
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
        Entrando com Google...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
