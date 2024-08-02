import { Formatter } from 'style-dictionary'

export default (({ dictionary }) => {
  const fontClasses = new Map()

  // Format all other tokens
  dictionary.allTokens.forEach(({ type, name, ...t }) => {
    const attributes = t.attributes!
    let fontClass = `.text-${attributes.type}-${attributes.item}`

    if (attributes.subitem) {
      fontClass += `-${attributes.subitem}`
    }

    // Ensure we don't lose modifiers like "default", "regular", "semibold", etc.
    if (attributes.state) {
      fontClass += `-${attributes.state}`
    }

    fontClasses.set(fontClass, t.value)
  })

  // Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
  return `const plugin = require("tailwindcss/plugin")
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = plugin(function ({ addComponents }) {
  addComponents(${JSON.stringify(Object.fromEntries(fontClasses))});
}, {
  theme: {
    fontFamily: {
      body: ['Inter Variable', ...defaultTheme.fontFamily.sans],
      display: ['Poppins', ...defaultTheme.fontFamily.sans]
    },
  }
})`
}) as Formatter
