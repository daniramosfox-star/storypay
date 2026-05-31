import { NextRequest, NextResponse } from 'next/server'
import { criarTransferenciaPix } from '@/lib/pagarme/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { valor, pixKey, pixKeyType } = body

    if (!valor || valor < 50) {
      return NextResponse.json({ error: 'Valor mínimo de saque é R$ 50' }, { status: 400 })
    }

    if (!pixKey || !pixKeyType) {
      return NextResponse.json({ error: 'Chave PIX obrigatória' }, { status: 400 })
    }

    // Verifica saldo disponível
    const { data: profile } = await supabase
      .from('profiles')
      .select('saldo, nome')
      .eq('id', user.id)
      .single()

    if (!profile || profile.saldo < valor) {
      return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
    }

    // Debita saldo imediatamente (otimista) para evitar double spend
    await supabase
      .from('profiles')
      .update({ saldo: profile.saldo - valor })
      .eq('id', user.id)

    // Cria transferência PIX no Pagar.me
    let transferencia
    try {
      transferencia = await criarTransferenciaPix({
        valor,
        pixKey,
        pixKeyType,
        nome: profile.nome,
        descricao: `Saque Storypay — ${user.email}`,
      })
    } catch (pagarmeErr) {
      // Reverte débito se Pagar.me falhou
      await supabase
        .from('profiles')
        .update({ saldo: profile.saldo })
        .eq('id', user.id)
      throw pagarmeErr
    }

    // Registra transação
    await supabase.from('transacoes').insert({
      user_id: user.id,
      tipo: 'saque',
      valor: -valor,
      descricao: `Saque PIX — ${pixKey} — Transfer ${transferencia.id}`,
    })

    // Notifica
    await supabase.from('notificacoes').insert({
      user_id: user.id,
      titulo: 'Saque solicitado!',
      mensagem: `R$ ${valor.toFixed(2)} enviados via PIX para ${pixKey}. Processamento em até 1 dia útil.`,
    })

    return NextResponse.json({
      success: true,
      transferId: transferencia.id,
      status: transferencia.status,
      valor,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar saque'
    console.error('[SAQUE]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
