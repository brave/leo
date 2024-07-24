import { Transform } from 'style-dictionary'
import { formatColor } from '../web/webColorRef'

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-shadow' && token.value !== 0
  },
  transformer: function ({ value }) {
    value = Array.isArray(value) ? value : [value]
    return {
      boxShadow: value.map((v) => formatBoxShadow(v)).join(', '),
      dropShadow: value.map((v) => formatDropShadow(v))
    }
  }
} as Transform

/**
 * @param {string} colorString
 * @returns {string}
 */
const formatColorForTw = (colorString: string) => {
  const formattedColor = formatColor('tw', colorString)
  return colorString.startsWith('$') &&
    !formattedColor.includes('elevation') &&
    !formattedColor.startsWith('rgb')
    ? `rgba(${formattedColor}, 1)`
    : formattedColor
}

function formatBoxShadow(value) {
  return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${
    value.offsetX
  }px ${value.offsetY}px ${value.radius}px ${value.spread}px ${formatColorForTw(
    value.color
  )}`
}

function formatDropShadow(value) {
  return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${
    value.offsetX
  }px ${value.offsetY}px ${value.radius}px ${formatColorForTw(value.color)}`
}
