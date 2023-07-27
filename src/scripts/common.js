const { Dirent } = require('fs')
const fs = require('fs/promises')
const path = require('path')

/**
 * Recursively walks all files in a folder
 * @param {string} dir The directory to walk
 * @param {((name: string, path: string, entry: Dirent) => boolean)?} skip A function for filtering out entries
 * @returns {Promise<AsyncIterable<string>}
 */
async function* walk(dir, skip) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name)

    // Allow the consumer to filter out files/folders.
    if (skip && skip(d.name, entry, d)) continue

    if (d.isDirectory()) yield* walk(entry, skip)
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
