import { createClient } from './client'

export async function getProfile(userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function getCampanhasAtivas(nicho?: string) {
  const supabase = createClient()
  let query = supabase
    .from('campanhas')
    .select(`*, profiles:marca_id(nome, empresa)`)
    .eq('status', 'ativa')
    .order('created_at', { ascending: false })

  if (nicho && nicho !== 'Todos') {
    query = query.eq('nicho', nicho)
  }

  const { data } = await query
  return data ?? []
}

export async function getMeusCampanhas(marcaId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('campanhas')
    .select(`*, entregas(count)`)
    .eq('marca_id', marcaId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getMinhasEntregas(influencerId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('entregas')
    .select(`*, campanhas(nome, post_type, profiles:marca_id(nome))`)
    .eq('influencer_id', influencerId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getTransacoes(userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('transacoes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getInfluencers(nicho?: string) {
  const supabase = createClient()
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('tipo', 'influencer')
    .order('rating', { ascending: false })

  if (nicho && nicho !== 'Todos') {
    query = query.eq('nicho', nicho)
  }

  const { data } = await query
  return data ?? []
}

export async function getDisputasAbertas() {
  const supabase = createClient()
  const { data } = await supabase
    .from('disputas')
    .select(`*, entregas(*, campanhas(nome, profiles:marca_id(nome)), profiles:influencer_id(instagram))`)
    .eq('status', 'aberta')
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function aceitarCampanha(campanhaId: string, influencerId: string, valor: number) {
  const supabase = createClient()
  const prazo = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('entregas')
    .insert({ campanha_id: campanhaId, influencer_id: influencerId, valor, prazo_confirmacao: prazo })
    .select()
    .single()
  return { data, error }
}

export async function marcarEntregue(entregaId: string, linkPost: string) {
  const supabase = createClient()
  const prazoConfirmacao = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  const { error } = await supabase
    .from('entregas')
    .update({ status: 'entregue', link_post: linkPost, entregue_em: new Date().toISOString(), prazo_confirmacao: prazoConfirmacao })
    .eq('id', entregaId)
  return { error }
}

export async function confirmarEntrega(entregaId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('entregas')
    .update({ status: 'confirmada', confirmado_em: new Date().toISOString() })
    .eq('id', entregaId)
  return { error }
}
