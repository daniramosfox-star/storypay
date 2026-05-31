'use client'

import { useState } from 'react'

const niches = ['Todos', 'Fitness', 'Moda', 'Beleza', 'Games', 'Gastronomia', 'Finanças', 'Pets', 'Viagem']

const influencers = [
  { name: 'Ana Souza', handle: '@anasouza', niche: 'Fitness', followers: '128K', rating: 4.9, posts: 47, color: 'from-orange-400 to-red-500', emoji: '🏋️‍♀️', deliveryRate: '98%', avgValue: 'R$ 180' },
  { name: 'Marcos Lima', handle: '@marcoslima', niche: 'Games', followers: '342K', rating: 4.8, posts: 89, color: 'from-blue-400 to-violet-500', emoji: '🎮', deliveryRate: '100%', avgValue: 'R$ 280' },
  { name: 'Julia Ferreira', handle: '@juliafashion', niche: 'Moda', followers: '89K', rating: 5.0, posts: 31, color: 'from-pink-400 to-rose-500', emoji: '👗', deliveryRate: '100%', avgValue: 'R$ 220' },
  { name: 'Pedro Costa', handle: '@pedrocosta_br', niche: 'Finanças', followers: '215K', rating: 4.7, posts: 62, color: 'from-green-400 to-emerald-500', emoji: '💰', deliveryRate: '95%', avgValue: 'R$ 350' },
  { name: 'Camila Ramos', handle: '@camilabeauty', niche: 'Beleza', followers: '176K', rating: 4.9, posts: 55, color: 'from-fuchsia-400 to-pink-500', emoji: '💄', deliveryRate: '97%', avgValue: 'R$ 260' },
  { name: 'Lucas Prado', handle: '@lucasprado_chef', niche: 'Gastronomia', followers: '95K', rating: 4.8, posts: 38, color: 'from-yellow-400 to-orange-500', emoji: '🍕', deliveryRate: '96%', avgValue: 'R$ 190' },
  { name: 'Fernanda Vieira', handle: '@ferviagem', niche: 'Viagem', followers: '203K', rating: 4.9, posts: 71, color: 'from-cyan-400 to-blue-500', emoji: '✈️', deliveryRate: '99%', avgValue: 'R$ 320' },
  { name: 'Bruno Santos', handle: '@brunopets', niche: 'Pets', followers: '67K', rating: 4.6, posts: 24, color: 'from-amber-400 to-orange-500', emoji: '🐾', deliveryRate: '92%', avgValue: 'R$ 140' },
]

export default function MarcaInfluencersPage() {
  const [niche, setNiche] = useState('Todos')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('rating')
  const [modal, setModal] = useState<typeof influencers[0] | null>(null)

  const filtered = influencers
    .filter(inf => (niche === 'Todos' || inf.niche === niche) &&
      (inf.name.toLowerCase().includes(search.toLowerCase()) || inf.handle.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'followers') return parseInt(b.followers) - parseInt(a.followers)
      return b.posts - a.posts
    })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Influencers 🧑‍🤳</h1>
        <p className="text-gray-400 text-sm mt-1">Explore os influencers disponíveis na plataforma</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar influencer..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
          <option value="rating">Melhor avaliação</option>
          <option value="followers">Mais seguidores</option>
          <option value="posts">Mais posts</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {niches.map(n => (
          <button key={n} onClick={() => setNiche(n)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              niche === n ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}>
            {n}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((inf, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`bg-gradient-to-br ${inf.color} h-20 flex items-center justify-center text-4xl`}>
              {inf.emoji}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{inf.name}</p>
                  <p className="text-gray-400 text-xs">{inf.handle}</p>
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-1">{inf.niche}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 text-sm">{inf.followers}</p>
                  <p className="text-gray-400 text-xs">Seguidores</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 text-sm">{inf.rating} ⭐</p>
                  <p className="text-gray-400 text-xs">Avaliação</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-green-600 text-sm">{inf.deliveryRate}</p>
                  <p className="text-gray-400 text-xs">Entrega</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 text-sm">{inf.avgValue}</p>
                  <p className="text-gray-400 text-xs">Valor médio</p>
                </div>
              </div>
              <button
                onClick={() => setModal(inf)}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm rounded-xl hover:scale-105 transition-all"
              >
                Ver perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className={`bg-gradient-to-br ${modal.color} p-6 text-center`}>
              <div className="text-5xl mb-2">{modal.emoji}</div>
              <h2 className="text-white text-xl font-black">{modal.name}</h2>
              <p className="text-white/70 text-sm">{modal.handle} • {modal.niche}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Seguidores', value: modal.followers },
                  { label: 'Avaliação', value: `${modal.rating} ⭐` },
                  { label: 'Posts entregues', value: modal.posts },
                  { label: 'Taxa de entrega', value: modal.deliveryRate },
                ].map((m, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="font-bold text-gray-900">{m.value}</p>
                    <p className="text-gray-400 text-xs">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-5">
                <p className="text-indigo-700 text-xs font-medium">
                  💡 Para convidar este influencer, crie uma campanha no nicho <strong>{modal.niche}</strong> — ele verá automaticamente.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">
                  Fechar
                </button>
                <button onClick={() => setModal(null)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all">
                  Criar campanha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
