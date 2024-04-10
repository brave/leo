const { join } = require('path')
const { readdirSync, unlink, cpSync, rmdir, statSync } = require('fs')

const staticFilesPath = join(__dirname, './static')
const staticFiles = readdirSync(staticFilesPath)

module.exports = {
  do: function (dictionary, config) {
    const targetDir = join(config.buildPath, config.preset)
    cpSync(staticFilesPath, targetDir, { recursive: true })
  },
  undo: function (dictionary, config) {
    staticFiles.forEach((file) => {
      const target = join(config.buildPath, config.preset, file)

      if (statSync(target).isDirectory()) {
        rmdir(target)
      } else {
        unlink(target)
      }
    })
  }
}
