const { Declaration, AtRule, Rule } = require('postcss');

const getPropertyName = (selector, decl) => {
    const regex = /([^A-Za-z0-9\-_])/g
    return `--${selector}_${decl.prop}`.replace(regex, '\\$1')
}

const extractDarkProperties = (lightAndDark) => {
    // Selector is the same for light and for dark.
    const selector = lightAndDark.dark.selector
    const properties = {}

    lightAndDark.dark.each(decl => {
        const propertyName = getPropertyName(selector, decl)
        properties[propertyName] = {
            dark: decl,
            light: {} // Empty so we set the value to undefined if there's no light property
        }
    })

    lightAndDark.light.each(decl => {
        const propertyName = getPropertyName(selector, decl)
        if (!properties[propertyName]) return
        properties[propertyName].light = decl
    });

    const darkVariables = Object.entries(properties)
        .map(([key, decl]) => new Declaration({ prop: key, value: decl.dark.value }))

    const lightVariables = Object.entries(properties)
        .map(([key, decl]) => new Declaration({ prop: key, value: decl.light.value || 'unset' }))
    
    for (const [property, decls] of Object.entries(properties)) {
      // If there is already a light property for this, update it to use the custom property.
      if (decls.light.prop) {
        decls.light.value = `var(${property})`
      } else { // If not, add a new declaration.
        lightAndDark.light.append(new Declaration({ prop: decls.dark.prop, value: `var(${property})`}))
      }
    }
  
  	lightAndDark.dark.remove()

    return {
      dark: darkVariables,
      light: lightVariables
    }
}

module.exports = (options = { forceGlobal: false }) => {
    const rules = {};
    const findMatchingLightRules = root => {
        const selectors = new Set(Object.keys(rules));
        root.each(rule => {
            if (rule.type !== 'rule') return;
            if (!selectors.has(rule.selector)) return;

            rules[rule.selector].light = rule
        })
    }

    return {
        postcssPlugin: 'darkmode',
        AtRule: {
            darkmode: (atRule) => {
                atRule.each(rule => {
                    rules[rule.selector] = {
                        dark: rule
                    }
                })
            }
        },
        OnceExit: (root) => {
          	const darkProperties = [];
          	const lightProperties = [];

            findMatchingLightRules(root);
            for (const rule of Object.values(rules)) {
                const { dark, light } = extractDarkProperties(rule)
                darkProperties.push(...dark);
              	lightProperties.push(...light);
            }

            const lightRule = new Rule({ selectors: [':root', '[data-theme=light]' ], nodes: lightProperties })
            const darkRule = new Rule({ selector: '[data-theme=dark]', nodes: darkProperties })
            const mediaQuery = new AtRule({ name: 'media', params: '(prefers-color-scheme: dark)', nodes: [
                new Rule({ selector: ':root', nodes: darkProperties })
            ]});
            
            root.prepend(lightRule, darkRule, mediaQuery);

            // Remove all the @darkmode rules, we should have fully converted them.
            root.each(r => {
                if (r.type !== 'atrule' || r.name !== 'darkmode') return

                // This should never happen.
                if (r.nodes.length) throw new Error(`Expected all @darkmode rule to have been converted. Encountered ${r.toString()}`);
                r.remove()
            })
        }
    }
}

module.exports.postcss = true;
