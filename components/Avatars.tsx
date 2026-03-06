'use client'

// Avatars via DiceBear API — estilo "bottts-neutral" (robôs geométricos, visual profissional)
// Docs: https://www.dicebear.com/styles/bottts-neutral

export type AvatarId =
  | 'neutron' | 'orion' | 'vega' | 'sirius' | 'atlas'
  | 'nova' | 'pulsar' | 'quasar' | 'zenith'

export const AVATARS: { id: AvatarId; label: string; color: string; bg: string }[] = [
  { id: 'neutron', label: 'Neutron',  color: '#3B5BDB', bg: '1e2a4a' },
  { id: 'orion',   label: 'Orion',   color: '#7C3AED', bg: '2a1a4a' },
  { id: 'vega',    label: 'Vega',    color: '#059669', bg: '0a2a1e' },
  { id: 'sirius',  label: 'Sirius',  color: '#0891B2', bg: '0a1e2a' },
  { id: 'atlas',   label: 'Atlas',   color: '#DC2626', bg: '2a0a0a' },
  { id: 'nova',    label: 'Nova',    color: '#D97706', bg: '2a1a0a' },
  { id: 'pulsar',  label: 'Pulsar',  color: '#9333EA', bg: '1e0a2a' },
  { id: 'quasar',  label: 'Quasar',  color: '#0E7490', bg: '0a1a2a' },
  { id: 'zenith',  label: 'Zenith',  color: '#16A34A', bg: '0a2a12' },
]

const FALLBACK: typeof AVATARS[0] = AVATARS[0]

function dicebearUrl(seed: string, bg: string, size: number) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&size=${size}&backgroundColor=${bg}&backgroundType=solid`
}

type AvatarIconProps = {
  id: string
  size?: number
  selected?: boolean
}

export function AvatarIcon({ id, size = 48, selected = false }: AvatarIconProps) {
  const meta = AVATARS.find(a => a.id === id) ?? FALLBACK
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: selected ? `0 0 0 3px white, 0 0 0 5px ${meta.color}` : 'none',
      border: `2px solid ${meta.color}40`,
      background: `#${meta.bg}`,
    }}>
      <img
        src={dicebearUrl(id, meta.bg, size)}
        alt={meta.label}
        width={size}
        height={size}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}

// Initials fallback (usado antes de escolher avatar)
export function InitialsAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const initial = name?.[0]?.toUpperCase() ?? '?'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700,
      fontFamily: 'Space Grotesk, sans-serif',
      color: '#E8EEFF', flexShrink: 0,
    }}>
      {initial}
    </div>
  )
}
