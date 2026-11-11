import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Transparency' }

const LABELS: Record<string, string> = {
  'annual-report': 'Annual reports',
  'audited-financials': 'Audited financial statements',
  policy: 'Policies',
  evaluation: 'Evaluations',
  resource: 'Resources',
}

export default async function Transparency() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'documents', limit: 200, sort: '-year', depth: 0 })
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)

  return (
    <div className="wrap">
      <h1>Transparency</h1>
      {settings?.registeredName && (
        <p><strong>{settings.registeredName}</strong><br />{settings.registrationDetails}</p>
      )}
      {Object.entries(LABELS).map(([key, label]) => {
        const items = docs.filter((d) => d.category === key)
        if (!items.length) return null
        return (
          <section key={key}>
            <h2>{label}</h2>
            <ul className="doc-list">
              {items.map((d) => (
                <li key={d.id}>
                  <a href={d.url ?? '#'}>{d.title}{d.year ? ` (${d.year})` : ''}</a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {docs.length === 0 && <p>Reports and policies will be published here.</p>}
    </div>
  )
}
