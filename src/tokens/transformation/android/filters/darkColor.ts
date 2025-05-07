import type { Filter } from 'style-dictionary/types'
import { matchDarkThemeToken } from '../../common/tokenFilters'

export default {
  name: 'android/filterDarkColor',
  filter: (token) => matchDarkThemeToken(token)
} as Filter
