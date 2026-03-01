export default {
  type: 'name',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function (token) {
    return getTokenName(token.name)
  }
}

/**
 * @param {string} name The name of the token
 * @returns {string}
 */
export const getTokenName = (name) => {
  return name
    .replaceAll('$', '')
    .replaceAll('.', '_')
    .replaceAll('-', '_')
    .replaceAll('color_', '')
    .replaceAll('light_', '')
    .replaceAll('dark_', '')
    .replaceAll('legacy_light_', '')
    .replaceAll('legacy_dark_', '')
}
