'use client'

import { useState } from 'react'

const posts = [
  {
    id: 1, brand: 'Nike Brasil', type: 'Story', value: 180, deadline: '2026-06-01',
    status: 'pendente', color: 'from-orange-400 to-red-500', logo: '👟',
    desc: 'Story linha running com link',
  },
  {
    id: 2, brand: 'Natura', type: 'Feed 7 dias', value: 480, deadline: '2026-06-03',
    status: 'em andamento', color: 'from-pink-400 to-rose-500', logo: '🌸',
    desc: 'Post hidratante nova linha',
  },
  {
    id: 3, brand: 'Gympass', type: 'Story', value: 250, deadline: '2026-05-31',
    status: 'urgente', color: 'from-violet-400 to-purple-500', logo: '💪',
    desc: 'Story app no treino diário',
  },
  {
    id: 4, brand: 'Adidas', type: 'Feed', value: 320, deadline: '2026-05-28',
    status: 'entregue', color: 'from-blue-400 to-indigo-500', logo: '⚡',
    desc: 'Post lookbook coleção',
  },
  {
    id: 5, brand: 'iFood', type: 'Story', value: 150, deadline: '2026-05-25',
    status: 'pago', color: 'from-red-400 to-orange-500', logo: '🍔',
    desc: 'Story pedido chegando',
  },
]

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pendente:     { label: 'Pendente',      color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'em andamento': { label: 'Em andamento', color: 'text-blue-700',   bg: 'bg-blue-100'   },
  urgente:      { label: '🚨 Urgente',    color: 'text-red-700',    bg: 'bg-red-100'    },
  entregue:     { label: 'Entregue',      color: 'text-purple-700', bg: 'bg-purple-100' },
  pago:         { label: '✓ Pago',        color: 'text-green-700',  bg: 'bg-green-100'  },
}

export default function MeusPostsPage() {
  const [delivered, setDelivered] = useState<number[]>([4, 5])
  const [modal, setModal] = useState<typeof posts[0] | null>(null)
  const [link, setLink] = useState('')
  const [filter, setFilter] = useState('todos')

  const tabs = ['todos', 'pendente', 'em andamento', 'entregue', 'pago']
  const filtered = filter === 'todos' ? posts : posts.filter(p => p.status === filter)

  const markDelivered = (id: number) => {
    setDelivered(p => [...p, id])
    setModal(null)
    setLink('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Meus Posts 📋</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie suas campanhas aceitas e marque as entregas</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'A entregar', value: '3', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
          { label: 'Aguardando confirmação', value: '1', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
          { label: 'Pagamentos pendentes', value: 'R$ 1.060', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border rounded-xl p-3 text-center`}>
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              filter === t
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(post => {
          const cfg = statusConfig[post.status]
          const isDelivered = delivered.includes(post.id) || post.status === 'pago'
          return (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {post.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-gray-900">{post.brand}</p>
                      <p className="text-gray-400 text-xs">{post.type} • Prazo: {post.deadline}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{post.desc}</p>
                </div>
              </div>

              <div className="px-5 pb-5 flex items-center justify-between">
                <p className="text-xl font-black text-gray-900">R$ {post.value}</p>
                {!isDelivered && post.status !== 'entregue' ? (
                  <button
                    onClick={() => setModal(post)}
                    className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:scale-105 transition-all"
                  >
                    Marcar entregue
                  </button>
                ) : post.status === 'pago' ? (
                  <span className="text-green-600 font-bold text-sm">💸 Pago</span>
                ) : (
                  <span className="text-purple-600 font-semibold text-sm bg-purple-50 px-4 py-2 rounded-full">
                    Aguardando marca confirmar
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Delivery modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-black text-gray-900 mb-1">Marcar como entregue</h2>
              <p className="text-gray-400 text-sm mb-5">{modal.brand} • {modal.type}</p>

              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Link do post publicado</label>
                <input
                  type="url"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  placeholder="https://instagram.com/p/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
                <p className="text-blue-700 text-xs font-medium">
                  ℹ️ A marca tem 48h para confirmar. Se não confirmar no prazo, o pagamento é liberado automaticamente.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setModal(null); setLink('') }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => markDelivered(modal.id)}
                  disabled={!link}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:scale-105 transition-all"
                >
                  Confirmar entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
