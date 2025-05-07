import type { Filter, TransformedToken } from 'style-dictionary/types'

const acceptedTypes = ['font', 'custom-fontStyle']

export default {
  name: 'tw/filterFonts',
  filter: (token: TransformedToken) => acceptedTypes.includes(token.type)
} as Filter
