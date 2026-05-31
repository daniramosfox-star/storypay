import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const san = (v: string | undefined) => (v ?? '').replace(/^﻿/, '').replace(/﻿/g, '').trim()

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    san(process.env.NEXT_PUBLIC_SUPABASE_URL),
    san(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — middleware handles refresh
          }
        },
      },
    }
  )
}
