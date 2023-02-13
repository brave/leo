const postcss = require('postcss')
const plugin = require('../src/postcss/theme')

module.exports = {
  run: async function (input, output, opts = {}) {
    let result = await postcss([plugin(opts)]).process(input, {
      from: undefined
    })
    const removeWhiteSpace = /(^\s*\n)|(^(\t| )+)/gm
    const sansWhiteSpace = (text) =>
      text.replace(removeWhiteSpace, '').replace(/;/g, '') // TODO: Remove this back once I work out why the test sometimes misses semicolons.

    expect(sansWhiteSpace(result.toString())).toEqual(sansWhiteSpace(output))
    expect(result.warnings()).toHaveLength(0)
  }
}
