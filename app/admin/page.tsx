import Link from 'next/link'

const stats = [
  { label: 'Prestadores online agora', value: '142', icon: '🟢', color: 'from-green-400 to-emerald-600' },
  { label: 'Pedidos abertos hoje', value: '318', icon: '📋', color: 'from-orange-400 to-red-500' },
  { label: 'Leads vendidos hoje', value: '94', icon: '💬', color: 'from-blue-400 to-indigo-600' },
  { label: 'Faturamento hoje', value: 'R$ 168', icon: '💰', color: 'from-violet-500 to-purple-600' },
  { label: 'Total prestadores', value: '8.420', icon: '👥', color: 'from-teal-400 to-cyan-600' },
  { label: 'Cidades atendidas', value: '42', icon: '🏙️', color: 'from-pink-400 to-rose-500' },
]

const prestadoresOnline = [
  { nome: 'João Silva', cat: '❄️ Ar condicionado', bairro: 'Setor Bueno — GO', dist: null, status: 'online' },
  { nome: 'Pedro Alves', cat: '⚡ Elétrica', bairro: 'Setor Marista — GO', dist: null, status: 'online' },
  { nome: 'Lucas Costa', cat: '🔧 Encanamento', bairro: 'Moema — SP', dist: null, status: 'online' },
  { nome: 'Ana Souza', cat: '🧹 Limpeza', bairro: 'Asa Sul — DF', dist: null, status: 'online' },
  { nome: 'Carlos Melo', cat: '🖌️ Pintura', bairro: 'Jardim Goiás — GO', dist: null, status: 'online' },
]

const pedidosRecentes = [
  { cat: '❄️', desc: 'AC não gela — Setor Bueno, GO', tempo: '2 min', leads: 1 },
  { cat: '⚡', desc: 'Trocar quadro de luz — Moema, SP', tempo: '5 min', leads: 2 },
  { cat: '🔧', desc: 'Vazamento na cozinha — Asa Sul, DF', tempo: '9 min', leads: 0 },
  { cat: '🔨', desc: 'Fixar porta e instalar prateleira', tempo: '14 min', leads: 1 },
]

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Painel Admin — Frepay 📊</h1>
          <p className="text-gray-400 text-sm mt-0.5">Visão geral da plataforma em tempo real</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Sistema operacional
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Faturamento breakdown */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 mb-6 text-white">
        <p className="font-bold mb-3">💰 Faturamento — Modelo Pay per Lead</p>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="text-2xl font-black">94</p><p className="text-white/70 text-xs">Leads vendidos hoje</p></div>
          <div><p className="text-2xl font-black">R$ 1,99</p><p className="text-white/70 text-xs">Preço por lead</p></div>
          <div><p className="text-2xl font-black">R$ 168</p><p className="text-white/70 text-xs">Receita do dia (94 × 1,99 - grátis)</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prestadores online */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Prestadores online agora</h2>
            <Link href="/admin/usuarios" className="text-orange-500 text-sm hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {prestadoresOnline.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{p.nome[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{p.nome}</p>
                  <p className="text-gray-400 text-xs">{p.cat} • {p.bairro}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-600 font-semibold">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos recentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Pedidos recentes</h2>
            <Link href="/admin/campanhas" className="text-orange-500 text-sm hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pedidosRecentes.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <span className="text-2xl flex-shrink-0">{p.cat}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{p.desc}</p>
                  <p className="text-xs text-gray-400">Há {p.tempo}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${p.leads > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.leads} lead{p.leads !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
