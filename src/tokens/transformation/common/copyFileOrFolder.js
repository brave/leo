import fs from 'node:fs'

export default {
  do: function (dictionary, config) {
    config.options.copyFilesAction.forEach(({ destination, origin }) => {
      console.log(`Copying ${origin} to ${destination}`)
      fs.cpSync(origin, destination, { recursive: true })
    })
  },
  undo: function (dictionary, config) {
    config.options.copyFilesAction.forEach(({ destination, origin }) => {
      console.log(`Cleaning ${destination}`)
      fs.rmSync(destination, { recursive: true, force: true })
    })
  }
}
