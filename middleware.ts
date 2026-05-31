import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const san = (v: string | undefined) => (v ?? '').replace(/﻿/g, '').trim()

export async function middleware(request: NextRequest) {
  const supabaseUrl = san(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseKey) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // ── Usuário NÃO autenticado tentando acessar área protegida ──
  const protectedPrefixes = ['/prestador', '/admin']
  const isProtected = protectedPrefixes.some(p => path.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // ── Rota /admin — exige tipo = 'admin' no perfil ──
  if (path.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', user.id)
      .single()

    if (!profile || profile.tipo !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/acesso-negado'
      return NextResponse.redirect(url)
    }
  }

  // ── Usuário logado tentando acessar /login ──
  if (user && path === '/login') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', user.id)
      .single()

    const tipo = profile?.tipo ?? 'cliente'
    const dest = tipo === 'prestador' ? '/prestador' : tipo === 'admin' ? '/admin' : '/'
    const url = request.nextUrl.clone()
    url.pathname = dest
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Exclui _next, assets estáticos E rotas /api/ (não precisam de auth no middleware)
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
