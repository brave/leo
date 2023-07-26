const { join } = require('path')
const { unlink, readFileSync, writeFileSync } = require('fs')
const postcssJs = require('postcss-js')
const postcss = require('postcss')

const cssFiles = ['variables.css']

const genPluginFilePath = (file, config) =>
  join(config.buildPath, 'plugins', `_${file}.ts`)

module.exports = {
  do: function (dictionary, config) {
    cssFiles.forEach((file) => {
      const css = readFileSync(join(config.buildPath, file), 'utf8')
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
