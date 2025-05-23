import type { Format } from 'style-dictionary/types'
import { fileHeader } from 'style-dictionary/utils'
import { varDefFormat } from '../../utils'
import {
  filteredTokens,
  matchDarkThemeToken,
  matchLightThemeToken
} from '../common/tokenFilters'
import formattedVariables from './formattedVariables'

export default {
  name: 'custom/css',
  format: async ({ dictionary, options, file }) => {
    const outputReferences = true
    const groupedTokens = {
      // if you export the prefixes use token.path[0] instead of [1]
      light: filteredTokens(dictionary, (token) => matchLightThemeToken(token)),
      dark: filteredTokens(dictionary, (token) => matchDarkThemeToken(token)),

      // Note: We don't export the dark & light versions of the tokens separately
      // - developers can refer to the primitive tokens instead.
      rest: filteredTokens(
        dictionary,
        (token) => !matchDarkThemeToken(token) && !matchLightThemeToken(token)
      )
    }

    const defaultVars = formattedVariables({
      format: 'css',
      dictionary: groupedTokens.rest,
      outputReferences
    })

    const lightVars = formattedVariables({
      format: 'css',
      dictionary: groupedTokens.light,
      outputReferences
    }).replace(/-light-/gm, '-')

    const darkVars = formattedVariables({
      format: 'css',
      dictionary: groupedTokens.dark,
      outputReferences
    }).replace(/-dark-/gm, '-')

    // prettier-ignore
    return (
    await fileHeader({ file, ...options }) +
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
} as Format
