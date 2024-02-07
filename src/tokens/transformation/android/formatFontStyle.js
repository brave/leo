const { fileHeader } = require('style-dictionary').formatHelpers
const changeCase = require('change-case')

const letterSpacingToFloat = (letterSpacing, fontSize) =>
  1 + letterSpacing / fontSize

const printDescription = (description) =>
  description && description !== '' && description !== null
    ? `    <!-- ${description} -->\n`
    : ''

module.exports = ({ dictionary, platform, options = {}, file }) => {
  const fontStyles = dictionary.allTokens
    .filter((compositeToken) => compositeToken.type === 'custom-fontStyle')
    // create style
    .map((compositeToken) => {
      return (
        `  <style name="${changeCase.pascalCase(compositeToken.name.replace("font_android_", ""))}">\n` +
        printDescription(compositeToken.description) +
        `    <item name="android:fontFamily">${
          options.fontFamilies[compositeToken.original.value.fontFamily]
        }</item>\n` +
        `    <item name="android:textSize">@dimen/${changeCase.snakeCase(compositeToken.name.replace("font_android_", ""))}</item>\n` +
        `    <item name="android:lineHeight">${compositeToken.original.value.lineHeight}sp</item>\n` +
        `    <item name="android:letterSpacing">${letterSpacingToFloat(
          compositeToken.original.value.letterSpacing,
          compositeToken.original.value.fontSize
        )}</item>\n` +
        `    <item name="fontStyle">${compositeToken.original.value.fontStyle}</item>\n` +
        `    <item name="fontWeight">${compositeToken.original.value.fontWeight}</item>\n` +
        '  </style>\n'
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
