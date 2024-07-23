import { TinyColor } from '@ctrl/tinycolor'
import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher: ({ type }) => type === 'color',
  transformer: ({ value }) => {
    const { r, g, b, a } = new TinyColor(value).toRgb()
    const parts = [a !== 1 && Math.round(a * 255), r, g, b]
      .filter((c) => c !== false)
      .map((c) => '0x' + Number(c).toString(16).padStart(2, '0').toUpperCase())

    const func = parts.length === 3 ? 'SkColorSetRGB' : 'SkColorSetARGB'
    return `${func}(${parts.join(', ')})`
  }
} as Transform
