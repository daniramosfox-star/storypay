import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
          Pronto para começar?
        </h2>
        <p className="text-white/70 text-xl mb-10">
          Junte-se a mais de 12 mil influencers e 850 marcas que já usam o Storypay.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cadastro?tipo=influencer"
            className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30"
          >
            Quero monetizar minha influência
          </Link>
          <Link
            href="/cadastro?tipo=marca"
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full text-lg transition-all"
          >
            Quero divulgar minha marca
          </Link>
        </div>
      </div>
    </section>
  )
}
