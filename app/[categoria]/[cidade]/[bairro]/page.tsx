import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIAS, CIDADES } from '@/lib/frepay/data'

interface Props {
  params: Promise<{ categoria: string; cidade: string; bairro: string }>
}

function deslugify(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, cidade, bairro } = await params
  const cat = CATEGORIAS.find(c => c.id === categoria)
  const cid = CIDADES.find(c => c.id === cidade)
  if (!cat || !cid) return {}

  const bairroNome = deslugify(bairro)
  const title = `${cat.nome} no ${bairroNome}, ${cid.nome} — ${cat.emoji} Online agora | Frepay`
  const description = `Técnico de ${cat.nome.toLowerCase()} no ${bairroNome} em ${cid.nome}/${cid.estado}. Atendimento rápido, contato direto via WhatsApp. Solicite agora gratuitamente!`

  return {
    title,
    description,
    keywords: `${cat.nome.toLowerCase()} ${bairroNome}, ${cat.nome.toLowerCase()} ${bairroNome} ${cid.nome}, técnico ${cat.nome.toLowerCase()} perto de mim`,
    openGraph: { title, description },
    alternates: { canonical: `https://frepay.com.br/${categoria}/${cidade}/${bairro}` },
  }
}

export default async function CategoriaCidadeBairroPage({ params }: Props) {
  const { categoria, cidade, bairro } = await params
  const cat = CATEGORIAS.find(c => c.id === categoria)
  const cid = CIDADES.find(c => c.id === cidade)
  if (!cat || !cid) notFound()

  const bairroNome = deslugify(bairro)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${cat.nome} no ${bairroNome} — Frepay`,
    description: `Profissionais de ${cat.nome.toLowerCase()} no ${bairroNome}, ${cid.nome}`,
    url: `https://frepay.com.br/${categoria}/${cidade}/${bairro}`,
    areaServed: [
      { '@type': 'City', name: cid.nome },
      { '@type': 'Neighborhood', name: bairroNome },
    ],
    serviceType: cat.nome,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-2 flex-wrap text-sm">
            <Link href="/" className="font-black text-orange-600">Frepay</Link>
            <span className="text-gray-300">/</span>
            <Link href={`/${categoria}/${cidade}`} className="text-gray-500 hover:text-orange-600">{cat.nome} em {cid.nome}</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-semibold">{bairroNome}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{cat.emoji}</div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              {cat.nome} no {bairroNome}
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Profissionais de {cat.nome.toLowerCase()} no {bairroNome}, {cid.nome}/{cid.estado} disponíveis agora.
              Atendimento rápido, contato direto pelo WhatsApp.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                ✅ 2 prestadores online no {bairroNome}
              </span>
              <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full">
                ⚡ Tempo médio de resposta: 8 min
              </span>
            </div>

            <Link href={`/pedir?categoria=${cat.id}`}
              className="inline-block mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black px-8 py-4 rounded-full text-lg hover:scale-105 transition-all">
              Solicitar {cat.nome} no {bairroNome} →
            </Link>
          </div>

          {/* Conteúdo SEO rico e único */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">
              {cat.nome} no {bairroNome}: como funciona
            </h2>
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              <p>
                Procurando <strong>{cat.nome.toLowerCase()} no {bairroNome}</strong>? O Frepay é a forma mais rápida de encontrar um profissional qualificado na sua região.
              </p>
              <p>
                Nossos prestadores de {cat.nome.toLowerCase()} no {bairroNome} são verificados, avaliados e atendem com rapidez.
                O processo é simples: descreva o problema, informe seu WhatsApp e aguarde o contato do profissional mais próximo.
              </p>
              <p>
                <strong>Por que usar o Frepay no {bairroNome}?</strong> Sem taxa sobre o serviço, contato direto via WhatsApp,
                profissionais com avaliações reais e disponibilidade em tempo real.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              {['Sem cadastro necessário', 'Contato via WhatsApp', 'Profissionais verificados'].map((item, i) => (
                <div key={i} className="bg-orange-50 rounded-xl p-3 text-center">
                  <p className="text-2xl mb-1">{['✅', '💬', '⭐'][i]}</p>
                  <p className="text-sm font-semibold text-orange-800">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Perguntas frequentes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">Perguntas frequentes</h2>
            <div className="flex flex-col gap-4">
              {[
                { q: `Quanto custa um ${cat.nome.toLowerCase()} no ${bairroNome}?`, a: `O valor varia conforme o serviço. No Frepay você combina diretamente com o profissional sem taxas intermediárias.` },
                { q: `Tem ${cat.nome.toLowerCase()} disponível agora no ${bairroNome}?`, a: `Sim! Temos ${cat.nome.toLowerCase()}s online no ${bairroNome} agora. Faça sua solicitação e receba contato em minutos.` },
                { q: `Os profissionais são confiáveis?`, a: `Todos os prestadores passam por verificação e possuem avaliações de outros clientes. Você pode ver a nota e comentários antes de contratar.` },
              ].map((faq, i) => (
                <details key={i} className="border border-gray-100 rounded-xl p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer text-sm">{faq.q}</summary>
                  <p className="text-gray-600 text-sm mt-2">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Outros bairros */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-bold text-gray-900 mb-3 text-sm">{cat.nome} em outros bairros de {cid.nome}</p>
            <div className="flex flex-wrap gap-2">
              {['Setor Bueno', 'Setor Marista', 'Jardim Goiás', 'Setor Oeste', 'Setor Sul'].filter(b => b !== bairroNome).map(b => (
                <Link key={b}
                  href={`/${categoria}/${cidade}/${b.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[̀-ͯ]/g, '')}`}
                  className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-all"
                >
                  {cat.emoji} {b}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
