'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PRECO_LEAD } from '@/lib/frepay/data'

type Transacao = {
  id: string
  tipo: string
  valor: number
  descricao: string | null
  created_at: string
}

export default function FinanceiroPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [saldo, setSaldo] = useState(0)
  const [tab, setTab] = useState<'historico' | 'adicionar'>('historico')
  const [valor, setValor] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id
        if (!userId) return

        const [{ data: profile }, { data: txns }] = await Promise.all([
          supabase.from('profiles').select('saldo').eq('id', userId).single(),
          supabase.from('transacoes').select('*').eq('prestador_id', userId).order('created_at', { ascending: false }).limit(20),
        ])

        if (profile) setSaldo(profile.saldo ?? 0)
        if (txns) setTransacoes(txns)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const leadsHoje = transacoes.filter(t =>
    t.tipo === 'compra_lead' && t.created_at.startsWith(new Date().toISOString().split('T')[0])
  ).length

  const gastoHoje = transacoes
    .filter(t => t.tipo === 'compra_lead' && t.created_at.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((s, t) => s + Math.abs(t.valor), 0)

  const leadsRestantes = saldo > 0 ? Math.floor(saldo / PRECO_LEAD) : 0

  const tipoCfg: Record<string, { icon: string; color: string }> = {
    compra_lead:      { icon: '💬', color: 'text-red-500' },
    saldo_adicionado: { icon: '💳', color: 'text-green-600' },
    estorno:          { icon: '↩️', color: 'text-blue-600' },
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Financeiro 💰</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie seu saldo de leads</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white">
          <p className="text-white/70 text-xs mb-1">Saldo disponível</p>
          <p className="text-3xl font-black">R$ {saldo.toFixed(2)}</p>
          <p className="text-white/60 text-xs mt-2">≈ {leadsRestantes} lead{leadsRestantes !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Leads hoje</p>
          <p className="text-2xl font-black text-gray-900">{leadsHoje}</p>
          <p className="text-gray-400 text-xs mt-1">contato{leadsHoje !== 1 ? 's' : ''} acessado{leadsHoje !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Gasto hoje</p>
          <p className="text-2xl font-black text-gray-900">R$ {gastoHoje.toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-1">R$ {PRECO_LEAD.toFixed(2)} por contato</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <p className="text-sm text-blue-800">
          <strong>1ª indicação do dia é grátis.</strong> A partir da 2ª, R$ {PRECO_LEAD.toFixed(2)} por contato. Sem mensalidade.
        </p>
      </div>

      <div className="flex gap-2 mb-5">
        {(['historico', 'adicionar'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === t ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600'
            }`}>
            {t === 'historico' ? '📄 Histórico' : '💳 Adicionar saldo'}
          </button>
        ))}
      </div>

      {tab === 'historico' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {transacoes.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-4xl mb-3">📄</p>
              <p>Nenhuma transação ainda</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transacoes.map((t, i) => {
                const cfg = tipoCfg[t.tipo] ?? { icon: '💰', color: 'text-gray-600' }
                return (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{t.descricao ?? t.tipo}</p>
                      <p className="text-xs text-gray-400">{new Date(t.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <p className={`font-bold text-sm flex-shrink-0 ${cfg.color}`}>
                      {t.valor > 0 ? '+' : ''}R$ {Math.abs(t.valor).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'adicionar' && (
        <div className="max-w-sm">
          {success ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Link gerado!</h2>
              <p className="text-gray-500 text-sm mb-5">Complete o pagamento na aba que abriu. O saldo é creditado automaticamente.</p>
              <button onClick={() => { setSuccess(false); setValor('') }} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl">Adicionar mais</button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Valor a adicionar (R$)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[5, 10, 20, 50].map(v => (
                    <button key={v} onClick={() => setValor(String(v))}
                      className={`py-2 rounded-xl border text-sm font-semibold transition-all ${valor === String(v) ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}>
                      R$ {v}
                    </button>
                  ))}
                </div>
                <input type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="Outro valor"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                {valor && Number(valor) >= 5 && (
                  <p className="text-xs text-orange-600 font-medium mt-1.5">
                    ≈ {Math.floor(Number(valor) / PRECO_LEAD)} leads pagos disponíveis
                  </p>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                <p>✅ Mínimo: R$ 5,00</p>
                <p>⚡ Saldo disponível imediatamente após pagamento</p>
                <p>🔒 Pago via InfinitePay (PIX ou cartão)</p>
              </div>
              <button
                onClick={() => {
                  if (!valor || Number(valor) < 5) return
                  // Gera link InfinitePay para adicionar saldo
                  const handle = 'denilson-pereira-ramos'
                  const items = encodeURIComponent(JSON.stringify([{ quantity: 1, price: Math.round(Number(valor) * 100), description: `Saldo Frepay — R$ ${valor}` }]))
                  const url = `https://checkout.infinitepay.io/${handle}?items=${items}`
                  window.open(url, '_blank')
                  setSuccess(true)
                }}
                disabled={!valor || Number(valor) < 5}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:scale-[1.01] transition-all">
                Pagar via InfinitePay — R$ {Number(valor || 0).toFixed(2)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
