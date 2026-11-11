// Single source of truth for fund designations (PRD DN-1, DN-6).
// Zakat is deliberately NOT a fund yet: the PRD flags that the Foundation must decide
// how Zakat/Sadaqah/Waqf are labelled and separated before it is offered.
export const FUNDS = [
  { value: 'general', label: 'General Fund' },
  { value: 'education', label: 'Education and Scholarships' },
  { value: 'women', label: 'Women Empowerment' },
  { value: 'youth', label: 'Youth Skills' },
  { value: 'community', label: 'Community Infrastructure' },
  { value: 'humanitarian', label: 'Humanitarian Relief' },
  { value: 'waqf', label: 'Waqf and Endowment' },
] as const

export const FUND_VALUES = FUNDS.map((f) => f.value) as [string, ...string[]]

// Paystack: GHS and USD for Ghana merchants. GBP is not offered until Paystack confirms it
// for the Foundation's account (PRD DN-3 asks for GBP).
export const CURRENCIES = ['GHS', 'USD'] as const
export type Currency = (typeof CURRENCIES)[number]
