'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getIconForCategory, haversine, formatDist } from '@/lib/frepay/map-icons'
import Link from 'next/link'

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

export default function MapaHero() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [L, setL] = useState<any>(null)

  const buscar = useCallback(async (pos: { lat: number; lon: number }, leaflet: any, map: any) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, nome, especialidade, categoria_id, avatar_url, is_online, latitude, longitude, rating')
      .eq('tipo', 'prestador')
      .eq('is_online', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(20)

    const prestadores = (data ?? []) as Prestador[]
    setOnlineCount(prestadores.length)

    // Remove marcadores antigos
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Adiciona novos
    prestadores.forEach(p => {
      const { bg, svg } = getIconForCategory(p.categoria_id)
      const dist = haversine(pos.lat, pos.lon, p.latitude, p.longitude)

      const icon = leaflet.divIcon({
        html: `<div style="
          width:38px;height:38px;
          background:${bg};
          border-radius:50%;
          border:3px solid white;
          box-shadow:0 3px 10px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:transform 0.2s;
        "
        onmouseover="this.style.transform='scale(1.25)'"
        onmouseout="this.style.transform='scale(1)'"
        ><div style="width:18px;height:18px">${svg}</div></div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        className: '',
      })

      const popup = `
        <div style="font-family:system-ui,sans-serif;min-width:160px">
          <p style="font-weight:700;font-size:13px;margin:0 0 3px">${p.nome}</p>
          <p style="font-size:11px;color:#666;margin:0 0 4px">${p.especialidade ?? ''}</p>
          <p style="font-size:11px;color:#FF6B35;font-weight:600;margin:0 0 6px">📍 ${formatDist(dist)}</p>
          <a href="/pedir" style="
            display:block;padding:5px 0;background:#FF6B35;color:white;
            text-align:center;border-radius:6px;font-weight:700;font-size:11px;
            text-decoration:none;
          ">Solicitar serviço →</a>
        </div>
      `

      const marker = leaflet.marker([p.latitude, p.longitude], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 200 })

      markersRef.current.push(marker)
    })
  }, [])

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return

    import('leaflet').then(leaflet => {
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      setL(leaflet)

      const map = leaflet.map(mapRef.current!, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: false,
        attributionControl: false,
      })

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map)

      // Adiciona controles minimalistas
      leaflet.control.zoom({ position: 'bottomright' }).addTo(map)
      leaflet.control.attribution({ prefix: false, position: 'bottomleft' }).addTo(map)

      leafletMapRef.current = map

      navigator.geolocation?.getCurrentPosition(
        pos => {
          const { latitude: lat, longitude: lon } = pos.coords
          const position = { lat, lon }
          setUserPos(position)
          map.setView([lat, lon], 14)

          // Marcador do usuário
          const userIcon = leaflet.divIcon({
            html: `<div style="
              width:18px;height:18px;
              background:#FF6B35;
              border:3px solid white;
              border-radius:50%;
              box-shadow:0 2px 8px rgba(255,107,53,0.6);
              position:relative;
            ">
              <div style="
                position:absolute;inset:-8px;
                background:rgba(255,107,53,0.2);
                border-radius:50%;
                animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
              "></div>
            </div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            className: '',
          })

          leaflet.marker([lat, lon], { icon: userIcon })
            .addTo(map)
            .bindTooltip('Você está aqui', { direction: 'top' })

          setLoading(false)
          buscar(position, leaflet, map)
        },
        () => {
          // Fallback Goiânia
          const pos = { lat: -16.6864, lon: -49.2643 }
          setUserPos(pos)
          map.setView([pos.lat, pos.lon], 13)
          setLoading(false)
          buscar(pos, leaflet, map)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    })
  }, [buscar])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 bg-gray-900/80 z-30 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 text-sm">Localizando prestadores...</p>
        </div>
      )}

      {/* Mapa */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Badge online */}
      {!loading && (
        <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {onlineCount > 0 ? `${onlineCount} prestador${onlineCount !== 1 ? 'es' : ''} online` : 'Nenhum online agora'}
        </div>
      )}

      {/* Link expandir */}
      <Link href="/mapa"
        className="absolute bottom-3 right-3 z-20 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-lg">
        🗺️ Ver mapa completo
      </Link>
    </div>
  )
}
