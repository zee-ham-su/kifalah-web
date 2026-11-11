import type { CollectionConfig } from 'payload'
import { allow, hasRole } from '../lib/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'slug', '_status'] },
  versions: { drafts: true },
  access: {
    // Public sees published only; editors see drafts too.
    read: ({ req }) => (hasRole(req.user, 'editor') ? true : { _status: { equals: 'published' } }),
    create: allow('editor'),
    update: allow('editor'),
    delete: allow('editor'),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', type: 'textarea', admin: { description: 'Used for search results and social sharing.' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
  ],
}
