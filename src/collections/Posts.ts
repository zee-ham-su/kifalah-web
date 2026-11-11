import type { CollectionConfig } from 'payload'
import { allow, hasRole } from '../lib/access'

export const PILLARS = [
  { label: 'Education and Scholarships', value: 'education' },
  { label: 'Women Empowerment', value: 'women' },
  { label: 'Youth Employment and Skills', value: 'youth' },
  { label: 'Community Development and Infrastructure', value: 'community' },
  { label: 'Humanitarian and Social Welfare', value: 'humanitarian' },
  { label: 'Waqf and Sustainability', value: 'waqf' },
]

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'pillar', 'publishedAt', '_status'] },
  versions: { drafts: true },
  access: {
    read: ({ req }) => (hasRole(req.user, 'editor') ? true : { _status: { equals: 'published' } }),
    create: allow('editor'),
    update: allow('editor'),
    delete: allow('editor'),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'pillar', type: 'select', options: PILLARS },
    { name: 'isStory', type: 'checkbox', label: 'Beneficiary story', defaultValue: false },
    {
      name: 'consentConfirmed',
      type: 'checkbox',
      label: 'Written consent obtained for every name, photo and detail',
      admin: {
        description: 'PRD NW-3: required before a beneficiary story can be published.',
        condition: (data) => Boolean(data?.isStory),
      },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?._status === 'published' && data.isStory && !data.consentConfirmed) {
          throw new Error('Confirm written consent before publishing a beneficiary story.')
        }
        return data
      },
    ],
  },
}
