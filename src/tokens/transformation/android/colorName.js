export default {
  type: 'name',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function (token) {
    return token.name
      .replace('color_', '')
      .replace('light_', '')
      .replace('dark_', '')
      .replace('legacy_light_', '')
      .replace('legacy_dark_', '')
  }
}
