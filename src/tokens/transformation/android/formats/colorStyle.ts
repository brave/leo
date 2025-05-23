import { TinyColor } from '@ctrl/tinycolor'
import type { Format } from 'style-dictionary/types'
import { fileHeader } from 'style-dictionary/utils'

export default {
  name: 'android/formatColorStyle',
  format: ({ dictionary, platform, options = {}, file }) => {
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
} as Format
