import fs from 'fs/promises'
import path from 'path'
import svelte2tsx from 'svelte2tsx'
import { isModuleMain } from './common.js'

const genTypes = async (options = {}) => {
  const { basePath = './', outputDir = './' } = options

  await fs.mkdir(outputDir, { recursive: true })

  await svelte2tsx.emitDts({
    libRoot: basePath,
    declarationDir: outputDir,
    svelteShimsPath: path.resolve('node_modules/svelte2tsx/svelte-shims.d.ts')
  })
}

export default genTypes

// Check if this module is being run directly
if (isModuleMain(import.meta.url)) {
  genTypes({
    basePath: './',
    outputDir: './types'
  }).then(() => console.log('Done'))
}
