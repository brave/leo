const TinyColor = require('@ctrl/tinycolor')

module.exports = {
  type: 'value',
  matcher(token) {
    return token.type === 'color'
  },
  transformer({ value, referencedVariable }) {
    if (referencedVariable) {
      const name = referencedVariable.substring(1).replaceAll('.', '-')
      return `var(--leo-color-${name})`
    }
    const color = new TinyColor.TinyColor(value)
    if (color.getAlpha() === 1) {
      return color.toHexString(true)
    }

    return color.toRgbString()
  }
}
