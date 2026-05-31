// InfinitePay Checkout API
// Docs: https://docs.infinitepay.io
// Checkout: https://www.infinitepay.io/checkout-documentacao

const CHECKOUT_BASE = 'https://api.checkout.infinitepay.io'
const AUTH_BASE = 'https://api.infinitepay.io/v2'

// ----------------------------------------------------------------
// Auth — obtém access token via OAuth2
// ----------------------------------------------------------------
let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Reutiliza token em cache se ainda válido
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const clientId = process.env.INFINITEPAY_CLIENT_ID
  const clientSecret = process.env.INFINITEPAY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('INFINITEPAY_CLIENT_ID e INFINITEPAY_CLIENT_SECRET não configurados')
  }

  const res = await fetch(`${AUTH_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `InfinitePay auth error ${res.status}`)

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 - 60000,
  }

  return cachedToken.token
}

// ----------------------------------------------------------------
// Criar link de pagamento (checkout)
// ----------------------------------------------------------------
export async function criarLinkPagamento(params: {
  orderNsu: string      // ID único nosso (lead_id)
  valor: number         // em reais (ex: 1.99)
  descricao: string
  webhookUrl: string    // chamado quando pago
  returnUrl: string     // redireciona após pagamento
}) {
  const token = await getAccessToken()
  const handle = process.env.INFINITEPAY_HANDLE
  if (!handle) throw new Error('INFINITEPAY_HANDLE não configurado')

  const res = await fetch(`${CHECKOUT_BASE}/links`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      handle,
      order_nsu: params.orderNsu,
      redirect_url: params.returnUrl,
      webhook_url: params.webhookUrl,
      items: [
        {
          quantity: 1,
          price: Math.round(params.valor * 100), // centavos
          description: params.descricao,
        },
      ],
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? data.error ?? `InfinitePay error ${res.status}`)
  return data as InfinitePayLink
}

// ----------------------------------------------------------------
// Verificar status de um pagamento
// ----------------------------------------------------------------
export async function verificarPagamento(orderNsu: string) {
  const token = await getAccessToken()
  const handle = process.env.INFINITEPAY_HANDLE!

  const res = await fetch(`${CHECKOUT_BASE}/payment_check`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ handle, order_nsu: orderNsu }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `InfinitePay error ${res.status}`)
  return data as InfinitePayStatus
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
export type InfinitePayLink = {
  url: string           // link para o cliente pagar
  invoice_slug: string  // ID do pagamento no InfinitePay
  order_nsu: string
  amount: number
  expires_at?: string
}

export type InfinitePayStatus = {
  invoice_slug: string
  order_nsu: string
  amount: number
  paid_amount?: number
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  capture_method?: string
  paid_at?: string
}

// Payload que chega no webhook quando pago
export type InfinitePayWebhookPayload = {
  invoice_slug: string
  order_nsu: string
  amount: number
  paid_amount: number
  capture_method: string   // 'pix' | 'credit' | etc
  transaction_nsu: string
  receipt_url?: string
  items: Array<{ quantity: number; price: number; description: string }>
}
