'use client'

// 9 Animal Avatars — Sirius Academy Brand
// Style: geometric flat icons, dark futuristic, Sirius palette

export type AvatarId = 'tiger' | 'hawk' | 'croc' | 'rhino' | 'bull' | 'elephant' | 'shark' | 'cobra' | 'wolf'

export const AVATARS: { id: AvatarId; label: string; color: string; gradient: [string, string] }[] = [
  { id: 'tiger',    label: 'Tigre',        color: '#F97316', gradient: ['#EA580C', '#DC2626'] },
  { id: 'hawk',     label: 'Gavião',       color: '#3B5BDB', gradient: ['#3B5BDB', '#7C3AED'] },
  { id: 'croc',     label: 'Crocodilo',    color: '#059669', gradient: ['#047857', '#065F46'] },
  { id: 'rhino',    label: 'Rinoceronte',  color: '#6B7A9E', gradient: ['#4B5563', '#374151'] },
  { id: 'bull',     label: 'Touro',        color: '#DC2626', gradient: ['#B91C1C', '#7F1D1D'] },
  { id: 'elephant', label: 'Elefante',     color: '#7C3AED', gradient: ['#6D28D9', '#4C1D95'] },
  { id: 'shark',    label: 'Tubarão',      color: '#0891B2', gradient: ['#0E7490', '#155E75'] },
  { id: 'cobra',    label: 'Cobra',        color: '#16A34A', gradient: ['#15803D', '#14532D'] },
  { id: 'wolf',     label: 'Lobo',         color: '#9333EA', gradient: ['#7E22CE', '#581C87'] },
]

type AvatarIconProps = {
  id: AvatarId
  size?: number
  selected?: boolean
}

// Each icon is a 100x100 viewBox SVG
function TigerIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Head */}
      <ellipse cx="50" cy="52" rx="28" ry="26" fill="white" fillOpacity="0.9"/>
      {/* Ears */}
      <polygon points="28,32 22,14 38,24" fill="white" fillOpacity="0.9"/>
      <polygon points="72,32 78,14 62,24" fill="white" fillOpacity="0.9"/>
      <polygon points="30,30 25,18 37,25" fill="currentColor" fillOpacity="0.5"/>
      <polygon points="70,30 75,18 63,25" fill="currentColor" fillOpacity="0.5"/>
      {/* Stripes */}
      <rect x="38" y="36" width="4" height="14" rx="2" fill="currentColor" fillOpacity="0.5" transform="rotate(-8 40 43)"/>
      <rect x="58" y="36" width="4" height="14" rx="2" fill="currentColor" fillOpacity="0.5" transform="rotate(8 60 43)"/>
      <rect x="47" y="34" width="6" height="10" rx="2" fill="currentColor" fillOpacity="0.4"/>
      {/* Eyes */}
      <ellipse cx="40" cy="48" rx="5" ry="5.5" fill="#1a1a2e"/>
      <ellipse cx="60" cy="48" rx="5" ry="5.5" fill="#1a1a2e"/>
      <circle cx="41" cy="47" r="1.5" fill="white"/>
      <circle cx="61" cy="47" r="1.5" fill="white"/>
      {/* Nose */}
      <ellipse cx="50" cy="58" rx="4" ry="3" fill="currentColor" fillOpacity="0.6"/>
      {/* Whiskers */}
      <line x1="22" y1="57" x2="44" y2="58" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="56" y1="58" x2="78" y2="57" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function HawkIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Wings spread */}
      <path d="M50 55 L12 35 L20 50 L50 58 Z" fill="white" fillOpacity="0.85"/>
      <path d="M50 55 L88 35 L80 50 L50 58 Z" fill="white" fillOpacity="0.85"/>
      {/* Body */}
      <ellipse cx="50" cy="60" rx="10" ry="14" fill="white" fillOpacity="0.9"/>
      {/* Head */}
      <circle cx="50" cy="42" r="12" fill="white" fillOpacity="0.95"/>
      {/* Beak */}
      <path d="M46 44 L54 44 L50 52 Z" fill="currentColor" fillOpacity="0.7"/>
      {/* Eyes */}
      <circle cx="44" cy="40" r="3.5" fill="#1a1a2e"/>
      <circle cx="56" cy="40" r="3.5" fill="#1a1a2e"/>
      <circle cx="45" cy="39" r="1" fill="white"/>
      <circle cx="57" cy="39" r="1" fill="white"/>
      {/* Wing details */}
      <path d="M20 50 L35 47 L50 55" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" fill="none"/>
      <path d="M80 50 L65 47 L50 55" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" fill="none"/>
    </svg>
  )
}

function CrocIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Body */}
      <ellipse cx="50" cy="58" rx="22" ry="10" fill="white" fillOpacity="0.85"/>
      {/* Head - long snout */}
      <path d="M28 50 L72 50 L72 44 L50 38 L28 44 Z" fill="white" fillOpacity="0.9"/>
      {/* Snout */}
      <path d="M28 46 L15 48 L15 54 L28 52 Z" fill="white" fillOpacity="0.9"/>
      <path d="M72 46 L85 48 L85 54 L72 52 Z" fill="white" fillOpacity="0.9"/>
      {/* Teeth */}
      <path d="M20 52 L22 58 L24 52" fill="currentColor" fillOpacity="0.5"/>
      <path d="M76 52 L78 58 L80 52" fill="currentColor" fillOpacity="0.5"/>
      {/* Scales */}
      <rect x="38" y="53" width="5" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/>
      <rect x="46" y="53" width="5" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/>
      <rect x="54" y="53" width="5" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/>
      {/* Eyes - on top of head */}
      <circle cx="38" cy="42" r="4" fill="#1a1a2e"/>
      <circle cx="62" cy="42" r="4" fill="#1a1a2e"/>
      <circle cx="39" cy="41" r="1.2" fill="white"/>
      <circle cx="63" cy="41" r="1.2" fill="white"/>
      {/* Nostrils */}
      <circle cx="30" cy="48" r="1.5" fill="currentColor" fillOpacity="0.5"/>
      <circle cx="70" cy="48" r="1.5" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  )
}

function RhinoIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Head */}
      <ellipse cx="52" cy="55" rx="26" ry="24" fill="white" fillOpacity="0.9"/>
      {/* Snout */}
      <ellipse cx="34" cy="60" rx="12" ry="10" fill="white" fillOpacity="0.95"/>
      {/* Horn */}
      <path d="M26 54 L28 28 L38 54 Z" fill="white" fillOpacity="0.95"/>
      <path d="M38 54 L40 40 L46 54 Z" fill="white" fillOpacity="0.7"/>
      {/* Ear */}
      <path d="M72 38 L80 22 L78 42 Z" fill="white" fillOpacity="0.9"/>
      {/* Eye */}
      <circle cx="60" cy="50" r="6" fill="#1a1a2e"/>
      <circle cx="61.5" cy="49" r="1.8" fill="white"/>
      {/* Skin folds */}
      <path d="M44 42 Q50 38 58 42" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M42 48 Q50 44 60 48" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Nostril */}
      <ellipse cx="30" cy="64" rx="3" ry="2" fill="currentColor" fillOpacity="0.4"/>
    </svg>
  )
}

function BullIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Horns */}
      <path d="M28 40 Q14 20 22 10 Q32 20 36 36" fill="white" fillOpacity="0.9"/>
      <path d="M72 40 Q86 20 78 10 Q68 20 64 36" fill="white" fillOpacity="0.9"/>
      {/* Head */}
      <ellipse cx="50" cy="57" rx="28" ry="26" fill="white" fillOpacity="0.9"/>
      {/* Muzzle */}
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="white" fillOpacity="1"/>
      <ellipse cx="44" cy="68" rx="4" ry="3" fill="currentColor" fillOpacity="0.4"/>
      <ellipse cx="56" cy="68" rx="4" ry="3" fill="currentColor" fillOpacity="0.4"/>
      {/* Eyes */}
      <circle cx="38" cy="50" r="6" fill="#1a1a2e"/>
      <circle cx="62" cy="50" r="6" fill="#1a1a2e"/>
      <circle cx="39.5" cy="49" r="2" fill="white"/>
      <circle cx="63.5" cy="49" r="2" fill="white"/>
      {/* Ears */}
      <ellipse cx="22" cy="50" rx="7" ry="10" fill="white" fillOpacity="0.85"/>
      <ellipse cx="78" cy="50" rx="7" ry="10" fill="white" fillOpacity="0.85"/>
    </svg>
  )
}

function ElephantIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Big ear left */}
      <ellipse cx="22" cy="50" rx="16" ry="20" fill="white" fillOpacity="0.8"/>
      {/* Head */}
      <ellipse cx="55" cy="46" rx="26" ry="24" fill="white" fillOpacity="0.9"/>
      {/* Trunk */}
      <path d="M38 58 Q30 70 36 82 Q44 90 50 82 Q52 72 44 62 Z" fill="white" fillOpacity="0.9"/>
      {/* Tusk */}
      <path d="M44 62 Q36 74 42 84" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.7"/>
      {/* Eye */}
      <circle cx="62" cy="40" r="6" fill="#1a1a2e"/>
      <circle cx="63.5" cy="39" r="1.8" fill="white"/>
      {/* Ear detail */}
      <path d="M14 44 Q22 52 18 62" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" fill="none"/>
    </svg>
  )
}

function SharkIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Body */}
      <path d="M10 55 Q50 40 85 55 Q50 65 10 55 Z" fill="white" fillOpacity="0.9"/>
      {/* Tail */}
      <path d="M82 52 L96 38 L96 70 Z" fill="white" fillOpacity="0.85"/>
      {/* Dorsal fin */}
      <path d="M40 52 L48 20 L60 52 Z" fill="white" fillOpacity="0.95"/>
      {/* Pectoral fin */}
      <path d="M30 56 L22 72 L45 60 Z" fill="white" fillOpacity="0.8"/>
      {/* Mouth */}
      <path d="M14 56 Q20 64 30 62" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Teeth */}
      <path d="M16 58 L18 64 L20 58" fill="currentColor" fillOpacity="0.5"/>
      <path d="M20 58 L22 64 L24 58" fill="currentColor" fillOpacity="0.5"/>
      {/* Eye */}
      <circle cx="24" cy="52" r="4" fill="#1a1a2e"/>
      <circle cx="25" cy="51" r="1.2" fill="white"/>
      {/* Gill lines */}
      <path d="M35 48 Q33 55 35 62" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" fill="none"/>
      <path d="M39 47 Q37 55 39 63" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" fill="none"/>
    </svg>
  )
}

function CobraIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Hood spread */}
      <path d="M50 38 Q28 30 20 50 Q28 46 50 50 Q72 46 80 50 Q72 30 50 38 Z" fill="white" fillOpacity="0.9"/>
      {/* Hood pattern */}
      <path d="M50 38 Q42 40 38 48 Q50 46 62 48 Q58 40 50 38 Z" fill="currentColor" fillOpacity="0.25"/>
      {/* Head */}
      <ellipse cx="50" cy="52" rx="14" ry="11" fill="white" fillOpacity="0.95"/>
      {/* Body coiled */}
      <path d="M50 62 Q70 68 68 80 Q60 90 46 86 Q30 80 32 68 Q38 62 50 65" stroke="white" strokeOpacity="0.85" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Eyes */}
      <circle cx="44" cy="50" r="3.5" fill="#1a1a2e"/>
      <circle cx="56" cy="50" r="3.5" fill="#1a1a2e"/>
      <circle cx="44.8" cy="49.2" r="1" fill="white"/>
      <circle cx="56.8" cy="49.2" r="1" fill="white"/>
      {/* Forked tongue */}
      <path d="M46 58 L50 64 L52 62 M50 64 L54 66" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function WolfIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {/* Ears pointed */}
      <path d="M32 40 L22 14 L46 32 Z" fill="white" fillOpacity="0.9"/>
      <path d="M68 40 L78 14 L54 32 Z" fill="white" fillOpacity="0.9"/>
      <path d="M34 38 L26 18 L44 32 Z" fill="currentColor" fillOpacity="0.3"/>
      <path d="M66 38 L74 18 L56 32 Z" fill="currentColor" fillOpacity="0.3"/>
      {/* Head */}
      <ellipse cx="50" cy="56" rx="26" ry="24" fill="white" fillOpacity="0.9"/>
      {/* Snout */}
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="white" fillOpacity="1"/>
      {/* Nose */}
      <path d="M44 60 Q50 57 56 60 L54 64 Q50 66 46 64 Z" fill="#1a1a2e"/>
      {/* Eyes */}
      <ellipse cx="39" cy="51" rx="5.5" ry="5" fill="#1a1a2e"/>
      <ellipse cx="61" cy="51" rx="5.5" ry="5" fill="#1a1a2e"/>
      <circle cx="40.5" cy="50" r="1.8" fill="white"/>
      <circle cx="62.5" cy="50" r="1.8" fill="white"/>
      {/* Fur marks */}
      <path d="M36 44 Q50 40 64 44" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

const ICON_MAP: Record<AvatarId, React.FC> = {
  tiger: TigerIcon,
  hawk: HawkIcon,
  croc: CrocIcon,
  rhino: RhinoIcon,
  bull: BullIcon,
  elephant: ElephantIcon,
  shark: SharkIcon,
  cobra: CobraIcon,
  wolf: WolfIcon,
}

export function AvatarIcon({ id, size = 48, selected = false }: AvatarIconProps) {
  const meta = AVATARS.find(a => a.id === id)!
  const Icon = ICON_MAP[id]
  const pad = size * 0.1

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: pad,
      boxShadow: selected ? `0 0 0 3px white, 0 0 0 5px ${meta.color}` : 'none',
      flexShrink: 0,
      color: meta.color,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Icon />
    </div>
  )
}

// Initials fallback (used before avatar is set)
export function InitialsAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const initial = name?.[0]?.toUpperCase() ?? '?'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 700,
      fontFamily: 'Space Grotesk, sans-serif',
      color: '#E8EEFF',
      flexShrink: 0,
    }}>
      {initial}
    </div>
  )
}
