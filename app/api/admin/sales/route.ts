import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'breno.nobre@gruporiomais.com.br'

// ── GET /api/admin/sales ───────────────────────────────────
// Retorna leads + compras para o painel admin.
// Protegido: só funciona se o usuário logado for o admin.
export async function GET(req: NextRequest) {
  try {
    // Verifica autenticação via header Authorization
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    // Valida o token e confere se é o admin
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token)
    if (authError || !user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Acesso negado' }, { status: 403 })
    }

    // Agora usa service role para buscar tudo
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const [leadsRes, purchasesRes] = await Promise.all([
      supabase
        .from('academy_checkout_leads')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('academy_purchases')
        .select('*')
        .order('created_at', { ascending: false }),
    ])

    return NextResponse.json({
      ok: true,
      leads: leadsRes.data ?? [],
      purchases: purchasesRes.data ?? [],
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    console.error('[admin/sales]', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
