import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// ── POST /api/asaas/webhook ────────────────────────────────
// Asaas envia eventos aqui quando o status do pagamento muda.
// O token configurado no Asaas é validado via header asaas-access-token.
export async function POST(req: NextRequest) {
  try {
    // Valida o token de autenticação enviado pelo Asaas em cada requisição
    const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN
    if (webhookToken) {
      const receivedToken = req.headers.get('asaas-access-token')
      if (receivedToken !== webhookToken) {
        console.warn('[asaas/webhook] Token inválido recebido')
        return NextResponse.json({ ok: false }, { status: 401 })
      }
    }

    const body = await req.json()

    const event = body?.event as string | undefined
    const payment = body?.payment

    if (!event || !payment?.id) {
      return NextResponse.json({ ok: true }) // ignora eventos sem dados relevantes
    }

    // Só nos interessa confirmação de pagamento
    if (event !== 'PAYMENT_RECEIVED' && event !== 'PAYMENT_CONFIRMED') {
      return NextResponse.json({ ok: true })
    }

    const asaasPaymentId = payment.id as string

    // Atualiza o status para 'pago' na tabela academy_purchases
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('academy_purchases')
      .update({
        status: 'pago',
        paid_at: new Date().toISOString(),
      })
      .eq('asaas_payment_id', asaasPaymentId)
      .eq('status', 'pendente') // só atualiza se ainda pendente

    if (error) {
      console.error('[asaas/webhook] DB error:', error.message)
      return NextResponse.json({ ok: false }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    console.error('[asaas/webhook]', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
