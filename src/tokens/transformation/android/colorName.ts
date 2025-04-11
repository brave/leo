import type { Transform } from 'style-dictionary/types'

export default {
  name: 'android/transformColorName',
  type: 'name',
  filter: function (token) {
    return token.type === 'color'
  },
  transform: function (token) {
    return token.name
      .replace('color_', '')
      .replace('light_', '')
      .replace('dark_', '')
      .replace('legacy_light_', '')
      .replace('legacy_dark_', '')
  }
} as Transform
