import { TinyColor } from '@ctrl/tinycolor'
import { Transform } from 'style-dictionary'
import { transformName } from './name'
import referenceToName from '../common/referenceToName'

export default {
  type: 'value',
  matcher: ({ type }) => type === 'color',
  transformer: ({ value, referencedVariable }) => {
    if (referencedVariable) {
      return transformName({
        name: referenceToName(referencedVariable)
      })
    }

    const { r, g, b, a } = new TinyColor(value).toRgb()
    const parts = [a !== 1 && Math.round(a * 255), r, g, b]
      .filter((c) => c !== false)
      .map((c) => '0x' + Number(c).toString(16).padStart(2, '0').toUpperCase())

    const func = parts.length === 3 ? 'SkColorSetRGB' : 'SkColorSetARGB'
    return `${func}(${parts.join(', ')})`
  }
} as Transform
