import type { Filter } from 'style-dictionary/types'

const acceptedTypes = [
  'color',
  'dimension',
  'font',
  'custom-radius',
  'custom-fontStyle',
  'custom-shadow',
  'custom-gradient',
  'custom-spacing',
  'number'
]

export default {
  name: 'filterWeb',
  filter: (token) => acceptedTypes.includes(token.type)
} as Filter
