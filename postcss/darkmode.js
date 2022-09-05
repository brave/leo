const indent = (text, level) => text.split('\n')
    .map(line => ''.padStart(level, '\t') + line)
    .join('\n')

const renderRule = (rule, transform) => {
    if (!rule.selector) {
        console.log(rule.toString())
        return ''
    }
    const selectors = rule.selector.split(',').map(s => s.trim()).map(transform)
    return `${selectors.join(', ')} {
${indent(rule.nodes.map(n => n.toString() + ';').join('\n'), 1)}
}`
}

const generateNestedDarkModeSelectors = (levels) => {
    if (levels === 0) return '';

    const generateNestedDarkModeSelector = (level) => {
        let selector = '[data-theme=dark]'
        while (--level > 0)
            selector = '[data-theme=dark] [data-theme=light] ' + selector;

        return `${selector} .component:not(${selector} [data-theme=light] .component):not([data-theme=light])`
    }

    return Array.from(Array(levels).keys()).map(i => generateNestedDarkModeSelector(i + 1)).join(',\n')
}

const getNestingLevel = (params) => {
    const result = /\(levels: (\d+)\)/g.exec(params);
    if (result && result[1]) {
        const parsed = parseInt(result[1]);
        return isNaN(parsed) ? 2 : parsed;
    }
    return 2;
}

module.exports = (options = { forceGlobal: false }) => {
    return {
        postcssPlugin: 'darkmode',
        AtRule: {
            darkmode: atRule => {
                const nesting = getNestingLevel(atRule.params);
                // In Svelte, we need to force the selector to be global,
                // otherwise the compiler will remove our style!
                let parentDarkModeSelectors = generateNestedDarkModeSelectors(nesting)
                if (parentDarkModeSelectors) {
                    if (options.forceGlobal) parentDarkModeSelectors = `:global(${parentDarkModeSelectors})`
                    parentDarkModeSelectors = ',\n' + parentDarkModeSelectors;
                }

                const queryBody = atRule.nodes.map(n => renderRule(n, s => `${s}:not([data-theme] ${s}):not([data-theme])`)).join('\n\n');
                const attributeBody = atRule.nodes.map(n => renderRule(n, s => `${s}[data-theme=dark]${parentDarkModeSelectors}`)).join('\n\n')

                atRule.replaceWith(`
@media (prefers-color-scheme: dark) {
${indent(queryBody, 1)}
}

${attributeBody}`)
            }
        }
    }
}

module.exports.postcss = true;
