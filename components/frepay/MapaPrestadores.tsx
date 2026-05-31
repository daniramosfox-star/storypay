'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getIconForCategory, haversine, formatDist } from '@/lib/frepay/map-icons'

type Prestador = {
  id: string
  nome: string
  especialidade: string | null
  categoria_id: string | null
  avatar_url: string | null
  is_online: boolean
  latitude: number
  longitude: number
  rating: number | null
}

interface Props {
  filtroCategoria?: string | null
  height?: string
  className?: string
}

const RAIOS = [1, 5, 10, 999] // km — expande progressivamente

export default function MapaPrestadores({ filtroCategoria, height = '500px', className = '' }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const circleRef = useRef<L.Circle | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null)
  const [prestadores, setPrestadores] = useState<Prestador[]>([])
  const [raioAtual, setRaioAtual] = useState<number>(1)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)

  // Carrega Leaflet só no client
  useEffect(() => {
    import('leaflet').then(leaflet => {
      // Fix ícones padrão do Leaflet
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      setL(leaflet)
    })
  }, [])

  // Busca prestadores no Supabase com expansão de raio
  const buscarPrestadores = useCallback(async (pos: { lat: number; lon: number }) => {
    const supabase = createClient()
    let query = supabase
      .from('profiles')
      .select('id, nome, especialidade, categoria_id, avatar_url, is_online, latitude, longitude, rating')
      .eq('tipo', 'prestador')
      .eq('is_online', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (filtroCategoria) {
      query = query.eq('categoria_id', filtroCategoria)
    }

    const { data } = await query
    const todos = (data ?? []) as Prestador[]

    // Calcula distância e ordena
    const comDist = todos
      .map(p => ({ ...p, dist: haversine(pos.lat, pos.lon, p.latitude, p.longitude) }))
      .sort((a, b) => a.dist - b.dist)

    // Expansão progressiva de raio
    let encontrados: typeof comDist = []
    let raioUsado = 1

    for (const raio of RAIOS) {
      encontrados = comDist.filter(p => p.dist <= raio)
      raioUsado = raio
      if (encontrados.length > 0) break
    }

    setRaioAtual(raioUsado)

    if (encontrados.length === 0) {
      setMensagem('Nenhum prestador encontrado na sua região. Tente novamente mais tarde ou deixe seu contato que avisamos quando um profissional estiver disponível.')
      setPrestadores([])
    } else {
      setMensagem(null)
      setPrestadores(encontrados)
    }
  }, [filtroCategoria])

  // Inicializa o mapa
  useEffect(() => {
    if (!L || !mapRef.current || leafletMapRef.current) return

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    leafletMapRef.current = map

    // Geolocalização
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        const position: { lat: number; lon: number } = { lat, lon }
        setUserPos(position)
        setLoading(false)

        map.setView([lat, lon], 14)

        // Marcador do cliente
        const clientIcon = L.divIcon({
          html: `<div style="
            width:16px; height:16px;
            background:#FF6B35;
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          className: '',
        })
        L.marker([lat, lon], { icon: clientIcon })
          .addTo(map)
          .bindTooltip('Você está aqui', { permanent: false })

        buscarPrestadores(position)
      },
      () => {
        // Fallback: Goiânia
        const fallback = { lat: -16.6864, lon: -49.2643 }
        setUserPos(fallback)
        setLoading(false)
        map.setView([fallback.lat, fallback.lon], 13)
        buscarPrestadores(fallback)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [L, buscarPrestadores])

  // Atualiza marcadores quando prestadores mudam
  useEffect(() => {
    const map = leafletMapRef.current
    if (!map || !L || !userPos) return

    // Remove marcadores antigos
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    if (circleRef.current) { circleRef.current.remove(); circleRef.current = null }

    if (prestadores.length === 0) return

    // Círculo de raio atual
    if (raioAtual < 999) {
      circleRef.current = L.circle([userPos.lat, userPos.lon], {
        radius: raioAtual * 1000,
        color: '#FF6B35',
        fillColor: '#FF6B35',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '6 4',
      }).addTo(map)
    }

    // Adiciona marcadores dos prestadores
    prestadores.forEach(p => {
      const { bg, svg } = getIconForCategory(p.categoria_id)
      const dist = haversine(userPos.lat, userPos.lon, p.latitude, p.longitude)
      const stars = p.rating ? '⭐'.repeat(Math.round(p.rating)) : ''

      const icon = L.divIcon({
        html: `
          <div class="frepay-marker" style="
            width:44px; height:44px;
            background:${bg};
            border-radius:50%;
            border:3px solid white;
            box-shadow:0 4px 12px rgba(0,0,0,0.25);
            display:flex; align-items:center; justify-content:center;
            cursor:pointer;
            transition:transform 0.2s;
          "
          onmouseover="this.style.transform='scale(1.2)'"
          onmouseout="this.style.transform='scale(1)'"
          >
            <div style="width:22px;height:22px">${svg}</div>
          </div>
          ${p.is_online ? `<div style="
            position:absolute; bottom:2px; right:2px;
            width:10px; height:10px;
            background:#22c55e;
            border:2px solid white;
            border-radius:50%;
          "></div>` : ''}
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        className: '',
      })

      const popup = `
        <div style="min-width:180px; font-family:system-ui,sans-serif">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px">
            ${p.avatar_url
              ? `<img src="${p.avatar_url}" style="width:40px;height:40px;border-radius:50%;object-fit:cover" />`
              : `<div style="width:40px;height:40px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px">
                  ${p.nome.split(' ').slice(0,2).map(n=>n[0]).join('')}
                </div>`
            }
            <div>
              <p style="font-weight:700;font-size:14px;margin:0">${p.nome}</p>
              <p style="font-size:11px;color:#666;margin:2px 0">${p.especialidade ?? p.categoria_id ?? 'Prestador'}</p>
              ${stars ? `<p style="font-size:11px;margin:0">${stars} ${p.rating?.toFixed(1)}</p>` : ''}
            </div>
          </div>
          <p style="font-size:12px;color:#FF6B35;font-weight:600;margin:4px 0">📍 ${formatDist(dist)}</p>
          <p style="font-size:11px;margin:4px 0">
            <span style="background:${p.is_online ? '#dcfce7' : '#f3f4f6'};color:${p.is_online ? '#16a34a' : '#9ca3af'};padding:2px 6px;border-radius:9999px;font-weight:600">
              ${p.is_online ? '● Online agora' : '○ Offline'}
            </span>
          </p>
          <a href="/pedir" style="
            display:block; margin-top:8px; padding:6px 0;
            background:#FF6B35; color:white; text-align:center;
            border-radius:8px; font-weight:700; font-size:12px;
            text-decoration:none;
          ">Ver perfil →</a>
        </div>
      `

      const marker = L.marker([p.latitude, p.longitude], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 220 })

      markersRef.current.push(marker)
    })
  }, [prestadores, userPos, L, raioAtual])

  // Atualização a cada 30 segundos
  useEffect(() => {
    if (!userPos) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => buscarPrestadores(userPos), 30000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [userPos, buscarPrestadores])

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* CSS do Leaflet */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-100 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Obtendo sua localização...</p>
        </div>
      )}

      {/* Mapa */}
      <div ref={mapRef} className="w-full h-full rounded-2xl z-10" />

      {/* Info overlay */}
      {!loading && (
        <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 text-xs max-w-[200px]">
          {mensagem ? (
            <p className="text-gray-600">{mensagem}</p>
          ) : (
            <>
              <p className="font-bold text-gray-900">
                {prestadores.filter(p => p.is_online).length} online • {prestadores.length} total
              </p>
              <p className="text-gray-400 mt-0.5">
                Raio: {raioAtual === 999 ? 'cidade toda' : `${raioAtual} km`}
              </p>
            </>
          )}
        </div>
      )}

      {/* Atualiza agora */}
      {!loading && userPos && (
        <button
          onClick={() => buscarPrestadores(userPos)}
          className="absolute bottom-3 right-3 z-20 bg-white shadow-lg rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all flex items-center gap-1.5"
        >
          <span className="text-base">🔄</span> Atualizar
        </button>
      )}
    </div>
  )
}
