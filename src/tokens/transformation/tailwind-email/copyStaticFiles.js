import { cpSync, readdirSync, rmdir, statSync, unlink } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const staticFilesPath = path.join(dirname, './static')
const staticFiles = readdirSync(staticFilesPath)

export default {
  do: function (dictionary, config) {
    const targetDir = path.join(config.buildPath, config.preset)
    cpSync(staticFilesPath, targetDir, { recursive: true })
  },
  undo: function (dictionary, config) {
    staticFiles.forEach((file) => {
      const target = path.join(config.buildPath, config.preset, file)

      if (statSync(target).isDirectory()) {
        rmdir(target)
      } else {
        unlink(target)
      }
    })
  }
}
