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
        `  <style name="${changeCase.pascalCase(
          compositeToken.name.replace('font_android_', '')
        )}">\n` +
        printDescription(compositeToken.description) +
        `    <item name="android:fontFamily">@font/${changeCase.snakeCase(
          compositeToken.original.value.fontFamily
        )}</item>\n` +
        `    <item name="android:textSize">@dimen/${changeCase.snakeCase(
          compositeToken.name.replace('font_android_', '')
        )}</item>\n` +
        // for android:lineHeight requires API level 28 and current api is 26
        `    <item name="lineHeight">${compositeToken.original.value.lineHeight}sp</item>\n` +
        // Commenting the changes, we need to fix the conversion
        // `    <item name="android:letterSpacing">${letterSpacingToFloat(
        //   compositeToken.original.value.letterSpacing,
        //   compositeToken.original.value.fontSize
        // )}</item>\n` +
        `    <item name="fontStyle">${compositeToken.original.value.fontStyle}</item>\n` +
        `    <item name="fontWeight">${compositeToken.original.value.fontWeight}</item>\n` +
        '  </style>\n'
      )
    })
  return `
<?xml version="1.0" encoding="utf-8"?>
${fileHeader({ file, commentStyle: 'xml' })}
<resources>
  ${fontStyles.join('\n')}
</resources>
`
}
