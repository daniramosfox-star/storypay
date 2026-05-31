'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch {
      setError('Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-black">F</span>
          </div>
          <span className="text-white font-black text-2xl">Frepay</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">E-mail enviado!</h1>
              <p className="text-gray-500 text-sm mb-6">
                Se <strong>{email}</strong> está cadastrado, você receberá um link para redefinir sua senha.
              </p>
              <Link href="/login" className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl text-center hover:scale-[1.01] transition-all">
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Recuperar senha</h1>
              <p className="text-gray-400 text-sm mb-6">Enviaremos um link para seu e-mail</p>
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="seu@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:scale-[1.01] transition-all">
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>
              <Link href="/login" className="block text-center text-sm text-gray-400 mt-4 hover:text-gray-600">
                ← Voltar para o login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
