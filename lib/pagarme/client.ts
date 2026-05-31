// Pagar.me v5 API client
// Docs: https://docs.pagar.me/reference

const BASE_URL = 'https://api.pagar.me/core/v5'

function getAuth() {
  const key = process.env.PAGARME_SECRET_KEY
  if (!key) throw new Error('PAGARME_SECRET_KEY não configurada')
  return 'Basic ' + Buffer.from(key + ':').toString('base64')
}

async function request<T>(method: string, path: string, body?: object): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: getAuth(),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message ?? `Pagar.me error ${res.status}`)
  }

  return data as T
}

// ----------------------------------------------------------------
// PIX — Gerar QR code para depósito da marca
// ----------------------------------------------------------------
export async function criarOrdemPix(params: {
  valor: number          // em reais
  nome: string
  email: string
  cpfCnpj: string
  descricao: string
  referenceId: string    // nosso ID interno (ex: profile_id)
}) {
  const valorCentavos = Math.round(params.valor * 100)

  return request<PixOrder>('POST', '/orders', {
    code: `DEP-${params.referenceId}-${Date.now()}`,
    items: [
      {
        amount: valorCentavos,
        description: params.descricao,
        quantity: 1,
        code: 'DEPOSITO',
      },
    ],
    customer: {
      name: params.nome,
      email: params.email,
      type: params.cpfCnpj.length > 14 ? 'company' : 'individual',
      document: params.cpfCnpj.replace(/\D/g, ''),
    },
    payments: [
      {
        payment_method: 'pix',
        pix: {
          expires_in: 3600, // 1h
          additional_information: [
            { name: 'Plataforma', value: 'Storypay' },
          ],
        },
        amount: valorCentavos,
      },
    ],
    metadata: {
      tipo: 'deposito',
      user_id: params.referenceId,
    },
  })
}

// ----------------------------------------------------------------
// PIX — Transferência para influencer (payout)
// ----------------------------------------------------------------
export async function criarTransferenciaPix(params: {
  valor: number
  pixKey: string
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'evp'
  nome: string
  descricao: string
}) {
  const valorCentavos = Math.round(params.valor * 100)

  return request<Transfer>('POST', '/transfers', {
    amount: valorCentavos,
    source_id: 'default_recipient',
    target: {
      type: 'bank_account',
      bank_account: {
        holder_name: params.nome,
        holder_type: 'individual',
        holder_document: '',
        bank: 'pix',
        branch_number: '',
        branch_check_digit: '',
        account_number: '',
        account_check_digit: '',
        type: 'checking',
      },
    },
    pix: {
      key: params.pixKey,
      key_type: params.pixKeyType,
    },
    metadata: {
      descricao: params.descricao,
    },
  })
}

// ----------------------------------------------------------------
// Consultar ordem
// ----------------------------------------------------------------
export async function consultarOrdem(orderId: string) {
  return request<PixOrder>('GET', `/orders/${orderId}`)
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
export type PixOrder = {
  id: string
  code: string
  status: 'pending' | 'paid' | 'canceled' | 'failed'
  amount: number
  charges: Array<{
    id: string
    status: string
    last_transaction: {
      id: string
      status: string
      qr_code: string
      qr_code_url: string
      expires_at: string
    }
  }>
  metadata: Record<string, string>
}

export type Transfer = {
  id: string
  status: 'pending' | 'transferred' | 'failed' | 'processing'
  amount: number
}
