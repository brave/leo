import { TinyColor } from '@ctrl/tinycolor'
import fileHeader from '../../web/fileHeader'

const getTokenValue = (token) => {
  const color = new TinyColor(token.original.value)
  if (color.getAlpha() === 1) {
    return color.toHexString()
  }

  const hex8 = color.toHex8()
  const aarrggbb = `#${hex8.slice(6, 8)}${hex8.slice(0, 6)}` // Rearrange to AARRGGBB format
  return aarrggbb
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
