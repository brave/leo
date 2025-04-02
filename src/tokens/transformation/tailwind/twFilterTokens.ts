import type { TransformedToken } from 'style-dictionary/types'

const acceptedTypes = [
  'color',
  'dimension',
  'custom-radius',
  'custom-shadow',
  'custom-gradient',
  'custom-spacing',
  'number'
]

export default (token: TransformedToken) => acceptedTypes.includes(token.type)
