export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl">Storypay</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              O marketplace de influencers mais fácil do Brasil. Conectamos marcas e influencers de forma simples e transparente.
            </p>
          </div>

          <div>
            <p className="font-bold mb-4 text-sm tracking-wide uppercase text-gray-300">Plataforma</p>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
              <li><a href="#influencers" className="hover:text-white transition-colors">Influencers</a></li>
              <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              <li><a href="/cadastro" className="hover:text-white transition-colors">Cadastro</a></li>
            </ul>
          </div>

          <div>
            <p className="font-bold mb-4 text-sm tracking-wide uppercase text-gray-300">Suporte</p>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <p className="font-bold mb-4 text-sm tracking-wide uppercase text-gray-300">Redes sociais</p>
            <div className="flex gap-3">
              {['📷', '🎵', '💼', '🐦'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 Storypay. Todos os direitos reservados.</p>
          <p className="text-gray-500 text-sm">Feito com 💜 no Brasil</p>
        </div>
      </div>
    </footer>
  )
}
