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
    fontSize: {},
    boxShadow,
    borderRadius,
    spacing,
    dropShadow,
    colors: colors,
    extend: {
      backgroundImage: {
        ...gradients
      }
    }
  },
  plugins: require('./plugins')
}
