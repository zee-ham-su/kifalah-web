import type { CollectionConfig } from 'payload'
import { allow, nobody } from '../lib/access'

// Inbox for contact / volunteer / partner forms (PRD AD-5). Written by /api/contact only.
export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Submission', plural: 'Inbox' },
  admin: { useAsTitle: 'name', group: 'Applications', defaultColumns: ['name', 'type', 'email', 'status', 'createdAt'] },
  access: {
    read: allow('editor', 'programme-officer'),
    create: nobody,
    update: allow('editor', 'programme-officer'),
    delete: allow(),
  },
  fields: [
    { name: 'type', type: 'select', required: true, options: ['contact', 'volunteer', 'partner'].map((v) => ({ label: v, value: v })) },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'in-progress', 'done'].map((v) => ({ label: v, value: v })) },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'organisation', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
  ],
}
