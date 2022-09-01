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

module.exports = (options = { forceGlobal: true }) => {
    return {
        postcssPlugin: 'darkmode',
        AtRule: {
            darkmode: atRule => {
                // In Svelte, we need to force the selector to be global,
                // otherwise the compiler will remove our style!
                let parentDarkModeSelector = '[data-theme=dark]'
                if (options.forceGlobal) parentDarkModeSelector = `:global(${parentDarkModeSelector})`
                
                const queryBody = atRule.nodes.map(n => renderRule(n, s => `${s}:not([data-theme=light] ${s}):not([data-theme=light])`)).join('\n\n');
                const attributeBody = atRule.nodes.map(n => renderRule(n, s => `${s}[data-theme=dark], ${parentDarkModeSelector} ${s}`)).join('\n\n')

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
