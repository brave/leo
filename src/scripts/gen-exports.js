import fs from 'fs/promises'
import path from 'path'
import { parseArgs } from 'util'
import { componentDetails, getSvelteFiles, isModuleMain } from './common.js'

const PACKAGE_JSON_PATH = './package.json'
const COMPONENTS_FOLDER = './src/components'

const TAILWIND_PRODUCTS = [
  'android',
  'browser',
  'ios',
  'marketing',
  'news',
  'newtab',
  'search',
  'web3'
]

const svelteEntry = (target) => ({
  types: `${target}.d.ts`,
  svelte: target,
  default: target
})

const getFlatSvelteExports = async () => {
  const entries = {}
  const sources = {}

  for await (const file of getSvelteFiles(COMPONENTS_FOLDER, false)) {
    const { fileName } = componentDetails(file)
    const relativePath = path
      .relative(COMPONENTS_FOLDER, file)
      .split(path.sep)
      .join('/')
    const key = `./svelte/${fileName}`

    if (sources[key]) {
      throw new Error(
        `Components ${sources[key]} and ${relativePath} would both be exported as ${key}`
      )
    }

    sources[key] = relativePath
    entries[key] = svelteEntry(`./svelte/components/${relativePath}`)
  }

  return Object.fromEntries(
    Object.entries(entries).sort(([a], [b]) => a.localeCompare(b))
  )
}

export const generateExports = async () => ({
  './package.json': './package.json',
  './svelte/components/*.svelte': svelteEntry('./svelte/components/*.svelte'),
  ...(await getFlatSvelteExports()),
  './svelte/*': './svelte/*',
  './react/*.js': './react/*.js',
  './react/*': {
    types: './react/*.d.ts',
    default: './react/*.js'
  },
  './web-components/*.js': './web-components/*.js',
  './web-components/*': {
    types: './web-components/*.d.ts',
    default: './web-components/*.js'
  },
  './icons/meta': {
    types: './icons/meta.d.ts',
    default: './icons/meta.js'
  },
  './icons/*': './icons/*',
  './icons-skia/*': './icons-skia/*',
  './icons-sf/*': './icons-sf/*',
  './tokens/tailwind': './tokens/tailwind/index.js',
  ...Object.fromEntries(
    TAILWIND_PRODUCTS.map((product) => [
      `./tokens/tailwind/${product}`,
      `./tokens/tailwind/${product}/index.js`
    ])
  ),
  './tokens/*': './tokens/*'
})

const run = async ({ check }) => {
  const current = await fs.readFile(PACKAGE_JSON_PATH, 'utf-8')
  const packageJson = JSON.parse(current)
  packageJson.exports = await generateExports()
  const updated = `${JSON.stringify(packageJson, null, 2)}\n`

  if (current === updated) {
    console.log('package.json exports are up to date')
    return
  }

  if (check) {
    console.error(
      'package.json exports are out of date. Run `pnpm run gen-exports` and commit the result.'
    )
    process.exit(1)
  }

  await fs.writeFile(PACKAGE_JSON_PATH, updated)
  console.log('Updated package.json exports')
}

if (isModuleMain(import.meta.url)) {
  const { values } = parseArgs({
    options: { check: { type: 'boolean' } }
  })
  run(values)
}
