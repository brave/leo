const filteredTokens = (dictionary, filterFn) => {
  let filtered = dictionary.allTokens
  if (typeof filterFn === 'function') {
    filtered = dictionary.allTokens.filter((token) => filterFn(token))
  }

  return {
    ...dictionary,
    ...{
      allProperties: filtered,
      allTokens: filtered
    }
  }
}

function matchThemableToken(token, modifierPathSegment) {
  return (
    (token.path[0]?.toLowerCase() === 'color' ||
      token.path.includes('elevation')) &&
    token.path.includes(modifierPathSegment)
  )
}

function matchDarkThemeToken(token) {
  return matchThemableToken(token, 'dark')
}

function matchLightThemeToken(token) {
  return matchThemableToken(token, 'light')
}

module.exports = {
  filteredTokens,
  matchThemableToken,
  matchDarkThemeToken,
  matchLightThemeToken
}
