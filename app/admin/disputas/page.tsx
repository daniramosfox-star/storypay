'use client'

import { useState } from 'react'

const disputes = [
  {
    id: 1,
    campaign: 'Hidratante Natura Verão',
    brand: 'Natura Brasil',
    influencer: '@anasouza',
    value: 320,
    openedAt: '29/05/2026 14:30',
    hoursOpen: 26,
    brandClaim: 'O influencer publicou o story mas sem o swipe-up e sem marcar a conta da Natura. Não atendeu os requisitos da campanha.',
    influencerClaim: 'Publiquei conforme o brief enviado. O link de swipe-up não funcionava no meu perfil pois não tenho o recurso habilitado.',
    link: 'https://instagram.com/stories/anasouza/abc123',
    evidence: 'Screenshot do story publicado enviado pelo influencer',
    status: 'aberta',
  },
  {
    id: 2,
    campaign: 'Running Nike Inverno',
    brand: 'Nike Brasil',
    influencer: '@fit_carol',
    value: 180,
    openedAt: '28/05/2026 09:15',
    hoursOpen: 51,
    brandClaim: 'Influencer não entregou no prazo de 48h. O prazo expirou sem nenhuma publicação.',
    influencerClaim: 'Tive um problema de saúde e não pude publicar no prazo. Publiquei 12h depois.',
    link: '',
    evidence: 'Atestado médico enviado pelo influencer',
    status: 'aberta',
  },
  {
    id: 3,
    campaign: 'App XP Investimentos',
    brand: 'XP Investimentos',
    influencer: '@pedrocosta_br',
    value: 420,
    openedAt: '27/05/2026 16:00',
    hoursOpen: 70,
    brandClaim: 'Post foi publicado e logo apagado após confirmação na plataforma.',
    influencerClaim: 'O post foi apagado por engano. Republiquei imediatamente e está no ar.',
    link: 'https://instagram.com/p/pedrocosta_xp',
    evidence: 'Screenshot antes e depois fornecido pelo influencer',
    status: 'aberta',
  },
]

export default function AdminDisputasPage() {
  const [verdicts, setVerdicts] = useState<Record<number, 'marca' | 'influencer' | null>>({})
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [resolved, setResolved] = useState<number[]>([])
  const [expanded, setExpanded] = useState<number | null>(1)

  const resolve = (id: number, winner: 'marca' | 'influencer') => {
    setVerdicts(p => ({ ...p, [id]: winner }))
    setResolved(p => [...p, id])
  }

  const open = disputes.filter(d => !resolved.includes(d.id))
  const done = disputes.filter(d => resolved.includes(d.id))

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Disputas ⚖️</h1>
        <p className="text-gray-400 text-sm mt-1">Analise e resolva os conflitos entre marcas e influencers</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Abertas', value: open.length, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Resolvidas hoje', value: done.length, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
          { label: 'Valor em disputa', value: `R$ ${open.reduce((s, d) => s + d.value, 0)}`, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border rounded-xl p-4 text-center`}>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Open disputes */}
      {open.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Disputas abertas</h2>
          {open.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
              <div
                className="flex items-start justify-between p-5 cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => setExpanded(expanded === d.id ? null : d.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">⚖️</div>
                  <div>
                    <p className="font-bold text-gray-900">{d.campaign}</p>
                    <p className="text-gray-500 text-xs">{d.brand} vs {d.influencer} • R$ {d.value}</p>
                    <p className="text-xs mt-1">
                      <span className={`font-semibold ${d.hoursOpen > 48 ? 'text-red-600' : 'text-orange-600'}`}>
                        {d.hoursOpen > 48 ? '🚨' : '⏱'} {d.hoursOpen}h em aberto
                      </span>
                      <span className="text-gray-400"> • Aberta em {d.openedAt}</span>
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm flex-shrink-0">{expanded === d.id ? '▲' : '▼'}</span>
              </div>

              {expanded === d.id && (
                <div className="border-t border-gray-100 p-5 flex flex-col gap-4">
                  {/* Claims */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">🏢 Alegação da marca</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{d.brandClaim}</p>
                    </div>
                    <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2">🧑‍🤳 Alegação do influencer</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{d.influencerClaim}</p>
                    </div>
                  </div>

                  {/* Evidence */}
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-xl">📎</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Evidência enviada</p>
                      <p className="text-xs text-gray-500">{d.evidence}</p>
                    </div>
                    {d.link && (
                      <a href={d.link} target="_blank" rel="noreferrer"
                        className="ml-auto text-indigo-500 text-xs hover:underline flex-shrink-0">
                        Ver post →
                      </a>
                    )}
                  </div>

                  {/* Admin note */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nota de decisão (interna)</label>
                    <textarea
                      value={notes[d.id] ?? ''}
                      onChange={e => setNotes(p => ({ ...p, [d.id]: e.target.value }))}
                      placeholder="Explique a decisão..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                    />
                  </div>

                  {/* Verdict buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => resolve(d.id, 'marca')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all text-sm"
                    >
                      🏢 Dar razão à marca
                      <span className="block text-xs font-normal opacity-80">Pagamento estornado</span>
                    </button>
                    <button
                      onClick={() => resolve(d.id, 'influencer')}
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all text-sm"
                    >
                      🧑‍🤳 Dar razão ao influencer
                      <span className="block text-xs font-normal opacity-80">Pagamento liberado</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolved */}
      {done.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Resolvidas</h2>
          {done.map(d => {
            const winner = verdicts[d.id]
            return (
              <div key={d.id} className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✅</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{d.campaign}</p>
                  <p className="text-gray-400 text-xs">{d.brand} vs {d.influencer}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${
                  winner === 'marca' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
                }`}>
                  {winner === 'marca' ? '🏢 Marca venceu' : '🧑‍🤳 Influencer venceu'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {open.length === 0 && done.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-semibold">Todas as disputas foram resolvidas!</p>
        </div>
      )}
    </div>
  )
}
