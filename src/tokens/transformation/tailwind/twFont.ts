import type { Transform } from 'style-dictionary/types'

export default {
  name: 'tw/font',
  type: 'value',
  filter(token) {
    return token.type === 'custom-fontStyle'
  },
  transform({ value: font }) {
    return {
      fontSize: `${font.fontSize}px`,
      lineHeight: `${font.lineHeight}px`,
      letterSpacing: `${font.letterSpacing}px`,
      fontWeight: font.fontWeight,
      fontFamily: font.fontFamily
    }
  }
} as Transform
