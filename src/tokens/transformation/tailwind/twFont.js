const notDefault = (value, defaultValue) => (value !== defaultValue) ? value : ''

const fontFamily = ({ fontFamily }, { fontFamilies } = {}) => fontFamilies && fontFamilies[fontFamily] ? fontFamilies[fontFamily] : fontFamily

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-fontStyle'
  },
  transformer: function ({ value: font }, { options }) {
    return {
      fontSize: `${font.fontSize}px`,
      lineHeight: `${font.lineHeight}px`,
      letterSpacing: `${font.letterSpacing}px`,
      fontWeight: font.fontWeight
    }
  }
}
