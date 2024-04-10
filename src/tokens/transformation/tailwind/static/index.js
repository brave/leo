const {
  colors,
  boxShadow,
  dropShadow,
  gradients,
  borderRadius,
  spacing
} = require('./tokens')

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
  },
  plugins: require('./plugins')
}
