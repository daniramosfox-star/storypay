import type { MetadataRoute } from 'next'
import { CATEGORIAS, CIDADES } from '@/lib/frepay/data'

const BASE = 'https://frepay.com.br'

const bairros: Record<string, string[]> = {
  'goiania': ['setor-bueno', 'setor-marista', 'jardim-goias', 'setor-oeste', 'setor-sul', 'setor-aeroporto', 'vila-nova', 'campinas'],
  'brasilia': ['asa-sul', 'asa-norte', 'sudoeste', 'noroeste', 'aguas-claras', 'taguatinga', 'ceilandia'],
  'sao-paulo': ['moema', 'pinheiros', 'vila-olimpia', 'itaim-bibi', 'brooklin', 'santo-amaro', 'santana'],
  'rio-de-janeiro': ['barra-da-tijuca', 'ipanema', 'leblon', 'copacabana', 'botafogo', 'tijuca'],
  'belo-horizonte': ['savassi', 'lourdes', 'funcionarios', 'buritis', 'pampulha'],
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/pedir`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/cadastro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // /[categoria]/[cidade]
  for (const cat of CATEGORIAS) {
    for (const cid of CIDADES) {
      urls.push({
        url: `${BASE}/${cat.id}/${cid.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.85,
      })

      // /[categoria]/[cidade]/[bairro]
      const bairrosCidade = bairros[cid.id] ?? []
      for (const b of bairrosCidade) {
        urls.push({
          url: `${BASE}/${cat.id}/${cid.id}/${b}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9, // bairro tem prioridade alta (cauda longa)
        })
      }
    }
  }

  return urls
}
