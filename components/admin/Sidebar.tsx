'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/admin', label: 'Visão geral', icon: '📊' },
  { href: '/admin/campanhas', label: 'Campanhas', icon: '📣' },
  { href: '/admin/usuarios', label: 'Usuários', icon: '👥' },
  { href: '/admin/disputas', label: 'Disputas', icon: '⚖️', badge: 3 },
  { href: '/admin/financeiro', label: 'Financeiro', icon: '💰' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSair = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 bg-gray-950 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-bold text-white">Storypay</span>
              <span className="block text-[10px] text-white/40 uppercase tracking-widest -mt-0.5">Admin</span>
            </div>
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
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-white/40">Super admin</p>
            </div>
          </div>
          <button onClick={handleSair}
            className="flex items-center gap-3 px-3 py-2 mt-1 w-full text-sm text-white/30 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5">
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-white/10 z-50 flex">
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs relative transition-all ${active ? 'text-violet-400' : 'text-white/40'}`}>
              <span className="text-xl">{item.icon}</span>
              {item.badge && (
                <span className="absolute top-1 right-1/4 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
