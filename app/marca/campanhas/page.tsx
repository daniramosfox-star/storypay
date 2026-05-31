'use client'

import { useState } from 'react'

const campaigns = [
  {
    id: 1, name: 'Running Nike Inverno', niche: 'Fitness', type: 'Story', platform: 'Instagram',
    budget: 2400, spent: 1440, posts: 8, pending: 2, status: 'ativa',
    color: 'from-orange-400 to-red-500',
    deliveries: [
      { influencer: '@anasouza', followers: '128K', value: 180, status: 'entregue', link: 'https://instagram.com/p/abc', date: '30/05/2026' },
      { influencer: '@marcoslima', followers: '342K', value: 180, status: 'pendente_confirmacao', link: 'https://instagram.com/p/def', date: '30/05/2026' },
      { influencer: '@fit_carol', followers: '95K', value: 180, status: 'aceita', link: '', date: '' },
    ],
  },
  {
    id: 2, name: 'Hidratante Natura Verão', niche: 'Beleza', type: 'Feed 7d', platform: 'Instagram',
    budget: 1600, spent: 960, posts: 5, pending: 1, status: 'ativa',
    color: 'from-pink-400 to-rose-500',
    deliveries: [
      { influencer: '@camilabeauty', followers: '176K', value: 320, status: 'pago', link: 'https://instagram.com/p/ghi', date: '28/05/2026' },
      { influencer: '@beleza_da_ju', followers: '88K', value: 320, status: 'entregue', link: 'https://instagram.com/p/jkl', date: '29/05/2026' },
    ],
  },
  {
    id: 3, name: 'Campanha Inverno 2025', niche: 'Moda', type: 'Feed 30d', platform: 'Instagram',
    budget: 3000, spent: 3000, posts: 10, pending: 0, status: 'encerrada',
    color: 'from-violet-400 to-purple-500',
    deliveries: [],
  },
]

const statusDelivery: Record<string, { label: string; color: string; bg: string }> = {
  aceita:               { label: 'Aguardando post', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  entregue:             { label: 'Revisar entrega', color: 'text-purple-700', bg: 'bg-purple-100' },
  pendente_confirmacao: { label: 'Confirmar', color: 'text-blue-700', bg: 'bg-blue-100' },
  pago:                 { label: '✓ Pago', color: 'text-green-700', bg: 'bg-green-100' },
  disputa:              { label: '⚠️ Disputa', color: 'text-red-700', bg: 'bg-red-100' },
}

export default function MarcaCampanhasPage() {
  const [selected, setSelected] = useState<typeof campaigns[0] | null>(null)
  const [confirmed, setConfirmed] = useState<string[]>([])
  const [disputed, setDisputed] = useState<string[]>([])

  const getDelivStatus = (d: typeof campaigns[0]['deliveries'][0]) => {
    const key = `${d.influencer}`
    if (confirmed.includes(key)) return 'pago'
    if (disputed.includes(key)) return 'disputa'
    return d.status
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Campanhas 📣</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie todas as suas campanhas e confirme entregas</p>
      </div>

      <div className="grid gap-5">
        {campaigns.map(c => {
          const pct = Math.round((c.spent / c.budget) * 100)
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`bg-gradient-to-r ${c.color} p-4 flex items-center justify-between`}>
                <div>
                  <p className="text-white font-bold">{c.name}</p>
                  <p className="text-white/70 text-xs">{c.platform} • {c.type} • {c.niche}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  c.status === 'ativa' ? 'bg-green-400 text-white' : 'bg-white/30 text-white'
                }`}>
                  {c.status === 'ativa' ? '● Ativa' : 'Encerrada'}
                </span>
              </div>

              <div className="p-4">
                <div className="flex gap-6 mb-3 flex-wrap">
                  <div><p className="text-xs text-gray-400">Posts</p><p className="font-bold text-gray-900">{c.posts}</p></div>
                  <div><p className="text-xs text-gray-400">Pendentes</p><p className="font-bold text-orange-600">{c.pending}</p></div>
                  <div><p className="text-xs text-gray-400">Gasto</p><p className="font-bold text-gray-900">R$ {c.spent}</p></div>
                  <div><p className="text-xs text-gray-400">Budget</p><p className="font-bold text-gray-900">R$ {c.budget}</p></div>
                </div>
                <div className="bg-gray-100 rounded-full h-2 mb-1">
                  <div className={`bg-gradient-to-r ${c.color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <span>{pct}% do budget utilizado</span>
                  <span>R$ {c.budget - c.spent} restantes</span>
                </div>

                <button
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  className="text-indigo-600 text-sm font-semibold hover:underline"
                >
                  {selected?.id === c.id ? '▲ Fechar entregas' : `▼ Ver entregas (${c.deliveries.length})`}
                </button>
              </div>

              {selected?.id === c.id && (
                <div className="border-t border-gray-100">
                  {c.deliveries.length === 0 ? (
                    <p className="p-4 text-sm text-gray-400 text-center">Nenhuma entrega ainda.</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {c.deliveries.map((d, i) => {
                        const st = getDelivStatus(d)
                        const cfg = statusDelivery[st]
                        const key = d.influencer
                        return (
                          <div key={i} className="p-4 flex items-center gap-4 flex-wrap">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {d.influencer[1].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">{d.influencer}</p>
                              <p className="text-gray-400 text-xs">{d.followers} seguidores{d.date ? ` • entregue em ${d.date}` : ''}</p>
                              {d.link && (
                                <a href={d.link} target="_blank" rel="noreferrer" className="text-indigo-500 text-xs hover:underline truncate block">
                                  {d.link}
                                </a>
                              )}
                            </div>
                            <p className="font-bold text-gray-900 text-sm flex-shrink-0">R$ {d.value}</p>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            {(st === 'entregue' || st === 'pendente_confirmacao') && (
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => setConfirmed(p => [...p, key])}
                                  className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => setDisputed(p => [...p, key])}
                                  className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-200 transition-all"
                                >
                                  Disputar
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
