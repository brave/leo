import { TinyColor } from '@ctrl/tinycolor'
import { fileHeader } from 'style-dictionary/utils'

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
