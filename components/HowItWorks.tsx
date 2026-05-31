'use client'

import { useState } from 'react'

const marcaSteps = [
  {
    icon: '💳',
    title: 'Crie sua conta e deposite saldo',
    desc: 'Cadastro rápido, assine os termos e deposite o valor que quiser gastar nas campanhas.',
  },
  {
    icon: '🎯',
    title: 'Monte sua campanha',
    desc: 'Escolha nicho, tipo de post (story ou feed), faça upload do material, escreva a legenda, coloque hashtags e links.',
  },
  {
    icon: '📣',
    title: 'Influencers aceitam e publicam',
    desc: 'A plataforma exibe sua campanha para influencers do nicho escolhido. Eles aceitam e fazem o post.',
  },
  {
    icon: '📊',
    title: 'Receba o relatório completo',
    desc: 'Acompanhe entregas em tempo real e receba o relatório final com todos os resultados da campanha.',
  },
]

const influencerSteps = [
  {
    icon: '📱',
    title: 'Crie seu perfil',
    desc: 'Preencha seu @, nicho, número de seguidores e bio. Em minutos você já aparece para as marcas.',
  },
  {
    icon: '🔥',
    title: 'Veja as campanhas do seu nicho',
    desc: 'Abre o app e aparece um feed de campanhas disponíveis pra você aceitar quando quiser, igual o Uber.',
  },
  {
    icon: '✅',
    title: 'Aceite e publique',
    desc: 'Aceitou? Use o material da marca, faça o post e marque como entregue na plataforma.',
  },
  {
    icon: '💰',
    title: 'Receba na conta',
    desc: 'A marca tem 48h para confirmar. Confirmado, o pagamento cai automaticamente na sua conta.',
  },
]

export default function HowItWorks() {
  const [tab, setTab] = useState<'marca' | 'influencer'>('influencer')
  const steps = tab === 'marca' ? marcaSteps : influencerSteps

  return (
    <section id="como-funciona" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Simples pra todo mundo
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Em poucos passos você começa a monetizar ou divulgar sua marca.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white border border-gray-200 rounded-full p-1 flex gap-1 shadow-sm">
            <button
              onClick={() => setTab('influencer')}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                tab === 'influencer'
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Para Influencers
            </button>
            <button
              onClick={() => setTab('marca')}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                tab === 'marca'
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Para Marcas
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-violet-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                {i + 1}
              </div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>

              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-violet-300 to-pink-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
