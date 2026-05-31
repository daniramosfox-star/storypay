import PrestadorSidebar from '@/components/frepay/PrestadorSidebar'

export default function PrestadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PrestadorSidebar />
      <main className="md:ml-60 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
