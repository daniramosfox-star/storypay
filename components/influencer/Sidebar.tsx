'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/influencer', label: 'Dashboard', icon: '📊' },
  { href: '/influencer/campanhas', label: 'Campanhas', icon: '🔥' },
  { href: '/influencer/meus-posts', label: 'Meus Posts', icon: '📋' },
  { href: '/influencer/financeiro', label: 'Financeiro', icon: '💰' },
  { href: '/influencer/perfil', label: 'Perfil', icon: '👤' },
]

export default function InfluencerSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900">Storypay</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Ana Souza</p>
              <p className="text-xs text-gray-400 truncate">@anasouza • Fitness</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 mt-1 text-sm text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
            <span>🚪</span> Sair
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex">
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-all ${
                active ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden xs:block">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
