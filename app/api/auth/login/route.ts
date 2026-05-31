import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const san = (v: string | undefined) => (v ?? '').replace(/﻿/g, '').trim()

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json()
    if (!email || !senha) {
      return NextResponse.json({ error: 'E-mail e senha obrigatórios' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })

    // Usa createServerClient que seta cookies automaticamente na response
    const supabase = createServerClient(
      san(process.env.NEXT_PUBLIC_SUPABASE_URL),
      san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 })
    }

    // Busca o tipo do perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', data.user.id)
      .single()

    const tipo = profile?.tipo ?? 'prestador'

    // Retorna com cookies de sessão já setados
    return NextResponse.json({ success: true, tipo }, {
      headers: response.headers,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
