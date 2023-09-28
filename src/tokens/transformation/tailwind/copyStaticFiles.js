const { join } = require('path')
const { readdirSync, unlink, cpSync, rmdir, statSync } = require('fs')

const staticFilesPath = join(__dirname, './static')
const staticFiles = readdirSync(staticFilesPath)

module.exports = {
  do: function (dictionary, config) {
    cpSync(staticFilesPath, config.buildPath, { recursive: true })
  },
  undo: function (dictionary, config) {
    staticFiles.forEach((file) => {
      const target = join(config.buildPath, file)

      if (statSync(target).isDirectory()) {
        rmdir(target)
      } else {
        unlink(target)
      }
    })
  }
}
