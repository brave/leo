import StyleDictionary from 'style-dictionary'
import { TinyColor } from '@ctrl/tinycolor'
const { fileHeader } = StyleDictionary.formatHelpers

export default ({ dictionary, platform, options = {}, file }) => {
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
