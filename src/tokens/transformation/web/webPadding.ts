import type { Transform } from 'style-dictionary/types'

export default {
  name: 'web/padding',
  type: 'value',
  filter: function (token) {
    return token.type === 'custom-spacing'
  },
  transform: ({ value: { top, left, bottom, right } }) => {
    if ([bottom, left, right].every((v) => v === top)) {
      return `${top}px`
    }
    return `${top}px ${right}px ${bottom}px ${left}px`
  }
} as Transform
