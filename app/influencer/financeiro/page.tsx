'use client'

import { useState } from 'react'

type SaqueResult = { success: boolean; transferId?: string; error?: string }

const transactions = [
  { brand: 'Adidas', type: 'Feed', value: 320, date: '30/05/2026', status: 'pago' },
  { brand: 'iFood', type: 'Story', value: 150, date: '29/05/2026', status: 'pago' },
  { brand: 'Nubank', type: 'Story', value: 410, date: '28/05/2026', status: 'pago' },
  { brand: 'Shopee', type: 'Feed 7d', value: 240, date: '22/05/2026', status: 'pago' },
  { brand: 'Nike Brasil', type: 'Story', value: 180, date: '15/05/2026', status: 'pago' },
  { brand: 'Samsung', type: 'Feed', value: 520, date: '10/05/2026', status: 'pago' },
  { brand: 'Gympass', type: 'Story', value: 250, date: '01/06/2026', status: 'pendente' },
  { brand: 'Natura', type: 'Feed 7d', value: 480, date: '03/06/2026', status: 'pendente' },
]

export default function FinanceiroPage() {
  const [tab, setTab] = useState<'extrato' | 'sacar'>('extrato')
  const [pixKey, setPixKey] = useState('')
  const [pixKeyType, setPixKeyType] = useState<'cpf' | 'email' | 'phone' | 'evp'>('email')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [saqueError, setSaqueError] = useState('')
  const [saqueResult, setSaqueResult] = useState<SaqueResult | null>(null)

  const totalPago = transactions.filter(t => t.status === 'pago').reduce((s, t) => s + t.value, 0)
  const totalPendente = transactions.filter(t => t.status === 'pendente').reduce((s, t) => s + t.value, 0)
  const taxa = (totalPago * 0.15).toFixed(2)
  const liquido = (totalPago * 0.85).toFixed(2)

  const handleSaque = async () => {
    setLoading(true)
    setSaqueError('')
    try {
      const res = await fetch('/api/pagamentos/saque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: Number(amount), pixKey, pixKeyType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSaqueResult(data)
    } catch (err) {
      setSaqueError(err instanceof Error ? err.message : 'Erro ao solicitar saque')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Financeiro 💰</h1>
        <p className="text-gray-400 text-sm mt-1">Acompanhe seus ganhos e solicite saques</p>
      </div>

      {/* Balance cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl p-5 text-white sm:col-span-1">
          <p className="text-white/70 text-xs mb-1">Saldo disponível</p>
          <p className="text-3xl font-black">R$ 1.240</p>
          <p className="text-white/60 text-xs mt-2">Pronto para sacar</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">A receber</p>
          <p className="text-2xl font-black text-gray-900">R$ {totalPendente}</p>
          <p className="text-gray-400 text-xs mt-2">Aguardando confirmação</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Total recebido (mês)</p>
          <p className="text-2xl font-black text-gray-900">R$ {liquido}</p>
          <p className="text-gray-400 text-xs mt-2">Após taxa da plataforma (15%)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['extrato', 'sacar'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === t
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
            }`}
          >
            {t === 'extrato' ? '📄 Extrato' : '💸 Sacar'}
          </button>
        ))}
      </div>

      {tab === 'extrato' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 grid grid-cols-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Marca</span>
            <span>Tipo</span>
            <span className="text-right">Valor</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-gray-50">
            {transactions.map((t, i) => (
              <div key={i} className="p-4 grid grid-cols-4 items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.brand}</p>
                  <p className="text-gray-400 text-xs">{t.date}</p>
                </div>
                <span className="text-gray-500 text-sm">{t.type}</span>
                <p className={`text-right font-bold text-sm ${t.status === 'pago' ? 'text-green-600' : 'text-orange-500'}`}>
                  + R$ {t.value}
                </p>
                <span className={`text-right text-xs font-semibold ${
                  t.status === 'pago' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {t.status === 'pago' ? '✓ Pago' : '⏳ Pendente'}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Taxa da plataforma (15%): <span className="font-semibold text-gray-700">- R$ {taxa}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total líquido</p>
              <p className="font-black text-gray-900">R$ {liquido}</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'sacar' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md">
          {saqueResult ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Saque solicitado!</h2>
              <p className="text-gray-500 text-sm mb-1">R$ {amount} enviados para</p>
              <p className="font-bold text-gray-800 mb-4">{pixKey}</p>
              <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                ID da transferência: {saqueResult.transferId ?? 'processando...'}
                <br />Processamento em até 1 dia útil.
              </p>
              <button
                onClick={() => { setSaqueResult(null); setAmount(''); setPixKey('') }}
                className="mt-5 w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl"
              >
                Novo saque
              </button>
            </div>
          ) : (
            <>
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-violet-600 text-xs font-medium">Saldo disponível para saque</p>
                  <p className="text-2xl font-black text-violet-900">R$ 1.240,00</p>
                </div>
                <span className="text-3xl">💰</span>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Tipo de chave PIX</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['email', 'cpf', 'phone', 'evp'] as const).map(t => (
                      <button key={t} onClick={() => setPixKeyType(t)}
                        className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                          pixKeyType === t ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:border-violet-300'
                        }`}>
                        {t === 'email' ? 'E-mail' : t === 'cpf' ? 'CPF' : t === 'phone' ? 'Telefone' : 'Aleatória'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Chave PIX</label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={e => setPixKey(e.target.value)}
                    placeholder={pixKeyType === 'email' ? 'seu@email.com' : pixKeyType === 'cpf' ? '000.000.000-00' : pixKeyType === 'phone' ? '(11) 99999-9999' : 'Chave aleatória'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Valor a sacar (R$)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                  <p>✅ Saques processados via Pagar.me</p>
                  <p>⏱ Até 1 dia útil para cair na conta</p>
                  <p>🔒 Sem taxa de saque — você recebe o valor integral</p>
                  <p>💰 Saque mínimo: R$ 50,00</p>
                </div>

                {saqueError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {saqueError}
                  </div>
                )}

                <button
                  onClick={handleSaque}
                  disabled={!pixKey || !amount || Number(amount) < 50 || loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:scale-105 transition-all"
                >
                  {loading ? 'Processando...' : 'Solicitar saque via PIX'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
