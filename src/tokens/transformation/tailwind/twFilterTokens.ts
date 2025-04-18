import type { Filter, TransformedToken } from 'style-dictionary/types'

const acceptedTypes = [
  'color',
  'dimension',
  'custom-radius',
  'custom-shadow',
  'custom-gradient',
  'custom-spacing',
  'number'
]

export default {
  name: 'tw/filterTokens',
  filter: (token: TransformedToken) => acceptedTypes.includes(token.type)
} as Filter
