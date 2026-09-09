import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getTokenName } from './colorName'
import { needsColorSelector } from './colorSelector'

const outputDirectories = ['color', 'color-night']

const selector = (color, alpha) => `<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:color="${color}" android:alpha="${alpha}" />
</selector>
`

const clearOutputDirectories = (config) => {
  for (const directory of outputDirectories) {
    rmSync(path.join(config.buildPath, directory), {
      recursive: true,
      force: true
    })
  }
}

export default {
  do(dictionary, config) {
    clearOutputDirectories(config)

    const composedColors = dictionary.allTokens.filter(needsColorSelector)

    for (const token of composedColors) {
      const directory = token.path.includes('dark') ? 'color-night' : 'color'
      mkdirSync(path.join(config.buildPath, directory), { recursive: true })

      writeFileSync(
        path.join(config.buildPath, directory, `${token.name}.xml`),
        selector(
          `@color/${getTokenName(token.referencedVariable)}`,
          token.opacity
        )
      )
    }
  },

  undo(dictionary, config) {
    clearOutputDirectories(config)
  }
}
