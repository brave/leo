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

/**
 * Gets the name of a component from its path.
 * @param {string} svelteComponentPath The path to the svelte component
 * @returns {{ fileName: string, fileNameWithoutExtension: string, componentName: string, extension: string }} The name of the component
 */
function componentDetails(svelteComponentPath) {
  const fileName = path.basename(svelteComponentPath)
  const extension = path.extname(svelteComponentPath)
  const fileNameWithoutExtension = fileName.substring(
    0,
    fileName.length - extension.length
  )
  const componentName =
    fileNameWithoutExtension[0].toUpperCase() +
    fileNameWithoutExtension.substring(1)

  return {
    fileName,
    fileNameWithoutExtension,
    componentName,
    extension
  }
}

module.exports = {
  walk,

  /**
   * Returns the paths to all Svelte files in a directory (and subdirectories).
   * @param {string} root The root folder
   * @param {boolean} includeDts Whether to include typescript definition files
   * @param {boolean} includeStories Whether to include stories
   */
  getSvelteFiles: async function* (
    root,
    includeDts = true,
    includeStories = false
  ) {
    for await (const file of await walk(root)) {
      if (
        !file.includes('.svelte') ||
        (!includeStories && file.includes('.stories.svelte')) ||
        (!includeDts && file.endsWith('.d.ts'))
      )
        continue

      yield file
    }
  },

  componentDetails
}
