const merge = require('lodash.merge')

const themes = ['light', 'dark']

const formatColorVar = (name, isStatic = true) => {
  name = isStatic ? name : name.replace('-dark-', '-').replace('-light-', '-')
  return `rgba(var(--tw-${name}), <alpha-value>)`
}

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
       * for use in Tailwind. This results in three ways of accessing
       * a color using dot notation:
       * Dark: colors.dark.systemfeedback.success.icon
       * Light: colors.light.systemfeedback.success.icon
       * Dynamic: colors.systemfeedback.success.icon
       */
      let colorGroup = colorTokens[t.attributes.type] ?? {}

      /**
       * `state` is for the deepest level on a token.
       * E.g. `icon` in colors.systemfeedback.success.icon
       */
      if (t.attributes.state) {
        if (!staticTheme) {
          // If not on a static theme, do not place within `dark` or `light` groups
          colorTokens[t.attributes.item] = colorTokens[t.attributes.item] || {}
          const tokenGroup =
            colorTokens[t.attributes.item][t.attributes.subitem] ?? {}
          colorTokens[t.attributes.item][t.attributes.subitem] = merge(
            tokenGroup,
            {
              [t.attributes.state]: formatColorVar(name, staticTheme)
            }
          )
        } else {
          // If on a static theme, place within `dark` or `light` groups
          const tokenGroup = colorGroup[t.attributes.item]
          colorGroup[t.attributes.item] = merge(tokenGroup, {
            [t.attributes.subitem]: formatColorVar(name, staticTheme)
          })
        }
      } else if (t.attributes.subitem) {
        /**
         * If not on a static theme AND theme is determined by `type`
         * property do not place within `dark` or `light` groups
         */
        if (themes.includes(t.attributes.type) && !staticTheme) {
          const tokenGroup = colorTokens[t.attributes.item] ?? {}
          colorTokens[t.attributes.item] = merge(tokenGroup, {
            [t.attributes.subitem]: formatColorVar(name, staticTheme)
          })

          /**
           * If not on a static theme AND theme is determined by `item`
           * property (e.g. legacy tokens) do not place within `dark`
           * or `light` groups
           */
        } else if (themes.includes(t.attributes.item) && !staticTheme) {
          const tokenGroup = colorTokens[t.attributes.type] ?? {}
          colorTokens[t.attributes.type] = merge(tokenGroup, {
            [t.attributes.subitem]: formatColorVar(name, staticTheme)
          })
        } else {
          // If on a static theme, place within `dark` or `light` groups
          const tokenGroup = colorGroup[t.attributes.item]
          colorGroup[t.attributes.item] = merge(tokenGroup, {
            [t.attributes.subitem]: formatColorVar(name, staticTheme)
          })
        }

        /**
         * If `item` property is the token name, don't nest inside object
         */
      } else if (t.attributes.item) {
        colorGroup[t.attributes.item] = formatColorVar(name, staticTheme)

        /**
         * If `item` property is the token name, set directly on colorGroup
         */
      } else if (t.attributes.type) {
        colorGroup = formatColorVar(name, staticTheme)
      }

      colorTokens[t.attributes.type] = colorGroup
    }
  })
  return colorTokens
}

function createStaticColorTokens(tokens) {
  return createColorTokensFromGroup(tokens)
}

function createDynamicColorTokens(tokens) {
  return createColorTokensFromGroup(tokens, false)
}

module.exports = ({ dictionary }) => {
  const staticColorTokens = createStaticColorTokens(dictionary.allTokens)
  const dynamicColorTokens = createDynamicColorTokens(dictionary.allTokens)
  const colorTokens = merge(dynamicColorTokens, staticColorTokens)

  const fontSizes = new Map()
  const borderRadii = new Map()
  const gradients = new Map()
  const boxShadows = new Map()
  const dropShadows = new Map()

  // Format all other tokens
  dictionary.allTokens.forEach(({ type, name, ...t }) => {
    if (type === 'custom-fontStyle') {
      const { fontSize, ...rest } = t.value

      // E.g.
      let fontName = `${t.attributes.item}`

      if (t.attributes.subitem) {
        fontName += `-${t.attributes.subitem}`
      }

      // Ensure we don't lose modifiers like "default", "regular", "semibold", etc.
      if (t.attributes.state) {
        fontName += `-${t.attributes.state}`
      }

      /*
       * Prefer "components" over "desktop" if present
       * (e.g. `components-button-small` instead of `desktop-button-small`)
       */
      if (t.attributes.type.includes('components')) {
        fontName = fontName.replace(
          t.attributes.item,
          t.attributes.type.replace(/[^a-zA-Z]/g, '')
        )
      }

      /**
       * Remove extraneous sections. E.g.
       * `text-h1` rather than `text-heading-h1`
       * `text-default-small-regular` rather than text-text-default-small-regular`
       */
      fontName = fontName.replace(/^heading-/, '').replace(/^text-/, '')

      fontSizes.set(fontName, [fontSize, rest])
    } else if (type === 'custom-radius') {
      if (t.attributes.type === 'full') {
        borderRadii.set(t.attributes.type, '9999px')
      } else {
        borderRadii.set(t.attributes.type, t.value)
      }
    } else if (type === 'custom-gradient') {
      const [, ...pathParts] = t.path
      gradients.set(pathParts.join('-'), t.value)
    } else if (type === 'custom-shadow') {
      const [, ...pathParts] = t.path
      boxShadows.set(
        pathParts.join('-').replace(' ', '-').replace('elevation-', ''),
        t.value.boxShadow
      )
      dropShadows.set(
        pathParts.join('-').replace(' ', '-').replace('elevation-', ''),
        t.value.dropShadow
      )
    }
  })

  // Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
  return `module.exports = ${JSON.stringify(
    {
      colors: colorTokens,
      primaryFont: ['Poppins', 'Helvetica', 'sans-serif'],
      fontSize: Object.fromEntries(fontSizes),
      borderRadius: Object.fromEntries(borderRadii),
      boxShadow: Object.fromEntries(boxShadows),
      dropShadow: Object.fromEntries(dropShadows),
      gradients: Object.fromEntries(gradients)
    },
    null,
    ' '.repeat(2)
  )}`
}
