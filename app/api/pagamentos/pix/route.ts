import { NextRequest, NextResponse } from 'next/server'
import { criarOrdemPix } from '@/lib/pagarme/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { valor, cpfCnpj } = body

    if (!valor || valor < 50) {
      return NextResponse.json({ error: 'Valor mínimo é R$ 50' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, empresa')
      .eq('id', user.id)
      .single()

    const nome = profile?.empresa || profile?.nome || 'Cliente'

    // Cria ordem PIX no Pagar.me
    const ordem = await criarOrdemPix({
      valor,
      nome,
      email: user.email!,
      cpfCnpj: cpfCnpj || '00000000000',
      descricao: `Depósito Storypay — R$ ${valor.toFixed(2)}`,
      referenceId: user.id,
    })

    // Salva a ordem pendente no banco
    await supabase.from('transacoes').insert({
      user_id: user.id,
      tipo: 'deposito',
      valor,
      descricao: `Depósito PIX — Ordem ${ordem.id}`,
      referencia_id: null,
    })

    const charge = ordem.charges?.[0]
    const qrCode = charge?.last_transaction?.qr_code
    const qrCodeUrl = charge?.last_transaction?.qr_code_url
    const expiresAt = charge?.last_transaction?.expires_at

    return NextResponse.json({
      orderId: ordem.id,
      qrCode,
      qrCodeUrl,
      expiresAt,
      valor,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao criar PIX'
    console.error('[PIX]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
