const TinyColor = require('@ctrl/tinycolor')
const { default: referenceToName } = require('../common/referenceToName')

module.exports = {
  type: 'value',
  matcher(token) {
    return token.type === 'color'
  },
  transformer({ value, referencedVariable }) {
    if (referencedVariable) {
      return `var(--leo-${referenceToName(referencedVariable)})`
    }
    const color = new TinyColor.TinyColor(value)
    if (color.getAlpha() === 1) {
      return color.toHexString(true)
    }

    return color.toRgbString()
  }
}
