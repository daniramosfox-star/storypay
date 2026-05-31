import { NextRequest, NextResponse } from 'next/server'

const san = (v: string | undefined) => (v ?? '').replace(/﻿/g, '').trim()

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))
  if (!email) return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 })

  const supabaseUrl = san(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey    = san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const appUrl     = san(process.env.NEXT_PUBLIC_APP_URL) || 'https://frepay-br.vercel.app'

  const r = await fetch(`${supabaseUrl}/auth/v1/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
    body: JSON.stringify({ email, redirect_to: `${appUrl}/nova-senha` }),
  })

  // Sempre retorna sucesso por segurança (não revela se email existe)
  return NextResponse.json({ success: true })
}
