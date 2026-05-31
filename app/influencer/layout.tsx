import InfluencerSidebar from '@/components/influencer/Sidebar'

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <InfluencerSidebar />
      <main className="md:ml-60 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
