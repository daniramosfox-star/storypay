import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Dupla verificação server-side
  if (!user) {
    redirect('/login?next=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tipo, nome')
    .eq('id', user.id)
    .single()

  if (!profile || profile.tipo !== 'admin') {
    redirect('/acesso-negado')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="md:ml-60 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
