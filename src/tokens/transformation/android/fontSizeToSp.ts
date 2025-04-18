import type { Transform } from 'style-dictionary/types'

export default {
  name: 'android/transformFontSizeToSp',
  type: 'value',
  filter: function (token) {
    return token.type === 'custom-fontStyle'
  },
  transform: function (token) {
    return `${token.value.fontSize}sp`
  }
} as Transform
