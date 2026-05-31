'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const contaCriada = params.get('msg') === 'conta-criada'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/﻿/g, '').trim()
      const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.replace(/﻿/g, '').trim()

      // Login direto via REST — mesmo método que funcionou no teste
      const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
        body: JSON.stringify({ email, password: senha }),
      })

      const session = await r.json()

      if (!r.ok || !session.access_token) {
        setError('E-mail ou senha incorretos.')
        setLoading(false)
        return
      }

      // Popula localStorage para o browser client funcionar
      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })

      // Descobre o tipo do perfil
      let tipo = 'prestador'
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tipo')
          .eq('id', session.user.id)
          .single()
        if (profile?.tipo) tipo = profile.tipo
      } catch { /* usa default */ }

      // Guarda userId em sessionStorage para o dashboard usar sem depender de getSession()
      if (session.user?.id) {
        sessionStorage.setItem('frepay_uid', session.user.id)
      }

      const next = new URLSearchParams(window.location.search).get('next')
      router.push(next ?? `/${tipo}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar. Tente novamente.')
      setLoading(false)
    }
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
          {contaCriada && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-bold text-green-800 text-sm">Conta criada com sucesso!</p>
                <p className="text-green-600 text-xs">Agora entre com seus dados para acessar o painel.</p>
              </div>
            </div>
          )}
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
            <Link href="/recuperar-senha" className="text-sm text-orange-600 hover:underline">
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

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>
}
