const { fileHeader } = require('style-dictionary').formatHelpers
const changeCase = require('change-case')

module.exports = ({ dictionary, platform, options = {}, file }) => {
  const fontStyles = dictionary.allTokens
    .filter((compositeToken) => compositeToken.type === 'custom-fontStyle')
    .map((compositeToken) => {
      return (
        ` <dimen name="${changeCase.snakeCase(compositeToken.name.replace("font_android_", ""))}">${compositeToken.original.value.fontSize}sp</dimen>`
      )
    })
  return (
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    fileHeader({ file, commentStyle: 'xml' }) +
    '\n<resources>\n' +
    fontStyles.join('\n') +
    '\n</resources>\n'
  )
}