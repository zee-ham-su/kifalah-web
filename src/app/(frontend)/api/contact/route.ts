import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const Body = z.object({
  type: z.enum(['contact', 'volunteer', 'partner']).default('contact'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  organisation: z.string().trim().max(160).optional(),
  message: z.string().trim().min(5).max(4000),
  website: z.string().optional(), // honeypot: real people leave this empty
})

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Please check the form.' }, { status: 400 })
  const { website, ...data } = parsed.data
  if (website) return Response.json({ ok: true }) // silently drop bots

  const payload = await getPayload({ config })
  await payload.create({ collection: 'form-submissions', data })
  // TODO: notify the right staff inbox by email.
  return Response.json({ ok: true })
}
