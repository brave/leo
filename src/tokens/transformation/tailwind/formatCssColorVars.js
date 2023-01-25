const formattedVariables = require('../web/formattedVariables')
const fileHeader = require('../web/fileHeader')

const filteredTokens = (dictionary, filterFn) => {
  let filtered = dictionary.allTokens;
  if (typeof filterFn === "function") {
    filtered = dictionary.allTokens.filter(token => filterFn(token))
  }

  return {
    ...dictionary,
    ...{
      allProperties: filtered,
      allTokens: filtered
    }
  }
}
// TODO(petemill): Don't duplicate these functions (and this whole module) 
// between web/formatCss and tailwind/formatCssColorVars
function matchColor(token, modifierPathSegment) {
  return token.path[0]?.toLowerCase() === "color" && token.path.some(pathSegment => pathSegment === modifierPathSegment)
}

function matchDarkColor(token) {
  return matchColor(token, 'dark')
}

function matchLightColor(token) {
  return matchColor(token, 'light')
}

module.exports = ({ dictionary, options, file }) => {
  const opts = options ?? {}
  const { outputReferences } = opts
  const groupedTokens = {
    // if you export the prefixes use token.path[0] instead of [1]
    light: filteredTokens(dictionary, (token) => matchLightColor(token)),
    dark: filteredTokens(dictionary, (token) => matchDarkColor(token)),
    rest: filteredTokens(dictionary, (token) => token.type === "color")
  }

  // Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
  return (
    fileHeader({ file }) +
      ':root {\n' +
      formattedVariables({ format: 'tailwind', dictionary: groupedTokens.rest, outputReferences }).replace(/desktop-/gm, "") +
      '\n}\n\n' +
      '@media (prefers-color-scheme: light) {\n' +
      ' :root {\n' +
      formattedVariables({ format: 'tailwind', dictionary: groupedTokens.light, outputReferences }).replace(/-light-/gm, "-") +
      '\n }\n}\n\n' +
      '@media (prefers-color-scheme: dark) {\n' +
      ' :root {\n' +
      formattedVariables({ format: 'tailwind', dictionary: groupedTokens.dark, outputReferences }).replace(/-dark-/gm, "-") +
      '\n }\n}\n\n' +
      '[data-theme="light"] {\n' +
      formattedVariables({ format: 'tailwind', dictionary: groupedTokens.light, outputReferences }).replace(/-light-/gm, "-") +
      '\n}\n\n' +
      '[data-theme="dark"] {\n' +
      formattedVariables({ format: 'tailwind', dictionary: groupedTokens.dark, outputReferences }).replace(/-dark-/gm, "-") +
      '\n}\n'
  )
}
