const plugin = require('tailwindcss/plugin')
const variables = require('./variables.css.js')
const fonts = require('./fonts.js')

module.exports = plugin(function ({ addBase }) {
  addBase({
    ...fonts,
    ...variables
  })
})
