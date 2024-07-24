import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'dimension' && token.value !== 0
  },
  transformer: function (token) {
    return `${token.value}px`
  }
} as Transform
