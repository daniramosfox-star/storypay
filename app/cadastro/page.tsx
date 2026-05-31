'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIAS, CIDADES } from '@/lib/frepay/data'

const termsText = `TERMOS DE USO — FREPAY

Última atualização: maio de 2026

1. ACEITAÇÃO DOS TERMOS
Ao criar uma conta na plataforma Frepay, você concorda com estes termos de uso.

2. SOBRE A PLATAFORMA
O Frepay é um marketplace que conecta clientes a prestadores de serviço (eletricistas, encanadores, técnicos de ar condicionado e outros profissionais) com base em geolocalização.

3. PARA PRESTADORES DE SERVIÇO
- Você declara que possui as qualificações necessárias para os serviços que oferece.
- Compromete-se a atender com qualidade e profissionalismo.
- A 1ª indicação do dia é gratuita. A partir da 2ª, cada contato custa R$ 1,99.
- O pagamento pelo contato é processado antes da revelação do telefone do cliente.

4. PARA CLIENTES
- O cadastro não é obrigatório para solicitar serviços.
- Seu telefone só é revelado ao prestador após o pagamento do lead.
- A plataforma não se responsabiliza pela execução do serviço contratado diretamente com o prestador.

5. PAGAMENTOS
- Processados via InfinitePay com segurança.
- A Frepay cobra apenas pelo lead (contato do cliente), não sobre o valor do serviço.

6. PRIVACIDADE
Seus dados são protegidos conforme a LGPD (Lei 13.709/2018). Seu telefone jamais é exposto sem pagamento do lead.

7. ENCERRAMENTO DE CONTA
A Frepay reserva-se o direito de encerrar contas que violem estes termos ou prejudiquem clientes.`

function CadastroContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [tried, setTried] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
    telefone: '',
    categoria: '',
    cidade: '',
    bio: '',
  })

  const h = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const err = (cond: boolean, msg: string) => cond ? (
    <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">⚠️ {msg}</p>
  ) : null

  const goStep2 = () => {
    setTried(true)
    if (form.nome && form.email && form.senha.length >= 8 && form.senha === form.confirmSenha) {
      setStep(2); setTried(false)
    }
  }

  const goStep3 = () => {
    setTried(true)
    if (form.categoria && form.cidade) { setStep(3); setTried(false) }
  }

  const handleSubmit = async () => {
    if (!termsAccepted) return
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: { data: { nome: form.nome, tipo: 'prestador' } },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from('profiles').upsert({
          id: data.user.id,
          tipo: 'prestador',
          nome: form.nome,
          telefone: form.telefone || null,
          categoria_id: form.categoria || null,
          cidade_id: form.cidade || null,
          bio: form.bio || null,
          is_online: false,
          saldo: 0,
        } as any)
      }

      router.push('/prestador')
      router.refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao criar conta'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-black">F</span>
          </div>
          <span className="text-white font-black text-2xl">Frepay</span>
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5">
            <h1 className="text-white font-black text-xl">Cadastro de prestador</h1>
            <p className="text-white/70 text-sm mt-0.5">Comece a receber pedidos na sua região</p>
          </div>

          {/* Progress */}
          <div className="px-6 pt-5 pb-2">
            <div className="flex items-center gap-2">
              {['Acesso', 'Serviço', 'Termos'].map((label, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
                  {i < 2 && <div className={`h-0.5 flex-1 rounded-full ${step > i + 1 ? 'bg-orange-400' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">

            {/* STEP 1 — Dados de acesso */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-gray-900">Dados de acesso</h2>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Nome completo</label>
                  <input name="nome" value={form.nome} onChange={h} placeholder="Seu nome"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${tried && !form.nome ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                  {err(tried && !form.nome, 'Informe seu nome')}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
                  <input name="email" value={form.email} onChange={h} type="email" placeholder="seu@email.com"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${tried && !form.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                  {err(tried && !form.email, 'Informe seu e-mail')}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Senha</label>
                  <input name="senha" value={form.senha} onChange={h} type="password" placeholder="Mínimo 8 caracteres"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${tried && form.senha.length < 8 ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                  {err(tried && form.senha.length < 8, 'Mínimo 8 caracteres')}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Confirmar senha</label>
                  <input name="confirmSenha" value={form.confirmSenha} onChange={h} type="password" placeholder="Repita a senha"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${tried && form.senha !== form.confirmSenha ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                  {err(tried && form.senha !== form.confirmSenha, 'As senhas não coincidem')}
                </div>

                <button onClick={goStep2}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl mt-1 hover:scale-[1.01] transition-all">
                  Continuar →
                </button>
              </div>
            )}

            {/* STEP 2 — Categoria e localização */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-gray-900">Seu serviço</h2>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp</label>
                  <input name="telefone" value={form.telefone} onChange={h} placeholder="(62) 99999-0000" inputMode="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Categoria de serviço</label>
                  <select name="categoria" value={form.categoria} onChange={h}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white ${tried && !form.categoria ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                    <option value="">Selecione sua especialidade...</option>
                    {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.nome}</option>)}
                  </select>
                  {err(tried && !form.categoria, 'Selecione sua categoria')}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Cidade que atende</label>
                  <select name="cidade" value={form.cidade} onChange={h}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white ${tried && !form.cidade ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                    <option value="">Selecione sua cidade...</option>
                    {CIDADES.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.estado}</option>)}
                  </select>
                  {err(tried && !form.cidade, 'Selecione sua cidade')}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Apresentação (opcional)</label>
                  <textarea name="bio" value={form.bio} onChange={h} rows={3} placeholder="Ex: Técnico certificado com 8 anos de experiência..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">← Voltar</button>
                  <button onClick={goStep3} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all">Continuar →</button>
                </div>
              </div>
            )}

            {/* STEP 3 — Termos */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-gray-900">Termos de uso</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-44 overflow-y-auto text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {termsText}
                </div>
                <label className="flex items-start gap-3 cursor-pointer bg-orange-50 border border-orange-100 rounded-xl p-3">
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700">
                    Li e aceito os <span className="text-orange-600 font-semibold">Termos de Uso</span> e a <span className="text-orange-600 font-semibold">Política de Privacidade</span> da Frepay.
                  </span>
                </label>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">← Voltar</button>
                  <button onClick={handleSubmit} disabled={!termsAccepted || loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:scale-[1.01] transition-all">
                    {loading ? 'Criando conta...' : 'Criar conta 🎉'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-5">
              Já tem conta?{' '}
              <Link href="/login" className="text-orange-600 font-semibold hover:underline">Entrar</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-4">
          Quer apenas solicitar um serviço?{' '}
          <Link href="/pedir" className="text-white/60 hover:text-white underline">Clique aqui — sem cadastro</Link>
        </p>
      </div>
    </div>
  )
}

export default function CadastroPage() {
  return <Suspense><CadastroContent /></Suspense>
}
