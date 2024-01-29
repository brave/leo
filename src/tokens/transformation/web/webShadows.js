const TinyColor = require('@ctrl/tinycolor')

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-shadow' && token.value !== 0
  },
  transformer: function ({ value }) {
    value = Array.isArray(value) ? value : [value]
    return value.map((v) => formatShadow(v)).join(', ')
  }
}

/**
 * 
 * @param {string} colorString 
 * @returns {string}
 */
function formatColor(colorString) {
  if (colorString.startsWith('{') && colorString.endsWith('}')) {
    const name = '--leo-' + colorString.substring(1, colorString.length - 2).split('.').join('-')
    return `var(${name})`
  }
  return new TinyColor.TinyColor(colorString).toRgbString()
} 

function formatShadow(value) {
  return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${
    value.offsetX
  }px ${value.offsetY}px ${value.radius}px ${
    value.spread
  }px ${formatColor(value.color)}`
}
