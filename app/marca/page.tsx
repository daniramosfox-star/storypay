import Link from 'next/link'

const stats = [
  { label: 'Saldo disponível', value: 'R$ 8.500', icon: '💳', color: 'from-indigo-500 to-violet-500', sub: 'Depositar mais →' },
  { label: 'Campanhas ativas', value: '4', icon: '📣', color: 'from-orange-400 to-red-400', sub: '12 influencers publicando' },
  { label: 'Alcance estimado', value: '2.1M', icon: '👁️', color: 'from-blue-400 to-cyan-400', sub: 'Este mês' },
  { label: 'Gasto total', value: 'R$ 14.320', icon: '📈', color: 'from-green-400 to-emerald-500', sub: 'ROI médio: 4.2x' },
]

const activeCampaigns = [
  { name: 'Running Nike Inverno', niche: 'Fitness', posts: 8, pending: 2, budget: 2400, spent: 1440, color: 'from-orange-400 to-red-500' },
  { name: 'Hidratante Natura Verão', niche: 'Beleza', posts: 5, pending: 1, budget: 1600, spent: 960, color: 'from-pink-400 to-rose-500' },
  { name: 'App Nike Training', niche: 'Fitness', posts: 3, pending: 0, budget: 900, spent: 540, color: 'from-violet-400 to-purple-500' },
]

const disputes = [
  { influencer: '@marcoslima', campaign: 'Running Nike Inverno', value: 180, daysAgo: 1 },
]

export default function MarcaDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard da Marca 🏢</h1>
          <p className="text-gray-400 text-sm mt-0.5">Nike Brasil • Bem-vindo de volta</p>
        </div>
        <Link
          href="/marca/criar-campanha"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition-all hover:shadow-lg hover:shadow-indigo-300"
        >
          + Nova campanha
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-indigo-500 mt-1 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Dispute alert */}
      {disputes.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-red-800 text-sm">Entrega para confirmar</p>
              <p className="text-red-600 text-xs">{disputes[0].influencer} entregou "{disputes[0].campaign}". Confirme em 48h ou o pagamento é liberado automaticamente.</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <Link href="/marca/campanhas" className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-700 transition-all">
              Revisar
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active campaigns */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Campanhas ativas</h2>
            <Link href="/marca/campanhas" className="text-indigo-600 text-sm font-medium hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {activeCampaigns.map((c, i) => {
              const pct = Math.round((c.spent / c.budget) * 100)
              return (
                <div key={i} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-black text-xs flex-shrink-0`}>
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                      <p className="text-gray-400 text-xs">{c.niche} • {c.posts} posts • {c.pending} pendentes</p>
                    </div>
                    <span className="text-xs font-bold text-gray-600 flex-shrink-0">{pct}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`bg-gradient-to-r ${c.color} h-1.5 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">Gasto: R$ {c.spent}</span>
                    <span className="text-xs text-gray-400">Budget: R$ {c.budget}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
            <p className="font-bold text-lg mb-1">Crie uma nova campanha</p>
            <p className="text-white/70 text-sm mb-4">Em menos de 5 minutos sua campanha está no ar para os influencers do seu nicho.</p>
            <Link
              href="/marca/criar-campanha"
              className="inline-block bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-full hover:scale-105 transition-all"
            >
              Criar agora →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Desempenho do mês</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Posts publicados', value: '38', icon: '📸' },
                { label: 'Influencers ativos', value: '12', icon: '🧑‍🤳' },
                { label: 'Alcance total', value: '2.1M', icon: '👁️' },
                { label: 'Engajamento médio', value: '4.8%', icon: '❤️' },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{m.icon}</span>
                    <span className="text-sm text-gray-600">{m.label}</span>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
