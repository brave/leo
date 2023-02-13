const StyleDictionary = require('style-dictionary')
const _template = require('lodash/template')
const fs = require('fs')

StyleDictionary.registerTransformGroup({
  name: 'skia',
  transforms: StyleDictionary.transformGroup.css.concat([
    'color/hex8ToRgbaPartial'
  ])
})

// convert to chromium's pascalCase convention
const transformName = (token) =>
  `k${token.name
    .split(/,|\-/)
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join('')
    .replace('Light', '')
    .replace('Dark', '')}`

const transformValue = (token) => {
  if (token.type === 'color') {
    // convert to hex
    return token.value
      .split(',')
      .map((s) => '0x' + Number(s).toString(16).padStart(2, '0').toUpperCase())
  }

  if (token.type === 'custom-spacing') {
    // We just store the number, rather than creating a gfx::Insets to make it
    // easier to combine the various spacings.
    return token.value.top
  }

  if (token.type === 'custom-radius') {
    // We only support a consistent radius on all corners.
    return token.value.topLeft
  }

  console.error(token)
  throw new Error(`Unsupported token type ${token.type}`)
}

const filteredTokens = (dictionary, filterFn) => {
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
      fs.readFileSync(__dirname + '/templates/colors.h.template')
    )

    const groupedTokens = {
      // Note: Here we check includes because the light/dark part of the token
      // could be 2nd (for normal colors) or 3rd (for legacy colors).
      light: filteredTokens(dictionary, (token) =>
        token.path.includes('light')
      ),
      dark: filteredTokens(dictionary, (token) => token.path.includes('dark')),
      rest: filteredTokens(dictionary)
    }

    return template({ groupedTokens, options, file })
  }
})

StyleDictionary.registerFormat({
  name: 'skia/spacing.h',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/spacing.h.template')
    )
    return template({ tokens: filteredTokens(dictionary), options, file })
  }
})

StyleDictionary.registerFormat({
  name: 'skia/radius.h',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/radius.h.template')
    )
    return template({ tokens: filteredTokens(dictionary), options, file })
  }
})
