export const filteredTokens = (dictionary, filterFn) => {
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

/**
 * @param {any} token The token
 * @param {string} modifierPathSegment path segment which represents a theme
 * @param {string[]} tokenPaths tokens starting with one of these prefixes (use `.` to join multiple path segments).
 **/
export function matchThemableToken(
  token,
  modifierPathSegment,
  tokenPaths = ['color']
) {
  const tokenPath = token.path.join('.').toLowerCase()
  return (
    tokenPaths.some((p) => tokenPath.startsWith(p)) &&
    token.path.includes(modifierPathSegment)
  )
}

export function matchDarkThemeToken(token) {
  return matchThemableToken(token, 'dark') || token.path.includes('effect')
}

export function matchLightThemeToken(token) {
  return matchThemableToken(token, 'light') || token.path.includes('effect')
}
