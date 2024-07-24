import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher(token) {
    return token.type === 'custom-fontStyle'
  },
  transformer({ value: font }) {
    return {
      fontSize: `${font.fontSize}px`,
      lineHeight: `${font.lineHeight}px`,
      letterSpacing: `${font.letterSpacing}px`,
      fontWeight: font.fontWeight,
      fontFamily: font.fontFamily
    }
  }
} as Transform
