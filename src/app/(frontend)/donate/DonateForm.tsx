'use client'

import { useState } from 'react'
import { FUNDS } from '@/lib/funds'

const PRESETS: Record<string, number[]> = { GHS: [20, 50, 100, 200], USD: [5, 10, 25, 50] }

export default function DonateForm() {
  const [currency, setCurrency] = useState<'GHS' | 'USD'>('GHS')
  const [amount, setAmount] = useState<number>(50)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const f = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/donate/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          fund: f.get('fund'),
          name: f.get('name'),
          email: f.get('email'),
          phone: f.get('phone') || undefined,
          anonymous: f.get('anonymous') === 'on',
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong.')
      window.location.href = json.url // Paystack hosted checkout: MoMo or card
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <label>
        Currency
        <select value={currency} onChange={(e) => { const c = e.target.value as 'GHS' | 'USD'; setCurrency(c); setAmount(PRESETS[c][1]) }}>
          <option value="GHS">GHS (Ghana cedi)</option>
          <option value="USD">USD</option>
        </select>
      </label>
      <div className="presets" role="group" aria-label="Amount">
        {PRESETS[currency].map((p) => (
          <button type="button" key={p} aria-pressed={amount === p} onClick={() => setAmount(p)}>
            {currency} {p}
          </button>
        ))}
      </div>
      <label>
        Other amount
        <input type="number" min="1" step="1" inputMode="decimal" value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} />
      </label>
      <label>
        Where should your gift go?
        <select name="fund" defaultValue="general">
          {FUNDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </label>
      <label>Full name<input name="name" required autoComplete="name" /></label>
      <label>Email (for your receipt)<input name="email" type="email" required autoComplete="email" /></label>
      <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" /></label>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 400 }}>
        <input type="checkbox" name="anonymous" style={{ minHeight: 'auto' }} /> Keep my gift anonymous
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={busy || !amount}>{busy ? 'Redirecting...' : `Give ${currency} ${amount || ''}`}</button>
      <small>You will choose Mobile Money or card on the next secure page. We never see or store your card details.</small>
    </form>
  )
}
