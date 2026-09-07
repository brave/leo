import { TinyColor } from '@ctrl/tinycolor'
import referenceToName from '../common/referenceToName'
import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher(token) {
    return token.type === 'color'
  },
  transformer({ value, referencedVariable, opacity }) {
    if (referencedVariable) {
      const reference = `var(--leo-${referenceToName(referencedVariable)})`
      if (typeof opacity === 'number') {
        const percentage = Number((opacity * 100).toFixed(4))
        return `color-mix(in srgb, ${reference} ${percentage}%, transparent)`
      }
      return reference
    }
    const color = new TinyColor(value)
    if (color.getAlpha() === 1) {
      return color.toHexString(true)
    }

    return color.toRgbString()
  }
} as Transform
