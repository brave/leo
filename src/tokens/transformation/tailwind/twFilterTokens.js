const acceptedTypes = [
  'color',
  'dimension',
  'custom-radius',
  'custom-shadow',
  'custom-gradient',
  'custom-spacing',
  'number'
]
const disallowedPathParts = ['android', 'ios']

module.exports = (token) =>
  acceptedTypes.includes(token.type) &&
  !token.path.toString().includes('android') &&
  !token.path.toString().match(new RegExp(`(${disallowedPathParts.join('|')})`))
