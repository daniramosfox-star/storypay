export const CATEGORIAS = [
  { id: 'ar-condicionado', nome: 'Ar condicionado', emoji: '❄️', cor: 'from-blue-400 to-cyan-500' },
  { id: 'eletrica', nome: 'Elétrica', emoji: '⚡', cor: 'from-yellow-400 to-orange-500' },
  { id: 'encanamento', nome: 'Encanamento', emoji: '🔧', cor: 'from-blue-500 to-indigo-500' },
  { id: 'pintura', nome: 'Pintura', emoji: '🖌️', cor: 'from-pink-400 to-rose-500' },
  { id: 'marido-de-aluguel', nome: 'Marido de aluguel', emoji: '🔨', cor: 'from-amber-500 to-orange-600' },
  { id: 'limpeza', nome: 'Limpeza', emoji: '🧹', cor: 'from-green-400 to-emerald-500' },
  { id: 'informatica', nome: 'Informática', emoji: '💻', cor: 'from-violet-400 to-purple-600' },
  { id: 'serralheria', nome: 'Serralheria', emoji: '🔩', cor: 'from-gray-500 to-gray-700' },
  { id: 'jardinagem', nome: 'Jardinagem', emoji: '🌿', cor: 'from-lime-400 to-green-600' },
  { id: 'mudanca', nome: 'Mudança', emoji: '📦', cor: 'from-orange-400 to-red-500' },
]

export const CIDADES = [
  { id: 'goiania', nome: 'Goiânia', estado: 'GO' },
  { id: 'aparecida-de-goiania', nome: 'Aparecida de Goiânia', estado: 'GO' },
  { id: 'brasilia', nome: 'Brasília', estado: 'DF' },
  { id: 'sao-paulo', nome: 'São Paulo', estado: 'SP' },
  { id: 'rio-de-janeiro', nome: 'Rio de Janeiro', estado: 'RJ' },
  { id: 'belo-horizonte', nome: 'Belo Horizonte', estado: 'MG' },
]

export const BAIRROS_GOIANIA = [
  'Setor Bueno', 'Setor Marista', 'Jardim Goiás', 'Setor Oeste',
  'Setor Sul', 'Setor Aeroporto', 'Vila Nova', 'Campinas',
  'Setor Pedro Ludovico', 'Setor Central', 'Setor Leste Universitário',
]

export const PRECO_LEAD = 1.99
export const LEAD_GRATIS_POR_DIA = 1

export function formatWhatsApp(tel: string) {
  const digits = tel.replace(/\D/g, '')
  const num = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${num}`
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
