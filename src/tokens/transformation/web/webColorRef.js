import { TinyColor } from '@ctrl/tinycolor'

/**
 * @param {'tw' | 'leo'} ns
 * @param {string} colorString
 * @returns {string}
 */
export function formatColor(ns, colorString) {
  if (colorString.startsWith('$')) {
    const name = `--${ns}-` + colorString.substring(1).split('.').join('-')
    return `var(${name})`
  }
  return new TinyColor(colorString).toRgbString()
}
