const defaultTheme = require('tailwindcss/defaultTheme')
const {
  primaryFont,
  fontSize,
  colors,
  boxShadow,
  dropShadow,
  gradients,
  borderRadius,
  spacing
} = require('./tokens')

module.exports = {
  theme: {
    fontSize,
    boxShadow,
    borderRadius,
    spacing,
    dropShadow,
    colors: colors,
    fontFamily: {
      sans: [...primaryFont, ...defaultTheme.fontFamily.sans]
    },
    extend: {
      backgroundImage: {
        ...gradients
      }
    }
  },
  plugins: require('./plugins')
}
