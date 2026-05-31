'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const termsText = `TERMOS DE USO — STORYPAY

Última atualização: maio de 2026

1. ACEITAÇÃO DOS TERMOS
Ao criar uma conta na plataforma Storypay, você concorda com estes termos de uso.

2. SOBRE A PLATAFORMA
O Storypay é um marketplace que conecta marcas e influencers para campanhas de marketing digital.

3. PARA INFLUENCERS
- Você declara que possui os direitos sobre o conteúdo que publica.
- Compromete-se a entregar as campanhas aceitas no prazo estipulado.
- Não cumprimento da entrega resulta em advertência no perfil.
- A plataforma retém 15% do valor de cada campanha a título de taxa de serviço.

4. PARA MARCAS
- O saldo depositado é descontado à medida que influencers entregam as campanhas.
- Você tem 48h para confirmar a entrega ou abrir disputa.
- Disputas são analisadas pela equipe do Storypay.

5. PAGAMENTOS
- Processados via Pagar.me com segurança PCI-DSS.
- Pagamentos a influencers são liberados após confirmação da marca ou encerramento do prazo de disputa.

6. PRIVACIDADE
Seus dados são protegidos conforme a LGPD (Lei 13.709/2018).

7. ENCERRAMENTO DE CONTA
A Storypay reserva-se o direito de encerrar contas que violem estes termos.`

function CadastroContent() {
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get('tipo') as 'influencer' | 'marca' | null

  const router = useRouter()
  const [tipo, setTipo] = useState<'influencer' | 'marca'>(tipoParam || 'influencer')
  const [step, setStep] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmSenha: '',
    instagram: '', tiktok: '', nicho: '', seguidores: '', bio: '',
    empresa: '', cnpj: '', site: '',
  })

  useEffect(() => {
    if (tipoParam) setTipo(tipoParam)
  }, [tipoParam])

  const niches = ['Fitness', 'Moda', 'Beleza', 'Games', 'Gastronomia', 'Finanças', 'Pets', 'Viagem']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!termsAccepted) return
    setLoading(true)
    setError('')

    const supabase = createClient()

    // 1. Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: { data: { nome: form.nome, tipo } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // 2. Upsert profile
      const profileData = tipo === 'influencer'
        ? { id: data.user.id, tipo, nome: form.nome, instagram: form.instagram, tiktok: form.tiktok, nicho: form.nicho, seguidores: Number(form.seguidores) || 0, bio: form.bio, saldo: 0 }
        : { id: data.user.id, tipo, nome: form.nome, empresa: form.empresa, cnpj: form.cnpj, site: form.site, saldo: 0 }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from('profiles').upsert(profileData as any)
    }

    router.push(`/${tipo}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-white font-bold text-2xl">Storypay</span>
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/50">
          {/* Type selector */}
          <div className="bg-gray-50 p-6 border-b border-gray-100">
            <p className="text-gray-500 text-sm text-center mb-4">Quero me cadastrar como</p>
            <div className="flex gap-3">
              <button
                onClick={() => setTipo('influencer')}
                className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  tipo === 'influencer'
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
                }`}
              >
                🧑‍🤳 Influencer
              </button>
              <button
                onClick={() => setTipo('marca')}
                className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  tipo === 'marca'
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
                }`}
              >
                🏢 Marca
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    step >= s
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && <div className={`h-0.5 flex-1 ${step > s ? 'bg-violet-400' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Basic info */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900">Dados básicos</h2>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Nome completo</label>
                  <input
                    name="nome" value={form.nome} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
                  <input
                    name="email" value={form.email} onChange={handleChange} type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Senha</label>
                  <input
                    name="senha" value={form.senha} onChange={handleChange} type="password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Confirmar senha</label>
                  <input
                    name="confirmSenha" value={form.confirmSenha} onChange={handleChange} type="password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Repita a senha"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!form.nome || !form.email || !form.senha || !form.confirmSenha}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl mt-2 disabled:opacity-40 hover:from-violet-500 hover:to-pink-500 transition-all"
                >
                  Continuar →
                </button>
              </div>
            )}

            {/* Step 2: Profile info */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {tipo === 'influencer' ? 'Perfil de influencer' : 'Dados da empresa'}
                </h2>

                {tipo === 'influencer' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">@ Instagram</label>
                        <input
                          name="instagram" value={form.instagram} onChange={handleChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                          placeholder="@seuperfil"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">@ TikTok</label>
                        <input
                          name="tiktok" value={form.tiktok} onChange={handleChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                          placeholder="@seuperfil"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Nicho principal</label>
                      <select
                        name="nicho" value={form.nicho} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                      >
                        <option value="">Selecione...</option>
                        {niches.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Seguidores (total)</label>
                      <input
                        name="seguidores" value={form.seguidores} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        placeholder="Ex: 50000"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Bio</label>
                      <textarea
                        name="bio" value={form.bio} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                        rows={3}
                        placeholder="Conte um pouco sobre você..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Nome da empresa</label>
                      <input
                        name="empresa" value={form.empresa} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        placeholder="Sua empresa"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">CNPJ</label>
                      <input
                        name="cnpj" value={form.cnpj} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Site</label>
                      <input
                        name="site" value={form.site} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        placeholder="https://suaempresa.com"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-violet-500 hover:to-pink-500 transition-all"
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Terms */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900">Termos de uso</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-48 overflow-y-auto text-xs text-gray-600 leading-relaxed whitespace-pre-line font-mono">
                  {termsText}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-violet-600"
                  />
                  <span className="text-sm text-gray-600">
                    Li e aceito os <span className="text-violet-600 font-semibold">Termos de Uso</span> e a <span className="text-violet-600 font-semibold">Política de Privacidade</span> do Storypay.
                  </span>
                </label>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!termsAccepted || loading}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:from-violet-500 hover:to-pink-500 transition-all"
                  >
                    {loading ? 'Criando conta...' : 'Criar conta 🎉'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-6">
              Já tem conta?{' '}
              <Link href="/login" className="text-violet-600 font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CadastroPage() {
  return (
    <Suspense>
      <CadastroContent />
    </Suspense>
  )
}
