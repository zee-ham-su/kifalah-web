import { getPayload } from 'payload'
import config from '@payload-config'
import { fromMinor, verifyTransaction } from './paystack'

// The one place a donation moves from pending to a final state.
// Called by both the webhook and the thank-you page, so it MUST be idempotent:
// it always re-verifies with Paystack (never trusts the caller) and does nothing
// if the donation is already settled.
export async function settleDonation(reference: string) {
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'donations',
    where: { reference: { equals: reference } },
    limit: 1,
    depth: 0,
  })
  const donation = found.docs[0]
  if (!donation) return { ok: false as const, reason: 'unknown-reference' }
  if (donation.status === 'success') return { ok: true as const, donation }

  const v = await verifyTransaction(reference)

  if (v.status === 'success') {
    // Guard against an amount/currency mismatch (tampered or mis-keyed initialisation).
    if (v.currency !== donation.currency || fromMinor(v.amount) !== donation.amount) {
      await payload.update({
        collection: 'donations',
        id: donation.id,
        data: { status: 'failed', gatewayResponse: { mismatch: true, verification: v } },
      })
      return { ok: false as const, reason: 'amount-mismatch' }
    }
    const updated = await payload.update({
      collection: 'donations',
      id: donation.id,
      data: { status: 'success', channel: v.channel, paidAt: v.paid_at, gatewayResponse: v as never },
    })
    // TODO: send receipt email + SMS here (Resend / Hubtel), then set receiptSentAt.
    return { ok: true as const, donation: updated }
  }

  if (v.status === 'failed' || v.status === 'abandoned') {
    await payload.update({
      collection: 'donations',
      id: donation.id,
      data: { status: v.status, gatewayResponse: v as never },
    })
  }
  return { ok: false as const, reason: v.status }
}
