import Link from 'next/link'

const plans = [
  {
    name: 'Influencer Free',
    price: 'Grátis',
    period: '',
    desc: 'Para começar a monetizar',
    color: 'from-gray-600 to-gray-700',
    features: [
      'Acesso a campanhas do seu nicho',
      'Pagamento automático',
      'Histórico de campanhas',
      'Perfil verificado',
    ],
    cta: 'Começar grátis',
    href: '/cadastro?tipo=influencer',
    highlight: false,
  },
  {
    name: 'Influencer Pro',
    price: 'R$ 29',
    period: '/mês',
    desc: 'Para influencers que querem mais',
    color: 'from-violet-600 to-pink-600',
    features: [
      'Tudo do plano Free',
      'Destaque no feed de campanhas',
      'Acesso antecipado a campanhas',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    href: '/cadastro?tipo=influencer&plano=pro',
    highlight: true,
  },
  {
    name: 'Marca Pro',
    price: 'R$ 99',
    period: '/mês',
    desc: 'Para marcas que escalam',
    color: 'from-indigo-600 to-violet-600',
    features: [
      'Filtros avançados de influencers',
      'Múltiplas campanhas simultâneas',
      'Relatório detalhado por campanha',
      'Gerente de conta dedicado',
      'API de integração',
    ],
    cta: 'Assinar Pro',
    href: '/cadastro?tipo=marca&plano=pro',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section id="planos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Planos
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Escolha seu plano
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Começe grátis e escale conforme cresce. A plataforma retém apenas 15% de cada transação.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden border ${
                plan.highlight
                  ? 'border-violet-300 shadow-xl shadow-violet-100 scale-105'
                  : 'border-gray-100 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="bg-gradient-to-r from-violet-600 to-pink-600 text-white text-center text-xs font-bold py-2 tracking-wide">
                  MAIS POPULAR
                </div>
              )}
              <div className="p-6">
                <div className={`inline-block bg-gradient-to-br ${plan.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 mb-1">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>

                <ul className="flex flex-col gap-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-full font-bold text-sm transition-all hover:scale-105 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:shadow-lg hover:shadow-violet-300'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
