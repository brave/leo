const formattedVariables = require('../web/formattedVariables')
const fileHeader = require('../web/fileHeader')
const {
  filteredTokens,
  matchDarkThemeToken,
  matchLightThemeToken
} = require('../common/tokenFilters')
const { stripTokenPrefix, varDefFormat } = require('../../utils')

module.exports = ({ dictionary, options, file }) => {
  const opts = options ?? {}
  const { outputReferences } = opts
  const groupedTokens = {
    light: filteredTokens(dictionary, (token) => matchLightThemeToken(token)),
    dark: filteredTokens(dictionary, (token) => matchDarkThemeToken(token)),
    rest: filteredTokens(
      dictionary,
      (token) =>
        ['color', 'custom-shadow'].includes(token.type) &&
        !matchDarkThemeToken(token) &&
        !matchLightThemeToken(token)
    )
  }

  const defaultVars = stripTokenPrefix(
    formattedVariables({
      format: 'tailwind',
      dictionary: groupedTokens.rest,
      outputReferences
    })
  )

  const lightVars = formattedVariables({
    format: 'tailwind',
    dictionary: groupedTokens.light,
    outputReferences
  }).replace(/-light-/gm, '-')

  const darkVars = formattedVariables({
    format: 'tailwind',
    dictionary: groupedTokens.dark,
    outputReferences
  }).replace(/-dark-/gm, '-')

  // prettier-ignore
  return (
    fileHeader({ file }) +
    [
      defaultVars && varDefFormat`:root {${defaultVars}}`,
      lightVars && varDefFormat`@media (prefers-color-scheme: light) {
 :root {${lightVars} }
}`,
      darkVars && varDefFormat`@media (prefers-color-scheme: dark) {
 :root {${darkVars} }
}`,
      lightVars && varDefFormat`[data-theme="light"] {${lightVars}}`,
      lightVars && varDefFormat`[data-theme="dark"] {${darkVars}}`,
    ]
      .filter((v) => !!v)
      .join('\n\n') +
    '\n'
  )
}
