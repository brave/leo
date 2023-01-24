const camelCase = require('lodash.camelcase')
const fileHeader = require('../web/fileHeader')

const THEMED_COLOR_GROUP_PARENT_KEYS = ['color', 'legacy']

function isToken (tokenOrTokenCategory) {
  return !!tokenOrTokenCategory.type
}

function cleanKey (key) {
  return camelCase(key.trim())
}

function removeSegmentFromNameInAllTokens(tokenCategory, nameSegment) {
  const result = {}
  for (const key in tokenCategory) {
    const value = tokenCategory[key]
    if (isToken(value)) {
      result[key] = {
        ...tokenCategory[key],
        name: tokenCategory[key].name?.replace(`-${nameSegment}-`, '-')
      }
      continue
    }
    result[key] = removeSegmentFromNameInAllTokens(value, nameSegment)
  }
  return result
}

function formattedVariables (properties) {
  const result = {}
  for (const key in properties) {
    let value = properties[key]
    if (!isToken(value)) {
      // If we are a collection of colors, which we have dark and light versions
      // of, then we should also provide a theme-less version of the properties
      // (i.e. without the 'dark' and 'light' parts of the name)
      // as that is what the css variable formatter does too.
      // TODO(petemill): This is ugly, there's got to be a cleaner way, or at least centralize this between
      // web, tailwind and styled-components.
      const hasDarkAndLightChildGroups = !!value.dark && !!value.light
      if (THEMED_COLOR_GROUP_PARENT_KEYS.includes(key) && hasDarkAndLightChildGroups) {
        value = {
          ...value,
          ...removeSegmentFromNameInAllTokens(value['light'], 'light')
        }
      }
      result[cleanKey(key)] = formattedVariables(value)
      continue
    }
    let name = value.name
    result[cleanKey(key)] = 'var(--' + name + ')'
  }
  return result
}

module.exports = ({ dictionary, file }) => {
  const themeObject = formattedVariables(dictionary.properties)
  return fileHeader({ file }) +
    'export default ' + JSON.stringify(themeObject, null, 2)
}
