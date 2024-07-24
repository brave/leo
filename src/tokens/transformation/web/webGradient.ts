import { TinyColor } from '@ctrl/tinycolor'
import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-gradient'
  },
  transformer: function ({ value }) {
    value = Array.isArray(value) ? value : [value]
    return value.map((v) => formatGradient(v)).join(', ')
  }
} as Transform

function formatGradient(value) {
  const stopsString = value.stops
    .map((stop) => {
      return `${new TinyColor(stop.color).toRgbString()} ${
        stop.position * 100
      }%`
    })
    .join(', ')
  if (value.gradientType === 'linear') {
    return `linear-gradient(${value.rotation}deg, ${stopsString})`
  }
  if (value.gradientType === 'radial') {
    return `radial-gradient(${stopsString})`
  }
}
