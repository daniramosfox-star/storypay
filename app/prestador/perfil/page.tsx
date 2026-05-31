'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIAS, CIDADES } from '@/lib/frepay/data'

const BAIRROS_GOIANIA = [
  'Setor Bueno', 'Setor Marista', 'Jardim Goiás', 'Setor Oeste',
  'Setor Sul', 'Setor Aeroporto', 'Vila Nova', 'Campinas',
  'Setor Pedro Ludovico', 'Setor Central',
]

export default function PerfilPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    especialidade: '',
    categoria_id: '',
    cidade_id: '',
    bairros_atendidos: [] as string[],
    bio: '',
    anos_experiencia: '',
  })

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      try {
        const userId = sessionStorage.getItem('frepay_uid')
        if (!userId) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profile) {
          setForm({
            nome: profile.nome ?? '',
            telefone: profile.telefone ?? '',
            especialidade: profile.especialidade ?? '',
            categoria_id: profile.categoria_id ?? '',
            cidade_id: profile.cidade_id ?? '',
            bairros_atendidos: profile.bairros_atendidos ?? [],
            bio: profile.bio ?? '',
            anos_experiencia: profile.anos_experiencia?.toString() ?? '',
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const h = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const toggleBairro = (b: string) => setForm(p => ({
    ...p,
    bairros_atendidos: p.bairros_atendidos.includes(b)
      ? p.bairros_atendidos.filter(x => x !== b)
      : [...p.bairros_atendidos, b],
  }))

  const save = async () => {
    setSaving(true)
    setError('')
    const uid = sessionStorage.getItem('frepay_uid')
    const user = uid ? { id: uid } : null
    if (!user) { setSaving(false); return }

    const { error: err } = await supabase.from('profiles').update({
      nome: form.nome,
      telefone: form.telefone || null,
      especialidade: form.especialidade || null,
      categoria_id: form.categoria_id || null,
      cidade_id: form.cidade_id || null,
      bairros_atendidos: form.bairros_atendidos,
      bio: form.bio || null,
      anos_experiencia: form.anos_experiencia ? Number(form.anos_experiencia) : null,
    }).eq('id', user.id)

    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const cat = CATEGORIAS.find(c => c.id === form.categoria_id)

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Meu perfil 👤</h1>
        <p className="text-gray-400 text-sm mt-1">Como os clientes veem você no mapa e nas buscas</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className={`h-20 flex items-center justify-center text-4xl bg-gradient-to-br ${cat?.cor ?? 'from-orange-400 to-red-400'}`}>
              {cat?.emoji ?? '🔧'}
            </div>
            <div className="p-4">
              <p className="font-black text-gray-900">{form.nome || 'Seu nome'}</p>
              <p className="text-gray-400 text-xs mb-2">{form.especialidade || 'Sua especialidade'}</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{form.bio || 'Sua bio...'}</p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                <span className="text-gray-500">{form.anos_experiencia ? `${form.anos_experiencia} anos exp.` : '—'}</span>
                <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Prestador</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Dados pessoais</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nome completo</label>
                <input name="nome" value={form.nome} onChange={h}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">WhatsApp</label>
                <input name="telefone" value={form.telefone} onChange={h} placeholder="(62) 99999-0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">O que você faz?</label>
              <input name="especialidade" value={form.especialidade} onChange={h}
                placeholder="Ex: Técnico de ar condicionado, instalação e manutenção"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Apresentação</label>
              <textarea name="bio" value={form.bio} onChange={h} rows={3}
                placeholder="Conte um pouco sobre você e sua experiência..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Área de atuação</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Categoria principal</label>
                <select name="categoria_id" value={form.categoria_id} onChange={h}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option value="">Selecione...</option>
                  {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Anos de experiência</label>
                <input name="anos_experiencia" value={form.anos_experiencia} onChange={h} type="number" min="1"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Cidade</label>
              <select name="cidade_id" value={form.cidade_id} onChange={h}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">Selecione...</option>
                {CIDADES.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.estado}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                Bairros atendidos <span className="text-gray-400 font-normal">({form.bairros_atendidos.length} selecionados)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {BAIRROS_GOIANIA.map(b => (
                  <button key={b} onClick={() => toggleBairro(b)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      form.bairros_atendidos.includes(b)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}>
                    {form.bairros_atendidos.includes(b) ? '✓ ' : ''}{b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <button onClick={save} disabled={saving}
            className={`w-full font-bold py-3 rounded-xl transition-all disabled:opacity-50 ${
              saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-[1.01]'
            }`}>
            {saving ? 'Salvando...' : saved ? '✓ Salvo com sucesso!' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}
