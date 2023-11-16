module.exports = ({ dictionary }) => {
  const fontClasses = new Map()

  // Format all other tokens
  dictionary.allTokens.forEach(({ type, name, ...t }) => {
    let fontClass = `.text-${t.attributes.type}-${t.attributes.item}`

    if (t.attributes.subitem) {
      fontClass += `-${t.attributes.subitem}`
    }

    // Ensure we don't lose modifiers like "default", "regular", "semibold", etc.
    if (t.attributes.state) {
      fontClass += `-${t.attributes.state}`
    }

    // Remove "desktop" for typography
    fontClass = fontClass.replace(/desktop-/gm, '')

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
      body: ['Inter', ...defaultTheme.fontFamily.sans],
      display: ['Poppins', ...defaultTheme.fontFamily.sans]
    },
  }
})`
}
