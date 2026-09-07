import formattedVariables from './formattedVariables'
import fileHeader from './fileHeader'
import isComposedColor from '../common/composedColor'
import {
  filteredTokens,
  matchDarkThemeToken,
  matchLightThemeToken
} from '../common/tokenFilters'
import { varDefFormat } from '../../utils'

export default ({ dictionary, options, file }) => {
  const opts = options ?? {}
  // const { outputReferences } = opts
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

  const dynamicVariables = (dictionary) =>
    formattedVariables({
      format: 'css',
      dictionary: filteredTokens(dictionary, isComposedColor),
      outputReferences,
      composedColorMode: 'dynamic'
    })

  const dynamicDefaultVars = dynamicVariables(groupedTokens.rest)
  const dynamicLightVars = dynamicVariables(groupedTokens.light).replace(
    /-light-/gm,
    '-'
  )
  const dynamicDarkVars = dynamicVariables(groupedTokens.dark).replace(
    /-dark-/gm,
    '-'
  )

  const dynamicOverrides = [
    dynamicDefaultVars && varDefFormat`:root {${dynamicDefaultVars}}`,
    dynamicLightVars &&
      varDefFormat`@media (prefers-color-scheme: light) {
 :root {${dynamicLightVars} }
}`,
    dynamicDarkVars &&
      varDefFormat`@media (prefers-color-scheme: dark) {
 :root {${dynamicDarkVars} }
}`,
    dynamicLightVars &&
      varDefFormat`[data-theme="light"] {${dynamicLightVars}}`,
    dynamicDarkVars && varDefFormat`[data-theme="dark"] {${dynamicDarkVars}}`
  ].filter((value) => !!value)

  const colorMixOverrides =
    dynamicOverrides.length > 0
      ? varDefFormat`@supports (color: color-mix(in srgb, black, transparent)) {${dynamicOverrides.join(
          '\n\n'
        )}
}`
      : ''

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
      darkVars && varDefFormat`[data-theme="dark"] {${darkVars}}`,
      colorMixOverrides,
    ]
      .filter((v) => !!v)
      .join('\n\n') +
    '\n'
  )
}
