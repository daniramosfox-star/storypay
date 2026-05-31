'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-16">
      {/* Background decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm">Plataforma #1 de influencer marketing no Brasil</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Monetize sua{' '}
              <span className="gradient-text">influência</span>{' '}
              do jeito certo
            </h1>

            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Igual ao Uber, mas para influencers. Abra o app, veja campanhas disponíveis pro seu nicho e aceite quando quiser. Simples assim.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/cadastro?tipo=influencer"
                className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 text-center"
              >
                Sou Influencer
              </Link>
              <Link
                href="/cadastro?tipo=marca"
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full text-lg transition-all text-center"
              >
                Sou Marca
              </Link>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-white font-bold text-2xl">12k+</p>
                <p className="text-white/50 text-sm">Influencers ativos</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-white font-bold text-2xl">850+</p>
                <p className="text-white/50 text-sm">Marcas parceiras</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-white font-bold text-2xl">R$4M+</p>
                <p className="text-white/50 text-sm">Pagos a influencers</p>
              </div>
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative animate-float">
              {/* Phone frame */}
              <div className="w-64 h-[520px] bg-gradient-to-b from-gray-900 to-black rounded-[3rem] border-4 border-white/10 shadow-2xl shadow-violet-900/50 relative overflow-hidden">
                {/* Status bar */}
                <div className="h-10 bg-black/50 flex items-center justify-center">
                  <div className="w-20 h-5 bg-black rounded-full" />
                </div>
                {/* App header */}
                <div className="bg-gradient-to-r from-violet-900 to-indigo-900 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white/60 text-xs">Olá, Ana!</p>
                      <p className="text-white font-bold">Campanhas disponíveis</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-violet-400" />
                  </div>
                  <div className="bg-white/10 rounded-xl p-2 flex items-center gap-2">
                    <span className="text-white/50 text-xs">🔍</span>
                    <span className="text-white/40 text-xs">Buscar campanhas...</span>
                  </div>
                </div>
                {/* Campaign cards */}
                <div className="p-3 flex flex-col gap-3">
                  {[
                    { brand: 'Nike Brasil', type: 'Story', value: 'R$ 180', tag: 'Fitness', color: 'from-orange-500 to-red-500' },
                    { brand: 'Natura', type: 'Feed', value: 'R$ 320', tag: 'Beleza', color: 'from-pink-500 to-rose-500' },
                    { brand: 'XP Investimentos', type: 'Story', value: 'R$ 250', tag: 'Finanças', color: 'from-green-500 to-emerald-500' },
                  ].map((c, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{c.brand[0]}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-xs font-semibold">{c.brand}</p>
                          <p className="text-white/40 text-xs">{c.type} • {c.tag}</p>
                        </div>
                        <span className="text-green-400 font-bold text-xs">{c.value}</span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold py-1.5 rounded-lg">
                        Aceitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-12 top-20 bg-white rounded-2xl shadow-xl p-3 animate-float-delay">
                <p className="text-xs text-gray-500">Pagamento recebido</p>
                <p className="text-sm font-bold text-gray-900">+ R$ 320,00 🎉</p>
              </div>
              <div className="absolute -right-10 bottom-24 bg-white rounded-2xl shadow-xl p-3 animate-float">
                <p className="text-xs text-gray-500">Nova campanha</p>
                <p className="text-sm font-bold text-gray-900">R$ 450 disponível</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
