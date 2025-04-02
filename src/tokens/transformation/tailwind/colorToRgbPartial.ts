import { TinyColor } from '@ctrl/tinycolor'
import type { Transform } from 'style-dictionary/types'

export default {
  name: 'color/hex8ToRgbPartial',
  type: 'value',
  filter: function (token) {
    return token.type === 'color'
  },
  transform: function ({ value, ...token }) {
    const fullColorValue = ['elevation']
    if (token.name.match(new RegExp(`(${fullColorValue.join('|')})`))) {
      return new TinyColor(value).toRgbString()
    } else {
      const { r, g, b } = new TinyColor(value).toRgb()
      return `${r}, ${g}, ${b}`
    }
  }
} as Transform
