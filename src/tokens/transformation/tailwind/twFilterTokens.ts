import { TransformedToken } from 'style-dictionary'

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
