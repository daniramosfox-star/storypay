import { NextRequest, NextResponse } from 'next/server'
import { gerarUrlPagamento } from '@/lib/infinitepay/client'
import { createClient } from '@/lib/supabase/server'
import { PRECO_LEAD } from '@/lib/frepay/data'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { pedidoId } = await req.json()
    if (!pedidoId) {
      return NextResponse.json({ error: 'pedidoId obrigatório' }, { status: 400 })
    }

    // Verifica se já comprou este lead
    const { data: leadExistente } = await supabase
      .from('leads')
      .select('id, pago, contato_revelado')
      .eq('pedido_id', pedidoId)
      .eq('prestador_id', user.id)
      .single()

    if (leadExistente?.contato_revelado) {
      return NextResponse.json({ error: 'Contato já revelado' }, { status: 400 })
    }

    // Verifica se é grátis (1ª do dia)
    const hoje = new Date().toISOString().split('T')[0]
    const { data: prestador } = await supabase
      .from('profiles')
      .select('nome, leads_gratis_data')
      .eq('id', user.id)
      .single()

    const eGratis = !prestador?.leads_gratis_data || prestador.leads_gratis_data !== hoje

    if (eGratis) {
      // Lead grátis — revela direto sem pagamento
      await supabase.from('leads').upsert({
        pedido_id: pedidoId,
        prestador_id: user.id,
        valor: 0,
        gratis: true,
        pago: true,
        contato_revelado: true,
      }, { onConflict: 'pedido_id,prestador_id' })

      await supabase.from('profiles')
        .update({ leads_gratis_data: hoje })
        .eq('id', user.id)

      const { data: pedido } = await supabase
        .from('pedidos')
        .select('cliente_telefone, cliente_nome')
        .eq('id', pedidoId)
        .single()

      return NextResponse.json({
        gratis: true,
        telefone: pedido?.cliente_telefone,
        nome: pedido?.cliente_nome,
      })
    }

    // Lead pago — cria link InfinitePay
    const leadId = leadExistente?.id ?? crypto.randomUUID()
    const orderNsu = `frepay-${leadId}`
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://storypay.vercel.app'

    // Salva lead como pendente
    await supabase.from('leads').upsert({
      id: leadId,
      pedido_id: pedidoId,
      prestador_id: user.id,
      valor: PRECO_LEAD,
      gratis: false,
      pago: false,
      contato_revelado: false,
    }, { onConflict: 'pedido_id,prestador_id' })

    // Gera URL direto — sem POST API, funciona com query params
    const paymentUrl = gerarUrlPagamento({
      orderNsu,
      valor: PRECO_LEAD,
      descricao: 'Lead Frepay — contato de cliente',
      webhookUrl: `${appUrl}/api/lead/webhook`,
      redirectUrl: `${appUrl}/prestador/pedidos?leadId=${leadId}`,
    })

    return NextResponse.json({
      gratis: false,
      leadId,
      paymentUrl,
      valor: PRECO_LEAD,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar pagamento'
    console.error('[LEAD/PAGAR]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
