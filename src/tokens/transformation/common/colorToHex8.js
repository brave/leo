const TinyColor = require('@ctrl/tinycolor')

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function ({ value }) {
    if (value.startsWith('$')) {
      console.log("Oh no!")
      throw "Oh no!"
    }
    return `${new TinyColor.TinyColor(value).toHex8String()}`
  }
}
