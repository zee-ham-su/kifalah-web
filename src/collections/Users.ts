import type { CollectionConfig } from 'payload'
import { ROLE_OPTIONS, allow, hasRole } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'roles'] },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    create: allow(),
    delete: allow(),
    // Staff can see themselves; super admins see everyone.
    read: ({ req }) => (hasRole(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) => (hasRole(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // The very first account becomes Super Admin so the Foundation is never locked out.
        if (operation === 'create') {
          const existing = await req.payload.count({ collection: 'users', req })
          if (existing.totalDocs === 0) data.roles = ['super-admin']
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: ROLE_OPTIONS,
      saveToJWT: true,
      access: {
        // Only super admins may grant roles (stops privilege escalation).
        create: ({ req }) => hasRole(req.user),
        update: ({ req }) => hasRole(req.user),
      },
    },
  ],
}
