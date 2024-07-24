import { Transform } from "style-dictionary"
import { formatColor } from './webColorRef'

export default {
  type: 'value',
  matcher(token) {
    return token.type === 'custom-shadow' && token.value !== 0
  },
  transformer({ value }) {
    value = Array.isArray(value) ? value : [value]
    return value.map((v) => formatShadow(v)).join(', ')
  }
} as Transform

function formatShadow(value) {
  return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${value.offsetX
    }px ${value.offsetY}px ${value.radius}px ${value.spread}px ${formatColor(
      'leo',
      value.color
    )}`
}
