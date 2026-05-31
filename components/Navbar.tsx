'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold text-xl">Storypay</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-white/70 hover:text-white transition-colors text-sm">Como funciona</a>
            <a href="#influencers" className="text-white/70 hover:text-white transition-colors text-sm">Influencers</a>
            <a href="#planos" className="text-white/70 hover:text-white transition-colors text-sm">Planos</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/cadastro" className="text-white/80 hover:text-white text-sm transition-colors">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105"
            >
              Começar grátis
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
          >
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition-colors">Como funciona</a>
          <a href="#influencers" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition-colors">Influencers</a>
          <a href="#planos" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition-colors">Planos</a>
          <hr className="border-white/10" />
          <Link href="/cadastro" className="text-white/80 hover:text-white transition-colors">Entrar</Link>
          <Link
            href="/cadastro"
            className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold px-5 py-3 rounded-full text-center"
          >
            Começar grátis
          </Link>
        </div>
      )}
    </nav>
  )
}
