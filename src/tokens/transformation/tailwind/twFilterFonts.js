const acceptedTypes = ['font', 'custom-fontStyle']
const disallowedPathParts = ['android', 'ios']

module.exports = (token) =>
  acceptedTypes.includes(token.type) &&
  token.attributes.type !== 'browser' &&
  !token.path.toString().includes('android') &&
  !token.path.toString().match(new RegExp(`(${disallowedPathParts.join('|')})`))
