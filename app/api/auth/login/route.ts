import { NextRequest, NextResponse } from 'next/server'

// Remove BOM usando código Unicode explícito
const san = (v: string | undefined) =>
  (v ?? '').replace(/﻿/g, '').replace(/​/g, '').trim()

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json().catch(() => ({}))

  if (!email || !senha) {
    return NextResponse.json({ error: 'E-mail e senha obrigatórios' }, { status: 400 })
  }

  const supabaseUrl = san(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey    = san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  console.log('[LOGIN] url length:', supabaseUrl.length, '| key length:', anonKey.length)

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ error: 'Servidor não configurado' }, { status: 500 })
  }

  // AbortController com timeout de 10 segundos
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const r = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
      body: JSON.stringify({ email, password: senha }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const session = await r.json()
    console.log('[LOGIN] status:', r.status, '| has token:', !!session.access_token)

    if (!r.ok || !session.access_token) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 })
    }

    // Busca tipo do perfil (com timeout próprio)
    let tipo = 'prestador'
    try {
      const pc = new AbortController()
      setTimeout(() => pc.abort(), 3000)
      const pr = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${session.user.id}&select=tipo&limit=1`,
        { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${session.access_token}` }, signal: pc.signal }
      )
      const profiles = await pr.json()
      if (profiles?.[0]?.tipo) tipo = profiles[0].tipo
    } catch { /* usa default */ }

    // Seta cookie de sessão
    const ref = supabaseUrl.split('//')[1]?.split('.')[0] ?? 'default'
    const cookieName = `sb-${ref}-auth-token`
    const cookieValue = JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      expires_in: session.expires_in ?? 3600,
      token_type: 'bearer',
      user: session.user,
    })

    // Retorna também os tokens para o browser poder chamar setSession()
    const response = NextResponse.json({
      success: true,
      tipo,
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })
    response.cookies.set(cookieName, cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: session.expires_in ?? 3600,
      path: '/',
    })

    return response
  } catch (e: unknown) {
    clearTimeout(timeout)
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    console.error('[LOGIN ERROR]', msg)
    if (msg.includes('abort') || msg.includes('timeout')) {
      return NextResponse.json({ error: 'Tempo esgotado. Tente novamente.' }, { status: 504 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
