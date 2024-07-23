import StyleDictionary, { Dictionary, TransformedToken } from 'style-dictionary'
import _template from 'lodash/template'
import fs from 'fs'
import colorToSkiaString from './colorToSkiaString'

StyleDictionary.registerTransform({
  name: 'color/hex8ToSkiaString',
  ...colorToSkiaString
})

StyleDictionary.registerTransformGroup({
  name: 'skia',
  transforms: StyleDictionary.transformGroup.css.concat([
    'color/hex8ToSkiaString'
  ])
})

// convert to chromium's pascalCase convention
const transformName = (token: TransformedToken) =>
  `k${token.name
    .split(/,|\-/)
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join('')
    .replace('Light', '')
    .replace('Dark', '')}`

const transformValue = (token: TransformedToken) => {
  if (token.type === 'color') {
    // The value is already in a format Skia can use.
    return token.value
  }

  if (token.type === 'number') {
    // We just store the number, rather than creating a gfx::Insets to make it
    // easier to combine the various spacings.
    return token.value
  }

  console.error(token)
  throw new Error(`Unsupported token type ${token.type}`)
}

const filteredTokens = (
  dictionary: Dictionary,
  filterFn: (value: TransformedToken) => boolean
) => {
  let filtered = dictionary.allTokens
  if (typeof filterFn === 'function') {
    filtered = dictionary.allTokens.filter((token) => filterFn(token))
  }

  filtered = filtered.map((token) => ({
    ...token,
    name: transformName(token),
    value: transformValue(token)
  }))

  return {
    ...dictionary,
    ...{
      allProperties: filtered,
      allTokens: filtered
    }
  }
}

StyleDictionary.registerFormat({
  name: 'skia/colors.h',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/colors.h.template', 'utf-8')
    )

    const groupedTokens = {
      // Note: Here we check includes because the light/dark part of the token
      // could be 2nd (for normal colors) or 3rd (for legacy colors).
      light: filteredTokens(dictionary, (token) =>
        token.path.includes('light')
      ),
      dark: filteredTokens(dictionary, (token) => token.path.includes('dark')),
      rest: filteredTokens(
        dictionary,
        (token) => !token.path.includes('light') && !token.path.includes('dark')
      )
    }

    return template({ groupedTokens, options, file })
  }
})

StyleDictionary.registerFormat({
  name: 'skia/spacing.h',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/spacing.h.template', 'utf-8')
    )
    return template({
      tokens: filteredTokens(dictionary, (token) =>
        token.path.includes('spacing')
      ),
      options,
      file
    })
  }
})

StyleDictionary.registerFormat({
  name: 'skia/radius.h',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/radius.h.template', 'utf-8')
    )
    return template({
      tokens: filteredTokens(dictionary, (token) =>
        token.path.includes('radius')
      ),
      options,
      file
    })
  }
})
