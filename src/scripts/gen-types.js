const svelte2tsx = require('svelte2tsx')
const fs = require('fs/promises')

const genTypes = async (options = {}) => {
  const { basePath = './', outputDir = './' } = options

  await fs.mkdir(outputDir, { recursive: true })

  await svelte2tsx.emitDts({
    libRoot: basePath,
    declarationDir: outputDir,
    svelteShimsPath: require.resolve('svelte2tsx/svelte-shims.d.ts')
  })
}

module.exports = genTypes

if (require.main == module) {
  genTypes({
    basePath: './',
    outputDir: './types'
  }).then(() => console.log('Done'))
}
