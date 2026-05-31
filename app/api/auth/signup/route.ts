import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email, senha, nome, telefone, categoria, cidade, bio } = await req.json()

    if (!email || !senha || !nome) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Service role — roda no servidor, sem problema de headers
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

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
      categoria_id: categoria || null,
      cidade_id: cidade || null,
      bio: bio || null,
      is_online: false,
      saldo: 0,
    })

    // 3. Faz login para retornar a sessão
    const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (loginError || !session.session) {
      // Conta criada mas login falhou — usuário pode logar manualmente
      return NextResponse.json({ success: true, needsLogin: true })
    }

    return NextResponse.json({
      success: true,
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
