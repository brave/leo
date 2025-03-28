import { join } from 'path'
import { unlink, readFileSync, writeFileSync } from 'fs'
import postcssJs from 'postcss-js'
import postcss from 'postcss'

const cssFiles = ['variables.css']

const genPluginFilePath = (file, config) =>
  join(config.buildPath, config.preset, 'plugins', `_${file}.ts`)

export default {
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
      unlink(genPluginFilePath(file, config))
    })
  }
}
