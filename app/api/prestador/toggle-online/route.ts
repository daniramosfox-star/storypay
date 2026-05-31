import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const san = (v: string | undefined) => (v ?? '').replace(/﻿/g, '').trim()

export async function POST(req: NextRequest) {
  try {
    const { userId, isOnline, latitude, longitude } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 })

    // Usa service role para bypass de RLS — operação confiável
    const supabase = createClient(
      san(process.env.NEXT_PUBLIC_SUPABASE_URL),
      san(process.env.SUPABASE_SERVICE_ROLE_KEY),
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const updateData: Record<string, unknown> = {
      is_online: isOnline,
      last_seen: new Date().toISOString(),
    }

    if (isOnline && latitude && longitude) {
      updateData.latitude = latitude
      updateData.longitude = longitude
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    if (error) {
      console.error('[TOGGLE-ONLINE]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, isOnline })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
