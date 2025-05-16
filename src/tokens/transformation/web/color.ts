import type { Transform } from 'style-dictionary/types'
import { TinyColor } from '@ctrl/tinycolor'
import referenceToName from '../common/referenceToName'
export default {
  name: 'web/color',
  type: 'value',
  filter(token) {
    return token.type === 'color'
  },
  transform({ value, referencedVariable }) {
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
