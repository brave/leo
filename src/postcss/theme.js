const { Declaration, AtRule, Rule } = require('postcss')
const supportedThemes = ['dark', 'light']

const getPropertyName = (selector, prop) => {
  const regex = /([^A-Za-z0-9\-_])/g
  return `--${selector}_${prop}`.replace(/\s+/g, '_').replace(regex, '\\$1')
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

const defaultOptions = {
  themeProperty: '--leo-theme'
}

/**
 * @param {{
 *  themeProperty?: string,
 * }} options The options for configuring container style queries for theming.
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

  const extractThemedProperties = (selector, lightAndDark) => {
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

    if (!lightAndDark.base) {
      lightAndDark.base = new Rule({ selector: selector })
      root.prepend(lightAndDark.base)
    }

    if (lightAndDark.dark) {
      lightAndDark.dark.each((decl) => {
        if (!decl.prop) return

        getPropertyVariants([decl.prop]).dark = decl
      })
    }

    if (lightAndDark.light) {
      lightAndDark.light.each((decl) => {
        if (!decl.prop) return

        getPropertyVariants([decl.prop]).light = decl
      })
    }

    lightAndDark.base.each((decl) => {
      if (!properties[decl.prop]) return
      properties[decl.prop].base = decl
    })

    // Create CSS variable declarations for light and dark modes
    // Always create scoped variables (even for CSS custom properties)
    const lightVariables = Object.entries(properties).map(
      ([prop, decl]) =>
        new Declaration({
          prop: getPropertyName(selector, prop),
          value: decl.light.value || decl.base.value || 'unset'
        })
    )
    const darkVariables = Object.entries(properties).map(
      ([prop, decl]) =>
        new Declaration({
          prop: getPropertyName(selector, prop),
          value: decl.dark.value || decl.base.value || 'unset'
        })
    )

    // 1. :root with default (light) values
    const rootLightRule = new Rule({
      selector: `:global(:root)`,
      nodes: lightVariables.map((decl) => decl.clone())
    })

    // 2. @media (prefers-color-scheme: dark) for dark mode default
    const darkMediaQuery = new AtRule({
      name: 'media',
      params: '(prefers-color-scheme: dark)',
      nodes: [
        new Rule({
          selector: `:global(${selector})`,
          nodes: darkVariables.map((decl) => decl.clone())
        })
      ]
    })

    // 3. [data-theme] fallback rules for explicit theme selection (Firefox)
    // Use descendant selectors to match when data-theme is on a parent
    const fallbackLightRule = new Rule({
      selector: `:global([data-theme="light"])`,
      nodes: lightVariables.map((decl) => decl.clone())
    })
    const fallbackDarkRule = new Rule({
      selector: `:global([data-theme="dark"])`,
      nodes: darkVariables.map((decl) => decl.clone())
    })

    // 4. @container style queries (highest specificity, modern browsers)
    const lightContainer = new AtRule({
      name: 'container',
      params: `style(--leo-theme: light)`,
      nodes: [
        new Rule({
          selector: `:global(${selector})`,
          nodes: lightVariables.map((decl) => decl.clone())
        })
      ]
    })

    const darkContainer = new AtRule({
      name: 'container',
      params: `style(--leo-theme: dark)`,
      nodes: [
        new Rule({
          selector: `:global(${selector})`,
          nodes: darkVariables.map((decl) => decl.clone())
        })
      ]
    })

    // Update base rule to use CSS variable references
    for (const [prop, decl] of Object.entries(properties)) {
      const varName = getPropertyName(selector, prop)
      const originalProp =
        decl.light?.prop || decl.dark?.prop || decl.base?.prop || prop
      lightAndDark.base.append(
        new Declaration({ prop: originalProp, value: `var(${varName})` })
      )
    }

    // Remove all of the overridden light rules.
    for (const decl of Object.values(properties)) {
      if ('remove' in decl.base) nodesToDelete.add(decl.base)
    } // Add all rules: :root, media query, fallback rules, then container queries last (highest specificity)

    return [
      rootLightRule,
      darkMediaQuery,
      fallbackLightRule,
      fallbackDarkRule,
      lightContainer,
      darkContainer
    ]
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
      findMatchingBaseRules(root)
      const rulesToAdd = []
      for (const [selector, rule] of Object.entries(rules)) {
        rulesToAdd.push(...extractThemedProperties(selector, rule))
      }

      root.prepend(...rulesToAdd)

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
