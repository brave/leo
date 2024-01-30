const { formatColor } = require('../web/webColorRef')

module.exports = {
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
}

function formatBoxShadow(value) {
  return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${
    value.offsetX
  }px ${value.offsetY}px ${value.radius}px ${value.spread}px ${formatColor(
    'tw',
    value.color
  )}`
}

function formatDropShadow(value) {
  return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${
    value.offsetX
  }px ${value.offsetY}px ${value.radius}px ${formatColor('tw', value.color)}`
}
