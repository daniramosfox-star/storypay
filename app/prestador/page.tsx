'use client'

import { useState, useEffect, useCallback } from 'react'
import { PRECO_LEAD, formatWhatsApp } from '@/lib/frepay/data'

const pedidosProximos = [
  { id: '1', categoria: '❄️', titulo: 'Ar condicionado', desc: 'AC split 12000 BTUs não está gelando. Já limpei o filtro.', endereco: 'Setor Bueno', distancia: '0.8 km', urgente: true, tempo: '3 min atrás' },
  { id: '2', categoria: '❄️', titulo: 'Ar condicionado', desc: 'Instalação de ar condicionado novo, apartamento 2 quartos.', endereco: 'Setor Marista', distancia: '1.4 km', urgente: false, tempo: '12 min atrás' },
  { id: '3', categoria: '❄️', titulo: 'Ar condicionado', desc: 'Ar condicionado pingando água dentro do quarto.', endereco: 'Jardim Goiás', distancia: '2.2 km', urgente: false, tempo: '28 min atrás' },
]

type PayState = {
  leadId: string
  paymentUrl: string
  qrcodeBase64?: string
  qrcodeContent?: string
  pedidoId: string
}

type ContatoRevelado = {
  pedidoId: string
  telefone: string
  nome: string
}

