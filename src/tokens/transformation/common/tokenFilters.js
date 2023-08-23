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

function matchThemableToken(
  token,
  modifierPathSegment,
  tokenPaths = ['color', 'effect.elevation']
) {
  const tokenPath = token.path.join('.').toLowerCase()
  return (
    tokenPaths.some((p) => tokenPath.startsWith(p)) &&
    token.path.includes(modifierPathSegment)
  )
}

function matchDarkThemeToken(token, tokenPaths) {
  return matchThemableToken(token, 'dark', tokenPaths)
}

function matchLightThemeToken(token, tokenPaths) {
  return matchThemableToken(token, 'light', tokenPaths)
}

module.exports = {
  filteredTokens,
  matchThemableToken,
  matchDarkThemeToken,
  matchLightThemeToken
}
