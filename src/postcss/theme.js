const { Declaration, AtRule, Rule } = require('postcss')
const supportedThemes = ['dark', 'light']

const getPropertyName = (selector, decl) => {
  const regex = /([^A-Za-z0-9\-_])/g
  return `--${selector}_${decl.prop}`
    .replace(/\s+/g, '_')
    .replace(regex, '\\$1')
}

const splitRule = (rule, selectorToExtract) => {
  // |cloneAfter|, so in an |each| loop, the new rule will be processed.
  const cloned = rule.cloneAfter()

  // Remove the base selector from the cloned rule.
  // Note: Directly splicing |selectors| has no effect, we have
  // to set a variable.
  const index = cloned.selectors.indexOf(selectorToExtract)
  const copy = [...cloned.selectors]
  copy.splice(index, 1)
  cloned.selectors = copy

  // If we don't set this all the formatting breaks.
  cloned.raws.before = '\n'

  // Set the selectors on the base rule to be just the base selector.
  rule.selector = selectorToExtract
}

// Note: It's important that these selectors have a better than (0, 1, 0)
// specificity, or they'll be overridden by the dark mode media query.
const defaultOptions = {
  darkSelector: '[data-theme][data-theme=dark]',
  lightSelector: '[data-theme][data-theme=light]',
  wrapSelector: (selector) => selector
}

/**
 * @param {{
 *  darkSelector: string,
 *  lightSelector: string,
 *  wrapSelector?: (selector: string) => string,
 * }} options The options for configuring the selectors for darkmode.
 */
module.exports = (options) => {
  options = { ...defaultOptions, ...options }

  let rules = {}
  const nodesToDelete = new Set()
  const findMatchingBaseRules = (root) => {
    const selectors = new Set(Object.keys(rules))
    root.each((rule) => {
      if (rule.type !== 'rule') return

      for (const baseSelector of [...rule.selectors]) {
        if (!selectors.has(baseSelector)) continue

        // If the rule has multiple selectors, we need to split the
        // selector with a variant into a new rule:
        // For example, when processing the rule .frob:
        // .foo, .frob, .bar { background: red; }
        // should become
        // .frob { background: red; }
        // .foo, .bar { background: red; }
        if (rule.selectors.length !== 1) splitRule(rule, baseSelector)

        // Merge with existing base rule or create new one
        if (rules[baseSelector].base) {
          // Merge declarations from this rule into the existing base rule
          rule.each((decl) => {
            // Check if property already exists in base rule
            let existingDecl = null
            rules[baseSelector].base.each((baseDecl) => {
              if (baseDecl.prop === decl.prop) {
                existingDecl = baseDecl
                return false
              }
            })

            if (existingDecl) {
              // Update existing declaration value
              existingDecl.value = decl.value
            } else {
              // Add new declaration to base rule
              const newDecl = decl.clone()
              rules[baseSelector].base.append(newDecl)
              nodesToDelete.add(newDecl)
            }
          })
        } else {
          // First rule for this selector
          rules[baseSelector].base = rule
        }
        break
      }
    })
  }

  const extractDarkProperties = (selector, lightAndDark) => {
    const variants = ['base', 'dark', 'light']

    // At least one variant should have a value. Take it, and get the root node.
    const root = variants
      .map((v) => lightAndDark[v])
      .filter((v) => v)[0]
      .root()

    // Selector is the same for light and for dark.
    const properties = {}
    const getPropertyVariants = (property) => {
      if (!properties[property])
        properties[property] = { base: {}, dark: {}, light: {} }
      return properties[property]
    }
    const getDeclProp = (decl) => decl.light.prop || decl.dark.prop

    if (!lightAndDark.base) {
      lightAndDark.base = new Rule({ selector: selector })
      root.prepend(lightAndDark.base)
    }

    if (lightAndDark.dark) {
      lightAndDark.dark.each((decl) => {
        if (!decl.prop) return

        const propertyName = getPropertyName(selector, decl)
        getPropertyVariants([propertyName]).dark = decl
      })
    }

    if (lightAndDark.light) {
      lightAndDark.light.each((decl) => {
        if (!decl.prop) return

        const propertyName = getPropertyName(selector, decl)
        getPropertyVariants([propertyName]).light = decl
      })
    }

    lightAndDark.base.each((decl) => {
      const propertyName = getPropertyName(selector, decl)
      if (!properties[propertyName]) return
      properties[propertyName].base = decl
    })

    const darkVariables = Object.entries(properties).map(
      ([key, decl]) =>
        new Declaration({
          prop: key,
          value: decl.dark.value || decl.base.value || 'unset'
        })
    )

    const lightVariables = Object.entries(properties).map(
      ([key, decl]) =>
        new Declaration({
          prop: key,
          value: decl.light.value || decl.base.value || 'unset'
        })
    )

    for (const [property, decls] of Object.entries(properties)) {
      lightAndDark.base.push(
        new Declaration({ prop: getDeclProp(decls), value: `var(${property})` })
      )
    }

    // Remove all of the overridden light rules.
    for (const decl of Object.values(properties)) {
      if ('remove' in decl.base) nodesToDelete.add(decl.base)
    }

    return {
      dark: darkVariables,
      light: lightVariables
    }
  }

  return {
    postcssPlugin: 'theme',
    AtRule: {
      theme: (atRule) => {
        const theme = supportedThemes.find((t) => atRule.params.includes(t))
        if (!theme)
          throw new Error(
            `Encountered unsupported theme ${
              atRule.params
            }. Allowed themes are ${supportedThemes.join(', ')}`
          )

        atRule.each((rule) => {
          for (const selector of rule.selectors) {
            if (!rules[selector]) rules[selector] = {}
            rules[selector][theme] = rule
          }
        })
        nodesToDelete.add(atRule)
      }
    },
    OnceExit: (root) => {
      const darkProperties = []
      const lightProperties = []

      findMatchingBaseRules(root)
      for (const [selector, rule] of Object.entries(rules)) {
        const { dark, light } = extractDarkProperties(selector, rule)
        darkProperties.push(...dark)
        lightProperties.push(...light)
      }

      let lightSelectors = [
        ':root',
        `:root${options.lightSelector}`,
        options.lightSelector
      ]
      let darkSelectors = [`:root${options.darkSelector}`, options.darkSelector]

      lightSelectors = lightSelectors.map((s) => options.wrapSelector(s))
      darkSelectors = darkSelectors.map((s) => options.wrapSelector(s))

      const lightRule = new Rule({
        selectors: lightSelectors,
        nodes: lightProperties
      })
      const darkRule = new Rule({
        selectors: darkSelectors,
        nodes: darkProperties
      })
      const darkMediaQuery = new AtRule({
        name: 'media',
        params: '(prefers-color-scheme: dark)',
        nodes: darkProperties.length
          ? [
              new Rule({
                selector: options.wrapSelector(':root'),
                nodes: darkProperties
              })
            ]
          : []
      })

      root.prepend(lightRule, darkRule, darkMediaQuery)

      for (const node of nodesToDelete) {
        node.remove()
      }

      // Remove all empty nodes
      root.each((node) => {
        if (!node.nodes || node.nodes.length === 0) node.remove()
      })

      // Reset global vars
      rules = {}
      nodesToDelete.clear()
    }
  }
}

module.exports.postcss = true
module.exports.__esModule = true
