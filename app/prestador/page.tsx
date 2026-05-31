'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PRECO_LEAD, formatWhatsApp } from '@/lib/frepay/data'
import { createClient } from '@/lib/supabase/client'

type Pedido = {
  id: string
  descricao: string
  endereco: string
  urgencia: string
  created_at: string
  cliente_nome: string
  cliente_telefone: string
}

type Lead = {
  id: string
  pedido_id: string
  gratis: boolean
  pago: boolean
  contato_revelado: boolean
}

type Profile = {
  id: string
  nome: string
  especialidade: string | null
  is_online: boolean
  rating: number | null
  saldo: number
  leads_gratis_data: string | null
}

export default function PrestadorDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [toggling, setToggling] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [payModal, setPayModal] = useState<Pedido | null>(null)
  const [contatosRevelados, setContatosRevelados] = useState<Record<string, string>>({})
  const [pageLoading, setPageLoading] = useState(true)

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    try {
      // getSession lê do localStorage — funciona após setSession() no login
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      if (!userId) { setPageLoading(false); return }

      const [{ data: prof }, { data: peds }, { data: lds }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('pedidos').select('id, descricao, endereco, urgencia, created_at, cliente_nome, cliente_telefone').eq('status', 'aberto').order('created_at', { ascending: false }).limit(10),
        supabase.from('leads').select('*').eq('prestador_id', userId),
      ])

      if (prof) setProfile(prof as Profile)
      if (peds) setPedidos(peds as Pedido[])
      if (lds) setLeads(lds as Lead[])
    } catch (e) {
      console.error('carregarDados error:', e)
    } finally {
      setPageLoading(false)
    }
  }, [])

  useEffect(() => { carregarDados() }, [carregarDados])

  const toggleOnline = async () => {
    if (!profile) return
    setToggling(true)
    const novoStatus = !profile.is_online

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      if (!userId) return

      await supabase.from('profiles').update({
        is_online: novoStatus,
        last_seen: new Date().toISOString(),
      }).eq('id', userId)

      // Pega GPS ao ficar online
      if (novoStatus && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async pos => {
          await supabase.from('profiles').update({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }).eq('id', userId)
        })
      }

      setProfile(p => p ? { ...p, is_online: novoStatus } : p)
    } catch (e) {
      console.error('toggleOnline error:', e)
    } finally {
      setToggling(false)
    }
  }

  const hoje = new Date().toISOString().split('T')[0]
  const gratisDispo = !profile?.leads_gratis_data || profile.leads_gratis_data < hoje

  const leadDoPedido = (pedidoId: string) => leads.find(l => l.pedido_id === pedidoId)

  const handleVerContato = async (pedido: Pedido) => {
    const lead = leadDoPedido(pedido.id)
    if (lead?.contato_revelado) return

    setLoadingId(pedido.id)
    try {
      const res = await fetch('/api/lead/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId: pedido.id }),
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) { alert(data.error ?? 'Erro'); return }

      if (data.gratis) {
        setContatosRevelados(p => ({ ...p, [pedido.id]: data.telefone }))
        await carregarDados()
      } else {
        setPayModal(pedido)
        // Abre checkout InfinitePay
        window.open(data.paymentUrl, '_blank')
      }
    } finally {
      setLoadingId(null)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const nomeExibido = profile?.nome ?? 'Prestador'
  const online = profile?.is_online ?? false

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Olá, {nomeExibido.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 text-sm">{profile?.especialidade ?? 'Prestador de serviços'}</p>
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
              {online ? 'Você aparece no mapa e nas buscas da sua região.' : 'Ative para aparecer no mapa e receber pedidos.'}
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

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-2">🎁</div>
          <p className="text-xs text-gray-400 mb-1">Lead grátis hoje</p>
          <p className="font-black text-gray-900 text-sm">{gratisDispo ? '✅ Disponível' : '⏳ Usado'}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-2">💬</div>
          <p className="text-xs text-gray-400 mb-1">Pedidos na área</p>
          <p className="font-black text-gray-900 text-sm">{pedidos.length} disponíveis</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-2">⭐</div>
          <p className="text-xs text-gray-400 mb-1">Avaliação</p>
          <p className="font-black text-gray-900 text-sm">{profile?.rating ? profile.rating.toFixed(1) : '—'}</p>
        </div>
      </div>

      {/* Pedidos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Pedidos na sua área</h2>
            <p className="text-gray-400 text-xs mt-0.5">{pedidos.length} pedidos abertos</p>
          </div>
          {!online && (
            <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full">
              Fique online para receber
            </span>
          )}
        </div>

        {pedidos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold">Nenhum pedido aberto na sua área</p>
            <p className="text-sm mt-1">Fique online para ser notificado quando chegar</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pedidos.map(p => {
              const lead = leadDoPedido(p.id)
              const revelado = lead?.contato_revelado || !!contatosRevelados[p.id]
              const telefone = contatosRevelados[p.id] || (revelado ? p.cliente_telefone : null)
              const carregando = loadingId === p.id
              const eGratis = gratisDispo && !lead

              return (
                <div key={p.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-bold text-gray-900 text-sm">Pedido de serviço</p>
                        {p.urgencia === 'urgente' && (
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">🚨 Urgente</span>
                        )}
                        <span className="text-gray-400 text-xs ml-auto">
                          {new Date(p.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{p.descricao}</p>
                      <p className="text-gray-400 text-xs">📍 {p.endereco}</p>
                    </div>
                  </div>

                  {revelado && telefone ? (
                    <a href={formatWhatsApp(telefone)} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all w-fit">
                      <span>💬</span> Chamar {p.cliente_nome} no WhatsApp
                    </a>
                  ) : (
                    <button onClick={() => handleVerContato(p)} disabled={carregando || !!payModal}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:scale-105 transition-all disabled:opacity-50">
                      {carregando ? '⏳ Processando...' : eGratis ? '🎁 Ver contato — GRÁTIS' : `💬 Ver contato — R$ ${PRECO_LEAD.toFixed(2)}`}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal aguardando pagamento */}
      {payModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💳</div>
              <p className="font-black text-gray-900">Pagamento em andamento</p>
              <p className="text-gray-500 text-sm mt-1">Complete o pagamento de R$ {PRECO_LEAD.toFixed(2)} na aba que abriu</p>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-3 mb-4 text-xs text-orange-700">
              <span className="animate-spin">⏳</span> Aguardando confirmação do pagamento...
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm">Cancelar</button>
              <button onClick={() => { setPayModal(null); carregarDados() }} className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl text-sm">Já paguei ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
