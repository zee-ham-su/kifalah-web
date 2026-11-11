import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const impact = settings?.impact ?? []

  return (
    <>
      <section className="hero">
        <h1>Empowering Communities. Transforming Lives. Building Futures.</h1>
        <p>Kifalah Foundation Ghana works in education, women's empowerment, youth skills, community infrastructure and social welfare across Ghana.</p>
        <Link href="/donate" className="btn">Donate</Link>
      </section>
      <div className="wrap">
        {impact.length > 0 && (
          <div className="counters">
            {impact.map((i) => (
              <div className="counter" key={i.id}>
                <strong>{i.value.toLocaleString('en-GB')}</strong>
                {i.label}
              </div>
            ))}
          </div>
        )}
        <p>Edit this page's content from the admin panel (Site settings, Pages, Posts).</p>
      </div>
    </>
  )
}
