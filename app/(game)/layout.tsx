'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase, type Profile } from '@/lib/supabase'
import { getLevelInfo, getXPToNextLevel } from '@/lib/game-data'
import { AvatarIcon, InitialsAvatar, type AvatarId } from '@/components/Avatars'
import OnboardingModal from '@/components/OnboardingModal'
import {
  LayoutDashboard, User, LogOut, TrendingUp, BarChart2, Megaphone,
  BookOpen, ShieldCheck, Sparkles, Lock, Zap, Menu, X,
} from 'lucide-react'
import dynamic from 'next/dynamic'

const StarfieldCanvas = dynamic(() => import('@/components/StarfieldCanvas'), { ssr: false })

function SiriusLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="sirius-logo">
      <defs>
        <filter id="sg1" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sg2" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="19" y1="8"  x2="28" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="19" y1="8"  x2="10" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="28" y1="17" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="10" y1="17" x2="14" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="14" y1="27" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="19" y1="8"  x2="19" y2="3"  stroke="rgba(93,130,255,0.2)" strokeWidth="0.6"/>
      <line x1="28" y1="17" x2="34" y2="13" stroke="rgba(93,130,255,0.18)" strokeWidth="0.6"/>
      <circle cx="10" cy="17" r="1.3" fill="#7B9FFF" filter="url(#sg1)" />
      <circle cx="28" cy="17" r="1.3" fill="#7B9FFF" filter="url(#sg1)" />
      <circle cx="14" cy="27" r="1.1" fill="#5C7FFF" filter="url(#sg1)" />
      <circle cx="24" cy="27" r="1.1" fill="#5C7FFF" filter="url(#sg1)" />
      <circle cx="19" cy="3"  r="0.9" fill="#4A6AFF" />
      <circle cx="34" cy="13" r="0.7" fill="#4A6AFF" />
      <circle cx="19" cy="8" r="3.2" fill="#3B5BDB" filter="url(#sg2)" />
      <circle cx="19" cy="8" r="1.6" fill="#E8EEFF" />
    </svg>
  )
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Detecta mobile
  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fecha sidebar mobile ao navegar
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const loadProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { data } = await supabase.from('academy_profiles').select('*').eq('id', session.user.id).single()
    if (!data) { router.push('/login'); return }
    setProfile(data)
    if (!data.onboarding_complete) setShowOnboarding(true)
    if (session.user.email === 'breno.nobre@gruporiomais.com.br') setIsAdmin(true)
    setLoading(false)
  }, [router])

  useEffect(() => { loadProfile() }, [loadProfile])

  async function handleOnboardingComplete(displayName: string, avatarId: AvatarId) {
    if (!profile) return
    await supabase.from('academy_profiles').update({ onboarding_complete: true, display_name: displayName, avatar_id: avatarId }).eq('id', profile.id)
    setProfile(prev => prev ? { ...prev, display_name: displayName, avatar_id: avatarId, onboarding_complete: true } : null)
    setShowOnboarding(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const levelInfo = profile ? getLevelInfo(profile.xp) : null
  const xpInfo   = profile ? getXPToNextLevel(profile.xp) : null
  const displayName = profile?.display_name || profile?.username || 'Jogador'
  const avatarId    = profile?.avatar_id as AvatarId | null

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Meu Painel', color: '#3B5BDB' },
    { href: '/perfil',    icon: User,            label: 'Meu Perfil', color: '#7C3AED' },
  ]

  const areaItems = [
    { href: '/area/marketing',  icon: Megaphone,  label: 'Marketing',  color: '#3B5BDB' },
    { href: '/area/vendas',     icon: TrendingUp, label: 'Vendas',     color: '#059669' },
    { href: '/area/financeiro', icon: BarChart2,  label: 'Financeiro', color: '#D97706' },
  ]

  // Itens do menu inferior mobile
  const bottomNavItems = [
    { href: '/dashboard',    icon: LayoutDashboard, label: 'Início',  color: '#3B5BDB', match: (p: string) => p === '/dashboard' },
    { href: '/especializacoes', icon: Zap,          label: 'Cursos',  color: '#E85D04', match: (p: string) => p.startsWith('/especializacoes') || p.startsWith('/curso/') },
    { href: '/genialidade',  icon: Sparkles,         label: 'Gênio',  color: '#7C3AED', match: (p: string) => p.startsWith('/genialidade') },
    { href: '/perfil',       icon: User,             label: 'Perfil', color: '#7C3AED', match: (p: string) => p === '/perfil' },
  ]

  // ─── Sidebar content (shared between desktop and mobile drawer) ───
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none', marginBottom: 28, display: 'block' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 6px' }}>
          <SiriusLogo />
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              SIRIUS
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.14em' }}>
              ACADEMY
            </div>
          </div>
        </div>
      </Link>

      {/* Player card */}
      {profile && levelInfo && xpInfo && (
        <div style={{
          background: 'rgba(59,91,219,0.07)',
          border: '1px solid rgba(59,91,219,0.14)',
          borderRadius: 10, padding: '12px 14px', marginBottom: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            {avatarId ? <AvatarIcon id={avatarId} size={36} /> : <InitialsAvatar name={displayName} size={36} />}
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: levelInfo.color, marginTop: 1 }}>
                Nv.{profile.level} — {profile.title}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.06em' }}>XP</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{profile.xp}</span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
            <div className="xp-bar" style={{ width: `${xpInfo.percent}%`, height: '100%' }} />
          </div>
        </div>
      )}

      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 6px', marginBottom: 6 }}>
        Menu
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className={`nav-pill ${active ? 'active' : ''}`}>
                <div className="nav-icon" style={{
                  background: active ? `${item.color}18` : 'var(--muted-bg)',
                  border: `1px solid ${active ? item.color + '30' : 'var(--border)'}`,
                }}>
                  <Icon size={15} color={active ? item.color : 'var(--text-secondary)'} strokeWidth={2} />
                </div>
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div style={{ height: 1, background: 'var(--border)', margin: '14px 0 8px 0' }} />

      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 6px', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BookOpen size={9} color="var(--text-muted)" strokeWidth={2} />
          Áreas
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {areaItems.map(item => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className={`nav-pill ${active ? 'active' : ''}`}>
                <div className="nav-icon" style={{
                  background: active ? `${item.color}18` : 'var(--muted-bg)',
                  border: `1px solid ${active ? item.color + '30' : 'var(--border)'}`,
                }}>
                  <Icon size={15} color={active ? item.color : 'var(--text-secondary)'} strokeWidth={2} />
                </div>
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {isAdmin && (
        <>
          <div style={{ height: 1, background: 'var(--border)', margin: '14px 0 8px 0' }} />
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 6px', marginBottom: 6 }}>
            Admin
          </div>
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <div className={`nav-pill ${pathname === '/admin' ? 'active' : ''}`}>
              <div className="nav-icon" style={{
                background: pathname === '/admin' ? 'rgba(245,158,11,0.18)' : 'var(--muted-bg)',
                border: `1px solid ${pathname === '/admin' ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
              }}>
                <ShieldCheck size={15} color={pathname === '/admin' ? '#f59e0b' : 'var(--text-secondary)'} strokeWidth={2} />
              </div>
              <span>Painel de Alunos</span>
            </div>
          </Link>
        </>
      )}

      <div style={{ height: 1, background: 'var(--border)', margin: '14px 0 8px 0' }} />

      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 6px', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={9} color="var(--text-muted)" strokeWidth={2} />
          Ferramentas
        </div>
      </div>

      <Link href="/genialidade" style={{ textDecoration: 'none' }}>
        <div className={`nav-pill ${pathname.startsWith('/genialidade') ? 'active' : ''}`}>
          <div className="nav-icon" style={{
            background: pathname.startsWith('/genialidade') ? 'rgba(124,58,237,0.18)' : 'var(--muted-bg)',
            border: `1px solid ${pathname.startsWith('/genialidade') ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
          }}>
            {isAdmin
              ? <Sparkles size={15} color={pathname.startsWith('/genialidade') ? '#7C3AED' : 'var(--text-secondary)'} strokeWidth={2} />
              : <Lock size={15} color="var(--text-muted)" strokeWidth={2} />
            }
          </div>
          <span style={{ color: isAdmin ? undefined : 'var(--text-muted)' }}>Zona de Genio</span>
        </div>
      </Link>

      <Link href="/especializacoes" style={{ textDecoration: 'none' }}>
        <div className={`nav-pill ${pathname.startsWith('/especializacoes') || pathname.startsWith('/curso/') ? 'active' : ''}`}>
          <div className="nav-icon" style={{
            background: (pathname.startsWith('/especializacoes') || pathname.startsWith('/curso/')) ? 'rgba(232,93,4,0.18)' : 'var(--muted-bg)',
            border: `1px solid ${(pathname.startsWith('/especializacoes') || pathname.startsWith('/curso/')) ? 'rgba(232,93,4,0.3)' : 'var(--border)'}`,
          }}>
            <Zap size={15} color={(pathname.startsWith('/especializacoes') || pathname.startsWith('/curso/')) ? '#E85D04' : 'var(--text-secondary)'} strokeWidth={2} />
          </div>
          <span>Especializacoes</span>
        </div>
      </Link>

      <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />

      <button onClick={handleLogout} className="nav-pill" style={{ border: 'none' }}>
        <div className="nav-icon" style={{ background: 'var(--muted-bg)', border: '1px solid var(--border)' }}>
          <LogOut size={14} color="var(--text-secondary)" strokeWidth={2} />
        </div>
        <span>Sair</span>
      </button>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

      <StarfieldCanvas />

      {showOnboarding && profile && (
        <OnboardingModal userId={profile.id} onComplete={handleOnboardingComplete} />
      )}

      {/* ── DESKTOP: Sidebar fixa ── */}
      {!isMobile && (
        <aside style={{
          width: 220,
          background: 'rgba(8,12,24,0.9)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 12px',
          position: 'fixed',
          top: 0, bottom: 0, left: 0,
          zIndex: 50,
          overflowY: 'auto',
          backdropFilter: 'blur(12px)',
        }}>
          <SidebarContent />
        </aside>
      )}

      {/* ── MOBILE: Hamburger header + Drawer ── */}
      {isMobile && (
        <>
          {/* Top bar mobile */}
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80,
            height: 56,
            background: 'rgba(8,12,24,0.95)',
            borderBottom: '1px solid var(--sidebar-border)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
          }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <SiriusLogo />
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: 'var(--text-primary)', letterSpacing: '0.05em', lineHeight: 1.1 }}>SIRIUS</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 8, color: 'var(--text-secondary)', letterSpacing: '0.14em' }}>ACADEMY</div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                background: 'var(--muted-bg)', border: '1px solid var(--border)',
                borderRadius: 8, width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-secondary)',
              }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Drawer overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 90,
                background: 'rgba(4,6,15,0.7)',
                backdropFilter: 'blur(4px)',
              }}
            />
          )}

          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 56, left: 0, bottom: 0, zIndex: 95,
            width: 240,
            background: 'rgba(8,12,24,0.98)',
            borderRight: '1px solid var(--sidebar-border)',
            backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column',
            padding: '20px 12px 100px',
            overflowY: 'auto',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s cubic-bezier(0.32,0,0.15,1)',
          }}>
            <SidebarContent />
          </div>

          {/* ── Bottom Navigation mobile ── */}
          <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80,
            height: 64,
            background: 'rgba(8,12,24,0.97)',
            borderTop: '1px solid var(--sidebar-border)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'stretch',
          }}>
            {bottomNavItems.map(item => {
              const active = item.match(pathname)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    flex: 1,
                    textDecoration: 'none',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 4,
                    position: 'relative',
                    transition: 'opacity 0.15s',
                  }}
                >
                  {/* Indicador ativo */}
                  {active && (
                    <div style={{
                      position: 'absolute', top: 0, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 32, height: 2,
                      background: item.color,
                      borderRadius: '0 0 4px 4px',
                      boxShadow: `0 0 8px ${item.color}`,
                    }} />
                  )}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? `${item.color}18` : 'transparent',
                    transition: 'background 0.15s',
                  }}>
                    <Icon
                      size={20}
                      color={active ? item.color : 'var(--text-muted)'}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: active ? 700 : 500,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: active ? item.color : 'var(--text-muted)',
                    letterSpacing: '0.04em',
                  }}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </>
      )}

      {/* ── Main content ── */}
      <main style={{
        marginLeft: isMobile ? 0 : 220,
        flex: 1,
        minHeight: '100vh',
        paddingTop: isMobile ? 56 : 0,
        paddingBottom: isMobile ? 64 : 0,
      }}>
        {children}
      </main>
    </div>
  )
}
