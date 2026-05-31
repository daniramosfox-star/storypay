'use client'

import { useState } from 'react'
import { PRECO_LEAD, formatWhatsApp } from '@/lib/frepay/data'

const todos = [
  { id: '1', cat: '❄️', titulo: 'Ar condicionado', desc: 'AC split 12000 BTUs não está gelando. Já limpei o filtro.', end: 'Setor Bueno, Goiânia', dist: '0.8 km', urgente: true, tempo: '3 min atrás', nome: 'Maria S.', tel: '62999990001' },
  { id: '2', cat: '❄️', titulo: 'Ar condicionado', desc: 'Instalação de ar condicionado novo, apartamento 2 quartos.', end: 'Setor Marista, Goiânia', dist: '1.4 km', urgente: false, tempo: '12 min atrás', nome: 'Carlos M.', tel: '62999990002' },
  { id: '3', cat: '❄️', titulo: 'Ar condicionado', desc: 'Ar condicionado pingando água dentro do quarto.', end: 'Jardim Goiás, Goiânia', dist: '2.2 km', urgente: false, tempo: '28 min atrás', nome: 'Ana R.', tel: '62999990003' },
  { id: '4', cat: '❄️', titulo: 'Ar condicionado', desc: 'Manutenção preventiva, dois aparelhos split.', end: 'Setor Sul, Goiânia', dist: '3.1 km', urgente: false, tempo: '45 min atrás', nome: 'Pedro L.', tel: '62999990004' },
]

export default function PedidosPage() {
  const [comprados, setComprados] = useState<string[]>([])
  const [modal, setModal] = useState<typeof todos[0] | null>(null)

  const leadsHoje = comprados.length
  const eGratis = (id: string) => !comprados.includes(id) && leadsHoje === 0

  const comprar = (id: string) => { setComprados(p => [...p, id]); setModal(null) }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pedidos na sua área 🔔</h1>
          <p className="text-gray-400 text-sm mt-0.5">{todos.length} pedidos disponíveis agora</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Online — recebendo pedidos
        </div>
      </div>

      {/* Banner grátis */}
      {leadsHoje === 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-5 flex items-center gap-3 text-white">
          <span className="text-3xl">🎁</span>
          <div>
            <p className="font-black">Sua 1ª indicação do dia é GRÁTIS!</p>
            <p className="text-white/80 text-xs">Clique em qualquer pedido abaixo e veja o contato sem pagar nada.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {todos.map(p => {
          const comprado = comprados.includes(p.id)
          return (
            <div key={p.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${p.urgente ? 'border-red-200' : 'border-gray-100'}`}>
              {p.urgente && (
                <div className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
                  🚨 URGENTE — cliente precisa de atendimento imediato
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{p.cat}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-gray-900">{p.titulo}</p>
                      <span className="text-gray-400 text-xs ml-auto">{p.tempo}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{p.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                      <span>📍 {p.end}</span>
                      <span>🗺 {p.dist}</span>
                    </div>
                  </div>
                </div>

                {comprado ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-green-800 text-sm">✅ Contato revelado — {p.nome}</p>
                      <p className="text-green-600 text-xs">Clique para abrir no WhatsApp</p>
                    </div>
                    <a href={formatWhatsApp(p.tel)} target="_blank" rel="noreferrer"
                      className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5">
                      <span>💬</span> WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModal(p)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:scale-105 transition-all flex items-center gap-2">
                      {eGratis(p.id)
                        ? <><span>🎁</span> Ver contato — GRÁTIS</>
                        : <><span>💬</span> Ver contato — R$ {PRECO_LEAD.toFixed(2)}</>
                      }
                    </button>
                    <p className="text-xs text-gray-400">
                      {eGratis(p.id) ? '1ª do dia grátis' : 'WhatsApp abre na hora'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5">
              <p className="text-white font-black">{modal.cat} {modal.titulo}</p>
              <p className="text-white/80 text-sm">{modal.dist} • {modal.end}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">"{modal.desc}"</p>
              {eGratis(modal.id) ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-4">
                  <p className="text-2xl mb-1">🎁</p>
                  <p className="font-black text-green-800">GRÁTIS — 1ª indicação do dia!</p>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3 mb-4">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-black text-orange-800">R$ {PRECO_LEAD.toFixed(2)} por este contato</p>
                    <p className="text-orange-600 text-xs">PIX ou cartão • WhatsApp abre na hora</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm">Cancelar</button>
                <button onClick={() => comprar(modal.id)} className="flex-1 bg-green-500 text-white font-black py-3 rounded-xl text-sm hover:bg-green-600">
                  {eGratis(modal.id) ? '🎁 Pegar grátis' : '💬 Pagar e ver WhatsApp'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
