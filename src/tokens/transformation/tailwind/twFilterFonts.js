const acceptedTypes = ['font', 'custom-fontStyle']

module.exports = (token) => acceptedTypes.includes(token.type)
