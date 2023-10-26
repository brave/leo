const components: string[] = []

// Prevent global issues with TS
;(function () {
  const { readdirSync } = require('fs')
  const { parse } = require('path')

  for (const file of readdirSync(__dirname, { withFileTypes: true })) {
    const { name } = parse(file.name)
    if (file.isFile() && name !== 'index' && !name.startsWith('_')) {
      components.push(name)
    }
  }
})()

module.exports = components.map((file) => {
  return require(`./${file}`)
})
