import type { Transform } from 'style-dictionary/types'

export default {
  name: 'web/radius',
  type: 'value',
  filter: function (token) {
    return token.type === 'custom-radius'
  },
  transform: function ({ value }) {
    if (
      [value.topRight, value.bottomLeft, value.bottomRight].every(
        (v) => v === value.topLeft
      )
    ) {
      return `${value.topLeft}px`
    }
    return `${value.topLeft}px ${value.topRight}px ${value.bottomLeft}px ${value.bottomRight}px`
  }
} as Transform
