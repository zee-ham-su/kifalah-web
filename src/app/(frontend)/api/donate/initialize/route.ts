import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { CURRENCIES, FUND_VALUES } from '@/lib/funds'
import { initializeTransaction, toMinor } from '@/lib/paystack'
import { makeReference } from '@/lib/reference'

const MIN: Record<string, number> = { GHS: 5, USD: 2 }

const Body = z.object({
  amount: z.number().positive().max(1_000_000),
  currency: z.enum(CURRENCIES),
  fund: z.enum(FUND_VALUES),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  anonymous: z.boolean().optional(),
})

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Please check the form and try again.' }, { status: 400 })
  const d = parsed.data
  if (d.amount < MIN[d.currency]) {
    return Response.json({ error: `Minimum gift is ${d.currency} ${MIN[d.currency]}.` }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const reference = makeReference('DON')

  // Save as pending BEFORE sending the donor to Paystack, so we can always reconcile.
  await payload.create({
    collection: 'donations',
    data: {
      reference,
      status: 'pending',
      amount: d.amount,
      currency: d.currency,
      fund: d.fund as never,
      donorName: d.name,
      donorEmail: d.email,
      donorPhone: d.phone,
      anonymous: d.anonymous ?? false,
    },
  })

  try {
    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
    const tx = await initializeTransaction({
      email: d.email,
      amountMinor: toMinor(d.amount),
      currency: d.currency,
      reference,
      callbackUrl: `${site}/donate/thanks`,
      metadata: { fund: d.fund, donor: d.name },
    })
    return Response.json({ url: tx.authorization_url })
  } catch (e) {
    console.error('paystack initialize', e)
    return Response.json({ error: 'Payments are unavailable right now. Please try again shortly.' }, { status: 502 })
  }
}
