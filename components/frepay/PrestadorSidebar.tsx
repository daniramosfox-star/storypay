'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/prestador', label: 'Dashboard', icon: '📊' },
  { href: '/prestador/pedidos', label: 'Pedidos', icon: '🔔', badge: true },
  { href: '/prestador/financeiro', label: 'Financeiro', icon: '💰' },
  { href: '/prestador/perfil', label: 'Meu perfil', icon: '👤' },
]

export default function PrestadorSidebar() {
  const pathname = usePathname()
  return (
    <>
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="font-black text-gray-900">Frepay</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
            <span>🚪</span> Sair
          </Link>
        </div>
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex">
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs transition-all ${active ? 'text-orange-500' : 'text-gray-400'}`}>
              <span className="text-xl">{item.icon}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
