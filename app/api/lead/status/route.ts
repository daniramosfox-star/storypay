import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Polled pelo front para saber se o pagamento foi confirmado
export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get('leadId')
  if (!leadId) return NextResponse.json({ error: 'leadId obrigatório' }, { status: 400 })

  const supabase = await createClient()
  const { data: lead } = await supabase
    .from('leads')
    .select('pago, contato_revelado')
    .eq('id', leadId)
    .single()

  if (!lead) return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })

  // Se pago, busca o contato do pedido separadamente
  let telefone = null
  let nome = null

  if (lead.pago) {
    const { data: leadFull } = await supabase
      .from('leads')
      .select('pedido_id')
      .eq('id', leadId)
      .single()

    if (leadFull?.pedido_id) {
      const { data: pedido } = await supabase
        .from('pedidos')
        .select('cliente_telefone, cliente_nome')
        .eq('id', leadFull.pedido_id)
        .single()
      telefone = pedido?.cliente_telefone ?? null
      nome = pedido?.cliente_nome ?? null
    }
  }

  return NextResponse.json({
    pago: lead.pago,
    contato_revelado: lead.contato_revelado,
    telefone,
    nome,
  })
}
