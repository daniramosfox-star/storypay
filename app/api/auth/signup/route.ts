import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Remove BOM (U+FEFF = 65279) e espaços que o Windows adiciona nas env vars
function sanitize(v: string | undefined) {
  return (v ?? '').replace(/^﻿/, '').replace(/﻿/g, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const { email, senha, nome, telefone, especialidade, cidade, bio } = await req.json()

    if (!email || !senha || !nome) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Sanitiza vars — remove BOM e espaços antes de usar nos headers
    const supabaseUrl = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL)
    const serviceKey  = sanitize(process.env.SUPABASE_SERVICE_ROLE_KEY)

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    // Service role — roda no servidor
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // 1. Cria o usuário
    const { data, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, tipo: 'prestador' },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 400 })
      }
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
    }

    // 2. Cria o perfil
    await supabase.from('profiles').upsert({
      id: data.user.id,
      tipo: 'prestador',
      nome,
      telefone: telefone || null,
      especialidade: especialidade || null,
      cidade_id: cidade || null,
      bio: bio || null,
      is_online: false,
      saldo: 0,
    })

    // Conta criada — cliente faz login separadamente via /api/auth/login
    return NextResponse.json({ success: true, needsLogin: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
