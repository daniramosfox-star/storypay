import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalPrestadores },
    { count: totalPedidos },
    { count: totalLeads },
    { data: prestadoresOnline },
    { data: pedidosRecentes },
    { data: leadsHoje },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('tipo', 'prestador'),
    supabase.from('pedidos').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('id, nome, especialidade, cidade_id').eq('tipo', 'prestador').eq('is_online', true).limit(5),
    supabase.from('pedidos').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('leads').select('valor, gratis').gte('created_at', new Date().toISOString().split('T')[0]),
  ])

  const totalOnline = prestadoresOnline?.length ?? 0
  const receitaHoje = (leadsHoje ?? []).filter(l => !l.gratis).reduce((s, l) => s + (l.valor ?? 0), 0)
  const leadsVendidosHoje = (leadsHoje ?? []).filter(l => !l.gratis).length

  const stats = [
    { label: 'Prestadores online agora', value: totalOnline.toString(), icon: '🟢', color: 'from-green-400 to-emerald-600' },
    { label: 'Total de pedidos', value: (totalPedidos ?? 0).toString(), icon: '📋', color: 'from-orange-400 to-red-500' },
    { label: 'Leads vendidos hoje', value: leadsVendidosHoje.toString(), icon: '💬', color: 'from-blue-400 to-indigo-600' },
    { label: 'Receita hoje', value: `R$ ${receitaHoje.toFixed(2)}`, icon: '💰', color: 'from-violet-500 to-purple-600' },
    { label: 'Total de prestadores', value: (totalPrestadores ?? 0).toString(), icon: '👥', color: 'from-teal-400 to-cyan-600' },
    { label: 'Total de leads', value: (totalLeads ?? 0).toString(), icon: '🎯', color: 'from-pink-400 to-rose-500' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Painel Admin 📊</h1>
          <p className="text-gray-400 text-sm mt-0.5">Dados em tempo real do Frepay</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {totalOnline} online agora
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prestadores online */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Prestadores online</h2>
            <Link href="/admin/usuarios" className="text-orange-500 text-sm hover:underline">Ver todos →</Link>
          </div>
          {(prestadoresOnline ?? []).length === 0 ? (
            <p className="p-6 text-center text-gray-400 text-sm">Nenhum prestador online agora</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {(prestadoresOnline ?? []).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {p.nome[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{p.nome}</p>
                    <p className="text-gray-400 text-xs truncate">{p.especialidade ?? '—'}</p>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pedidos recentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Pedidos recentes</h2>
            <Link href="/admin/campanhas" className="text-orange-500 text-sm hover:underline">Ver todos →</Link>
          </div>
          {(pedidosRecentes ?? []).length === 0 ? (
            <p className="p-6 text-center text-gray-400 text-sm">Nenhum pedido ainda</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {(pedidosRecentes ?? []).map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <span className="text-xl flex-shrink-0">{p.urgencia === 'urgente' ? '🚨' : '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-1">{p.descricao}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(p.created_at).toLocaleString('pt-BR')} · {p.endereco?.split(',')[0]}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    p.status === 'aberto' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
