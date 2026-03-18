import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  email: string | null
  display_name: string | null
  avatar_id: string | null
  xp: number
  level: number
  title: string
  onboarding_complete: boolean
  role?: string
  created_at: string
}

export type UserProgress = {
  id: string
  user_id: string
  phase_id: number
  module_id: string
  completed: boolean
  xp_earned: number
  completed_at: string | null
}
