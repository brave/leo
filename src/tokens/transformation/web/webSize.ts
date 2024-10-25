import { Transform } from 'style-dictionary'

export default {
  type: 'value',
  matcher({ type }) {
    return type === 'number'
  },
  transformer({ value, name }) {
    // Font weight doesn't have a unit - unfortunately we have no better
    // way of determining whether this is a font-weight than checking the name.
    const unit = name.endsWith('font-weight') ? '' : 'px'
    return `${value}${unit}`
  }
} as Transform
