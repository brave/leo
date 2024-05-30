const TinyColor = require('@ctrl/tinycolor')

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function ({ value, original }) {
    if (original.value.startsWith('$')) {
      const name = original.value.substring(1).replaceAll('.', '-');
      return `var(--leo-color-${name})` 
    }
    return `${new TinyColor.TinyColor(value).toRgbString()}`
  }
}
