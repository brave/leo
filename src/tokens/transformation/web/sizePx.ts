import type { Transform } from 'style-dictionary/types'

export default {
  name: 'size/px',
  type: 'value',
  filter: function (token) {
    return token.type === 'dimension' && token.value !== 0
  },
  transform: function (token) {
    return `${token.value}px`
  }
} as Transform
