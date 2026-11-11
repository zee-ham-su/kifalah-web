import { randomBytes } from 'crypto'

// Unambiguous characters only (no 0/O, 1/I) so references can be read over the phone or SMS.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function makeReference(prefix: 'DON' | 'APP'): string {
  const bytes = randomBytes(8)
  let out = ''
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length]
  return `KIF-${prefix}-${out}`
}
