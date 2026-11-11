import type { GlobalConfig } from 'payload'
import { allow, anyone } from '../lib/access'

// Everything staff may need to change without a developer (PRD AD-2, HP-3, TR-5).
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: { read: anyone, update: allow('editor') },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Impact counters',
          fields: [
            {
              name: 'impact',
              type: 'array',
              maxRows: 6,
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'number', required: true },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea' },
            { name: 'social', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'url', type: 'text' }] },
          ],
        },
        {
          label: 'Legal and bank',
          fields: [
            { name: 'registeredName', type: 'text' },
            { name: 'registrationDetails', type: 'textarea' },
            { name: 'bankDetails', type: 'textarea', admin: { description: 'Shown on the donate page for bank transfers.' } },
          ],
        },
      ],
    },
  ],
}
