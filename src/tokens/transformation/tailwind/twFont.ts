import { Transform } from 'style-dictionary'
import { fontFamily } from '../common/fontHelper'

export default {
  type: 'value',
  matcher(token) {
    return token.type === 'custom-fontStyle'
  },
  transformer({ value: font }, platform) {
    return {
      fontSize: `${font.fontSize}px`,
      lineHeight: `${font.lineHeight}px`,
      letterSpacing: `${font.letterSpacing}px`,
      fontWeight: font.fontWeight,
      fontFamily: fontFamily(font, platform?.options as any)
    }
  }
} as Transform
