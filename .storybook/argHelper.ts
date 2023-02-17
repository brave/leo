export const getStyleFromArgs = (args) =>
  Object.entries(args)
    .filter(([key]) => key.startsWith('--leo-'))
    .reduce((prev, [key, value]) => prev + `${key}: ${value || 'unset'}; `, '')

export const getNonStyleArgs = (args) =>
  Object.entries(args)
    .filter(([key]) => !key.startsWith('--leo-'))
    .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {})
