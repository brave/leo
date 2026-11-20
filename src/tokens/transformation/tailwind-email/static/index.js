const {
  colors,
  boxShadow,
  dropShadow,
  gradients,
  borderRadius,
  spacing
} = require('./tokens')

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    boxShadow: {},
    borderRadius: {},
    spacing: {},
    dropShadow: {},
    colors: {},
    extend: {
      boxShadow,
      borderRadius,
      spacing,
      dropShadow,
      colors: colors,
      backgroundImage: {
        ...gradients
      }
    }
  }
}
