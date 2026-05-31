'use client'

import { useState } from 'react'

const niches = ['Todos', 'Fitness', 'Moda', 'Beleza', 'Games', 'Gastronomia', 'Finanças', 'Pets', 'Viagem']

const campaigns = [
  {
    id: 1, brand: 'Nike Brasil', niche: 'Fitness', type: 'Story', platform: 'Instagram',
    value: 180, deadline: '48h', description: 'Publicar story mostrando produto novo da linha running com link nos stories.',
    material: 'Imagem + copy prontos', color: 'from-orange-400 to-red-500', logo: '👟',
  },
  {
    id: 2, brand: 'Natura', niche: 'Beleza', type: 'Feed', platform: 'Instagram',
    value: 320, deadline: '5 dias', description: 'Post no feed apresentando nova linha de hidratantes. Prazo no ar: 7 dias.',
    material: 'Vídeo 30s + legenda', color: 'from-pink-400 to-rose-500', logo: '🌸',
  },
  {
    id: 3, brand: 'Gympass', niche: 'Fitness', type: 'Story', platform: 'Instagram + TikTok',
    value: 250, deadline: '24h', description: 'Story mostrando como usa o app no dia a dia de treinos.',
    material: 'Brief detalhado + link de afiliado', color: 'from-violet-400 to-purple-500', logo: '💪',
  },
  {
    id: 4, brand: 'XP Investimentos', niche: 'Finanças', type: 'Story', platform: 'Instagram',
    value: 420, deadline: '3 dias', description: 'Story educativo sobre renda fixa com swipe-up para landing page.',
    material: 'Template + roteiro gravado', color: 'from-green-400 to-emerald-500', logo: '📈',
  },
  {
    id: 5, brand: 'iFood', niche: 'Gastronomia', type: 'Feed', platform: 'TikTok',
    value: 200, deadline: '4 dias', description: 'Vídeo no TikTok mostrando pedido chegando + reação. Mood: espontâneo.',
    material: 'Cupom de pedido grátis + brief', color: 'from-red-400 to-orange-500', logo: '🍔',
  },
  {
    id: 6, brand: 'Shein Brasil', niche: 'Moda', type: 'Feed', platform: 'Instagram',
    value: 280, deadline: '5 dias', description: 'Foto no feed com peças da coleção de inverno. Mínimo 3 fotos no carrossel.',
    material: 'Créditos na loja + brief', color: 'from-fuchsia-400 to-pink-500', logo: '👗',
  },
]

export default function CampanhasPage() {
  const [activeNiche, setActiveNiche] = useState('Todos')
  const [accepted, setAccepted] = useState<number[]>([])
  const [modal, setModal] = useState<typeof campaigns[0] | null>(null)

  const filtered = campaigns.filter(c => activeNiche === 'Todos' || c.niche === activeNiche)

  const accept = (id: number) => {
    setAccepted(p => [...p, id])
    setModal(null)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Campanhas disponíveis 🔥</h1>
        <p className="text-gray-400 text-sm mt-1">Escolha as campanhas que combinam com seu perfil</p>
      </div>

      {/* Niche filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {niches.map(n => (
          <button
            key={n}
            onClick={() => setActiveNiche(n)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeNiche === n
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(c => {
          const isAccepted = accepted.includes(c.id)
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className={`bg-gradient-to-r ${c.color} p-5 flex items-center gap-3`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                  {c.logo}
                </div>
                <div>
                  <p className="text-white font-bold">{c.brand}</p>
                  <p className="text-white/70 text-xs">{c.platform} • {c.type}</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">{c.niche}</span>
                  <span className="text-gray-400 text-xs">⏱ {c.deadline}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-1">{c.description}</p>
                <p className="text-xs text-gray-400 mb-4">📦 {c.material}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900">R$ {c.value}</span>
                  {isAccepted ? (
                    <span className="bg-green-100 text-green-700 font-semibold text-sm px-4 py-2 rounded-full">
                      ✓ Aceita!
                    </span>
                  ) : (
                    <button
                      onClick={() => setModal(c)}
                      className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm px-4 py-2 rounded-full hover:scale-105 transition-all"
                    >
                      Aceitar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Accept modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-r ${modal.color} p-6`}>
              <div className="text-4xl mb-2">{modal.logo}</div>
              <h2 className="text-white text-xl font-black">{modal.brand}</h2>
              <p className="text-white/70 text-sm">{modal.platform} • {modal.type}</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-xs">Você vai receber</p>
                  <p className="text-3xl font-black text-gray-900">R$ {modal.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Prazo pra entregar</p>
                  <p className="text-xl font-bold text-gray-900">{modal.deadline}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">{modal.description}</p>
              <p className="text-gray-400 text-xs mb-6">📦 Material: {modal.material}</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
                <p className="text-yellow-800 text-xs font-medium">
                  ⚠️ Ao aceitar, você se compromete a entregar no prazo. Não entrega = advertência no perfil.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => accept(modal.id)}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all"
                >
                  Confirmar aceitação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
