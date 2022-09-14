const { Declaration, AtRule, Rule } = require('postcss');

const getPropertyName = (selector, decl) => {
    const regex = /([^A-Za-z0-9\-_])/g
    return `--${selector}_${decl.prop}`
        .replace(/\s+/g, '_')
        .replace(regex, '\\$1')
}

const splitRule = (rule, selectorToExtract) => {
    // |cloneAfter|, so in an |each| loop, the new rule will be processed.
    const cloned = rule.cloneAfter();

    // Remove the light selector from the cloned rule.
    // Note: Directly splicing |selectors| has no effect, we have
    // to set a varible.
    const index = cloned.selectors.indexOf(selectorToExtract);
    const copy = [...cloned.selectors];
    copy.splice(index, 1);
    cloned.selectors = copy;

    // If we don't set this all the formatting breaks.
    cloned.raws.before = '\n';

    // Set the selectors on the light rule to be just the light selector.
    rule.selector = selectorToExtract;
}

const defaultOptions = {
    darkSelector: '[data-theme=dark]',
    lightSelector: '[data-theme=light]'
}

/**
 * @param {{ darkSelector: string, lightSelector: string }} options The options for configuring the selectors for darkmode.
 */
module.exports = (options) => {
    options = { ...defaultOptions, ...options };

    const rules = {};
    const nodesToDelete = new Set();
    const findMatchingLightRules = root => {
        const selectors = new Set(Object.keys(rules));
        root.each(rule => {
            if (rule.type !== 'rule') return;

            for (const lightSelector of [...rule.selectors]) {
                if (!selectors.has(lightSelector)) continue

                // If the rule has multiple selectors, we need to split the the
                // rule apart:
                // For example, when processing the rule .frob:
                // .foo, .frob, .bar { background: red; }
                // should become
                // .frob { background: red; }
                // .foo, .bar { background: red; }
                if (rule.selectors.length !== 1) splitRule(rule, lightSelector);

                rules[lightSelector].light = rule;
                break;
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

        for (const [property, decls] of Object.entries(properties)) {
            lightAndDark.light.push(new Declaration({ prop: decls.dark.prop, value: `var(${property})` }));
        }

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

            const lightRule = new Rule({ selectors: [':root', options.lightSelector], nodes: lightProperties })
            const darkRule = new Rule({ selector: options.darkSelector, nodes: darkProperties })
            const mediaQuery = new AtRule({
                name: 'media', params: '(prefers-color-scheme: dark)', nodes: [
                    new Rule({ selector: ':root', nodes: darkProperties })
                ]
            });

            // Only append our new rules if they're going to change something.
            // (they won't if there are no @darkmode rules in this sheet).
            if (lightProperties.length || darkProperties.length)
                root.prepend(lightRule, darkRule, mediaQuery);

            for (const node of nodesToDelete)
                node.remove()

            // Remove all empty nodes
            root.each(node => {
                if (node.nodes.length === 0) node.remove();
            })
        }
    }
}

module.exports.postcss = true;
