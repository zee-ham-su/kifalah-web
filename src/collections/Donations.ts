import type { CollectionConfig } from 'payload'
import { allow, nobody } from '../lib/access'
import { FUNDS, CURRENCIES } from '../lib/funds'
import { makeReference } from '../lib/reference'

// Created only by server code (donate route / Paystack webhook) via the Local API.
// Nobody can create or delete donations through the public REST API or the admin UI.
export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'reference',
    group: 'Giving',
    defaultColumns: ['reference', 'amount', 'currency', 'fund', 'status', 'channel', 'createdAt'],
  },
  access: {
    read: allow('finance'),
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  timestamps: true,
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true, defaultValue: () => makeReference('DON'), admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Abandoned', value: 'abandoned' },
      ],
    },
    { name: 'amount', type: 'number', required: true, admin: { description: 'Major units (e.g. GHS 50.00).' } },
    { name: 'currency', type: 'select', required: true, options: CURRENCIES.map((c) => ({ label: c, value: c })) },
    { name: 'fund', type: 'select', required: true, index: true, options: FUNDS.map((f) => ({ label: f.label, value: f.value })) },
    { name: 'donorName', type: 'text', required: true },
    { name: 'donorEmail', type: 'email', required: true },
    { name: 'donorPhone', type: 'text' },
    { name: 'anonymous', type: 'checkbox', defaultValue: false, admin: { description: 'Hide name from any public display.' } },
    { name: 'channel', type: 'text', admin: { description: 'card, mobile_money, bank ... as reported by Paystack.' } },
    { name: 'paidAt', type: 'date' },
    { name: 'receiptSentAt', type: 'date' },
    { name: 'gatewayResponse', type: 'json', admin: { description: 'Raw Paystack verification payload, for reconciliation.' } },
  ],
}
