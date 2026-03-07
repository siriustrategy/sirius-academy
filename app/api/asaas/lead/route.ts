import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// ── POST /api/asaas/lead ───────────────────────────────────
// Salva o lead quando o usuário avança do step 1 para o step 2 do checkout.
// Chamado mesmo que o usuário não finalize o pagamento (carrinho abandonado).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, nome, email, telefone, produtoTipo, cursoId } = body

    if (!email || !nome || !produtoTipo) {
      return NextResponse.json({ ok: false, error: 'Dados incompletos' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Upsert — se o mesmo usuário/email retornar ao carrinho, atualiza em vez de duplicar
    const { error } = await supabase.from('academy_checkout_leads').upsert(
      {
        user_id: userId ?? null,
        nome,
        email,
        telefone: telefone ?? null,
        produto_tipo: produtoTipo,
        curso_id: cursoId ?? null,
      },
      {
        onConflict: 'user_id,produto_tipo',
        ignoreDuplicates: false,
      }
    )

    if (error) {
      // Fallback: se upsert falhar (ex: sem unique constraint), faz insert simples
      await supabase.from('academy_checkout_leads').insert({
        user_id: userId ?? null,
        nome,
        email,
        telefone: telefone ?? null,
        produto_tipo: produtoTipo,
        curso_id: cursoId ?? null,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    console.error('[asaas/lead]', msg)
    // Não bloqueia o fluxo do usuário — retorna ok mesmo em erro
    return NextResponse.json({ ok: true })
  }
}
