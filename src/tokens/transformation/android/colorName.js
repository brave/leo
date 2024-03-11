module.exports = {
  type: 'name',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function (token) {
    return token.name
      .replace('color_light_', '')
      .replace('color_dark_', '')
      .replace('color_legacy_light_', '')
      .replace('color_legacy_dark_', '')
  }
}
