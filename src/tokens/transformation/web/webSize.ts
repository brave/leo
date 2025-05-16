import type { Transform } from 'style-dictionary/types'

export default {
  name: 'web/size',
  type: 'value',
  filter({ type }) {
    return type === 'number'
  },
  transform({ value, name }) {
    // Font weight doesn't have a unit - unfortunately we have no better
    // way of determining whether this is a font-weight than checking the name.
    const unit = name.endsWith('font-weight') ? '' : 'px'
    return `${value}${unit}`
  }
} as Transform
