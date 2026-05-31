import { NextRequest, NextResponse } from 'next/server'

const san = (v: string | undefined) => (v ?? '').replace(/﻿/g, '').trim()

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json()
    if (!email || !senha) {
      return NextResponse.json({ error: 'E-mail e senha obrigatórios' }, { status: 400 })
    }

    const supabaseUrl = san(process.env.NEXT_PUBLIC_SUPABASE_URL)
    const anonKey    = san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    // Login direto via REST — igual ao teste que funcionou
    const r = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
      },
      body: JSON.stringify({ email, password: senha }),
    })

    const session = await r.json()

    if (!r.ok || !session.access_token) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 })
    }

    // Busca tipo do perfil
    let tipo = 'prestador'
    try {
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${session.user.id}&select=tipo&limit=1`,
        { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${session.access_token}` } }
      )
      const profiles = await profileRes.json()
      if (profiles?.[0]?.tipo) tipo = profiles[0].tipo
    } catch { /* usa default */ }

    // Monta response com cookies de sessão
    const response = NextResponse.json({ success: true, tipo })

    // Cookie principal da sessão Supabase (formato esperado pelo middleware @supabase/ssr)
    const cookieValue = JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: session.user,
    })

    const projectRef = supabaseUrl.split('//')[1].split('.')[0]
    const cookieName = `sb-${projectRef}-auth-token`

    response.cookies.set(cookieName, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: session.expires_in ?? 3600,
      path: '/',
    })

    return response
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro interno'
    console.error('[LOGIN]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
