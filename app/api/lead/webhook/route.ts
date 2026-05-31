import { NextRequest, NextResponse } from 'next/server'
import { consultarStatus } from '@/lib/picpay/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // PicPay envia: { referenceId, authorizationId, status }
    const referenceId: string = body.referenceId
    if (!referenceId?.startsWith('frepay-lead-')) {
      return NextResponse.json({ ok: true }) // ignora cobranças de outros sistemas
    }

    const leadId = referenceId.replace('frepay-lead-', '')

    // Confirma status diretamente na API (não confia só no webhook)
    const status = await consultarStatus(referenceId)

    if (status.status !== 'paid' && status.status !== 'completed') {
      return NextResponse.json({ ok: true }) // ainda não pago
    }

    const supabase = await createClient()

    // Busca o lead
    const { data: lead } = await supabase
      .from('leads')
      .select('*, pedidos(cliente_telefone, cliente_nome, categoria_id)')
      .eq('id', leadId)
      .single()

    if (!lead || lead.pago) {
      return NextResponse.json({ ok: true }) // já processado
    }

    // Marca como pago e revela contato
    await supabase
      .from('leads')
      .update({
        pago: true,
        contato_revelado: true,
        payment_id: status.authorizationId,
      })
      .eq('id', leadId)

    // Registra transação
    await supabase.from('transacoes').insert({
      prestador_id: lead.prestador_id,
      tipo: 'compra_lead',
      valor: -lead.valor,
      descricao: `Lead pago via PicPay — ${lead.pedidos?.categoria_id}`,
      lead_id: leadId,
    })

    // Notifica prestador via Supabase Realtime (broadcast)
    await supabase.channel(`prestador-${lead.prestador_id}`).send({
      type: 'broadcast',
      event: 'lead_pago',
      payload: {
        leadId,
        telefone: lead.pedidos?.cliente_telefone,
        nome: lead.pedidos?.cliente_nome,
      },
    })

    console.log(`[WEBHOOK] Lead ${leadId} pago — prestador ${lead.prestador_id}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[WEBHOOK PICPAY]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
