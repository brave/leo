const plugins: string[] = []

// Prevent global issues with TS
;(function () {
  const { readdirSync } = require('fs')
  const { parse } = require('path')

  for (const file of readdirSync(__dirname, { withFileTypes: true })) {
    const { name } = parse(file.name)
    if (file.isFile() && name !== 'index' && !name.startsWith('_')) {
      plugins.push(name)
    }
  }
})()

module.exports = plugins.map((file) => {
  return require(`./${file}`)
})
