import { matchDarkThemeToken } from '../../common/tokenFilters.js'

export default (token) =>
  !token.name.includes('ios_browser') && matchDarkThemeToken(token)
