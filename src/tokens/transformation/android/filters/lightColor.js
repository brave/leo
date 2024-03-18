const { matchLightThemeToken } = require('../../common/tokenFilters')

module.exports = (token) =>
  matchLightThemeToken(token) || token.name.startsWith('primitive')
