const formattedVariables = require('./formattedVariables')
const fileHeader = require('./fileHeader')
const {
  filteredTokens,
  matchDarkThemeToken,
  matchLightThemeToken
} = require('../common/tokenFilters')

module.exports = ({ dictionary, options, file }) => {
  const opts = options ?? {}
  const { outputReferences } = opts
  const groupedTokens = {
    // if you export the prefixes use token.path[0] instead of [1]
    light: filteredTokens(dictionary, (token) => matchLightThemeToken(token)),
    dark: filteredTokens(dictionary, (token) => matchDarkThemeToken(token)),
    rest: filteredTokens(dictionary)
  }

  // Note: replace strips out '-light-' and '-dark-' inside media queries
  // Remove "desktop" for typography (which only appears in the :root non-media-query section)
  return (
    fileHeader({ file }) +
    ':root {\n' +
    formattedVariables({
      format: 'css',
      dictionary: groupedTokens.rest,
      outputReferences
    }).replace(/desktop-/gm, '') +
    '\n}\n\n' +
    '@media (prefers-color-scheme: light) {\n' +
    ' :root {\n' +
    formattedVariables({
      format: 'css',
      dictionary: groupedTokens.light,
      outputReferences
    }).replace(/-light-/gm, '-') +
    '\n }\n}\n\n' +
    '@media (prefers-color-scheme: dark) {\n' +
    ' :root {\n' +
    formattedVariables({
      format: 'css',
      dictionary: groupedTokens.dark,
      outputReferences
    }).replace(/-dark-/gm, '-') +
    '\n }\n}\n\n' +
    '[data-theme="light"] {\n' +
    formattedVariables({
      format: 'css',
      dictionary: groupedTokens.light,
      outputReferences
    }).replace(/-light-/gm, '-') +
    '\n}\n\n' +
    '[data-theme="dark"] {\n' +
    formattedVariables({
      format: 'css',
      dictionary: groupedTokens.dark,
      outputReferences
    }).replace(/-dark-/gm, '-') +
    '\n}\n'
  )
}
