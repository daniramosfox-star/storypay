// Ícones SVG flat design para cada categoria de serviço
// Cada ícone é branco sobre fundo colorido, 40x40px com sombra

export const CATEGORY_ICONS: Record<string, { bg: string; svg: string }> = {
  'ar-condicionado': {
    bg: '#4FC3F7',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L9 5H7l3-3h4zm0 0l3 3h-2l-3-3h2zm-1 4v3.27L8.27 7H7l2.73 2.73L6 13h1.27L12 8.27 16.73 13H18l-3.73-3.27L17 7h-1.27L12 9.27V6h-1zm0 8v3.27L8.27 17H7l2.73 2.73L6 22h1.27L12 17.27 16.73 22H18l-3.73-3.27L17 17h-1.27L12 19.27V14h-1z"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>`,
  },
  'eletrica': {
    bg: '#FFD600',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>`,
  },
  'encanamento': {
    bg: '#1565C0',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7H7a5 5 0 000 10h3v2H8v2h8v-2h-2v-2h3a5 5 0 000-10zm0 8H7a3 3 0 010-6h10a3 3 0 010 6z"/>
      <path d="M11 5h2V3h-2v2zm0 14h2v2h-2v-2z"/>
    </svg>`,
  },
  'pintura': {
    bg: '#7B1FA2',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM4 8V4h16v4H4zm11 8l-1 4H8V12h8v4h-1z"/>
      <rect x="10" y="10" width="4" height="8"/>
    </svg>`,
  },
  'marido-de-aluguel': {
    bg: '#E65100',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 2.1L13 4.6l1.4 1.4 2.5-2.5-1.4-1.4zM13 7L7 1 5.6 2.4l2 2L4 8l1.4 1.4 3.6-3.6 1.4 1.4L7 10.8l1.4 1.4 3.4-3.4 1.3 1.3L20 3l-1.4-1.4L13 7zm-1.6 7.8L10 16.2 5 21l2 .8 5-5-1.6-.4 2.5-2.4-1.5-1.1z"/>
    </svg>`,
  },
  'limpeza': {
    bg: '#2E7D32',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 9V4l1-1V2H7v1l1 1v5l-2 2v2h3v6l1 1 1-1v-6h3v-2l-2-2z"/>
    </svg>`,
  },
  'informatica': {
    bg: '#37474F',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 2H3a2 2 0 00-2 2v12a2 2 0 002 2h7l-2 3v1h8v-1l-2-3h7a2 2 0 002-2V4a2 2 0 00-2-2zm0 12H3V4h18v10z"/>
    </svg>`,
  },
  'serralheria': {
    bg: '#546E7A',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
    </svg>`,
  },
  'jardinagem': {
    bg: '#558B2F',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2C14 3 17 8 17 8zM9.77 14.77L8 13l4.5-4.5 1.5 1.5-4.23 4.77z"/>
    </svg>`,
  },
  'mudanca': {
    bg: '#F57F17',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>`,
  },
  // fallback genérico
  default: {
    bg: '#FF6B35',
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`,
  },
}

export function getIconForCategory(categoriaId: string | null) {
  if (!categoriaId) return CATEGORY_ICONS.default
  return CATEGORY_ICONS[categoriaId] ?? CATEGORY_ICONS.default
}

// Haversine distance in km
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export function formatDist(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m de você`
  return `${km.toFixed(1).replace('.', ',')} km de você`
}
