// Remove BOM (U+FEFF) e espaços que o Windows/PowerShell podem adicionar
export function sanitizeEnv(value: string | undefined): string {
  if (!value) return ''
  return value.replace(/^﻿/, '').replace(/﻿/g, '').trim()
}
