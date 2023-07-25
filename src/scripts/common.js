const fs = require('fs/promises')
const path = require('path')

/**
 * Recursively walks all files in a folder
 * @param {The directory to walk} dir
 * @returns {Promise<AsyncIterable<string>}
 */
async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isSymbolicLink()) continue
    if (d.isDirectory()) yield* walk(entry)
    else if (d.isFile()) yield entry
  }
}

module.exports = {
  walk,

  /**
   * Returns the paths to all Svelte files in a directory (and subdirectories).
   * @param {string} root The root folder
   * @param {boolean} includeDts Whether to include typescript definition files
   */
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
