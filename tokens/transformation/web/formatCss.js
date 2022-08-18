const formattedVariables = require('./formattedVariables')
const fileHeader = require('./fileHeader')

function isColor(token) {
  return token.type === 'color'
}

function duplicateTokenWithRgbText(token) {
  const rgbStart = 'rgb('
  const rgbEnd = ')'
  if (token.value && token.value.startsWith(rgbStart) && token.value.endsWith(rgbEnd)) {
    const newToken = { ...token }
    newToken.value = token.value.slice(rgbStart.length).slice(0, rgbEnd.length * -1)
    return newToken
  }
}

function filteredCssTokens (dictionary, filterFn) {
  // Reduce to any filter (e.g. dark mode only)
  let filtered = dictionary.allTokens;
  if (typeof filterFn === "function") {
    filtered = dictionary.allTokens.filter(token => filterFn(token))
  }
  // Sometimes css wants multiple values repeated in different syntaxes
  const newTokens = []
  for (const token of filtered) {
    if (isColor(token)) {
      const newToken = duplicateTokenWithRgbText(token)
      if (newToken) {
        newToken.path.push('rgb')
        newToken.name += '-rgb'
        newTokens.push(newToken)
      }
    }
  }
  if (newTokens.length) {
    filtered = [...filtered, ...newTokens]
  }

  return {
    ...dictionary,
    allProperties: filtered,
    allTokens: filtered
  }
}

module.exports = ({ dictionary, options, file }) => {
  const opts = options ?? {}
  const { outputReferences } = opts
  // if you export the prefixes use token.path[0] instead of [1]
  const light = filteredCssTokens(dictionary, (token) => token.path[2]?.toLowerCase() === 'light-mode')
  const dark = filteredCssTokens(dictionary, (token) => token.path[2]?.toLowerCase() === 'dark-mode')
  const rest = filteredCssTokens(dictionary)
  // Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
  return (
    fileHeader({ file }) +
      ':root {\n' +
      formattedVariables({ format: 'css', dictionary: rest, outputReferences }).replace(/desktop-/gm, "") +
      '\n}\n\n' +
      '@media (prefers-color-scheme: light) {\n' +
      ' :root {\n' +
      formattedVariables({ format: 'css', dictionary: light, outputReferences }).replace(/light-mode-/gm, "") +
      '\n }\n}\n\n' +
      '@media (prefers-color-scheme: dark) {\n' +
      ' :root {\n' +
      formattedVariables({ format: 'css', dictionary: dark, outputReferences }).replace(/dark-mode-/gm, "") +
      '\n }\n}\n\n' +
      'html[data-theme="light"] {\n' +
      formattedVariables({ format: 'css', dictionary: light, outputReferences }).replace(/light-mode-/gm, "") +
      '\n}\n\n' +
      'html[data-theme="dark"] {\n' +
      formattedVariables({ format: 'css', dictionary: dark, outputReferences }).replace(/dark-mode-/gm, "") +
      '\n}\n'
  )
}
