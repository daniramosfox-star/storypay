'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (authError) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    // Fetch profile to redirect to correct dashboard
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', data.user.id)
      .single()

    const tipo = profile?.tipo ?? 'influencer'
    router.push(`/${tipo}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-white font-bold text-2xl">Frepay</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl shadow-violet-900/50 p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Entrar</h1>
          <p className="text-gray-400 text-sm mb-6">Acesse sua conta</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                placeholder="Sua senha"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 rounded-xl mt-1 disabled:opacity-50 hover:from-violet-500 hover:to-pink-500 transition-all hover:scale-[1.01]"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-violet-600 hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          <hr className="my-5 border-gray-100" />

          <p className="text-center text-sm text-gray-500">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-violet-600 font-semibold hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/pedir" className="text-white/40 text-xs hover:text-white/70 transition-colors">
            Solicitar um serviço sem cadastro →
          </Link>
        </div>
      </div>
    </div>
  )
}
