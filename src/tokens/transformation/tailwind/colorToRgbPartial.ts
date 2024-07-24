import { TinyColor } from '@ctrl/tinycolor'
import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function ({ value, ...token }) {
    const fullColorValue = ['elevation']
    if (token.name.match(new RegExp(`(${fullColorValue.join('|')})`))) {
      return new TinyColor(value).toRgbString()
    } else {
      const { r, g, b } = new TinyColor(value).toRgb()
      return `${r}, ${g}, ${b}`
    }
  }
} as Transform
