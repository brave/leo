const indent = (text, level) => text.split('\n')
	.map(line => ''.padStart(level, '\t') + line)
	.join('\n')

export default () => {
  return {
    postcssPlugin: 'darkmode',
    AtRule: {
      darkmode: atRule => {
        const selectors = atRule.params.split(',').map(t => t.trim()).filter(s => s)
        if (!selectors.length) selectors.push('&');
        const body = atRule.nodes.join(';\n');
        atRule.replaceWith(`
@media (prefers-color-scheme: dark) {
	${selectors.map(s => `${s}:not([data-theme="light"] ${s}):not([data-theme="light"])`).join(', ')} {
${indent(body, 2)};
	}
}

${selectors.map(s => `${s}[data-theme="dark"]`).join(', ')} {
${indent(body, 1)}
}`)
        
      }
    }
  }
}

export const postcss = true;
