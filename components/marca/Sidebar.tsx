'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/marca', label: 'Dashboard', icon: '📊' },
  { href: '/marca/campanhas', label: 'Campanhas', icon: '📣' },
  { href: '/marca/criar-campanha', label: 'Nova campanha', icon: '✨' },
  { href: '/marca/influencers', label: 'Influencers', icon: '🧑‍🤳' },
  { href: '/marca/financeiro', label: 'Financeiro', icon: '💳' },
]

export default function MarcaSidebar() {
  const pathname = usePathname()

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
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
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
                {item.href === '/marca/criar-campanha' && (
                  <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    +
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-sm font-bold">
              N
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Nike Brasil</p>
              <p className="text-xs text-gray-400 truncate">Plano Free</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 mt-1 text-sm text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
            <span>🚪</span> Sair
          </Link>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex">
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-all ${
                active ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
