const fs = require('fs/promises')
const path = require('path')

async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory()) yield* walk(entry)
    else if (d.isFile()) yield entry
  }
}

module.exports = {
  getSvelteFiles: async function* (root, includeDts = true) {
    for await (const file of await walk(root)) {
      if (
        !file.includes('.svelte') ||
        file.includes('.stories.svelte') ||
        (!includeDts && file.endsWith('.d.ts'))
      )
        continue

      yield file
    }
  }
}
