const stats = [
  { value: '12.000+', label: 'Influencers ativos', icon: '🧑‍🤳' },
  { value: '850+', label: 'Marcas parceiras', icon: '🏢' },
  { value: 'R$ 4M+', label: 'Pagos a influencers', icon: '💸' },
  { value: '98%', label: 'Taxa de entrega', icon: '✅' },
]

export default function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-3">{s.icon}</div>
              <p className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</p>
              <p className="text-white/60 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
