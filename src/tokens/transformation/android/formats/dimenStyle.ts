import type { Format } from 'style-dictionary/types'
import { fileHeader } from 'style-dictionary/utils'

export default {
  name: 'android/formatDimenStyle',
  format: ({ dictionary, platform, options = {}, file }) => {
    const fontStyles = dictionary.allTokens
      .filter((compositeToken) => compositeToken.type === 'custom-fontStyle')
      .map((compositeToken) => {
        const dimenName = compositeToken.name.replace('font_android_', '')
        return ` <dimen name="${dimenName}">${compositeToken.value}</dimen>`
      })
    return `
<?xml version="1.0" encoding="utf-8"?>
${fileHeader({ file, commentStyle: 'xml' })}
<resources>
  ${fontStyles.join('\n')}
</resources>
`
  }
} as Format
