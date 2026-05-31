import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Polled pelo front para saber se o pagamento foi confirmado
export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get('leadId')
  if (!leadId) return NextResponse.json({ error: 'leadId obrigatório' }, { status: 400 })

  const supabase = await createClient()
  const { data: lead } = await supabase
    .from('leads')
    .select('pago, contato_revelado, pedidos(cliente_telefone, cliente_nome)')
    .eq('id', leadId)
    .single()

  if (!lead) return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })

  return NextResponse.json({
    pago: lead.pago,
    contato_revelado: lead.contato_revelado,
    telefone: lead.pago ? lead.pedidos?.cliente_telefone : null,
    nome: lead.pago ? lead.pedidos?.cliente_nome : null,
  })
}
