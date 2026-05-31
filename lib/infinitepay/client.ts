// InfinitePay Checkout Integrado
// Gera URL de pagamento diretamente — sem POST, sem OAuth
// Formato: https://checkout.infinitepay.io/[handle]?items=[...]&order_nsu=...

const CHECKOUT_BASE = 'https://checkout.infinitepay.io'

function getHandle() {
  const handle = process.env.INFINITEPAY_HANDLE
  if (!handle) throw new Error('INFINITEPAY_HANDLE não configurado')
  return handle
}

// ----------------------------------------------------------------
// Gerar URL de pagamento (método direto — sem chamada de API)
// ----------------------------------------------------------------
export function gerarUrlPagamento(params: {
  orderNsu: string
  valor: number          // em reais (ex: 1.99)
  descricao: string
  redirectUrl: string    // redireciona após pagar
  webhookUrl?: string    // notificação quando pago
}): string {
  const handle = getHandle()

  const items = JSON.stringify([{
    quantity: 1,
    price: Math.round(params.valor * 100), // centavos
    description: params.descricao,
  }])

  const url = new URL(`${CHECKOUT_BASE}/${handle}`)
  url.searchParams.set('items', items)
  url.searchParams.set('order_nsu', params.orderNsu)
  url.searchParams.set('redirect_url', params.redirectUrl)
  if (params.webhookUrl) {
    url.searchParams.set('webhook_url', params.webhookUrl)
  }

  return url.toString()
}

// ----------------------------------------------------------------
// Verificar status de um pagamento via API
// ----------------------------------------------------------------
export async function verificarPagamento(orderNsu: string): Promise<InfinitePayStatus> {
  const handle = getHandle()

  const res = await fetch('https://api.checkout.infinitepay.io/payment_check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, order_nsu: orderNsu }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `InfinitePay error ${res.status}`)
  return data as InfinitePayStatus
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
export type InfinitePayStatus = {
  order_nsu: string
  amount?: number
  paid_amount?: number
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  capture_method?: string
  paid_at?: string
  invoice_slug?: string
}

export type InfinitePayWebhookPayload = {
  invoice_slug: string
  order_nsu: string
  amount: number
  paid_amount: number
  capture_method: string   // 'pix' | 'credit' | 'debit'
  transaction_nsu: string
  receipt_url?: string
  items: Array<{ quantity: number; price: number; description: string }>
}
