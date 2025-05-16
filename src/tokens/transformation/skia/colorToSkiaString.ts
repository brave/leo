import { TinyColor } from '@ctrl/tinycolor'
import type { Transform } from 'style-dictionary/types'
import referenceToName from '../common/referenceToName'
import { transformName } from './name'

export default {
  name: 'color/hex8ToSkiaString',
  type: 'value',
  filter: ({ type }) => type === 'color',
  transform: ({ value, referencedVariable }) => {
    if (referencedVariable) {
      return transformName({
        name: referenceToName(referencedVariable)
      })
    }

    const { r, g, b, a } = new TinyColor(value).toRgb()
    const parts = [a !== 1 && Math.round(a * 255), r, g, b]
      .filter((c: number | boolean) => c !== false)
      .map((c) => '0x' + Number(c).toString(16).padStart(2, '0').toUpperCase())

    const func = parts.length === 3 ? 'SkColorSetRGB' : 'SkColorSetARGB'
    return `${func}(${parts.join(', ')})`
  }
} as Transform
