'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: {
  nome: string
  email: string
  senha: string
  tipo: 'influencer' | 'marca'
  // influencer fields
  instagram?: string
  tiktok?: string
  nicho?: string
  seguidores?: string
  bio?: string
  // brand fields
  empresa?: string
  cnpj?: string
  site?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.senha,
    options: {
      data: {
        nome: formData.nome,
        tipo: formData.tipo,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Create profile
    const profileData = formData.tipo === 'influencer'
      ? {
          id: data.user.id,
          tipo: 'influencer',
          nome: formData.nome,
          instagram: formData.instagram ?? '',
          tiktok: formData.tiktok ?? '',
          nicho: formData.nicho ?? '',
          seguidores: Number(formData.seguidores) || 0,
          bio: formData.bio ?? '',
          rating: 0,
          posts_entregues: 0,
          saldo: 0,
        }
      : {
          id: data.user.id,
          tipo: 'marca',
          nome: formData.nome,
          empresa: formData.empresa ?? '',
          cnpj: formData.cnpj ?? '',
          site: formData.site ?? '',
          saldo: 0,
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData as any)

    if (profileError) {
      return { error: profileError.message }
    }
  }

  return { success: true }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tipo')
    .eq('id', data.user.id)
    .single()

  return { success: true, tipo: profile?.tipo ?? 'influencer' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
