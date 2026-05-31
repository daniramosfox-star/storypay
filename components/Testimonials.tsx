const testimonials = [
  {
    name: 'Rafaela Mendes',
    role: 'Influencer de Fitness • 85K seguidores',
    avatar: '👩‍🦱',
    text: 'Em 3 meses na plataforma já complementei minha renda em mais de R$ 4.000. É incrível poder escolher as campanhas que fazem sentido pra minha audiência.',
    color: 'from-orange-400 to-red-400',
  },
  {
    name: 'TechHome Brasil',
    role: 'Marca de Tecnologia',
    avatar: '🏢',
    text: 'Conseguimos atingir exatamente o público que queríamos gastando muito menos do que nas plataformas tradicionais. O ROI foi 3x melhor que o esperado.',
    color: 'from-blue-400 to-violet-400',
  },
  {
    name: 'Thiago Moreira',
    role: 'Influencer de Games • 210K seguidores',
    avatar: '🎮',
    text: 'A plataforma é simples de usar e os pagamentos sempre caem certinho. Melhor marketplace de influencers que já usei no Brasil.',
    color: 'from-violet-400 to-pink-400',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Quem usa, aprova
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
