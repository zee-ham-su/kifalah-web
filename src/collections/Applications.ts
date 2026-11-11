import type { CollectionConfig } from 'payload'
import { allow, hasRole, nobody } from '../lib/access'
import { makeReference } from '../lib/reference'

// Scholarship / support applications (PRD 5.4). Intake comes from a server route (to be built),
// so public create is closed. Data is restricted to authorised staff (AP-9: minors' data).
export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'reference',
    group: 'Applications',
    defaultColumns: ['reference', 'applicantName', 'category', 'status', 'score', 'createdAt'],
  },
  access: {
    read: allow('programme-officer', 'reviewer'),
    create: nobody,
    update: allow('programme-officer', 'reviewer'),
    delete: ({ req }) => hasRole(req.user),
  },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true, defaultValue: () => makeReference('APP'), admin: { readOnly: true } },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'SHS', value: 'shs' },
        { label: 'TVET', value: 'tvet' },
        { label: 'Tertiary', value: 'tertiary' },
        { label: 'STEM', value: 'stem' },
        { label: 'Humanitarian referral', value: 'referral' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'submitted',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under review', value: 'under-review' },
        { label: 'Shortlisted', value: 'shortlisted' },
        { label: 'Awarded', value: 'awarded' },
        { label: 'Declined', value: 'declined' },
      ],
    },
    { name: 'applicantName', type: 'text', required: true },
    { name: 'applicantPhone', type: 'text', required: true, index: true },
    { name: 'applicantEmail', type: 'email' },
    { name: 'dateOfBirth', type: 'date' },
    { name: 'isMinor', type: 'checkbox', defaultValue: false },
    {
      name: 'guardian',
      type: 'group',
      admin: { condition: (d) => Boolean(d?.isMinor) },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'consentGiven', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'school', type: 'text' },
    { name: 'region', type: 'text' },
    { name: 'financialNeed', type: 'textarea' },
    { name: 'referee', type: 'group', fields: [{ name: 'name', type: 'text' }, { name: 'phone', type: 'text' }] },
    { name: 'answers', type: 'json', admin: { description: 'Remaining form fields as submitted.' } },
    { name: 'score', type: 'number', min: 0, max: 100 },
    { name: 'reviewerNotes', type: 'textarea' },
  ],
}
