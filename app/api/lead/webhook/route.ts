import { NextRequest, NextResponse } from 'next/server'
import { verificarPagamento, type InfinitePayWebhookPayload } from '@/lib/infinitepay/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const payload: InfinitePayWebhookPayload = await req.json()
    console.log('[WEBHOOK INFINITEPAY]', payload.order_nsu, payload.capture_method)

    // Só processa pedidos do Frepay
    const orderNsu = payload.order_nsu
    if (!orderNsu?.startsWith('frepay-')) {
      return NextResponse.json({ ok: true })
    }

    const leadId = orderNsu.replace('frepay-', '')

    // Confirma pagamento diretamente na API (não confia só no webhook)
    let statusConfirmado
    try {
      statusConfirmado = await verificarPagamento(orderNsu)
      if (statusConfirmado.status !== 'paid') {
        return NextResponse.json({ ok: true }) // ainda não pago
      }
    } catch {
      // Se falhar a verificação, usa o payload do webhook mesmo
      if (!payload.paid_amount || payload.paid_amount < payload.amount) {
        return NextResponse.json({ ok: true })
      }
    }

    const supabase = await createClient()

    // Evita processar duas vezes
    const { data: lead } = await supabase
      .from('leads')
      .select('pago, prestador_id, pedido_id')
      .eq('id', leadId)
      .single()

    if (!lead || lead.pago) {
      return NextResponse.json({ ok: true })
    }

    // Marca como pago e revela contato
    await supabase.from('leads').update({
      pago: true,
      contato_revelado: true,
      payment_id: payload.invoice_slug,
    }).eq('id', leadId)

    // Busca info da categoria para a transação
    const { data: pedido } = await supabase
      .from('pedidos')
      .select('categoria_id, cliente_telefone, cliente_nome')
      .eq('id', lead.pedido_id)
      .single()

    // Registra transação financeira
    await supabase.from('transacoes').insert({
      prestador_id: lead.prestador_id,
      tipo: 'compra_lead',
      valor: -(payload.paid_amount / 100), // converte centavos
      descricao: `Lead pago via InfinitePay (${payload.capture_method ?? 'pix'}) — ${pedido?.categoria_id ?? ''}`,
      lead_id: leadId,
    })

    // Notifica prestador em tempo real via Supabase Realtime
    await supabase.channel(`prestador-${lead.prestador_id}`).send({
      type: 'broadcast',
      event: 'lead_pago',
      payload: {
        leadId,
        telefone: pedido?.cliente_telefone,
        nome: pedido?.cliente_nome,
      },
    })

    console.log(`[WEBHOOK] Lead ${leadId} confirmado via ${payload.capture_method}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[WEBHOOK INFINITEPAY]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
