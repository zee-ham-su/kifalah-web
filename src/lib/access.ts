import type { Access } from 'payload'

export type Role = 'super-admin' | 'editor' | 'finance' | 'programme-officer' | 'reviewer'

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Super Admin', value: 'super-admin' },
  { label: 'Content Editor', value: 'editor' },
  { label: 'Finance', value: 'finance' },
  { label: 'Programme Officer', value: 'programme-officer' },
  { label: 'Reviewer', value: 'reviewer' },
]

// Super admins pass every check.
export const hasRole = (user: unknown, ...roles: Role[]): boolean => {
  const userRoles = (user as { roles?: Role[] } | null)?.roles
  if (!Array.isArray(userRoles)) return false
  return userRoles.includes('super-admin') || roles.some((r) => userRoles.includes(r))
}

export const allow =
  (...roles: Role[]): Access =>
  ({ req }) =>
    hasRole(req.user, ...roles)

export const anyone: Access = () => true
export const nobody: Access = () => false
