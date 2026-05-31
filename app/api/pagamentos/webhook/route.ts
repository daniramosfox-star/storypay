import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Verifica assinatura HMAC do webhook Pagar.me
function verificarAssinatura(payload: string, signature: string): boolean {
  const secret = process.env.PAGARME_WEBHOOK_SECRET
  if (!secret) return true // skip em dev sem secret configurado

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature.replace('sha256=', ''), 'hex')
  )
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-hub-signature') ?? ''

  if (!verificarAssinatura(rawBody, signature)) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const supabase = await createClient()

  try {
    // ----------------------------------------------------------------
    // PIX pago — creditar saldo da marca
    // ----------------------------------------------------------------
    if (event.type === 'order.paid') {
      const order = event.data
      const userId = order.metadata?.user_id

      if (!userId) {
        return NextResponse.json({ ok: true })
      }

      const valorReais = order.amount / 100

      // Credita saldo no profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('saldo')
        .eq('id', userId)
        .single()

      const novoSaldo = (profile?.saldo ?? 0) + valorReais

      await supabase
        .from('profiles')
        .update({ saldo: novoSaldo })
        .eq('id', userId)

      // Atualiza transação para confirmada
      await supabase
        .from('transacoes')
        .update({ descricao: `Depósito PIX confirmado — Ordem ${order.id}` })
        .eq('user_id', userId)
        .like('descricao', `%${order.id}%`)

      // Notifica o usuário
      await supabase.from('notificacoes').insert({
        user_id: userId,
        titulo: 'Depósito confirmado!',
        mensagem: `R$ ${valorReais.toFixed(2)} adicionados ao seu saldo. Pronto para criar campanhas!`,
      })

      console.log(`[WEBHOOK] Depósito R$ ${valorReais} creditado para ${userId}`)
    }

    // ----------------------------------------------------------------
    // Entrega confirmada — liberar pagamento ao influencer
    // ----------------------------------------------------------------
    if (event.type === 'transfer.paid') {
      const transfer = event.data
      console.log(`[WEBHOOK] Transferência ${transfer.id} confirmada`)
      // Transfer status já atualizado via API route /saque
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[WEBHOOK]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
