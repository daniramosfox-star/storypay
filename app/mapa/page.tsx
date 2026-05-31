'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { CATEGORIAS } from '@/lib/frepay/data'

// Leaflet só pode rodar no client — sem SSR
const MapaPrestadores = dynamic(
  () => import('@/components/frepay/MapaPrestadores'),
  { ssr: false, loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Carregando mapa...</p>
      </div>
    </div>
  )}
)

function MapaContent() {
  const params = useSearchParams()
  const [filtro, setFiltro] = useState<string | null>(params.get('categoria'))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-700 text-lg">←</Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-black text-xs">F</span>
              </div>
              <span className="font-black text-gray-900">Frepay</span>
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="font-bold text-gray-700 text-sm">Mapa de prestadores</h1>
          </div>

          {/* Filtro de categoria */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <button
              onClick={() => setFiltro(null)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !filtro ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {CATEGORIAS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFiltro(filtro === cat.id ? null : cat.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filtro === cat.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.emoji}</span> {cat.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <MapaPrestadores
          filtroCategoria={filtro}
          height="calc(100vh - 160px)"
          className="shadow-xl rounded-2xl overflow-hidden"
        />

        {/* Legenda */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Legenda</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CATEGORIAS.map(cat => (
              <div key={cat.id} className="flex items-center gap-2">
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-xs text-gray-600">{cat.nome}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-500">Online agora</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-500">Offline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
              <span className="text-xs text-gray-500">Você</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MapaPage() {
  return <Suspense><MapaContent /></Suspense>
}
