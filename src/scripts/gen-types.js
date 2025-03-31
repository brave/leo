import fs from 'fs/promises'
import path from 'path'
import svelte2tsx from 'svelte2tsx'
import { fileURLToPath } from 'url'

const genTypes = async (options = {}) => {
  const { basePath = './', outputDir = './' } = options

  await fs.mkdir(outputDir, { recursive: true })

  await svelte2tsx.emitDts({
    libRoot: basePath,
    declarationDir: outputDir,
    svelteShimsPath: path.resolve('svelte2tsx/svelte-shims.d.ts')
  })
}

export default genTypes

// Check if this module is being run directly
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url)
  if (process.argv[1] === modulePath) {
    genTypes({
      basePath: './',
      outputDir: './types'
    }).then(() => console.log('Done'))
  }
}
