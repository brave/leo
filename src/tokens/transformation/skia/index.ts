import fs from 'fs'
import _template from 'lodash/template'
import path from 'path'
import StyleDictionary, { Dictionary, TransformedToken } from 'style-dictionary'
import { fileURLToPath } from 'url'
import colorToSkiaString from './colorToSkiaString'
import { transformName } from './name'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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

const sortOrder = ['Primitive', 'Scheme', 'Neutral', 'Primary']

const getSortKey = ({ name, value }) => {
  const specialIndex = sortOrder.findIndex((i) => name.includes(i))
  if (specialIndex !== -1) {
    return specialIndex
  }

  // If its a color, it should sort later
  if (value.toString().startsWith('kColor')) sortOrder.length + 1

  // Its a color, but not a primitive
  return sortOrder.length
}

const dynamicPalettePrimitives = [
  'primary',
  'secondary',
  'tertiary',
  'neutral-variant',
  'neutral',
  'error'
]

// Colors in the material palette need to know that they should point to the
// equivalent color ref from the Chromium color mixer, so that when the theme
// in Chromium changes they follow suit.
const maybeMaterialColorProps = (token: TransformedToken) => {
  // Skip non-primitive tokens - only our primitives are set from the Material
  // palette, everything else is defined in terms of them.
  if (!token.name.includes('primitive')) return
  const type = dynamicPalettePrimitives.find((p) => token.name.includes(p))
  if (!type) return

  const tone = parseInt(token.name.split('-').slice(-1)[0])
  if (isNaN(tone)) return

  const transformedType = type
    .split('-')
    .map((t) => t[0].toUpperCase() + t.slice(1))
    .join('')

  return {
    dynamicPrimitive: type,
    tone: token.name.split('-').slice(-1),
    dynamicRef: `kColorRef${transformedType}${tone}`
  }
}

const filteredTokens = (
  dictionary: Dictionary,
  filterFn: (value: TransformedToken) => boolean
) => {
  let filtered = dictionary.allTokens
  if (typeof filterFn === 'function') {
    filtered = dictionary.allTokens.filter((token) => filterFn(token))
  }

  filtered = filtered
    .map((token) => ({
      ...token,
      name: transformName(token),
      value: transformValue(token),
      ...maybeMaterialColorProps(token)
    }))
    .sort((a, b) => {
      // Make sure tokens which depend on others sort after those they depend on
      const aKey = getSortKey(a)
      const bKey = getSortKey(b)

      if (aKey !== bKey) {
        return aKey - bKey
      }

      return a.name.localeCompare(b.name)
    })

  return {
    ...dictionary,
    ...{
      allProperties: filtered,
      allTokens: filtered
    }
  }
}

const templates = [
  'nala_color_id.h',
  'nala_color_mixer.h',
  'nala_color_mixer.cc'
]
for (const templateName of templates) {
  StyleDictionary.registerFormat({
    name: `skia/${templateName}`,
    formatter: ({ dictionary, options, file }) => {
      const template = _template(
        fs.readFileSync(
          dirname + `/templates/${templateName}.template`,
          'utf-8'
        )
      )

      const groupedTokens = {
        // Note: Here we check includes because the light/dark part of the token
        // could be 2nd (for normal colors) or 3rd (for legacy colors).
        light: filteredTokens(dictionary, (token) =>
          token.path.includes('light')
        ),
        dark: filteredTokens(dictionary, (token) =>
          token.path.includes('dark')
        ),
        rest: filteredTokens(
          dictionary,
          (token) =>
            !token.path.includes('light') && !token.path.includes('dark')
        )
      }

      return template({ groupedTokens, options, file })
    }
  })
}

StyleDictionary.registerFormat({
  name: 'skia/spacing.h',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(dirname + '/templates/spacing.h.template', 'utf-8')
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
      fs.readFileSync(dirname + '/templates/radius.h.template', 'utf-8')
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
