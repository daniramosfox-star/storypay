const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5']
const weekRevenue = [8400, 12200, 9800, 15600, 14320]
const maxRev = Math.max(...weekRevenue)

const transactions = [
  { desc: 'Depósito Nike Brasil', type: 'deposito', value: '+R$ 10.000', date: '30/05/2026', status: 'confirmado' },
  { desc: 'Taxa plataforma — @anasouza (Nike)', type: 'taxa', value: '+R$ 27', date: '30/05/2026', status: 'confirmado' },
  { desc: 'Pagamento @marcoslima — Nike', type: 'pagamento', value: '-R$ 153', date: '30/05/2026', status: 'confirmado' },
  { desc: 'Taxa plataforma — @camilabeauty (Natura)', type: 'taxa', value: '+R$ 48', date: '29/05/2026', status: 'confirmado' },
  { desc: 'Pagamento @camilabeauty — Natura', type: 'pagamento', value: '-R$ 272', date: '29/05/2026', status: 'confirmado' },
  { desc: 'Depósito Shopee Brasil', type: 'deposito', value: '+R$ 6.000', date: '28/05/2026', status: 'confirmado' },
  { desc: 'Saque @ferviagem — PIX', type: 'saque', value: '-R$ 1.200', date: '28/05/2026', status: 'processado' },
]

const typeCfg: Record<string, { color: string; bg: string }> = {
  deposito:  { color: 'text-green-700',  bg: 'bg-green-100'  },
  taxa:      { color: 'text-violet-700', bg: 'bg-violet-100' },
  pagamento: { color: 'text-blue-700',   bg: 'bg-blue-100'   },
  saque:     { color: 'text-orange-700', bg: 'bg-orange-100' },
}

export default function AdminFinanceiroPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Financeiro 💰</h1>
        <p className="text-gray-400 text-sm mt-1">Faturamento e métricas financeiras da plataforma</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Receita total (taxa 15%)', value: 'R$ 180.000', sub: 'Acumulado', color: 'from-violet-500 to-purple-600' },
          { label: 'Volume transacionado', value: 'R$ 1,2M', sub: 'Total da plataforma', color: 'from-green-400 to-emerald-600' },
          { label: 'Receita este mês', value: 'R$ 48.200', sub: '+18% vs mês anterior', color: 'from-blue-400 to-indigo-600' },
          { label: 'Saques pendentes', value: 'R$ 3.400', sub: '8 influencers aguardando', color: 'from-orange-400 to-red-500' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${k.color} flex items-center justify-center text-white text-sm mb-3`}>
              💎
            </div>
            <p className="text-xs text-gray-400 mb-0.5">{k.label}</p>
            <p className="text-xl font-black text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Volume transacionado (últimas 5 semanas)</h2>
          <div className="flex items-end gap-3 h-48">
            {weekRevenue.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-600">R$ {(v / 1000).toFixed(1)}k</span>
                <div
                  className="w-full bg-gradient-to-t from-violet-600 to-pink-400 rounded-t-lg transition-all"
                  style={{ height: `${(v / maxRev) * 100}%` }}
                />
                <span className="text-xs text-gray-400">{weeks[i]}</span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
            {[
              { label: 'Taxa plataforma', value: 'R$ 2.148', pct: '15%', color: 'bg-violet-500' },
              { label: 'Pago a influencers', value: 'R$ 12.172', pct: '85%', color: 'bg-green-500' },
              { label: 'Em disputa', value: 'R$ 920', pct: '6%', color: 'bg-red-400' },
            ].map((b, i) => (
              <div key={i} className="text-center">
                <div className={`w-3 h-3 rounded-full ${b.color} mx-auto mb-1`} />
                <p className="text-xs text-gray-400">{b.label}</p>
                <p className="font-bold text-gray-900 text-sm">{b.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pending withdrawals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Saques pendentes</h3>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">8</span>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { handle: '@anasouza', value: 'R$ 600', pix: 'ana@email.com' },
              { handle: '@ferviagem', value: 'R$ 1.200', pix: '(11) 99999-0000' },
              { handle: '@lucasprado_chef', value: 'R$ 380', pix: '123.456.789-00' },
              { handle: '@brunopets', value: 'R$ 220', pix: 'bruno@email.com' },
            ].map((w, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {w.handle[1].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{w.handle}</p>
                  <p className="text-xs text-gray-400 truncate">{w.pix}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-600">{w.value}</p>
                  <button className="text-xs text-indigo-600 font-semibold hover:underline">Pagar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Extrato da plataforma</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t, i) => {
                const cfg = typeCfg[t.type]
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-800">{t.desc}</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{t.date}</td>
                    <td className={`p-4 text-right font-bold text-sm ${t.value.startsWith('+') ? 'text-green-600' : 'text-gray-700'}`}>
                      {t.value}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
