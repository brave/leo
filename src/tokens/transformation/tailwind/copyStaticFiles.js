import { join } from 'path'
import { readdirSync, unlink, cpSync, rmdir, statSync } from 'fs'

const staticFilesPath = join(__dirname, './static')
const staticFiles = readdirSync(staticFilesPath)

export default {
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
