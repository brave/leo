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
