import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'number'
  },
  transformer: function ({ value }) {
    return `${value}px`
  }
} as Transform
