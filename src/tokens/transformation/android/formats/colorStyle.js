import StyleDictionary from 'style-dictionary'
import { TinyColor } from '@ctrl/tinycolor'
const { fileHeader } = StyleDictionary.formatHelpers

const getTokenValue = (token) => {
  const color = new TinyColor(token.original.value)
  if (color.getAlpha() === 1) {
    return color.toHexString()
  }
  return color.toHex8String()
}

export default ({ dictionary, platform, options = {}, file }) => {
  const colorStyles = dictionary.allTokens
    .filter((compositeToken) => compositeToken.type === 'color')
    .map((compositeToken) => {
      const colorCode = getTokenValue(compositeToken)
      return `  <color name="${compositeToken.name}" tools:ignore="UnusedResources">${colorCode}</color>`
    })
  return `<?xml version="1.0" encoding="utf-8" ?>
${fileHeader({ file, commentStyle: 'xml' })}
<resources xmlns:tools="http://schemas.android.com/tools">
${colorStyles.join('\n')}
</resources>
`
}
