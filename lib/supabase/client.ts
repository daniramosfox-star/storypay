import { createBrowserClient } from '@supabase/ssr'

// Remove BOM (U+FEFF = 65279) que o Windows adiciona nas env vars
function san(v: string | undefined): string {
  return (v ?? '').replace(/﻿/g, '').trim()
}

export function createClient() {
  const url = san(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!url || !key) {
    throw new Error('Supabase não configurado')
  }

  // createBrowserClient armazena sessão em COOKIES — necessário para o middleware funcionar
  return createBrowserClient(url, key)
}
