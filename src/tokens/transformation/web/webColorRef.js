const TinyColor = require('@ctrl/tinycolor')

module.exports = {
  /**
   * @param {'tw' | 'leo'} ns
   * @param {string} colorString
   * @returns {string}
   */
  formatColor(ns, colorString) {
    if (colorString.startsWith('$')) {
      const name = `--${ns}-` + colorString.substring(1).split('.').join('-')
      return `var(${name})`
    }
    return new TinyColor.TinyColor(colorString).toRgbString()
  }
}
