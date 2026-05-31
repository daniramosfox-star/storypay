import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIAS, CIDADES } from '@/lib/frepay/data'

interface Props {
  params: Promise<{ categoria: string; cidade: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, cidade } = await params
  const cat = CATEGORIAS.find(c => c.id === categoria)
  const cid = CIDADES.find(c => c.id === cidade)
  if (!cat || !cid) return {}

  const title = `${cat.nome} em ${cid.nome} — ${cat.emoji} Profissionais disponíveis agora | Frepay`
  const description = `Encontre ${cat.nome.toLowerCase()} em ${cid.nome}/${cid.estado} com atendimento rápido. Prestadores verificados, contato direto pelo WhatsApp. Solicite agora!`

  return {
    title,
    description,
    keywords: `${cat.nome.toLowerCase()} ${cid.nome}, ${cat.nome.toLowerCase()} ${cid.estado}, ${cat.nome.toLowerCase()} perto de mim, ${cat.nome.toLowerCase()} urgente ${cid.nome}`,
    openGraph: { title, description },
    alternates: { canonical: `https://frepay.com.br/${categoria}/${cidade}` },
  }
}

export async function generateStaticParams() {
  const params: { categoria: string; cidade: string }[] = []
  for (const cat of CATEGORIAS) {
    for (const cid of CIDADES) {
      params.push({ categoria: cat.id, cidade: cid.id })
    }
  }
  return params
}

const prestadoresMock = [
  { nome: 'João Silva', avaliacao: 4.9, avaliacoes: 87, experiencia: 8, dist: '0.8 km', online: true },
  { nome: 'Pedro Alves', avaliacao: 4.8, avaliacoes: 54, experiencia: 5, dist: '1.4 km', online: true },
  { nome: 'Lucas Ferreira', avaliacao: 4.7, avaliacoes: 31, experiencia: 3, dist: '2.1 km', online: false },
]

export default async function CategoriasCidadePage({ params }: Props) {
  const { categoria, cidade } = await params
  const cat = CATEGORIAS.find(c => c.id === categoria)
  const cid = CIDADES.find(c => c.id === cidade)
  if (!cat || !cid) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${cat.nome} em ${cid.nome} — Frepay`,
    description: `Profissionais de ${cat.nome.toLowerCase()} em ${cid.nome}`,
    url: `https://frepay.com.br/${categoria}/${cidade}`,
    areaServed: { '@type': 'City', name: cid.nome },
    serviceType: cat.nome,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-black text-xs">F</span>
              </div>
              <span className="font-black text-gray-900">Frepay</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 text-sm">{cat.nome}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 text-sm font-semibold">{cid.nome}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Hero da página SEO */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{cat.emoji}</div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              {cat.nome} em {cid.nome}
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Encontre profissionais de {cat.nome.toLowerCase()} em {cid.nome}/{cid.estado} disponíveis agora.
              Contato direto pelo WhatsApp, sem intermediários.
            </p>
            <Link href={`/pedir?categoria=${cat.id}`}
              className="inline-block mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black px-8 py-4 rounded-full text-lg hover:scale-105 transition-all">
              Solicitar {cat.nome} agora →
            </Link>
          </div>

          {/* Prestadores disponíveis */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Profissionais disponíveis em {cid.nome}</h2>
              <p className="text-gray-400 text-sm mt-0.5">{prestadoresMock.filter(p => p.online).length} online agora</p>
            </div>
            <div className="divide-y divide-gray-50">
              {prestadoresMock.map((p, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br ${cat.cor}`}>
                    {cat.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900">{p.nome}</p>
                      {p.online && <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">● Online</span>}
                    </div>
                    <p className="text-gray-400 text-xs">{p.avaliacao}⭐ ({p.avaliacoes} avaliações) • {p.experiencia} anos de exp. • {p.dist}</p>
                  </div>
                  <Link href={`/pedir?categoria=${cat.id}`}
                    className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm px-4 py-2 rounded-xl hover:scale-105 transition-all">
                    Ver contato
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Conteúdo SEO */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">
              Como contratar {cat.nome.toLowerCase()} em {cid.nome}
            </h2>
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              <p>
                O Frepay conecta você com profissionais de <strong>{cat.nome.toLowerCase()}</strong> em <strong>{cid.nome}</strong> de forma rápida e segura.
                Todos os prestadores são verificados e avaliados por outros clientes.
              </p>
              <p>
                Para contratar um profissional de {cat.nome.toLowerCase()} em {cid.nome}, basta descrever o problema, informar seu endereço e número de WhatsApp.
                Os prestadores disponíveis na sua região receberão uma notificação e entrarão em contato imediatamente.
              </p>
              <p>
                O contato é feito diretamente pelo WhatsApp — sem intermediários, sem taxas sobre o serviço.
                Você combina o valor e o horário diretamente com o profissional.
              </p>
            </div>
          </div>

          {/* Bairros atendidos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">
              {cat.nome} por bairro em {cid.nome}
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Setor Bueno', 'Setor Marista', 'Jardim Goiás', 'Setor Oeste', 'Setor Sul', 'Campinas', 'Vila Nova', 'Setor Aeroporto'].map(b => (
                <Link key={b}
                  href={`/${categoria}/${cidade}/${b.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[̀-ͯ]/g, '')}`}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 transition-all"
                >
                  {cat.emoji} {cat.nome} no {b}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
