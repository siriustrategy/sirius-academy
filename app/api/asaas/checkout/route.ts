import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// ── Config Asaas ──────────────────────────────────────────
const ASAAS_BASE =
  process.env.ASAAS_ENV === 'production'
    ? 'https://api.asaas.com/api/v3'
    : 'https://sandbox.asaas.com/api/v3'

const ASAAS_KEY = process.env.ASAAS_API_KEY!

// ── Preços ────────────────────────────────────────────────
const PRECOS: Record<string, number> = {
  genialidade: 12.90,
  curso: 4.90,
}

// ── Helper fetch Asaas ────────────────────────────────────
async function asaas(path: string, method = 'GET', body?: object) {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      access_token: ASAAS_KEY,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json?.errors?.[0]?.description ?? json?.message ?? 'Erro Asaas'
    throw new Error(msg)
  }
  return json
}

function today() {
  return new Date().toISOString().split('T')[0]
}

// ── POST /api/asaas/checkout ──────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      // Identificação do usuário e produto
      userId,
      produtoTipo,   // 'genialidade' | 'curso'
      cursoId,       // ex: 'lovable-supabase' (null para genialidade)
      // Dados pessoais
      nome,
      cpf,
      email,
      telefone,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      complemento,
      // Pagamento
      metodo,        // 'card' | 'pix' | 'boleto'
      cartaoNome,
      cartaoNumero,
      cartaoMes,
      cartaoAno,
      cartaoCVV,
    } = body

    if (!userId) return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 })
    if (!produtoTipo || !PRECOS[produtoTipo]) {
      return NextResponse.json({ ok: false, error: 'Produto inválido' }, { status: 400 })
    }

    const valor = PRECOS[produtoTipo]
    const cpfDigits    = cpf.replace(/\D/g, '')
    const phoneDigits  = telefone.replace(/\D/g, '')
    const cepDigits    = cep.replace(/\D/g, '')

    const descricao =
      produtoTipo === 'genialidade'
        ? 'Zona de Genialidade — Sirius Academy'
        : `Curso: ${cursoId} — Sirius Academy`

    // ── 1. Criar cliente no Asaas ─────────────────────────
    const customer = await asaas('/customers', 'POST', {
      name: nome,
      cpfCnpj: cpfDigits,
      email,
      mobilePhone: phoneDigits,
      postalCode: cepDigits,
      address: logradouro,
      addressNumber: numero,
      complement: complemento || '',
      province: bairro,
      notificationDisabled: false,
    })

    // ── 2. Criar PAGAMENTO ÚNICO (não assinatura) ─────────
    const billingType =
      metodo === 'card' ? 'CREDIT_CARD'
      : metodo === 'pix' ? 'PIX'
      : 'BOLETO'

    const paymentPayload: Record<string, unknown> = {
      customer: customer.id,
      billingType,
      value: valor,
      dueDate: today(),
      description: descricao,
    }

    if (metodo === 'card') {
      paymentPayload.creditCard = {
        holderName: cartaoNome,
        number: cartaoNumero.replace(/\s/g, ''),
        expiryMonth: cartaoMes,
        expiryYear: cartaoAno.length === 2 ? `20${cartaoAno}` : cartaoAno,
        ccv: cartaoCVV,
      }
      paymentPayload.creditCardHolderInfo = {
        name: nome,
        email,
        cpfCnpj: cpfDigits,
        postalCode: cepDigits,
        addressNumber: numero,
        phone: phoneDigits,
      }
    }

    const payment = await asaas('/payments', 'POST', paymentPayload)

    // ── 3. Buscar QR Code Pix / URL Boleto ───────────────
    let pixQrCode: string | null = null
    let pixCopyCola: string | null = null
    let boletoUrl: string | null = null
    let boletoLinhaDigitavel: string | null = null

    if (metodo === 'pix') {
      await new Promise(r => setTimeout(r, 1000))
      try {
        const pixRes = await asaas(`/payments/${payment.id}/pixQrCode`, 'GET')
        pixQrCode   = pixRes.encodedImage ?? null
        pixCopyCola = pixRes.payload ?? null
      } catch {
        // PIX pode demorar para gerar o QR
      }
    }

    if (metodo === 'boleto') {
      boletoUrl            = payment.bankSlipUrl ?? null
      boletoLinhaDigitavel = payment.nossoNumero ?? null
    }

    // ── 4. Registrar compra no Supabase ───────────────────
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const statusInicial = metodo === 'card' ? 'pago' : 'pendente'

    const { error: dbError } = await supabase.from('academy_purchases').insert({
      user_id: userId,
      produto_tipo: produtoTipo,
      curso_id: cursoId ?? null,
      status: statusInicial,
      valor,
      metodo_pagamento: metodo,
      asaas_payment_id: payment.id,
      asaas_customer_id: customer.id,
      paid_at: statusInicial === 'pago' ? new Date().toISOString() : null,
    })

    if (dbError) console.error('[purchase-db]', dbError.message)

    // ── 5. Retornar ───────────────────────────────────────
    return NextResponse.json({
      ok: true,
      metodo,
      status: statusInicial,
      asaasPaymentId: payment.id,
      asaasCustomerId: customer.id,
      pixQrCode,
      pixCopyCola,
      boletoUrl,
      boletoLinhaDigitavel,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    console.error('[asaas/checkout]', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
