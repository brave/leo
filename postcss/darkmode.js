const getPropertyName = (selector, decl) => {
    const regex = /([^A-Za-z0-9\-_])/g
    return `--${selector}_${decl.prop}`.replace(regex, '\\$1')
}

const extractDarkProperties = (lightAndDark) => {
    // Selector is the same for light and for dark.
    const selector = lightAndDark.dark.selector
    const properties = {}
    const unchangedProperties = []

    lightAndDark.dark.each(decl => {
        const propertyName = getPropertyName(selector, decl)
        properties[propertyName] = {
            dark: decl,
            light: {} // Empty so we set the value to undefined if there's no light property
        }
    })

    lightAndDark.light.each(decl => {
        const propertyName = getPropertyName(selector, decl)
        if (!properties[propertyName]) {
            unchangedProperties.push(decl)
            return
        }
        properties[propertyName].light = decl
    });

    const darkVariables = Object.entries(properties)
        .map(([key, decl]) => `${key}: ${decl.dark.value};`)
        .join('\n')

    const lightVariables = Object.entries(properties)
        .map(([key, decl]) => `${key}: ${decl.light.value || 'unset'};`)
        .join('\n')

    const naturalProperties = unchangedProperties
        .map(p => `${p};`)
        .join('\n')

    const overriddenProperties = Object.entries(properties)
        .map(([property, decls]) => `${decls.dark.prop}: var(${property});`)
        .join('\n')

    return `
:root, [data-theme=light] {
${lightVariables}
}

[data-theme=dark] {
${darkVariables}
}

@media (prefers-color-scheme: dark) {
    :root {
${darkVariables}
    }
}

${selector} {
${naturalProperties}
${overriddenProperties}
}`
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
            findMatchingLightRules(root);
            for (const rule of Object.values(rules)) {
                const replacementCss = extractDarkProperties(rule)
                rule.light.replaceWith(replacementCss)
                rule.dark.remove()
            }

            // Remove all the @darkmode rules, we should have fully converted them.
            root.each(r => {
                if (r.type !== 'atrule' || r.name !== 'darkmode') return
                if (r.nodes.length) throw new Error('Expected @darkmode rule to have been converted');
                r.remove()
            })
        }
    }
}

module.exports.postcss = true;
