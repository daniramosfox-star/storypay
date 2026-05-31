// PicPay E-commerce API
// Docs: https://picpay.github.io/picpay-docs-digital-payments

const BASE = 'https://appws.picpay.com/ecommerce/public/v2'

function getToken() {
  const token = process.env.PICPAY_TOKEN
  if (!token) throw new Error('PICPAY_TOKEN não configurado')
  return token
}

// ----------------------------------------------------------------
// Criar cobrança — retorna URL de pagamento
// ----------------------------------------------------------------
export async function criarCobranca(params: {
  referenceId: string    // ID único do nosso sistema (lead_id)
  valor: number          // em reais (1.99)
  compradorNome: string
  compradorEmail: string
  compradorCpf?: string
  callbackUrl: string    // webhook quando pago
  returnUrl: string      // onde redirecionar após pago
}) {
  const res = await fetch(`${BASE}/payments`, {
    method: 'POST',
    headers: {
      'x-picpay-token': getToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      referenceId: params.referenceId,
      callbackUrl: params.callbackUrl,
      returnUrl: params.returnUrl,
      value: params.valor,
      buyer: {
        firstName: params.compradorNome.split(' ')[0],
        lastName: params.compradorNome.split(' ').slice(1).join(' ') || 'Prestador',
        document: params.compradorCpf ?? '000.000.000-00',
        email: params.compradorEmail,
      },
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `PicPay error ${res.status}`)
  return data as PicPayCobranca
}

// ----------------------------------------------------------------
// Consultar status de um pagamento
// ----------------------------------------------------------------
export async function consultarStatus(referenceId: string) {
  const res = await fetch(`${BASE}/payments/${referenceId}/status`, {
    headers: { 'x-picpay-token': getToken() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `PicPay error ${res.status}`)
  return data as PicPayStatus
}

// ----------------------------------------------------------------
// Cancelar cobrança
// ----------------------------------------------------------------
export async function cancelarCobranca(referenceId: string) {
  const res = await fetch(`${BASE}/payments/${referenceId}/cancellations`, {
    method: 'POST',
    headers: { 'x-picpay-token': getToken() },
  })
  return res.ok
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
export type PicPayCobranca = {
  referenceId: string
  paymentUrl: string      // URL para o prestador pagar
  qrcode: {
    content: string       // string do QR code
    base64: string        // imagem base64 do QR
  }
  expiresAt: string
}

export type PicPayStatus = {
  referenceId: string
  status: 'created' | 'expired' | 'analysis' | 'paid' | 'completed' | 'refunded' | 'chargeback'
  authorizationId?: string
  paidAt?: string
  value?: number
}
