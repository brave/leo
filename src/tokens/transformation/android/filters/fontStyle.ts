import type { Filter } from 'style-dictionary/types'

export default {
  name: 'android/filterFontStyle',
  filter: (token) => token.attributes.category === 'font'
} as Filter
