'use client'

import { useState } from 'react'
import { CATEGORIAS, BAIRROS_GOIANIA, CIDADES } from '@/lib/frepay/data'

export default function PerfilPage() {
  const [form, setForm] = useState({
    nome: 'João Silva',
    telefone: '(62) 99999-0001',
    categoria: 'ar-condicionado',
    cidade: 'goiania',
    bairros: ['Setor Bueno', 'Setor Marista', 'Jardim Goiás'],
    bio: 'Técnico certificado com 8 anos de experiência. Atendo residências e empresas. Orçamento sem compromisso.',
    anos: '8',
  })
  const [saved, setSaved] = useState(false)
  const h = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))
  const toggleBairro = (b: string) => setForm(p => ({
    ...p,
    bairros: p.bairros.includes(b) ? p.bairros.filter(x => x !== b) : [...p.bairros, b],
  }))
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const cat = CATEGORIAS.find(c => c.id === form.categoria)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Meu perfil 👤</h1>
        <p className="text-gray-400 text-sm mt-1">Como os clientes veem você na plataforma</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Preview card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className={`h-20 flex items-center justify-center text-4xl bg-gradient-to-br ${cat?.cor ?? 'from-gray-400 to-gray-500'}`}>
              {cat?.emoji ?? '🔧'}
            </div>
            <div className="p-4">
              <p className="font-black text-gray-900">{form.nome}</p>
              <p className="text-gray-400 text-xs mb-2">{cat?.nome} • {form.anos} anos de exp.</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{form.bio}</p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">4.9 ⭐</span>
                <span className="text-gray-400">23 avaliações</span>
                <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Dados pessoais</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nome completo</label>
                <input value={form.nome} onChange={e => h('nome', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">WhatsApp</label>
                <input value={form.telefone} onChange={e => h('telefone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Bio / Apresentação</label>
              <textarea value={form.bio} onChange={e => h('bio', e.target.value)} rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Área de atuação</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Categoria principal</label>
                <select value={form.categoria} onChange={e => h('categoria', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Anos de experiência</label>
                <input type="number" value={form.anos} onChange={e => h('anos', e.target.value)} min="1" max="50"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Cidade</label>
              <select value={form.cidade} onChange={e => h('cidade', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {CIDADES.map(c => <option key={c.id} value={c.id}>{c.nome} - {c.estado}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Bairros atendidos <span className="text-gray-400 font-normal">(selecione todos)</span></label>
              <div className="flex flex-wrap gap-2">
                {BAIRROS_GOIANIA.map(b => (
                  <button key={b} onClick={() => toggleBairro(b)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      form.bairros.includes(b)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}>
                    {form.bairros.includes(b) ? '✓ ' : ''}{b}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">{form.bairros.length} bairro{form.bairros.length !== 1 ? 's' : ''} selecionado{form.bairros.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <button onClick={save}
            className={`w-full font-bold py-3 rounded-xl transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-[1.01]'}`}>
            {saved ? '✓ Salvo com sucesso!' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}
