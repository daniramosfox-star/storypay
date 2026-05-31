'use client'

import { useState } from 'react'

const history = [
  { desc: 'Depósito via PIX', value: '+R$ 5.000', date: '01/05/2026', type: 'entrada' },
  { desc: 'Nike Running — @anasouza', value: '-R$ 180', date: '15/05/2026', type: 'saida' },
  { desc: 'Nike Running — @fit_carol', value: '-R$ 180', date: '18/05/2026', type: 'saida' },
  { desc: 'Depósito via PIX', value: '+R$ 5.000', date: '20/05/2026', type: 'entrada' },
  { desc: 'Natura — @camilabeauty', value: '-R$ 320', date: '22/05/2026', type: 'saida' },
  { desc: 'Nike Running — @marcoslima', value: '-R$ 180', date: '28/05/2026', type: 'saida' },
  { desc: 'Natura — @beleza_da_ju', value: '-R$ 320', date: '29/05/2026', type: 'saida' },
]

const depositAmounts = [500, 1000, 2000, 5000]

type PixData = {
  orderId: string
  qrCode: string
  qrCodeUrl: string
  expiresAt: string
  valor: number
}

export default function MarcaFinanceiroPage() {
  const [tab, setTab] = useState<'extrato' | 'depositar'>('extrato')
  const [amount, setAmount] = useState('')
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [copied, setCopied] = useState(false)

  const gerarPix = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/pagamentos/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: Number(amount), cpfCnpj }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setPixData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar PIX')
    } finally {
      setLoading(false)
    }
  }

  const copiarCodigo = () => {
    if (!pixData?.qrCode) return
    navigator.clipboard.writeText(pixData.qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetar = () => {
    setPixData(null)
    setAmount('')
    setCpfCnpj('')
    setError('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Financeiro 💳</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie o saldo e acompanhe os gastos das campanhas</p>
      </div>

      {/* Balance */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
          <p className="text-white/70 text-xs mb-1">Saldo disponível</p>
          <p className="text-3xl font-black">R$ 8.500</p>
          <p className="text-white/60 text-xs mt-2">Para campanhas ativas</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Reservado em campanhas</p>
          <p className="text-2xl font-black text-gray-900">R$ 2.940</p>
          <p className="text-gray-400 text-xs mt-2">4 campanhas ativas</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Gasto total</p>
          <p className="text-2xl font-black text-gray-900">R$ 14.320</p>
          <p className="text-gray-400 text-xs mt-2">Desde o início</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['extrato', 'depositar'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); resetar() }}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === t ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}>
            {t === 'extrato' ? '📄 Extrato' : '💳 Depositar saldo'}
          </button>
        ))}
      </div>

      {tab === 'extrato' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 grid grid-cols-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Descrição</span>
            <span className="text-center">Data</span>
            <span className="text-right">Valor</span>
          </div>
          <div className="divide-y divide-gray-50">
            {history.map((h, i) => (
              <div key={i} className="p-4 grid grid-cols-3 items-center">
                <p className="text-sm text-gray-800">{h.desc}</p>
                <p className="text-xs text-gray-400 text-center">{h.date}</p>
                <p className={`text-right font-bold text-sm ${h.type === 'entrada' ? 'text-green-600' : 'text-red-500'}`}>
                  {h.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'depositar' && (
        <div className="max-w-md">
          {/* PIX QR Code gerado */}
          {pixData ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-5">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <h2 className="text-xl font-black text-gray-900">PIX gerado!</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Escaneie o QR code ou copie o código abaixo
                </p>
              </div>

              {/* QR code real via qrCodeUrl */}
              {pixData.qrCodeUrl ? (
                <img
                  src={pixData.qrCodeUrl}
                  alt="QR Code PIX"
                  className="w-48 h-48 rounded-xl border border-gray-200"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center text-5xl">
                  📲
                </div>
              )}

              <div className="w-full">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Código PIX copia e cola</p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-start gap-2">
                  <p className="text-xs font-mono text-gray-600 break-all flex-1 select-all">
                    {pixData.qrCode || 'Código PIX gerado pelo Pagar.me'}
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={copiarCodigo}
                  className={`w-full font-bold py-3 rounded-xl transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.01]'
                  }`}
                >
                  {copied ? '✓ Copiado!' : '📋 Copiar código PIX'}
                </button>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 text-center">
                  ⏱ O saldo será creditado automaticamente após o pagamento ser confirmado.
                  {pixData.expiresAt && (
                    <span className="block mt-1 font-semibold">
                      Expira em: {new Date(pixData.expiresAt).toLocaleTimeString('pt-BR')}
                    </span>
                  )}
                </div>

                <button onClick={resetar}
                  className="w-full border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 text-sm">
                  Gerar novo PIX
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Valor (R$)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {depositAmounts.map(v => (
                    <button key={v} onClick={() => setAmount(String(v))}
                      className={`py-2 rounded-xl border text-sm font-semibold transition-all ${
                        amount === String(v) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}>
                      R$ {v.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Outro valor (mín. R$ 50)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  CPF / CNPJ
                </label>
                <input
                  type="text"
                  value={cpfCnpj}
                  onChange={e => setCpfCnpj(e.target.value)}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                <p>✅ Saldo creditado automaticamente após confirmação do pagamento</p>
                <p>⏱ Confirmação geralmente em menos de 1 minuto</p>
                <p>🔒 Processado com segurança pelo Pagar.me (PCI-DSS)</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                onClick={gerarPix}
                disabled={!amount || Number(amount) < 50 || loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:scale-[1.01] transition-all"
              >
                {loading ? 'Gerando PIX...' : `Gerar PIX — R$ ${Number(amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
