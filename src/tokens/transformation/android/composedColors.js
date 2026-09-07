import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { TinyColor } from '@ctrl/tinycolor'
import { getTokenName } from './colorName'

const outputDirectories = [
  'color',
  'color-night',
  'color-v23',
  'color-night-v23'
]

const isComposedColor = (token) =>
  token.type === 'color' &&
  token.referencedVariable &&
  typeof token.opacity === 'number' &&
  !token.name.includes('ios_browser')

const androidColor = (value) => {
  const color = new TinyColor(value)
  if (color.getAlpha() === 1) return color.toHexString()

  const hex8 = color.toHex8()
  return `#${hex8.slice(6, 8)}${hex8.slice(0, 6)}`
}

const selector = (color, opacity) => `<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:color="${color}"${opacity === undefined ? '' : ` android:alpha="${opacity}"`} />
</selector>
`

export default {
  do(dictionary, config) {
    for (const directory of outputDirectories) {
      rmSync(path.join(config.buildPath, directory), {
        recursive: true,
        force: true
      })
    }

    const composedColors = dictionary.allTokens.filter(isComposedColor)

    for (const token of composedColors) {
      const isDark = token.path.includes('dark')
      const fallbackDirectory = isDark ? 'color-night' : 'color'
      const dynamicDirectory = isDark ? 'color-night-v23' : 'color-v23'
      const filename = `${token.name}.xml`

      for (const directory of [fallbackDirectory, dynamicDirectory]) {
        mkdirSync(path.join(config.buildPath, directory), { recursive: true })
      }

      writeFileSync(
        path.join(config.buildPath, fallbackDirectory, filename),
        selector(androidColor(token.original.value))
      )
      writeFileSync(
        path.join(config.buildPath, dynamicDirectory, filename),
        selector(
          `@color/${getTokenName(token.referencedVariable)}`,
          token.opacity
        )
      )
    }
  },

  undo(dictionary, config) {
    for (const directory of outputDirectories) {
      rmSync(path.join(config.buildPath, directory), {
        recursive: true,
        force: true
      })
    }
  }
}
