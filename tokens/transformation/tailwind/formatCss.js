const formattedVariables = require('./formattedVariables')
const fileHeader = require('./fileHeader')

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

module.exports = ({ dictionary, options, file }) => {
  const opts = options ?? {}
  const { outputReferences } = opts
  const groupedTokens = {
    // if you export the prefixes use token.path[0] instead of [1]
    light: filteredTokens(dictionary, (token) => token.path[2]?.toLowerCase() === 'light-mode'),
    dark: filteredTokens(dictionary, (token) => token.path[2]?.toLowerCase() === 'dark-mode'),
    rest: filteredTokens(dictionary, (token) => token.type === "color")
  }

  // Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
  return (
    fileHeader({ file }) +
      ':root {\n' +
      formattedVariables({ format: 'css', dictionary: groupedTokens.rest, outputReferences }).replace(/desktop-/gm, "") +
      '\n}\n\n' +
      '@media (prefers-color-scheme: light) {\n' +
      ' :root {\n' +
      formattedVariables({ format: 'css', dictionary: groupedTokens.light, outputReferences }).replace(/light-mode-/gm, "") +
      '\n }\n}\n\n' +
      '@media (prefers-color-scheme: dark) {\n' +
      ' :root {\n' +
      formattedVariables({ format: 'css', dictionary: groupedTokens.dark, outputReferences }).replace(/dark-mode-/gm, "") +
      '\n }\n}\n\n' +
      '[data-theme="light"] {\n' +
      formattedVariables({ format: 'css', dictionary: groupedTokens.light, outputReferences }).replace(/light-mode-/gm, "") +
      '\n}\n\n' +
      '[data-theme="dark"] {\n' +
      formattedVariables({ format: 'css', dictionary: groupedTokens.dark, outputReferences }).replace(/dark-mode-/gm, "") +
      '\n}\n'
  )
}
