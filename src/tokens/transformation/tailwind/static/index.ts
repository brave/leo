const defaultTheme = require('tailwindcss/defaultTheme')
const {
  primaryFont,
  fontSize,
  colors,
  boxShadow,
  dropShadow,
  gradients,
  borderRadius
} = require('./tokens')

module.exports = {
  theme: {
    fontSize,
    boxShadow,
    borderRadius,
    dropShadow,
    colors: colors,
    fontFamily: {
      sans: [...primaryFont, ...defaultTheme.fontFamily.sans]
    },
    extend: {
      backgroundImage: {
        ...gradients
      },
    }
  },
  plugins: require('./plugins')
}
