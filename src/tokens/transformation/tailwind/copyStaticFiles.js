import { cpSync, readdirSync, rmdir, statSync, unlink } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
