'use client'

import { useState } from 'react'

const niches = ['Fitness', 'Moda', 'Beleza', 'Games', 'Gastronomia', 'Finanças', 'Pets', 'Viagem']

export default function PerfilPage() {
  const [form, setForm] = useState({
    nome: 'Ana Souza',
    instagram: '@anasouza',
    tiktok: '@anasouza_fit',
    nicho: 'Fitness',
    seguidores: '128000',
    bio: 'Apaixonada por fitness, saúde e bem-estar. Compartilho minha rotina de treinos e alimentação saudável. 🏋️‍♀️',
    cidade: 'São Paulo, SP',
    taxa: 'R$ 150',
  })
  const [saved, setSaved] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Meu Perfil 👤</h1>
        <p className="text-gray-400 text-sm mt-1">Como as marcas te veem na plataforma</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="bg-gradient-to-br from-violet-500 to-pink-500 h-20 flex items-center justify-center text-4xl">
              🏋️‍♀️
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900">{form.nome}</p>
                  <p className="text-gray-400 text-xs">{form.instagram}</p>
                </div>
                <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {form.nicho}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{form.bio}</p>
              <div className="flex justify-between text-center border-t border-gray-100 pt-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {Number(form.seguidores).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-gray-400 text-xs">Seguidores</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">4.9 ⭐</p>
                  <p className="text-gray-400 text-xs">Avaliação</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">47</p>
                  <p className="text-gray-400 text-xs">Posts</p>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="bg-green-50 border border-green-100 rounded-xl p-2 text-center">
                <p className="text-green-700 text-xs font-semibold">✓ Perfil verificado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Editar dados</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nome completo</label>
                <input name="nome" value={form.nome} onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Cidade</label>
                <input name="cidade" value={form.cidade} onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">@ Instagram</label>
                <input name="instagram" value={form.instagram} onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">@ TikTok</label>
                <input name="tiktok" value={form.tiktok} onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nicho</label>
                <select name="nicho" value={form.nicho} onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white">
                  {niches.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Seguidores (total)</label>
                <input name="seguidores" value={form.seguidores} onChange={handle} type="number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handle} rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Taxa base por story</label>
              <input name="taxa" value={form.taxa} onChange={handle} placeholder="Ex: R$ 150"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              <p className="text-xs text-gray-400 mt-1">Referência para marcas. As campanhas têm valor fixo definido pela marca.</p>
            </div>

            <button
              onClick={save}
              className={`w-full font-bold py-3 rounded-xl transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:scale-105'
              }`}
            >
              {saved ? '✓ Salvo com sucesso!' : 'Salvar alterações'}
            </button>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 mt-4">
            <h3 className="font-bold text-red-700 mb-1 text-sm">Zona de perigo</h3>
            <p className="text-gray-400 text-xs mb-3">Ações irreversíveis na conta</p>
            <button className="border border-red-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all">
              Desativar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
