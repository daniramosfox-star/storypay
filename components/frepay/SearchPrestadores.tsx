'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Prestador = {
  id: string
  nome: string
  especialidade: string | null
  avatar_url: string | null
  is_online: boolean
  latitude: number | null
  longitude: number | null
  rating: number | null
  cidade_id: string | null
}

// Fórmula Haversine — distância em km entre dois pontos
function distancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const cores = [
  'from-orange-400 to-red-500',
  'from-violet-400 to-purple-500',
  'from-blue-400 to-cyan-500',
  'from-green-400 to-emerald-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
]

interface Props {
  placeholder?: string
  className?: string
  onSelect?: (prestador: Prestador) => void
}

export default function SearchPrestadores({
  placeholder = 'Buscar por nome ou tipo de serviço...',
  className = '',
  onSelect,
}: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Prestador[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Tenta pegar localização do usuário
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {} // silencia erro de permissão negada
    )
  }, [])

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const buscar = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('id, nome, especialidade, avatar_url, is_online, latitude, longitude, rating, cidade_id')
        .eq('tipo', 'prestador')
        .or(`nome.ilike.%${q}%,especialidade.ilike.%${q}%`)
        .order('is_online', { ascending: false })
        .order('rating', { ascending: false })
        .limit(8)

      setResults((data ?? []) as Prestador[])
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => buscar(val), 300)
  }

  const handleSelect = (p: Prestador) => {
    setQuery(p.nome)
    setOpen(false)
    if (onSelect) onSelect(p)
    else router.push(`/pedir?q=${encodeURIComponent(p.especialidade ?? p.nome)}`)
  }

  const getDist = (p: Prestador): string | null => {
    if (!userPos || !p.latitude || !p.longitude) return null
    const km = distancia(userPos.lat, userPos.lon, p.latitude, p.longitude)
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)} km`
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {loading ? (
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition-all"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {results.length === 0 && !loading ? (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-400 text-sm">Nenhum prestador encontrado para <strong>"{query}"</strong></p>
              <button onClick={() => { setOpen(false); router.push(`/pedir?q=${encodeURIComponent(query)}`) }}
                className="mt-3 text-orange-600 text-sm font-semibold hover:underline">
                Criar pedido para "{query}" →
              </button>
            </div>
          ) : (
            <>
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  {results.filter(r => r.is_online).length > 0
                    ? `${results.filter(r => r.is_online).length} online agora`
                    : 'Prestadores encontrados'}
                </p>
                {userPos && <p className="text-xs text-gray-400">📍 Ordenado por distância</p>}
              </div>

              <div className="divide-y divide-gray-50">
                {results.map((p, i) => {
                  const dist = getDist(p)
                  const cor = cores[i % cores.length]
                  return (
                    <button key={p.id} onClick={() => handleSelect(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left group">

                      {/* Avatar */}
                      <div className="flex-shrink-0 relative">
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt={p.nome}
                            className="w-11 h-11 rounded-xl object-cover border border-gray-100" />
                        ) : (
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cor} flex items-center justify-center text-white font-black text-sm`}>
                            {iniciais(p.nome)}
                          </div>
                        )}
                        {/* Indicador online */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${p.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-orange-700 transition-colors">
                            {p.nome}
                          </p>
                          {p.is_online && (
                            <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">
                              Online
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs truncate mt-0.5">
                          {p.especialidade ?? 'Prestador de serviços'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {p.rating && p.rating > 0 && (
                            <span className="text-xs text-amber-500">⭐ {p.rating.toFixed(1)}</span>
                          )}
                          {dist && (
                            <span className="text-xs text-gray-400">📍 {dist}</span>
                          )}
                        </div>
                      </div>

                      <span className="text-gray-300 group-hover:text-orange-400 transition-colors text-sm flex-shrink-0">→</span>
                    </button>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                <button onClick={() => { setOpen(false); router.push(`/pedir?q=${encodeURIComponent(query)}`) }}
                  className="w-full text-xs text-orange-600 font-semibold hover:underline text-center">
                  Ver todos os resultados para "{query}" →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
