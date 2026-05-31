import { NextRequest, NextResponse } from 'next/server'
import { criarCobranca } from '@/lib/picpay/client'
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

    // Busca dados do prestador
    const { data: prestador } = await supabase
      .from('profiles')
      .select('nome, telefone, leads_gratis_hoje, leads_gratis_data, saldo')
      .eq('id', user.id)
      .single()

    if (!prestador) {
      return NextResponse.json({ error: 'Prestador não encontrado' }, { status: 404 })
    }

    // Verifica se já comprou este lead
    const { data: leadExistente } = await supabase
      .from('leads')
      .select('id, pago, contato_revelado, gratis')
      .eq('pedido_id', pedidoId)
      .eq('prestador_id', user.id)
      .single()

    if (leadExistente?.contato_revelado) {
      return NextResponse.json({ error: 'Contato já revelado' }, { status: 400 })
    }

    // Verifica se é grátis (1ª do dia)
    const hoje = new Date().toISOString().split('T')[0]
    const eGratis =
      !prestador.leads_gratis_data ||
      prestador.leads_gratis_data !== hoje

    if (eGratis) {
      // Lead grátis — revela direto
      const { data: lead } = await supabase
        .from('leads')
        .upsert({
          pedido_id: pedidoId,
          prestador_id: user.id,
          valor: 0,
          gratis: true,
          pago: true,
          contato_revelado: true,
        }, { onConflict: 'pedido_id,prestador_id' })
        .select()
        .single()

      // Marca grátis do dia como usado
      await supabase
        .from('profiles')
        .update({ leads_gratis_data: hoje, leads_gratis_hoje: 1 })
        .eq('id', user.id)

      // Busca telefone do cliente
      const { data: pedido } = await supabase
        .from('pedidos')
        .select('cliente_telefone, cliente_nome')
        .eq('id', pedidoId)
        .single()

      return NextResponse.json({
        gratis: true,
        leadId: lead?.id,
        telefone: pedido?.cliente_telefone,
        nome: pedido?.cliente_nome,
      })
    }

    // Lead pago — cria cobrança no PicPay
    const leadId = leadExistente?.id ?? crypto.randomUUID()
    const referenceId = `frepay-lead-${leadId}`
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://frepay.com.br'

    // Cria o lead como pendente (sem revelar ainda)
    await supabase
      .from('leads')
      .upsert({
        id: leadId,
        pedido_id: pedidoId,
        prestador_id: user.id,
        valor: PRECO_LEAD,
        gratis: false,
        pago: false,
        contato_revelado: false,
      }, { onConflict: 'pedido_id,prestador_id' })

    const cobranca = await criarCobranca({
      referenceId,
      valor: PRECO_LEAD,
      compradorNome: prestador.nome,
      compradorEmail: user.email!,
      callbackUrl: `${appUrl}/api/lead/webhook`,
      returnUrl: `${appUrl}/prestador/pedidos?lead=${leadId}&status=pago`,
    })

    return NextResponse.json({
      gratis: false,
      leadId,
      paymentUrl: cobranca.paymentUrl,
      qrcodeBase64: cobranca.qrcode?.base64,
      qrcodeContent: cobranca.qrcode?.content,
      valor: PRECO_LEAD,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar pagamento'
    console.error('[LEAD/PAGAR]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
