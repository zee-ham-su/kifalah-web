import { FUNDS } from './funds'

// Both senders are no-ops (return false) when their keys are missing, so local dev
// and tests never need real accounts. They throw on a failed API call so callers can retry.

export async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM // e.g. "Kifalah Foundation <receipts@yourdomain.org>"
  if (!key || !from) return false
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, text }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
  return true
}

// Hubtel "quick send" SMS API. Confirm the endpoint and sender ID against your Hubtel dashboard;
// sender IDs must be registered with Hubtel before they work.
export async function sendSms(to: string, content: string): Promise<boolean> {
  const id = process.env.HUBTEL_CLIENT_ID
  const secret = process.env.HUBTEL_CLIENT_SECRET
  const from = process.env.HUBTEL_SENDER_ID
  if (!id || !secret || !from) return false
  const url = new URL('https://smsc.hubtel.com/v1/messages/send')
  url.search = new URLSearchParams({ clientid: id, clientsecret: secret, from, to: normalisePhone(to), content }).toString()
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Hubtel ${res.status}: ${await res.text()}`)
  return true
}

// 0241234567 -> 233241234567 ; +233... -> 233...
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (digits.startsWith('233')) return digits
  if (digits.startsWith('0')) return `233${digits.slice(1)}`
  return digits
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export type ReceiptInput = {
  reference: string
  donorName: string
  amount: number
  currency: string
  fund: string
  paidAt?: string | null
  orgName: string
  registration?: string | null
}

export function buildReceipt(r: ReceiptInput) {
  const fund = FUNDS.find((f) => f.value === r.fund)?.label ?? r.fund
  const amount = `${r.currency} ${r.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const date = new Date(r.paidAt ?? Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

  const text = [
    `Thank you, ${r.donorName}.`,
    `We have received your gift of ${amount} for ${fund} on ${date}.`,
    `Receipt reference: ${r.reference}`,
    '',
    r.orgName,
    r.registration ?? '',
  ].join('\n').trim()

  const html = `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:auto;color:#1b2420">
<h2 style="color:#0f4d3a">Thank you, ${esc(r.donorName)}</h2>
<p>We have received your gift. May it bring benefit to many.</p>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:6px 0;color:#5b6760">Amount</td><td><strong>${esc(amount)}</strong></td></tr>
<tr><td style="padding:6px 0;color:#5b6760">Fund</td><td>${esc(fund)}</td></tr>
<tr><td style="padding:6px 0;color:#5b6760">Date</td><td>${esc(date)}</td></tr>
<tr><td style="padding:6px 0;color:#5b6760">Reference</td><td><strong>${esc(r.reference)}</strong></td></tr>
</table>
<p style="color:#5b6760;font-size:13px">${esc(r.orgName)}${r.registration ? `<br>${esc(r.registration).replace(/\n/g, '<br>')}` : ''}</p>
</div>`

  const sms = `Kifalah Foundation: thank you ${r.donorName.split(' ')[0]}. We received ${amount} (${fund}). Ref ${r.reference}.`
  return { subject: `Your Kifalah receipt ${r.reference}`, html, text, sms }
}
