import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Chamado quando marca confirma entrega OU quando as 48h expiram
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { entregaId } = await req.json()

    // Busca a entrega com dados da campanha e influencer
    const { data: entrega, error } = await supabase
      .from('entregas')
      .select(`
        *,
        campanhas(nome, marca_id, profiles:marca_id(saldo, nome)),
        influencer:influencer_id(saldo, nome, instagram)
      `)
      .eq('id', entregaId)
      .single()

    if (error || !entrega) {
      return NextResponse.json({ error: 'Entrega não encontrada' }, { status: 404 })
    }

    // Verifica se quem está confirmando é a marca dona da campanha
    const marcaId = entrega.campanhas?.marca_id
    if (marcaId !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    if (entrega.status === 'paga') {
      return NextResponse.json({ error: 'Entrega já paga' }, { status: 400 })
    }

    const valorBruto = entrega.valor
    const taxa = valorBruto * 0.15               // 15% da plataforma
    const valorLiquido = valorBruto - taxa        // 85% pro influencer

    const marcaSaldo = entrega.campanhas?.profiles?.saldo ?? 0
    const influencerSaldo = entrega.influencer?.saldo ?? 0

    // 1. Debita da marca
    await supabase
      .from('profiles')
      .update({ saldo: marcaSaldo - valorBruto })
      .eq('id', marcaId)

    // 2. Credita influencer (valor líquido)
    await supabase
      .from('profiles')
      .update({ saldo: influencerSaldo + valorLiquido })
      .eq('id', entrega.influencer_id)

    // 3. Marca entrega como paga
    await supabase
      .from('entregas')
      .update({ status: 'paga', confirmado_em: new Date().toISOString() })
      .eq('id', entregaId)

    // 4. Registra transações
    await supabase.from('transacoes').insert([
      {
        user_id: marcaId,
        tipo: 'pagamento',
        valor: -valorBruto,
        descricao: `Pagamento ${entrega.influencer?.instagram} — ${entrega.campanhas?.nome}`,
        referencia_id: entregaId,
      },
      {
        user_id: entrega.influencer_id,
        tipo: 'pagamento',
        valor: valorLiquido,
        descricao: `Campanha: ${entrega.campanhas?.nome}`,
        referencia_id: entregaId,
      },
      {
        user_id: entrega.influencer_id,
        tipo: 'taxa',
        valor: -taxa,
        descricao: `Taxa plataforma (15%) — ${entrega.campanhas?.nome}`,
        referencia_id: entregaId,
      },
    ])

    // 5. Notifica influencer
    await supabase.from('notificacoes').insert({
      user_id: entrega.influencer_id,
      titulo: 'Pagamento liberado! 💸',
      mensagem: `R$ ${valorLiquido.toFixed(2)} creditados pelo post na campanha "${entrega.campanhas?.nome}".`,
    })

    // 6. Incrementa posts_entregues do influencer
    await supabase.rpc('increment_posts_entregues', { uid: entrega.influencer_id })

    return NextResponse.json({
      success: true,
      valorBruto,
      taxa,
      valorLiquido,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao liberar pagamento'
    console.error('[LIBERAR]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
