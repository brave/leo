import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import postcss from 'postcss'
import postcssJs from 'postcss-js'
import type { Action } from 'style-dictionary/types'

const cssFiles = ['variables.css']

const genPluginFilePath = (file, config) =>
  join(config.buildPath, config.preset, 'plugins', `_${file}.ts`)

export default {
  name: 'tailwind/convert_css_to_js',
  do: function (dictionary, config) {
    cssFiles.forEach((file) => {
      const css = readFileSync(
        join(config.buildPath, config.preset, file),
        'utf8'
      )
      const root = postcss.parse(css)
      const cssAsJs = postcssJs.objectify(root)

      writeFileSync(
        genPluginFilePath(file, config),
        `module.exports = ${JSON.stringify(cssAsJs, null, 2)}`
      )
    })
  },
  undo: function (dictionary, config) {
    cssFiles.forEach((file) => {
      unlinkSync(genPluginFilePath(file, config))
    })
  }
} as Action
