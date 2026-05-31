import MarcaSidebar from '@/components/marca/Sidebar'

export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MarcaSidebar />
      <main className="md:ml-60 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
