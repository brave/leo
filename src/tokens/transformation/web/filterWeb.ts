const acceptedTypes = [
  'color',
  'dimension',
  'font',
  'custom-radius',
  'custom-fontStyle',
  'custom-shadow',
  'custom-gradient',
  'custom-spacing',
  'number'
]

export default (token) => acceptedTypes.includes(token.type)
