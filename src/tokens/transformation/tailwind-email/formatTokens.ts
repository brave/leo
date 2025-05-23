import merge from 'lodash.merge'
import { Formatter } from 'style-dictionary'

const themes = ['light', 'dark']

const kebabCase = (str: string) => str && str.toLowerCase().replaceAll(' ', '-')

/**
 * This function transforms tokens into a nested object
 * structure ready for Tailwind. The conditional statements
 * are largely to handle creating both static and dynamic
 * tokens. E.g. A given token needs three variants:
 * dynamic, static light, and static dark. This function gets
 * run twice: once to create all static tokens, and another
 * time to create the dynamic tokens which places values on
 * the parent (e.g. the root object, or 'legacy') and uses the
 * appropriate color variable.
 */
function createColorTokensFromGroup(tokens, staticTheme = true) {
  const colorTokens = {}
  tokens.forEach(({ type, name, ...t }) => {
    if (type === 'color') {
      /**
       * The following conditions are in order to properly group
       * color tokens and format into a nested object structure
       * for use in Tailwind.
       */
      let colorGroup = colorTokens[t.attributes.type] ?? {}

      const tItem = kebabCase(t.attributes.item)
      const tSubItem = kebabCase(t.attributes.subitem)

      /**
       * `state` is for the deepest level on a token.
       * E.g. `icon` in colors.systemfeedback.success.icon
       */
      if (t.attributes.state) {
        if (!staticTheme) {
          // If not on a static theme, do not place within `dark` or `light` groups
          colorTokens[tItem] = colorTokens[tItem] || {}
          const tokenGroup = colorTokens[tItem][tSubItem] ?? {}
          colorTokens[tItem][tSubItem] = merge(tokenGroup, {
            [t.attributes.state]: t.value
          })
        } else {
          // If on a static theme, place within `dark` or `light` groups
          const tokenGroup = colorGroup[tItem]
          colorGroup[tItem] = merge(tokenGroup, {
            [tSubItem]: t.value
          })
        }
      } else if (tSubItem) {
        /**
         * If not on a static theme AND theme is determined by `type`
         * property do not place within `dark` or `light` groups
         */
        if (themes.includes(t.attributes.type) && !staticTheme) {
          const tokenGroup = colorTokens[tItem] ?? {}
          colorTokens[tItem] = merge(tokenGroup, {
            [tSubItem]: t.value
          })

          /**
           * If not on a static theme AND theme is determined by `item`
           * property (e.g. legacy tokens) do not place within `dark`
           * or `light` groups
           */
        } else if (themes.includes(t.attributes.item) && !staticTheme) {
          const tokenGroup = colorTokens[t.attributes.type] ?? {}
          colorTokens[t.attributes.type] = merge(tokenGroup, {
            [tSubItem]: t.value
          })
        } else {
          // If on a static theme, place within `dark` or `light` groups
          const tokenGroup = colorGroup[tItem]
          colorGroup[tItem] = merge(tokenGroup, {
            [tSubItem]: t.value
          })
        }

        /**
         * If `item` property is the token name, don't nest inside object
         */
      } else if (t.attributes.item) {
        colorGroup[tItem] = t.value

        /**
         * If `item` property is the token name, set directly on colorGroup
         */
      } else if (t.attributes.type) {
        colorGroup = t.value
      }

      if (Object.keys(colorGroup).length > 0) {
        colorTokens[t.attributes.type] = colorGroup
      }
    }
  })
  return colorTokens
}

export default (({ dictionary }) => {
  const colorTokens = createColorTokensFromGroup(dictionary.allTokens)

  const borderRadii = new Map([['none', '0']])
  const spacing = new Map<string | number, string | number>([[0, 0]]) // Initialize with option for 0 spacing
  const gradients = new Map()
  const boxShadows = new Map([['none', 'none']])
  const dropShadows = new Map<string, string | string[]>([
    ['none', '0 0 #0000']
  ])

  // Format all other tokens
  dictionary.allTokens.forEach(({ type, name, ...t }) => {
    const attributes = t.attributes!
    if (attributes.category === 'radius') {
      if (attributes.type === 'full') {
        borderRadii.set(attributes.type, '9999px')
      } else {
        borderRadii.set(attributes.type!, t.value)
      }
    } else if (attributes.category === 'spacing') {
      spacing.set(attributes.type!, t.value)
    } else if (type === 'custom-gradient') {
      const [, ...pathParts] = t.path
      gradients.set(pathParts.join('-'), t.value)
    } else if (type === 'custom-shadow') {
      const [, ...pathParts] = t.path
      boxShadows.set(
        pathParts
          .filter((v) => !['elevation', 'light', 'dark'].includes(v))
          .join('-')
          .replaceAll(' ', '-'),
        t.value.boxShadow
      )
      dropShadows.set(
        pathParts
          .filter((v) => !['elevation', 'light', 'dark'].includes(v))
          .join('-')
          .replaceAll(' ', '-'),
        t.value.dropShadow
      )
    }
  })

  // Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
  return `module.exports = ${JSON.stringify(
    {
      colors: colorTokens,
      spacing: Object.fromEntries(spacing),
      borderRadius: Object.fromEntries(borderRadii),
      boxShadow: Object.fromEntries(boxShadows),
      dropShadow: Object.fromEntries(dropShadows),
      gradients: Object.fromEntries(gradients)
    },
    null,
    ' '.repeat(2)
  )}`
}) as Formatter
