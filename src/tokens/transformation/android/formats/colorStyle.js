const { fileHeader } = require('style-dictionary').formatHelpers
const { TinyColor } = require('@ctrl/tinycolor')

module.exports = ({ dictionary, platform, options = {}, file }) => {
  const colorStyles = dictionary.allTokens
    .filter((compositeToken) => compositeToken.type === 'color')
    .map((compositeToken) => {
      const colorCode = new TinyColor(
        compositeToken.original.value
      ).toHexString()
      return `<color name="${compositeToken.name}">${colorCode}</color>`
    })
  return `
<?xml version="1.0" encoding="utf-8"?>
${fileHeader({ file, commentStyle: 'xml' })}
<resources>
  ${colorStyles.join('\n')}
</resources>
`
}
