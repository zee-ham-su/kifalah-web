import type { CollectionConfig } from 'payload'
import { allow, anyone } from '../lib/access'

// Transparency Hub (PRD 5.7): staff upload a PDF and it appears on the public page.
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: { useAsTitle: 'title', group: 'Transparency', defaultColumns: ['title', 'category', 'year'] },
  access: {
    read: anyone,
    create: allow('editor'),
    update: allow('editor'),
    delete: allow('editor'),
  },
  upload: { mimeTypes: ['application/pdf'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Annual report', value: 'annual-report' },
        { label: 'Audited financials', value: 'audited-financials' },
        { label: 'Policy', value: 'policy' },
        { label: 'Evaluation', value: 'evaluation' },
        { label: 'Brief / resource', value: 'resource' },
      ],
    },
    { name: 'year', type: 'number', min: 2000, max: 2100, admin: { description: 'Leave blank for policies.' } },
  ],
}
