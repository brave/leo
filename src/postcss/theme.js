const { Declaration, AtRule, Rule } = require('postcss')
const supportedThemes = ['dark', 'light']

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

    const lightRules = Object.entries(properties).map(
      ([prop, decl]) =>
        new Declaration({
          prop,
          value: decl.light.value || decl.base.value || 'unset'
        })
    )
    const darkRules = Object.entries(properties).map(
      ([prop, decl]) =>
        new Declaration({
          prop,
          value: decl.dark.value || decl.base.value || 'unset'
        })
    )

    const lightContainer = new AtRule({
      name: 'container',
      params: `style(${options.themeProperty}: light)`,
      nodes: [new Rule({ selector: `:global(${selector})`, nodes: lightRules })]
    })

    const darkContainer = new AtRule({
      name: 'container',
      params: `style(${options.themeProperty}: dark)`,
      nodes: [new Rule({ selector: `:global(${selector})`, nodes: darkRules })]
    })

    // Note: These rules are required because container queries can't query the element itself so without these we wouldn't
    // be able to put a data-theme attribute on a Leo component.
    // Note: We need to use :global here because the Svelte compiler doesn't like it when we add an attribute selector to a rule.
    // Its debatable whether we need this at all because:
    // 1. In custom elements mode its okay to set this on the element itself.
    // 2. In Svelte mode you can only set data-theme on the element itself with difficulty (i.e. external JS).
    // If we remove these rules, we can get rid of the :global() wrapper above - its only used to avoid specificity issues.
    const onSelfLight = new Rule({
      selector: `:global(${selector}[data-theme="light"])`,
      nodes: lightRules
    })
    const onSelfDark = new Rule({
      selector: `:global(${selector}[data-theme="dark"])`,
      nodes: darkRules
    })

    // Add the light/dark container queries to the root.
    root.prepend(lightContainer, darkContainer, onSelfLight, onSelfDark)

    // Remove all of the overridden light rules.
    for (const decl of Object.values(properties)) {
      if ('remove' in decl.base) nodesToDelete.add(decl.base)
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
      findMatchingBaseRules(root)
      for (const [selector, rule] of Object.entries(rules)) {
        extractThemedProperties(selector, rule)
      }

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