export default function PrestadorDashboard() {
  const [online, setOnline] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [leadsGratis, setLeadsGratis] = useState(true)
  const [revelados, setRevelados] = useState<ContatoRevelado[]>([])
  const [payState, setPayState] = useState<PayState | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleOnline = () => {
    setToggling(true)
    setTimeout(() => { setOnline(o => !o); setToggling(false) }, 500)
  }

  const jaRevelado = (pedidoId: string) => revelados.find(r => r.pedidoId === pedidoId)

  // Poll status do pagamento a cada 3s
  const pollStatus = useCallback(async (leadId: string, pedidoId: string) => {
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/lead/status?leadId=${leadId}`)
        const data = await res.json()
        if (data.pago && data.telefone) {
          clearInterval(interval)
          setPolling(false)
          setPayState(null)
          setLeadsGratis(false)
          setRevelados(p => [...p, { pedidoId, telefone: data.telefone, nome: data.nome }])
        }
      } catch {
        // continua tentando
      }
    }, 3000)
    // Para de tentar após 10 min
    setTimeout(() => { clearInterval(interval); setPolling(false) }, 600000)
  }, [])

  const handleVerContato = async (pedidoId: string) => {
    setLoadingId(pedidoId)
    try {
      const res = await fetch('/api/lead/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId }),
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? 'Erro ao processar')
        return
      }

      if (data.gratis) {
        // Lead grátis — já revelado
        setLeadsGratis(false)
        setRevelados(p => [...p, { pedidoId, telefone: data.telefone, nome: data.nome }])
      } else {
        // Pago — mostra QR Code PicPay
        setPayState({
          leadId: data.leadId,
          paymentUrl: data.paymentUrl,
          qrcodeBase64: data.qrcodeBase64,
          qrcodeContent: data.qrcodeContent,
          pedidoId,
        })
        pollStatus(data.leadId, pedidoId)
      }
    } catch {
      alert('Erro de conexão. Tente novamente.')
    } finally {
      setLoadingId(null)
    }
  }

  const copiarPix = () => {
    if (payState?.qrcodeContent) {
      navigator.clipboard.writeText(payState.qrcodeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Olá, João! 👋</h1>
          <p className="text-gray-400 text-sm">Técnico de Ar condicionado • Setor Bueno</p>
        </div>
      </div>

      {/* Botão ONLINE/OFFLINE */}
      <div className={`rounded-3xl p-6 mb-6 transition-all duration-500 ${online ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`relative w-4 h-4 rounded-full flex-shrink-0 ${online ? 'bg-white' : 'bg-gray-400'}`}>
                {online && <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />}
              </div>
              <p className={`text-2xl font-black ${online ? 'text-white' : 'text-gray-500'}`}>
                {toggling ? 'Atualizando...' : online ? 'ONLINE — Recebendo pedidos' : 'OFFLINE — Invisível para clientes'}
              </p>
            </div>
            <p className={`text-sm ${online ? 'text-white/80' : 'text-gray-400'}`}>
              {online ? 'Você aparece nas buscas da sua região.' : 'Ative para receber pedidos na sua área.'}
            </p>
          </div>
          <button onClick={toggleOnline} disabled={toggling}
            className={`px-8 py-4 rounded-2xl font-black text-lg transition-all disabled:opacity-50 flex-shrink-0 shadow-lg ${
              online ? 'bg-white text-green-700 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}>
            {toggling ? '...' : online ? '⏸ Ficar offline' : '▶ Ficar online'}
          </button>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl mb-1">🎁</p>
          <p className="font-black text-gray-900 text-sm">{leadsGratis ? 'Disponível' : 'Usado'}</p>
          <p className="text-gray-400 text-xs">Lead grátis hoje</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl mb-1">💬</p>
          <p className="font-black text-gray-900 text-sm">{revelados.length}</p>
          <p className="text-gray-400 text-xs">Contatos acessados</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl mb-1">⭐</p>
          <p className="font-black text-gray-900 text-sm">4.9</p>
          <p className="text-gray-400 text-xs">Sua avaliação</p>
        </div>
      </div>

      {/* Pedidos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Pedidos na sua área</h2>
          <p className="text-gray-400 text-xs mt-0.5">{pedidosProximos.length} disponíveis agora</p>
        </div>

        <div className="divide-y divide-gray-50">
          {pedidosProximos.map(p => {
            const contato = jaRevelado(p.id)
            const carregando = loadingId === p.id
            const eGratis = leadsGratis

            return (
              <div key={p.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl flex-shrink-0">{p.categoria}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-bold text-gray-900 text-sm">{p.titulo}</p>
                      {p.urgente && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">🚨 Urgente</span>}
                      <span className="text-gray-400 text-xs ml-auto">{p.tempo}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{p.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>📍 {p.endereco}</span>
                      <span>🗺 {p.distancia}</span>
                    </div>
                  </div>
                </div>

                {contato ? (
                  /* Contato revelado — botão WhatsApp */
                  <a href={formatWhatsApp(contato.telefone)} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all w-fit">
                    <span className="text-lg">💬</span>
                    Chamar {contato.nome} no WhatsApp
                  </a>
                ) : (
                  <button
                    onClick={() => handleVerContato(p.id)}
                    disabled={carregando || !!payState}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {carregando
                      ? <><span className="animate-spin">⏳</span> Processando...</>
                      : eGratis
                        ? <><span>🎁</span> Ver contato — GRÁTIS</>
                        : <><span>💬</span> Ver contato — R$ {PRECO_LEAD.toFixed(2)} via PicPay</>
                    }
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal PicPay */}
      {payState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-center">
              <div className="text-4xl mb-1">💚</div>
              <p className="text-white font-black text-lg">Pagar R$ {PRECO_LEAD.toFixed(2)} via PicPay</p>
              <p className="text-white/80 text-xs mt-0.5">Escaneie o QR Code ou copie o código</p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* QR Code */}
              {payState.qrcodeBase64 ? (
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${payState.qrcodeBase64}`}
                    alt="QR Code PicPay"
                    className="w-48 h-48 rounded-xl border border-gray-200"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto flex items-center justify-center text-5xl">
                  📲
                </div>
              )}

              {/* Código copia e cola */}
              {payState.qrcodeContent && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Código copia e cola</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2">
                    <p className="text-xs font-mono text-gray-600 flex-1 truncate">{payState.qrcodeContent.slice(0, 40)}...</p>
                    <button onClick={copiarPix}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {copied ? '✓' : '📋 Copiar'}
                    </button>
                  </div>
                </div>
              )}

              {/* Link PicPay */}
              <a href={payState.paymentUrl} target="_blank" rel="noreferrer"
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all">
                Abrir no PicPay →
              </a>

              {/* Status polling */}
              <div className={`flex items-center gap-2 justify-center text-xs ${polling ? 'text-orange-600' : 'text-gray-400'}`}>
                {polling ? (
                  <><span className="animate-spin">⏳</span> Aguardando confirmação do pagamento...</>
                ) : (
                  'Verificação concluída'
                )}
              </div>

              <div className="text-xs text-gray-400 text-center leading-relaxed">
                Após pagar, o WhatsApp do cliente abre automaticamente. <br />
                Não feche essa janela.
              </div>

              <button onClick={() => setPayState(null)}
                className="text-gray-400 text-sm text-center hover:text-gray-700 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
