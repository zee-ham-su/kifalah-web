import { createHmac, timingSafeEqual } from 'crypto'

const API = 'https://api.paystack.co'

function secret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set')
  return key
}

// Paystack amounts are in the currency's lowest unit (pesewas / cents).
export const toMinor = (major: number) => Math.round(major * 100)
export const fromMinor = (minor: number) => minor / 100

export async function initializeTransaction(args: {
  email: string
  amountMinor: number
  currency: string
  reference: string
  callbackUrl: string
  metadata: Record<string, unknown>
}): Promise<{ authorization_url: string }> {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: args.email,
      amount: args.amountMinor,
      currency: args.currency,
      reference: args.reference,
      callback_url: args.callbackUrl,
      metadata: args.metadata,
    }),
  })
  const json = await res.json()
  if (!res.ok || !json.status) throw new Error(json.message || 'Paystack initialize failed')
  return json.data
}

export type PaystackVerification = {
  status: string // 'success' | 'failed' | 'abandoned' | ...
  amount: number
  currency: string
  channel?: string
  paid_at?: string
  reference: string
}

export async function verifyTransaction(reference: string): Promise<PaystackVerification> {
  const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` },
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok || !json.status) throw new Error(json.message || 'Paystack verify failed')
  return json.data
}

// Paystack signs the raw body with HMAC-SHA512 using the secret key.
export function isValidSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false
  const expected = createHmac('sha512', secret()).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}
