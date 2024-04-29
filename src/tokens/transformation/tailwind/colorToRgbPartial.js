const TinyColor = require('@ctrl/tinycolor')

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function ({ value, ...token }) {
    const fullColorValue = ['elevation']
    if (token.name.match(new RegExp(`(${fullColorValue.join('|')})`))) {
      return new TinyColor.TinyColor(value).toRgbString()
    } else {
      const { r, g, b, a } = new TinyColor.TinyColor(value).toRgb()
      return `${r}, ${g}, ${b}`
    }
  }
}
