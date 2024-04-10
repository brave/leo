const acceptedTypes = [
  'color',
  'dimension',
  'custom-radius',
  'custom-shadow',
  'custom-gradient',
  'custom-spacing',
  'number'
]

module.exports = (token) => acceptedTypes.includes(token.type)
