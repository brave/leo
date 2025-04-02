import type { Transform } from 'style-dictionary/types'
import { formatColor } from './webColorRef'

export default {
  name: 'web/shadow',
  type: 'value',
  filter(token) {
    return token.type === 'custom-shadow' && token.value !== 0
  },
  transform({ value }) {
    value = Array.isArray(value) ? value : [value]
    return value.map((v) => formatShadow(v)).join(', ')
  }
} as Transform

function formatShadow(value) {
  return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${
    value.offsetX
  }px ${value.offsetY}px ${value.radius}px ${value.spread}px ${formatColor(
    'leo',
    value.color
  )}`
}
