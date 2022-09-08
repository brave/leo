const { Declaration, AtRule, Rule } = require('postcss');

const getPropertyName = (selector, decl) => {
    const regex = /([^A-Za-z0-9\-_])/g
    return `--${selector}_${decl.prop}`
        .replace(' ', '_')
        .replace(regex, '\\$1')
}

module.exports = (options = { forceGlobal: false }) => {
    const rules = {};
    const nodesToDelete = new Set();
    const findMatchingLightRules = root => {
        const selectors = new Set(Object.keys(rules));
        root.each(rule => {
            if (rule.type !== 'rule') return;

            for (const lightSelector of rule.selectors) {
                if (!selectors.has(lightSelector)) continue
                rules[lightSelector].light = rule;
            }
        })
    }

    const extractDarkProperties = (selector, lightAndDark) => {
        // Selector is the same for light and for dark.
        const properties = {}

        if (!lightAndDark.light) {
            lightAndDark.light = new Rule({ selector: selector })
            lightAndDark.dark.root().prepend(lightAndDark.light);
        }

        lightAndDark.dark.each(decl => {
            if (!decl.prop) return;

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

        const targetRule = new Rule({
            selector: selector,
            nodes: Object.entries(properties)
                .map(([property, decls]) => new Declaration({ prop: decls.dark.prop, value: `var(${property})` }))
        });
        lightAndDark.light.parent.append(targetRule);

        // Remove all of the overridden light rules.
        for (const decl of Object.values(properties)) {
            if ('remove' in decl.light)
                nodesToDelete.add(decl.light);
        }

        return {
            dark: darkVariables,
            light: lightVariables
        }
    }

    return {
        postcssPlugin: 'darkmode',
        AtRule: {
            darkmode: (atRule) => {
                atRule.each(rule => {
                    for (const selector of rule.selectors)
                        rules[selector] = { dark: rule }
                })
                nodesToDelete.add(atRule)
            }
        },
        OnceExit: (root) => {
            const darkProperties = [];
            const lightProperties = [];

            findMatchingLightRules(root);
            for (const [selector, rule] of Object.entries(rules)) {
                const { dark, light } = extractDarkProperties(selector, rule)
                darkProperties.push(...dark);
                lightProperties.push(...light);
            }

            const lightRule = new Rule({ selectors: [':root', '[data-theme=light]'], nodes: lightProperties })
            const darkRule = new Rule({ selector: '[data-theme=dark]', nodes: darkProperties })
            const mediaQuery = new AtRule({
                name: 'media', params: '(prefers-color-scheme: dark)', nodes: [
                    new Rule({ selector: ':root', nodes: darkProperties })
                ]
            });

            root.prepend(lightRule, darkRule, mediaQuery);

            for (const node of nodesToDelete)
                node.remove()
        }
    }
}

module.exports.postcss = true;
