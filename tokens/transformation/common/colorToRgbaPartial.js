const TinyColor = require('@ctrl/tinycolor')

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function ({ value }) {
    const { r, g, b, a } = new TinyColor.TinyColor(value).toRgb()
    return `${r}, ${g}, ${b}`
  }
}
