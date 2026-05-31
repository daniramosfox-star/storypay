'use client'

import { useState } from 'react'
import Link from 'next/link'

const niches = ['Fitness', 'Moda', 'Beleza', 'Games', 'Gastronomia', 'Finanças', 'Pets', 'Viagem']
const platforms = ['Instagram', 'TikTok', 'Instagram + TikTok']

const feedDurations = [
  { label: '24 horas', value: '24h', mult: 1 },
  { label: '7 dias', value: '7d', mult: 1.5 },
  { label: '30 dias', value: '30d', mult: 2 },
  { label: 'Permanente', value: 'permanente', mult: 3 },
]

const influencersCatalog = [
  { id: 1, handle: '@anasouza', niche: 'Fitness', followers: '128K', rating: 4.9, emoji: '🏋️‍♀️', color: 'from-orange-400 to-red-500' },
  { id: 2, handle: '@marcoslima', niche: 'Games', followers: '342K', rating: 4.8, emoji: '🎮', color: 'from-blue-400 to-violet-500' },
  { id: 3, handle: '@juliafashion', niche: 'Moda', followers: '89K', rating: 5.0, emoji: '👗', color: 'from-pink-400 to-rose-500' },
  { id: 4, handle: '@pedrocosta_br', niche: 'Finanças', followers: '215K', rating: 4.7, emoji: '💰', color: 'from-green-400 to-emerald-500' },
  { id: 5, handle: '@camilabeauty', niche: 'Beleza', followers: '176K', rating: 4.9, emoji: '💄', color: 'from-fuchsia-400 to-pink-500' },
  { id: 6, handle: '@lucasprado_chef', niche: 'Gastronomia', followers: '95K', rating: 4.8, emoji: '🍕', color: 'from-yellow-400 to-orange-500' },
  { id: 7, handle: '@ferviagem', niche: 'Viagem', followers: '203K', rating: 4.9, emoji: '✈️', color: 'from-cyan-400 to-blue-500' },
  { id: 8, handle: '@brunopets', niche: 'Pets', followers: '67K', rating: 4.6, emoji: '🐾', color: 'from-amber-400 to-orange-500' },
]

type AlcanceMode = 'um' | 'grupo'

