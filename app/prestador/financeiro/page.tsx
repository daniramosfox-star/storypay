'use client'

import { useState } from 'react'
import { PRECO_LEAD } from '@/lib/frepay/data'

const historico = [
  { desc: 'Lead grátis — Maria S. (AC não gela)', tipo: 'gratis', valor: 'R$ 0,00', data: '31/05/2026 09:14' },
  { desc: 'Lead pago — Carlos M. (Instalação AC)', tipo: 'pago', valor: `- R$ ${PRECO_LEAD.toFixed(2)}`, data: '31/05/2026 10:22' },
  { desc: 'Lead pago — Ana R. (AC pingando)', tipo: 'pago', valor: `- R$ ${PRECO_LEAD.toFixed(2)}`, data: '30/05/2026 14:05' },
  { desc: 'Lead pago — Pedro L. (Manutenção)', tipo: 'pago', valor: `- R$ ${PRECO_LEAD.toFixed(2)}`, data: '30/05/2026 16:38' },
  { desc: 'Saldo adicionado via PIX', tipo: 'deposito', valor: '+ R$ 20,00', data: '29/05/2026 11:00' },
]

export default function FinanceiroPage() {
  const [tab, setTab] = useState<'historico' | 'adicionar'>('historico')
  const [valor, setValor] = useState('')
  const [success, setSuccess] = useState(false)

  const saldoAtual = 14.09
  const leadsRestantes = Math.floor(saldoAtual / PRECO_LEAD)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Financeiro 💰</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie seu saldo de leads</p>
      </div>

      {/* Saldo cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white">
          <p className="text-white/70 text-xs mb-1">Saldo disponível</p>
          <p className="text-3xl font-black">R$ {saldoAtual.toFixed(2)}</p>
          <p className="text-white/60 text-xs mt-2">≈ {leadsRestantes} lead{leadsRestantes !== 1 ? 's' : ''} disponíve{leadsRestantes !== 1 ? 'is' : 'l'}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Leads hoje</p>
          <p className="text-2xl font-black text-gray-900">2</p>
          <p className="text-gray-400 text-xs mt-1">1 grátis + 1 pago</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Gasto este mês</p>
          <p className="text-2xl font-black text-gray-900">R$ {(3 * PRECO_LEAD).toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-1">3 contatos pagos</p>
        </div>
      </div>

      {/* Como funciona resumo */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div className="text-sm text-blue-800">
          <p className="font-bold mb-1">Como funciona o pagamento por lead</p>
          <p className="text-blue-600 text-xs leading-relaxed">
            Você recebe <strong>1 contato grátis por dia</strong>. A partir do 2º, cada contato custa <strong>R$ {PRECO_LEAD.toFixed(2)}</strong>.
            Sem mensalidade, sem contrato. Você só paga quando quiser ver o contato de um cliente.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['historico', 'adicionar'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === t ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
            }`}>
            {t === 'historico' ? '📄 Histórico' : '💳 Adicionar saldo'}
          </button>
        ))}
      </div>

      {tab === 'historico' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {historico.map((h, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  h.tipo === 'gratis' ? 'bg-green-100 text-green-600' :
                  h.tipo === 'pago' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {h.tipo === 'gratis' ? '🎁' : h.tipo === 'pago' ? '💬' : '💳'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{h.desc}</p>
                  <p className="text-xs text-gray-400">{h.data}</p>
                </div>
                <p className={`font-bold text-sm flex-shrink-0 ${h.tipo === 'deposito' ? 'text-green-600' : h.tipo === 'gratis' ? 'text-green-500' : 'text-red-500'}`}>
                  {h.valor}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'adicionar' && (
        <div className="max-w-sm">
          {success ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Saldo adicionado!</h2>
              <p className="text-gray-500 text-sm mb-5">R$ {valor} adicionados ao seu saldo.</p>
              <button onClick={() => { setSuccess(false); setValor('') }} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl">Adicionar mais</button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Valor a adicionar (R$)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[5, 10, 20, 50].map(v => (
                    <button key={v} onClick={() => setValor(String(v))}
                      className={`py-2 rounded-xl border text-sm font-semibold transition-all ${valor === String(v) ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                      R$ {v}
                    </button>
                  ))}
                </div>
                <input type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="Outro valor"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                {valor && Number(valor) >= 5 && (
                  <p className="text-xs text-orange-600 font-medium mt-1.5">
                    ≈ {Math.floor(Number(valor) / PRECO_LEAD)} lead{Math.floor(Number(valor) / PRECO_LEAD) !== 1 ? 's' : ''} pagos disponíveis
                  </p>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                <p>✅ Valor mínimo: R$ 5,00</p>
                <p>⚡ Saldo disponível imediatamente após pagamento</p>
                <p>🔒 Processado com segurança pelo Mercado Pago</p>
              </div>
              <button onClick={() => setSuccess(true)} disabled={!valor || Number(valor) < 5}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:scale-[1.01] transition-all">
                Pagar via PIX — R$ {Number(valor || 0).toFixed(2)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
