import type { Format } from 'style-dictionary/types'
import { fileHeader } from 'style-dictionary/utils'
import { varDefFormat } from '../../utils'
import {
  filteredTokens,
  matchDarkThemeToken,
  matchLightThemeToken
} from '../common/tokenFilters'
import formattedVariables from '../web/formattedVariables'

export default {
  name: 'tailwind/css',
  format: async ({ dictionary, options, file }) => {
    // Note that we're assuming a boolean, and forcing the value to be a boolean rather than a function
    const outputReferences = !!options.outputReferences
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

    const defaultVars = formattedVariables({
      format: 'tailwind',
      dictionary: groupedTokens.rest,
      outputReferences: !!outputReferences,
      formatting: 'tailwind'
    })

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
