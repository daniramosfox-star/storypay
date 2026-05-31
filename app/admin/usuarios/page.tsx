'use client'

import { useState } from 'react'

const users = [
  { id: 1, name: 'Ana Souza', handle: '@anasouza', type: 'influencer', niche: 'Fitness', followers: '128K', status: 'ativo', warnings: 0, joined: '12/03/2026', earnings: 'R$ 8.400' },
  { id: 2, name: 'Nike Brasil', handle: 'nike.com.br', type: 'marca', niche: '—', followers: '—', status: 'ativo', warnings: 0, joined: '05/01/2026', earnings: 'R$ 48.200 gastos' },
  { id: 3, name: 'Marcos Lima', handle: '@marcoslima', type: 'influencer', niche: 'Games', followers: '342K', status: 'ativo', warnings: 0, joined: '20/02/2026', earnings: 'R$ 12.400' },
  { id: 4, name: 'Carol Fitness', handle: '@fit_carol', type: 'influencer', niche: 'Fitness', followers: '95K', status: 'advertido', warnings: 1, joined: '08/04/2026', earnings: 'R$ 2.100' },
  { id: 5, name: 'Natura Brasil', handle: 'natura.com.br', type: 'marca', niche: '—', followers: '—', status: 'ativo', warnings: 0, joined: '10/02/2026', earnings: 'R$ 32.100 gastos' },
  { id: 6, name: 'Pedro Costa', handle: '@pedrocosta_br', type: 'influencer', niche: 'Finanças', followers: '215K', status: 'ativo', warnings: 0, joined: '01/03/2026', earnings: 'R$ 7.900' },
  { id: 7, name: 'Lucas Fake', handle: '@lucasfake99', type: 'influencer', niche: 'Fitness', followers: '12K', status: 'suspenso', warnings: 3, joined: '30/04/2026', earnings: 'R$ 0' },
  { id: 8, name: 'Shopee Brasil', handle: 'shopee.com.br', type: 'marca', niche: '—', followers: '—', status: 'ativo', warnings: 0, joined: '15/01/2026', earnings: 'R$ 21.800 gastos' },
]

const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
  ativo:     { label: 'Ativo',     color: 'text-green-700',  bg: 'bg-green-100'  },
  advertido: { label: 'Advertido', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  suspenso:  { label: 'Suspenso',  color: 'text-red-700',    bg: 'bg-red-100'    },
}

export default function AdminUsuariosPage() {
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<typeof users[0] | null>(null)
  const [statuses, setStatuses] = useState<Record<number, string>>({})

  const getStatus = (u: typeof users[0]) => statuses[u.id] ?? u.status

  const filtered = users.filter(u => {
    const matchType = filter === 'todos' || u.type === filter
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.handle.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const setStatus = (id: number, s: string) => { setStatuses(p => ({ ...p, [id]: s })); setModal(null) }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Usuários 👥</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie todos os influencers e marcas da plataforma</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total de usuários', value: users.length, color: 'text-gray-900' },
          { label: 'Influencers', value: users.filter(u => u.type === 'influencer').length, color: 'text-violet-700' },
          { label: 'Marcas', value: users.filter(u => u.type === 'marca').length, color: 'text-indigo-700' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuário..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white" />
        </div>
        <div className="flex gap-2">
          {['todos', 'influencer', 'marca'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === t ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
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
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Usuário</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Nicho / Seguidores</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Cadastro</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Movimentação</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => {
                const st = getStatus(u)
                const cfg = statusCfg[st]
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                          u.type === 'influencer' ? 'bg-gradient-to-br from-violet-400 to-pink-400' : 'bg-gradient-to-br from-indigo-400 to-violet-400'
                        }`}>
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                          <p className="text-gray-400 text-xs">{u.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        u.type === 'influencer' ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-sm text-gray-700">{u.niche}</p>
                      <p className="text-xs text-gray-400">{u.followers}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500 hidden lg:table-cell">{u.joined}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {u.warnings > 0 && (
                          <span className="text-xs text-red-500 font-bold">{u.warnings}⚠️</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-sm font-semibold text-gray-700">{u.earnings}</p>
                    </td>
                    <td className="p-4">
                      <button onClick={() => setModal(u)}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all">
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User management modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold ${
                  modal.type === 'influencer' ? 'bg-gradient-to-br from-violet-400 to-pink-400' : 'bg-gradient-to-br from-indigo-400 to-violet-400'
                }`}>
                  {modal.name[0]}
                </div>
                <div>
                  <p className="font-black text-gray-900">{modal.name}</p>
                  <p className="text-gray-400 text-sm">{modal.handle}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${statusCfg[getStatus(modal)].bg} ${statusCfg[getStatus(modal)].color}`}>
                    {statusCfg[getStatus(modal)].label}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Alterar status</p>
              <div className="flex flex-col gap-2 mb-5">
                {[
                  { s: 'ativo', label: '✅ Ativar conta', color: 'border-green-200 hover:bg-green-50 text-green-700' },
                  { s: 'advertido', label: '⚠️ Emitir advertência', color: 'border-yellow-200 hover:bg-yellow-50 text-yellow-700' },
                  { s: 'suspenso', label: '🚫 Suspender conta', color: 'border-red-200 hover:bg-red-50 text-red-700' },
                ].map(opt => (
                  <button key={opt.s} onClick={() => setStatus(modal.id, opt.s)}
                    disabled={getStatus(modal) === opt.s}
                    className={`border rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${opt.color}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setModal(null)}
                className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
