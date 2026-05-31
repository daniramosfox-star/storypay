'use client'

import { useState } from 'react'

const niches = ['Todos', 'Fitness', 'Moda', 'Beleza', 'Games', 'Gastronomia', 'Finanças', 'Pets', 'Viagem']

const influencers = [
  { name: 'Ana Souza', handle: '@anasouza', niche: 'Fitness', followers: '128K', avatar: '🏋️‍♀️', rating: 4.9, posts: 47, color: 'from-orange-400 to-red-500' },
  { name: 'Marcos Lima', handle: '@marcoslima', niche: 'Games', followers: '342K', avatar: '🎮', rating: 4.8, posts: 89, color: 'from-blue-400 to-violet-500' },
  { name: 'Julia Ferreira', handle: '@juliafashion', niche: 'Moda', followers: '89K', avatar: '👗', rating: 5.0, posts: 31, color: 'from-pink-400 to-rose-500' },
  { name: 'Pedro Costa', handle: '@pedrocosta_br', niche: 'Finanças', followers: '215K', avatar: '💰', rating: 4.7, posts: 62, color: 'from-green-400 to-emerald-500' },
  { name: 'Camila Ramos', handle: '@camilabeauty', niche: 'Beleza', followers: '176K', avatar: '💄', rating: 4.9, posts: 55, color: 'from-fuchsia-400 to-pink-500' },
  { name: 'Lucas Prado', handle: '@lucasprado_chef', niche: 'Gastronomia', followers: '95K', avatar: '🍕', rating: 4.8, posts: 38, color: 'from-yellow-400 to-orange-500' },
  { name: 'Fernanda Vieira', handle: '@ferviagem', niche: 'Viagem', followers: '203K', avatar: '✈️', rating: 4.9, posts: 71, color: 'from-cyan-400 to-blue-500' },
  { name: 'Bruno Santos', handle: '@brunopets', niche: 'Pets', followers: '67K', avatar: '🐾', rating: 4.6, posts: 24, color: 'from-amber-400 to-orange-500' },
]

export default function InfluencerShowcase() {
  const [activeNiche, setActiveNiche] = useState('Todos')
  const [search, setSearch] = useState('')

  const filtered = influencers.filter(inf => {
    const matchNiche = activeNiche === 'Todos' || inf.niche === activeNiche
    const matchSearch = inf.name.toLowerCase().includes(search.toLowerCase()) ||
      inf.handle.toLowerCase().includes(search.toLowerCase())
    return matchNiche && matchSearch
  })

  return (
    <section id="influencers" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-pink-100 text-pink-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Vitrine de Influencers
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Encontre o influencer perfeito
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Mais de 12 mil influencers verificados prontos para divulgar sua marca.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome ou @..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
          />
        </div>

        {/* Niche filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {niches.map(n => (
            <button
              key={n}
              onClick={() => setActiveNiche(n)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeNiche === n
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((inf, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm card-hover">
              <div className={`bg-gradient-to-br ${inf.color} h-24 flex items-center justify-center text-5xl`}>
                {inf.avatar}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{inf.name}</h3>
                    <p className="text-gray-400 text-xs">{inf.handle}</p>
                  </div>
                  <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {inf.niche}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{inf.followers}</p>
                    <p className="text-gray-400 text-xs">Seguidores</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{inf.rating} ⭐</p>
                    <p className="text-gray-400 text-xs">Avaliação</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{inf.posts}</p>
                    <p className="text-gray-400 text-xs">Posts</p>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 border-2 border-violet-500 text-violet-600 hover:bg-violet-600 hover:text-white rounded-full text-sm font-semibold transition-all">
                  Ver perfil
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>Nenhum influencer encontrado para "{search}"</p>
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href="/cadastro?tipo=marca"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-all hover:shadow-lg hover:shadow-violet-500/30"
          >
            Ver todos os influencers →
          </a>
        </div>
      </div>
    </section>
  )
}
