// InfinitePay Checkout Integrado
// Docs: https://app.infinitepay.io/external-checkout#documentacao
// Sem OAuth — só precisa do handle (InfiniteTag sem o $)

const CHECKOUT_API = 'https://api.checkout.infinitepay.io'

function getHandle() {
  const handle = process.env.INFINITEPAY_HANDLE
  if (!handle) throw new Error('INFINITEPAY_HANDLE não configurado')
  return handle
}

// ----------------------------------------------------------------
// Criar link de pagamento
// ----------------------------------------------------------------
export async function criarLinkPagamento(params: {
  orderNsu: string       // ID único do nosso sistema (lead_id)
  valor: number          // em reais (ex: 1.99)
  descricao: string
  webhookUrl: string     // chamado automaticamente quando pago
  returnUrl: string      // redireciona o comprador após pagar
}) {
  const handle = getHandle()

  const res = await fetch(`${CHECKOUT_API}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? `InfinitePay error ${res.status}`)
  }
  return data as InfinitePayLink
}

// ----------------------------------------------------------------
// Verificar status de um pagamento
// ----------------------------------------------------------------
export async function verificarPagamento(orderNsu: string) {
  const handle = getHandle()

  const res = await fetch(`${CHECKOUT_API}/payment_check`, {
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
export type InfinitePayLink = {
  url: string
  invoice_slug: string
  order_nsu: string
  amount: number
  expires_at?: string
}

export type InfinitePayStatus = {
  invoice_slug?: string
  order_nsu: string
  amount: number
  paid_amount?: number
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  capture_method?: string
  paid_at?: string
}

export type InfinitePayWebhookPayload = {
  invoice_slug: string
  order_nsu: string
  amount: number
  paid_amount: number
  capture_method: string
  transaction_nsu: string
  receipt_url?: string
  items: Array<{ quantity: number; price: number; description: string }>
}
