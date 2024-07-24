import { TinyColor } from '@ctrl/tinycolor'
import referenceToName from '../common/referenceToName'
import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher(token) {
    return token.type === 'color'
  },
  transformer({ value, referencedVariable }) {
    if (referencedVariable) {
      return `var(--leo-${referenceToName(referencedVariable)})`
    }
    const color = new TinyColor(value)
    if (color.getAlpha() === 1) {
      return color.toHexString(true)
    }

    return color.toRgbString()
  }
} as Transform
