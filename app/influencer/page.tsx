import Link from 'next/link'

const stats = [
  { label: 'Saldo disponível', value: 'R$ 1.240,00', icon: '💰', color: 'from-violet-500 to-pink-500', sub: '+R$ 320 essa semana' },
  { label: 'Campanhas ativas', value: '3', icon: '🔥', color: 'from-orange-400 to-red-400', sub: '1 aguardando entrega' },
  { label: 'Posts entregues', value: '47', icon: '✅', color: 'from-green-400 to-emerald-500', sub: 'Taxa de entrega 98%' },
  { label: 'Avaliação média', value: '4.9 ⭐', icon: '🏆', color: 'from-yellow-400 to-orange-400', sub: 'Top 5% da plataforma' },
]

const activeCampaigns = [
  { brand: 'Nike Brasil', type: 'Story', deadline: '2 dias', value: 'R$ 180', status: 'pendente', color: 'from-orange-400 to-red-500' },
  { brand: 'Natura', type: 'Feed 7 dias', deadline: '5 dias', value: 'R$ 480', status: 'em andamento', color: 'from-pink-400 to-rose-500' },
  { brand: 'XP Investimentos', type: 'Story', deadline: '1 dia', value: 'R$ 250', status: 'urgente', color: 'from-green-400 to-emerald-500' },
]

const recentPayments = [
  { brand: 'Adidas', value: '+R$ 320,00', date: 'Hoje, 14h23', status: 'recebido' },
  { brand: 'iFood', value: '+R$ 150,00', date: 'Ontem', status: 'recebido' },
  { brand: 'Nubank', value: '+R$ 410,00', date: '28/05/2026', status: 'recebido' },
]

export default function InfluencerDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Olá, Ana! 👋</h1>
          <p className="text-gray-400 text-sm mt-0.5">Aqui está o resumo da sua conta</p>
        </div>
        <Link
          href="/influencer/campanhas"
          className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition-all hover:shadow-lg hover:shadow-violet-300"
        >
          + Ver campanhas
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
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active campaigns */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Campanhas ativas</h2>
            <Link href="/influencer/meus-posts" className="text-violet-600 text-sm font-medium hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {activeCampaigns.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                  {c.brand[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{c.brand}</p>
                  <p className="text-gray-400 text-xs">{c.type} • prazo: {c.deadline}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900 text-sm">{c.value}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    c.status === 'urgente'
                      ? 'bg-red-100 text-red-600'
                      : c.status === 'em andamento'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-50">
            <Link
              href="/influencer/meus-posts"
              className="block w-full text-center py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-400 hover:text-violet-600 transition-all"
            >
              Marcar entregas →
            </Link>
          </div>
        </div>

        {/* Recent payments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Pagamentos recentes</h2>
            <Link href="/influencer/financeiro" className="text-violet-600 text-sm font-medium hover:underline">Ver extrato</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPayments.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                  💸
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{p.brand}</p>
                  <p className="text-gray-400 text-xs">{p.date}</p>
                </div>
                <p className="font-bold text-green-600 text-sm flex-shrink-0">{p.value}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-50 bg-gradient-to-r from-violet-50 to-pink-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Total este mês</p>
              <p className="font-black text-gray-900">R$ 2.340,00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip banner */}
      <div className="mt-6 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-bold">🚀 Ative o plano Pro</p>
          <p className="text-white/70 text-sm mt-0.5">Apareça em destaque e receba campanhas antes de todo mundo</p>
        </div>
        <button className="bg-white text-violet-700 font-bold text-sm px-5 py-2.5 rounded-full hover:scale-105 transition-all flex-shrink-0 ml-4">
          Assinar
        </button>
      </div>
    </div>
  )
}