export default function CriarCampanhaPage() {
  const [step, setStep] = useState(1)
  const [launched, setLaunched] = useState(false)

  // Form state
  const [nome, setNome] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [postType, setPostType] = useState<'story' | 'feed'>('story')
  const [feedDuration, setFeedDuration] = useState('24h')
  const [material, setMaterial] = useState<File | null>(null)
  const [legenda, setLegenda] = useState('')
  const [orcamento, setOrcamento] = useState('')
  const [alcance, setAlcance] = useState<AlcanceMode>('grupo')
  const [nicho, setNicho] = useState('') // '' = livre
  const [influencerEspecifico, setInfluencerEspecifico] = useState<number | null>(null)

  const [tried1, setTried1] = useState(false)
  const [tried2, setTried2] = useState(false)
  const [tried3, setTried3] = useState(false)

  const dur = feedDurations.find(d => d.value === feedDuration)
  const orcamentoNum = Number(orcamento) || 0
  const valorFinal = postType === 'feed' ? orcamentoNum * (dur?.mult ?? 1) : orcamentoNum

  const step1Valid = !!nome && !!platform
  const step2Valid = postType === 'feed' ? !!legenda : true
  const step3Valid =
    orcamentoNum >= 50 &&
    (alcance === 'grupo' || (alcance === 'um' && !!influencerEspecifico))

  const catalogFiltered = nicho
    ? influencersCatalog.filter(i => i.niche === nicho)
    : influencersCatalog

  const selectedInf = influencersCatalog.find(i => i.id === influencerEspecifico)

  const goToStep2 = () => { setTried1(true); if (step1Valid) { setStep(2); setTried1(false) } }
  const goToStep3 = () => { setTried2(true); if (step2Valid) { setStep(3); setTried2(false) } }
  const launch    = () => { setTried3(true); if (step3Valid) setLaunched(true) }

  const err = (show: boolean, msg: string) => show ? (
    <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5 animate-pulse-slow">
      <span>⚠️</span> {msg}
    </p>
  ) : null

  if (launched) {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="text-7xl mb-5">{alcance === 'um' ? '🤝' : nicho ? '🎯' : '⚡'}</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          {alcance === 'um' ? 'Proposta enviada!' : 'Campanha no ar!'}
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          {alcance === 'um'
            ? <><strong>{selectedInf?.handle}</strong> tem 48h para aceitar ou recusar.</>
            : nicho
              ? <>Influencers de <strong>{nicho}</strong> já estão vendo sua oferta.</>
              : <>Notificação enviada para <strong>todos os influencers</strong>. Quem aceitar primeiro fica com o trabalho — tem 20 minutos para postar e enviar o print.</>
          }
        </p>
        <p className="text-xs text-gray-400 mb-8">Você será notificado por e-mail quando houver aceite.</p>
        <div className="flex gap-3">
          <Link href="/marca/campanhas" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-5 py-3 rounded-full text-sm hover:scale-105 transition-all">
            Ver campanhas
          </Link>
          <button
            onClick={() => { setLaunched(false); setStep(1); setNome(''); setLegenda(''); setOrcamento(''); setMaterial(null); setInfluencerEspecifico(null); setNicho(''); setAlcance('grupo') }}
            className="border border-gray-200 text-gray-600 font-semibold px-5 py-3 rounded-full text-sm hover:bg-gray-50"
          >
            Nova campanha
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Criar campanha ✨</h1>
        <p className="text-gray-400 text-sm mt-1">Preencha os dados e sua campanha vai ao ar em minutos</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {['Campanha', 'Criativo', 'Distribuição'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
              step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {i < 2 && <div className={`h-0.5 flex-1 rounded-full ${step > i + 1 ? 'bg-indigo-400' : 'bg-gray-100'}`} />}
          </div>
        ))}
      </div>

      {/* ──────────── STEP 1 — CAMPANHA ──────────── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <h2 className="font-bold text-gray-900">Dados da campanha</h2>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nome da campanha</label>
            <input
              value={nome} onChange={e => setNome(e.target.value)}
              placeholder="Ex: Lançamento Tênis Running Inverno"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${tried1 && !nome ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {err(tried1 && !nome, 'Dê um nome para sua campanha')}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Plataforma</label>
            <div className="flex gap-2 flex-wrap">
              {platforms.map(p => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    platform === p ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}>
                  {p === 'Instagram' ? '📷' : p === 'TikTok' ? '🎵' : '📷🎵'} {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Tipo de post</label>
            <div className="grid grid-cols-2 gap-3">
              {(['story', 'feed'] as const).map(t => (
                <button key={t} onClick={() => setPostType(t)}
                  className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all flex flex-col items-center gap-1.5 ${
                    postType === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}>
                  <span className="text-2xl">{t === 'story' ? '📱' : '🖼️'}</span>
                  <span>{t === 'story' ? 'Story' : 'Post no Feed'}</span>
                  <span className="text-xs font-normal opacity-60">{t === 'story' ? 'Expira em 24h' : 'Fica no perfil'}</span>
                </button>
              ))}
            </div>
          </div>

          {postType === 'feed' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Tempo que o post deve ficar no ar</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {feedDurations.map(d => (
                  <button key={d.value} onClick={() => setFeedDuration(d.value)}
                    className={`py-3 rounded-xl border-2 text-xs font-semibold transition-all text-center ${
                      feedDuration === d.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}>
                    <p className="font-bold">{d.label}</p>
                    <p className="text-indigo-400 mt-0.5">{d.mult}× o valor</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={goToStep2}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all mt-1">
            Continuar →
          </button>
        </div>
      )}

      {/* ──────────── STEP 2 — CRIATIVO ──────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <h2 className="font-bold text-gray-900">Material criativo</h2>

          {/* Upload */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              {postType === 'story' ? 'Imagem ou vídeo do story' : 'Imagem ou vídeo do post'}
            </label>
            <label htmlFor="material-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
              <input id="material-upload" type="file" accept="image/*,video/*" className="hidden"
                onChange={e => setMaterial(e.target.files?.[0] ?? null)} />
              {material ? (
                <>
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-sm font-semibold text-gray-700 truncate max-w-xs">{material.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(material.size / 1024 / 1024).toFixed(1)} MB — clique para trocar</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm font-semibold text-gray-700">Clique para fazer upload</p>
                  <p className="text-xs text-gray-400 mt-1">Imagem ou vídeo · máx. 100MB</p>
                </>
              )}
            </label>
          </div>

          {/* Legenda — SÓ para feed */}
          {postType === 'feed' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Legenda do post <span className="text-red-400">*</span>
              </label>
              <textarea
                value={legenda}
                onChange={e => setLegenda(e.target.value)}
                rows={5}
                maxLength={2200}
                placeholder="Escreva aqui a legenda completa..."
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${tried2 && !legenda ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Escreva a legenda completa que o influencer vai copiar e colar no post. Inclua hashtags e emojis que desejar.
              </p>
              <p className="text-xs text-gray-300 mt-1 text-right">{legenda.length}/2.200</p>
              {err(tried2 && !legenda, 'A legenda é obrigatória para posts no feed')}
            </div>
          )}

          {/* Info story */}
          {postType === 'story' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              📱 Story não tem legenda — o influencer vai publicar o material que você enviou acima. Você pode incluir instruções no campo de briefing da próxima etapa se precisar.
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">← Voltar</button>
            <button onClick={goToStep3}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all">
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* ──────────── STEP 3 — DISTRIBUIÇÃO + ORÇAMENTO ──────────── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
          <h2 className="font-bold text-gray-900">Distribuição e orçamento</h2>

          {/* Alcance: um ou grupo */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Quem vai fazer o post?</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setAlcance('grupo')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${alcance === 'grupo' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                <p className="text-xl mb-1">👥</p>
                <p className={`font-bold text-sm ${alcance === 'grupo' ? 'text-indigo-700' : 'text-gray-800'}`}>Grupo de influencers</p>
                <p className="text-xs text-gray-400 mt-0.5">Vários aceitam e publicam</p>
              </button>
              <button onClick={() => setAlcance('um')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${alcance === 'um' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                <p className="text-xl mb-1">🎯</p>
                <p className={`font-bold text-sm ${alcance === 'um' ? 'text-indigo-700' : 'text-gray-800'}`}>Um influencer específico</p>
                <p className="text-xs text-gray-400 mt-0.5">Você escolhe quem</p>
              </button>
            </div>
          </div>

          {/* Grupo: escolher nicho ou livre */}
          {alcance === 'grupo' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Filtrar por nicho</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setNicho('')}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
                    nicho === '' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}>
                  ⚡ Livre — todos os nichos
                </button>
                {niches.map(n => (
                  <button key={n} onClick={() => setNicho(n)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
                      nicho === n ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>

              {nicho === '' ? (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 leading-relaxed">
                  ⚡ <strong>Modo Livre:</strong> a notificação chega para todos os influencers da plataforma ao mesmo tempo. Quem aceitar primeiro fica com o trabalho. O influencer tem <strong>20 minutos</strong> para postar e enviar o print como prova. Se não enviar no prazo, a oferta volta para o próximo.
                </div>
              ) : (
                <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700">
                  🎯 A campanha será exibida para os influencers do nicho <strong>{nicho}</strong>. Qualquer um pode aceitar e publicar.
                </div>
              )}
            </div>
          )}

          {/* Um influencer específico: catálogo */}
          {alcance === 'um' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Filtrar por nicho (opcional)</label>
              {err(tried3 && alcance === 'um' && !influencerEspecifico, 'Escolha um influencer para continuar')}
              <select value={nicho} onChange={e => { setNicho(e.target.value); setInfluencerEspecifico(null) }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white mb-3">
                <option value="">Todos os nichos</option>
                {niches.map(n => <option key={n}>{n}</option>)}
              </select>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {catalogFiltered.map(inf => (
                  <button key={inf.id} onClick={() => setInfluencerEspecifico(inf.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      influencerEspecifico === inf.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-300'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${inf.color} flex items-center justify-center text-xl flex-shrink-0`}>
                      {inf.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${influencerEspecifico === inf.id ? 'text-indigo-700' : 'text-gray-900'}`}>{inf.handle}</p>
                      <p className="text-xs text-gray-400">{inf.niche} · {inf.followers} seguidores · {inf.rating}⭐</p>
                    </div>
                    {influencerEspecifico === inf.id && <span className="text-indigo-500 text-lg">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orçamento — UM único campo */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              {alcance === 'um' ? 'Valor da proposta (R$)' : 'Orçamento total da campanha (R$)'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">R$</span>
              <input
                type="number"
                value={orcamento}
                onChange={e => setOrcamento(e.target.value)}
                placeholder="0,00"
                className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${tried3 && orcamentoNum < 50 ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
            </div>
            {orcamentoNum >= 50 && (
              <div className="mt-2 bg-gray-50 rounded-xl p-3 text-xs flex flex-col gap-1">
                {postType === 'feed' && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Multiplicador ({feedDuration})</span>
                    <span className="font-semibold text-gray-700">× {dur?.mult}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxa da plataforma (15%)</span>
                  <span className="font-semibold text-gray-700">- R$ {(valorFinal * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                  <span className="font-bold text-gray-800">
                    {alcance === 'um' ? 'O influencer recebe' : 'Valor total investido'}
                  </span>
                  <span className="font-black text-indigo-700">R$ {(valorFinal * 0.85).toFixed(2)}</span>
                </div>
                {alcance === 'grupo' && orcamentoNum > 0 && (
                  <p className="text-indigo-500 font-medium mt-1 text-center">
                    ≈ pode pagar até {Math.floor(orcamentoNum / (orcamentoNum > 500 ? 200 : 100))} influencers com esse orçamento
                  </p>
                )}
              </div>
            )}
            {err(tried3 && orcamentoNum === 0, 'Informe o valor do orçamento')}
            {err(tried3 && orcamentoNum > 0 && orcamentoNum < 50, 'O valor mínimo é R$ 50')}
            <p className="text-xs text-gray-400 mt-1.5">Mínimo: R$ 50 · Seu saldo atual: R$ 8.500</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">← Voltar</button>
            <button
              onClick={launch}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all"
            >
              {alcance === 'um' ? '🤝 Enviar proposta' : nicho === '' ? '⚡ Lançar para todos' : '🚀 Lançar campanha'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
