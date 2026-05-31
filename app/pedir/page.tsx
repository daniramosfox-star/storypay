'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { formatWhatsApp } from '@/lib/frepay/data'

const exemplos = [
  'Designer gráfico para criar logo e identidade visual',
  'Eletricista para trocar o quadro de luz',
  'Encanador — torneira pingando',
  'Técnico de ar condicionado para manutenção',
  'Personal trainer para treinos online',
  'Fotógrafo para ensaio de família',
  'Desenvolvedor para criar um site simples',
  'Motorista para mudança residencial',
]

function PedirContent() {
  const [step, setStep] = useState(1)
  const [descricao, setDescricao] = useState('')
  const [endereco, setEndereco] = useState('')
  const [localizando, setLocalizando] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [urgente, setUrgente] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [tried, setTried] = useState(false)

  const formatTel = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 2) return d
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  }

  const usarGeolocalizacao = () => {
    setLocalizando(true)
    navigator.geolocation?.getCurrentPosition(
      () => { setEndereco('Localização obtida via GPS ✓'); setLocalizando(false) },
      () => { setLocalizando(false) }
    )
  }

  const err = (cond: boolean, msg: string) => cond ? (
    <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">⚠️ {msg}</p>
  ) : null

  const avancar = () => {
    setTried(true)
    if (step === 1 && descricao.length >= 10) { setStep(2); setTried(false) }
    if (step === 2 && endereco) { setStep(3); setTried(false) }
    if (step === 3 && nome && telefone.replace(/\D/g,'').length >= 10) setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Pedido enviado!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Prestadores disponíveis na sua área que atendem o que você precisa serão notificados agora. O profissional entrará em contato pelo WhatsApp.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-3xl">📱</span>
            <div className="text-left">
              <p className="font-bold text-green-800 text-sm">Fique de olho no WhatsApp</p>
              <p className="text-green-600 text-xs">{telefone} — o prestador vai chamar em breve</p>
            </div>
          </div>
          <Link href="/" className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all">
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/" className="text-gray-400 hover:text-gray-700">←</Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-black text-xs">F</span>
          </div>
          <span className="font-black text-gray-900">Frepay</span>
        </div>
        <span className="ml-auto text-xs text-gray-400">Passo {step} de 3</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? 'bg-orange-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Step 1 — O que você precisa? */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">O que você precisa?</h1>
              <p className="text-gray-400 text-sm">Descreva livremente — qualquer serviço ou solução</p>
            </div>

            <div>
              <textarea
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                rows={4}
                placeholder="Ex: Preciso de um designer para criar artes para o meu Instagram..."
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-white ${tried && descricao.length < 10 ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              <div className="flex justify-between items-center mt-1">
                {err(tried && descricao.length < 10, 'Descreva com mais detalhes (mín. 10 caracteres)')}
                <p className="text-xs text-gray-300 ml-auto">{descricao.length} chars</p>
              </div>
            </div>

            {/* Exemplos clicáveis */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Exemplos — clique para usar</p>
              <div className="flex flex-wrap gap-2">
                {exemplos.map((ex, i) => (
                  <button key={i} onClick={() => setDescricao(ex)}
                    className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 transition-all text-left">
                    {ex.slice(0, 40)}{ex.length > 40 ? '...' : ''}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-3 cursor-pointer">
              <input type="checkbox" checked={urgente} onChange={e => setUrgente(e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <div>
                <p className="text-sm font-bold text-orange-800">🚨 Urgente</p>
                <p className="text-xs text-orange-600">Preciso de atendimento o mais rápido possível</p>
              </div>
            </label>

            <button onClick={avancar} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl hover:scale-[1.01] transition-all">
              Continuar →
            </button>
          </div>
        )}

        {/* Step 2 — Localização */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Onde você está?</h1>
              <p className="text-gray-400 text-sm">Para encontrar prestadores perto de você</p>
            </div>

            <button onClick={usarGeolocalizacao} disabled={localizando}
              className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-left hover:border-blue-400 transition-all disabled:opacity-50">
              <span className="text-2xl">{localizando ? '⏳' : '📍'}</span>
              <div>
                <p className="font-bold text-blue-800 text-sm">{localizando ? 'Obtendo localização...' : 'Usar minha localização atual'}</p>
                <p className="text-blue-500 text-xs">Mais rápido e preciso</p>
              </div>
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs font-medium">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Digite seu endereço</label>
              <input value={endereco} onChange={e => setEndereco(e.target.value)}
                placeholder="Ex: Rua dos Pinheiros, 120 — Setor Bueno, Goiânia"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white ${tried && !endereco ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
              {err(tried && !endereco, 'Informe seu endereço')}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">← Voltar</button>
              <button onClick={avancar} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all">Continuar →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Contato */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Seus dados de contato</h1>
              <p className="text-gray-400 text-sm">O prestador vai te chamar pelo WhatsApp</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Seu nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Como você se chama?"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white ${tried && !nome ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
              {err(tried && !nome, 'Informe seu nome')}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">WhatsApp / Telefone</label>
              <input value={telefone} onChange={e => setTelefone(formatTel(e.target.value))}
                placeholder="(62) 99999-9999" inputMode="tel"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white ${tried && telefone.replace(/\D/g,'').length < 10 ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
              {err(tried && telefone.replace(/\D/g,'').length < 10, 'Informe um número válido')}
              {telefone.replace(/\D/g,'').length >= 10 && (
                <a href={formatWhatsApp(telefone)} target="_blank" rel="noreferrer"
                  className="mt-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all w-fit">
                  <span className="text-lg">💬</span> Abrir WhatsApp — {telefone}
                </a>
              )}
            </div>

            {/* Resumo */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-xs flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="text-gray-400 flex-shrink-0">Serviço:</span>
                <span className="text-gray-800 font-medium">{descricao.slice(0, 80)}{descricao.length > 80 ? '...' : ''}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 flex-shrink-0">Local:</span>
                <span className="text-gray-800">{endereco}</span>
              </div>
              {urgente && <span className="font-bold text-red-600">🚨 Urgente</span>}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
              🔒 Seu número fica protegido. Só é revelado para o prestador após pagamento do lead.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">← Voltar</button>
              <button onClick={avancar} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all">
                Enviar pedido ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PedirPage() {
  return <Suspense><PedirContent /></Suspense>
}
