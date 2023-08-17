module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'number'
  },
  transformer: function ({ value }) {
    return `${value}px`
  }
}
