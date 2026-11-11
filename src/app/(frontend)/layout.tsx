import React from 'react'
import Link from 'next/link'
import './styles.css'

export const metadata = {
  title: { default: 'Kifalah Foundation Ghana', template: '%s | Kifalah Foundation Ghana' },
  description: 'Empowering Communities. Transforming Lives. Building Futures.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">Kifalah Foundation Ghana</Link>
          <nav>
            <Link href="/transparency">Transparency</Link>
            <Link href="/donate" className="btn">Donate</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">© Kifalah Foundation Ghana</footer>
      </body>
    </html>
  )
}
