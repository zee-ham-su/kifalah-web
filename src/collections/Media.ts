import type { CollectionConfig } from 'payload'
import { allow, anyone } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: anyone,
    create: allow('editor'),
    update: allow('editor'),
    delete: allow('editor'),
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
  upload: {
    mimeTypes: ['image/*'],
    // Small WebP variants keep pages light on 3G/4G (PRD 6.1).
    formatOptions: { format: 'webp', options: { quality: 78 } },
    imageSizes: [
      { name: 'card', width: 640, height: undefined, formatOptions: { format: 'webp' } },
      { name: 'hero', width: 1400, height: undefined, formatOptions: { format: 'webp' } },
    ],
  },
}
