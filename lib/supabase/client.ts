import { createBrowserClient } from '@supabase/ssr'

// Remove BOM (U+FEFF) usando escape explícito — evita problemas de encoding no arquivo
function san(v: string | undefined): string {
  return (v ?? '').replace(/﻿/g, '').trim()
}

export function createClient() {
  const url = san(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!url || !key) {
    throw new Error('Supabase não configurado')
  }

  return createBrowserClient(url, key)
}
