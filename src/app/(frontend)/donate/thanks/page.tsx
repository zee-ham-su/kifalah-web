import Link from 'next/link'
import { settleDonation } from '@/lib/settleDonation'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Thank you' }

export default async function Thanks({ searchParams }: { searchParams: Promise<{ reference?: string; trxref?: string }> }) {
  const sp = await searchParams
  const reference = sp.reference || sp.trxref
  // Re-verifies with Paystack; the webhook may already have settled it (idempotent).
  const result = reference ? await settleDonation(reference).catch(() => null) : null

  return (
    <div className="wrap">
      {result?.ok ? (
        <>
          <h1>Thank you for your gift</h1>
          <p>Your reference is <strong>{reference}</strong>. Keep it for your records.</p>
        </>
      ) : (
        <>
          <h1>We could not confirm your payment yet</h1>
          <p>If money left your account or wallet, don't worry: we reconcile every payment automatically. Quote reference <strong>{reference ?? 'n/a'}</strong> if you contact us.</p>
          <Link href="/donate" className="btn">Try again</Link>
        </>
      )}
    </div>
  )
}
