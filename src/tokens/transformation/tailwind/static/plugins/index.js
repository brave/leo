const { readdirSync } = require('fs')
const { parse, extname } = require('path')

const plugins = []

const currentFileExt = extname(__filename)

for (const file of readdirSync(__dirname, { withFileTypes: true })) {
  const { name } = parse(file.name)
  const pluginFileExt = extname(file.name)

  if (
    file.isFile() &&
    name !== 'index' &&
    !name.startsWith('_') &&
    pluginFileExt === currentFileExt
  ) {
    plugins.push(name)
  }
}

module.exports = plugins.map((file) => {
  return require(`./${file}`)
})
