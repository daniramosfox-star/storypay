import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { sanitizeEnv } from './sanitize'

export function createClient() {
  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!url || !key) {
    throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  }

  return createSupabaseClient(url, key)
}
