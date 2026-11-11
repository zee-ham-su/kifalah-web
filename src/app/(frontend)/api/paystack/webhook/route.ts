import { isValidSignature } from '@/lib/paystack'
import { settleDonation } from '@/lib/settleDonation'

// Paystack calls this server-to-server. It is the source of truth for payment state
// (the donor's browser redirect can be lost on a bad connection).
export async function POST(req: Request) {
  const raw = await req.text()
  if (!isValidSignature(raw, req.headers.get('x-paystack-signature'))) {
    return new Response('invalid signature', { status: 401 })
  }

  let event: { event?: string; data?: { reference?: string } }
  try {
    event = JSON.parse(raw)
  } catch {
    return new Response('bad json', { status: 400 })
  }

  const reference = event.data?.reference
  if (reference && event.event?.startsWith('charge.')) {
    try {
      await settleDonation(reference)
    } catch (e) {
      console.error('webhook settle failed', reference, e)
      return new Response('retry', { status: 500 }) // Paystack will retry
    }
  }
  return new Response('ok')
}
