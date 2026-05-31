'use client'

import { useState } from 'react'

const campaigns = [
  { id: 1, name: 'Running Nike Inverno', brand: 'Nike Brasil', niche: 'Fitness', type: 'Story', budget: 2400, spent: 1440, posts: 8, status: 'ativa', created: '20/05/2026' },
  { id: 2, name: 'Hidratante Natura Verão', brand: 'Natura Brasil', niche: 'Beleza', type: 'Feed 7d', budget: 1600, spent: 960, posts: 5, status: 'ativa', created: '22/05/2026' },
  { id: 3, name: 'App XP Investimentos', brand: 'XP Investimentos', niche: 'Finanças', type: 'Story', budget: 1260, spent: 840, posts: 3, status: 'ativa', created: '25/05/2026' },
  { id: 4, name: 'Shopee Dia dos Namorados', brand: 'Shopee Brasil', niche: 'Moda', type: 'Feed 30d', budget: 6000, spent: 5400, posts: 18, status: 'ativa', created: '01/05/2026' },
  { id: 5, name: 'Gympass Janeiro', brand: 'Gympass', niche: 'Fitness', type: 'Story', budget: 3000, spent: 3000, posts: 15, status: 'encerrada', created: '02/01/2026' },
  { id: 6, name: 'iFood Verão', brand: 'iFood', niche: 'Gastronomia', type: 'Story', budget: 1800, spent: 1800, posts: 12, status: 'encerrada', created: '15/12/2025' },
]

export default function AdminCampanhasPage() {
  const [filter, setFilter] = useState('todas')
  const [search, setSearch] = useState('')
  const [paused, setPaused] = useState<number[]>([])

  const filtered = campaigns.filter(c => {
    const matchStatus = filter === 'todas' || c.status === filter
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const isPaused = (id: number) => paused.includes(id)
  const togglePause = (id: number) => setPaused(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Campanhas 📣</h1>
        <p className="text-gray-400 text-sm mt-1">Monitore e gerencie todas as campanhas da plataforma</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total de campanhas', value: campaigns.length },
          { label: 'Ativas agora', value: campaigns.filter(c => c.status === 'ativa').length },
          { label: 'Volume total', value: `R$ ${campaigns.reduce((s, c) => s + c.budget, 0).toLocaleString('pt-BR')}` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar campanha ou marca..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white" />
        </div>
        <div className="flex gap-2">
          {['todas', 'ativa', 'encerrada'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Campanha</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Tipo</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Posts</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => {
                const pct = Math.round((c.spent / c.budget) * 100)
                const paused = isPaused(c.id)
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                      <p className="text-gray-400 text-xs">{c.brand} • {c.niche}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{c.type}</td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-900">R$ {c.spent} / R$ {c.budget}</p>
                      <div className="bg-gray-100 rounded-full h-1.5 mt-1 w-24">
                        <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700 hidden lg:table-cell">{c.posts} posts</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        c.status === 'ativa' && !paused ? 'bg-green-100 text-green-700' :
                        paused ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {paused ? '⏸ Pausada' : c.status === 'ativa' ? '● Ativa' : 'Encerrada'}
                      </span>
                    </td>
                    <td className="p-4">
                      {c.status === 'ativa' && (
                        <button onClick={() => togglePause(c.id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            paused
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}>
                          {paused ? '▶ Retomar' : '⏸ Pausar'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
