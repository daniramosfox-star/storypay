'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIAS } from '@/lib/frepay/data'
import SearchPrestadores from '@/components/frepay/SearchPrestadores'

const depoimentos = [
  { nome: 'Carlos Mendes', cidade: 'Goiânia - GO', texto: 'Encontrei um técnico de ar condicionado em menos de 10 minutos. Chegou rápido e resolveu o problema no mesmo dia.', cat: '❄️', nota: 5 },
  { nome: 'Ana Rodrigues', cidade: 'São Paulo - SP', texto: 'O eletricista foi super profissional. Adorei poder falar direto no WhatsApp sem ficar ligando pra 10 lugares.', cat: '⚡', nota: 5 },
  { nome: 'Marcos Silva', cidade: 'Brasília - DF', texto: 'Solicitei encanador urgente às 21h e em 30 minutos tinha profissional disponível na minha área.', cat: '🔧', nota: 5 },
]

export default function Home() {
  const [catSelecionada, setCatSelecionada] = useState('')

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="font-black text-gray-900 text-xl">Frepay</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/mapa" className="text-gray-600 text-sm font-medium hover:text-orange-600 flex items-center gap-1">
              🗺️ <span className="hidden sm:inline">Mapa</span>
            </Link>
            <Link href="/login" className="text-gray-600 text-sm font-medium hover:text-gray-900">Entrar</Link>
            <Link href="/cadastro?tipo=prestador" className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:scale-105 transition-all">
              Seja prestador
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-14 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                Prestadores disponíveis agora na sua região
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Encontre o profissional{' '}
                <span className="gradient-text">que você precisa</span>
              </h1>

              <p className="text-white/70 text-xl leading-relaxed mb-8">
                Descreva qualquer serviço ou solução — eletricista, designer, fotógrafo, personal trainer e muito mais. Profissionais disponíveis perto de você agora, contato direto pelo WhatsApp.
              </p>

              {/* Search com autocomplete */}
              <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-black/30">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">
                  Encontre um profissional agora
                </p>
                <SearchPrestadores
                  placeholder="Digite um serviço ou nome do profissional..."
                  className="mb-3"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['Eletricista', 'Designer', 'Fotógrafo', 'Encanador', 'Personal'].map(s => (
                    <button key={s} onClick={() => setCatSelecionada(s)}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 rounded-full transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="relative animate-float">
                <div className="w-64 h-[520px] bg-gray-900 rounded-[3rem] border-4 border-white/10 shadow-2xl overflow-hidden">
                  <div className="h-10 bg-black flex items-center justify-center">
                    <div className="w-20 h-4 bg-black rounded-full" />
                  </div>
                  {/* App header */}
                  <div className="bg-gray-900 p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="text-white/50 text-xs">Sua região</p>
                        <p className="text-white font-bold text-sm">Setor Bueno, Goiânia</p>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  {/* Prestadores */}
                  <div className="p-3 flex flex-col gap-2">
                    <p className="text-white/50 text-xs px-1">3 prestadores disponíveis</p>
                    {[
                      { nome: 'João Silva', cat: '❄️', dist: '0.8 km', rating: 4.9, online: true },
                      { nome: 'Pedro Alves', cat: '❄️', dist: '1.2 km', rating: 4.8, online: true },
                      { nome: 'Lucas Costa', cat: '❄️', dist: '2.1 km', rating: 4.7, online: true },
                    ].map((p, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-xl flex-shrink-0">
                          {p.cat}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold">{p.nome}</p>
                          <p className="text-white/40 text-xs">{p.dist} • {p.rating}⭐</p>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                      </div>
                    ))}
                    <button className="mt-1 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold py-2.5 rounded-xl">
                      Ver contato — WhatsApp
                    </button>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -right-8 top-24 bg-white rounded-2xl shadow-xl px-3 py-2 animate-float-delay">
                  <p className="text-xs text-gray-500">Profissional a</p>
                  <p className="text-sm font-black text-gray-900">0.8 km de você 📍</p>
                </div>
                <div className="absolute -left-8 bottom-24 bg-green-500 rounded-2xl shadow-xl px-3 py-2 animate-float">
                  <p className="text-white text-xs font-bold">✓ Online agora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como é amplo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Para qualquer serviço ou solução</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Não existe categoria limitada. Descreva o que precisa e os profissionais certos aparecem.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { emoji: '⚡', label: 'Eletricista' },
              { emoji: '🔧', label: 'Encanador' },
              { emoji: '❄️', label: 'Técnico de AC' },
              { emoji: '🎨', label: 'Designer gráfico' },
              { emoji: '📱', label: 'Artes para redes sociais' },
              { emoji: '💻', label: 'Desenvolvedor web' },
              { emoji: '📸', label: 'Fotógrafo' },
              { emoji: '🎵', label: 'Produtor musical' },
              { emoji: '🏋️', label: 'Personal trainer' },
              { emoji: '🧹', label: 'Faxineira' },
              { emoji: '🌿', label: 'Jardineiro' },
              { emoji: '📦', label: 'Motorista de mudança' },
              { emoji: '🖌️', label: 'Pintor' },
              { emoji: '📊', label: 'Contador' },
              { emoji: '🔩', label: 'Serralheiro' },
              { emoji: '✍️', label: 'Redator / Copywriter' },
            ].map((s, i) => (
              <Link key={i} href="/pedir"
                className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:border-orange-300 hover:bg-orange-50 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{s.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{s.label}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/pedir" className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm hover:underline">
              Não encontrou? Descreva qualquer serviço →
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Como funciona</h2>
            <p className="text-gray-500">Simples e rápido — igual o Uber</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Cliente */}
            <div>
              <div className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-6">Para quem precisa de serviço</div>
              <div className="flex flex-col gap-6">
                {[
                  { n: '1', icon: '📋', title: 'Descreva o problema', desc: 'Escolha a categoria e descreva o que precisa em segundos.' },
                  { n: '2', icon: '📍', title: 'Informe o endereço', desc: 'Use a geolocalização ou digite seu endereço manualmente.' },
                  { n: '3', icon: '📱', title: 'Coloque seu WhatsApp', desc: 'O profissional vai entrar em contato direto pelo WhatsApp.' },
                  { n: '4', icon: '⚡', title: 'Receba o contato', desc: 'O primeiro profissional disponível na área recebe sua solicitação.' },
                ].map(s => (
                  <div key={s.n} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                      {s.n}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{s.icon} {s.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/pedir" className="inline-block mt-8 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-all">
                Solicitar serviço agora →
              </Link>
            </div>

            {/* Prestador */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-6">Para prestadores de serviço</div>
              <div className="flex flex-col gap-5">
                {[
                  { icon: '👤', title: 'Crie seu perfil grátis', desc: 'Nome, foto, categoria e bairros que você atende.' },
                  { icon: '🟢', title: 'Ative o botão ONLINE', desc: 'Quando estiver disponível, apareça para os clientes da sua região.' },
                  { icon: '🔔', title: 'Receba notificações', desc: 'Pedidos chegam em tempo real quando tem serviço perto de você.' },
                  { icon: '🎁', title: '1ª indicação do dia é grátis', desc: 'A partir da 2ª, pague apenas R$ 1,99 por contato — sem mensalidade.' },
                  { icon: '💬', title: 'Fale no WhatsApp', desc: 'Ao pagar, o número do cliente abre direto no WhatsApp.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/cadastro?tipo=prestador" className="inline-block mt-6 w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-all">
                Cadastrar como prestador →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa preview */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Veja quem está disponível agora</h2>
            <p className="text-gray-500">Prestadores online em tempo real no mapa</p>
          </div>
          <div className="relative">
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-64 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-10" />
              <div className="text-center z-20 relative">
                <div className="text-5xl mb-3">🗺️</div>
                <p className="font-bold text-gray-800 text-lg">Mapa interativo de prestadores</p>
                <p className="text-gray-500 text-sm mt-1 mb-4">Veja quem está online perto de você agora</p>
                <Link href="/mapa"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-all inline-block">
                  Abrir mapa →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { v: '8.400+', l: 'Prestadores ativos' },
              { v: '42 cidades', l: 'Já atendidas' },
              { v: 'R$ 1,99', l: 'Por lead (após o grátis)' },
              { v: '< 10 min', l: 'Tempo médio de resposta' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-black">{s.v}</p>
                <p className="text-white/70 text-sm mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Quem usa, recomenda</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(d.nota)].map((_, j) => <span key={j} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{d.texto}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-xl">{d.cat}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{d.nome}</p>
                    <p className="text-gray-400 text-xs">{d.cidade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 hero-gradient">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Precisa de um profissional agora?</h2>
          <p className="text-white/70 text-lg mb-8">Sem mensalidade, sem complicação. Encontre um profissional disponível em minutos.</p>
          <Link href="/pedir" className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-black px-10 py-4 rounded-full text-lg hover:scale-105 transition-all hover:shadow-xl hover:shadow-orange-500/30">
            Solicitar serviço grátis →
          </Link>
          <p className="text-white/40 text-sm mt-4">Sem cadastro necessário para clientes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-white font-black text-xs">F</span>
                </div>
                <span className="font-black text-lg">Frepay</span>
              </div>
              <p className="text-gray-400 text-sm">O marketplace de prestadores de serviço mais rápido do Brasil.</p>
            </div>
            <div>
              <p className="font-bold text-sm mb-3 text-gray-300">Serviços</p>
              <div className="flex flex-col gap-1.5">
                {CATEGORIAS.slice(0, 5).map(c => (
                  <Link key={c.id} href={`/pedir?categoria=${c.id}`} className="text-gray-400 text-sm hover:text-white transition-colors">{c.nome}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-bold text-sm mb-3 text-gray-300">Plataforma</p>
              <div className="flex flex-col gap-1.5">
                <Link href="/cadastro?tipo=prestador" className="text-gray-400 text-sm hover:text-white">Seja prestador</Link>
                <Link href="/login" className="text-gray-400 text-sm hover:text-white">Entrar</Link>
                <Link href="/pedir" className="text-gray-400 text-sm hover:text-white">Solicitar serviço</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex justify-between items-center flex-wrap gap-3">
            <p className="text-gray-500 text-sm">© 2026 Frepay. Todos os direitos reservados.</p>
            <p className="text-gray-500 text-sm">Feito com ❤️ no Brasil</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
