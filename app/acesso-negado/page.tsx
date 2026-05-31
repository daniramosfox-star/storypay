import Link from 'next/link'

export default function AcessoNegadoPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-6">🚫</div>
        <h1 className="text-3xl font-black text-white mb-3">Acesso negado</h1>
        <p className="text-gray-400 mb-8">
          Você não tem permissão para acessar esta área.
          Apenas administradores podem entrar aqui.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
          >
            Voltar para o início
          </Link>
          <Link
            href="/login"
            className="border border-white/20 text-white/60 font-medium py-3 px-6 rounded-xl hover:bg-white/5 transition-all text-sm"
          >
            Entrar com outra conta
          </Link>
        </div>
      </div>
    </div>
  )
}
