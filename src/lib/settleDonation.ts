import { getPayload } from 'payload'
import config from '@payload-config'
import { fromMinor, verifyTransaction } from './paystack'
import { buildReceipt, sendEmail, sendSms } from './notify'

// Sends the receipt at most once. The claim (setting receiptSentAt where it is still empty)
// is a single atomic UPDATE, so the webhook and the thank-you page can race safely.
// If sending fails, the claim is released so the next webhook retry tries again.
async function sendReceiptOnce(donationId: number | string) {
  const payload = await getPayload({ config })
  const claimed = await payload.update({
    collection: 'donations',
    where: { and: [{ id: { equals: donationId } }, { receiptSentAt: { exists: false } }] },
    data: { receiptSentAt: new Date().toISOString() },
  })
  const d = claimed.docs[0]
  if (!d) return // someone else already sent it

  try {
    const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
    const r = buildReceipt({
      reference: d.reference,
      donorName: d.donorName,
      amount: d.amount,
      currency: d.currency,
      fund: d.fund,
      paidAt: d.paidAt,
      orgName: settings?.registeredName || 'Kifalah Foundation Ghana',
      registration: settings?.registrationDetails,
    })
    const emailed = await sendEmail(d.donorEmail, r.subject, r.html, r.text)
    // Email not configured: release the claim so it is sent once keys exist, instead of silently marking it done.
    if (!emailed) throw new Error('email not configured (RESEND_API_KEY / EMAIL_FROM)')
    if (d.donorPhone) await sendSms(d.donorPhone, r.sms).catch((e) => console.error('sms failed (non-fatal)', e))
  } catch (e) {
    console.error('receipt failed, releasing claim', d.reference, e)
    await payload.update({ collection: 'donations', id: d.id, data: { receiptSentAt: null } })
  }
}

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
  if (donation.status === 'success') {
    if (!donation.receiptSentAt) await sendReceiptOnce(donation.id) // retry a receipt that failed earlier
    return { ok: true as const, donation }
  }

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
    await sendReceiptOnce(updated.id)
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
