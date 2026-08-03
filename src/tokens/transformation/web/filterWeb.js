const acceptedTypes = [
  'color',
  'dimension',
  'font',
  'custom-radius',
  'custom-fontStyle',
  'custom-shadow',
  'custom-gradient',
  'custom-spacing',
  'custom-duration',
  'custom-easing',
  'number'
]

export default (token) => acceptedTypes.includes(token.type)
