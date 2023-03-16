const fs = require('fs/promises')
const path = require('path')
const { getSvelteFiles } = require('./common')

const WEB_BINDINGS_DIRECTORY = 'web-components/'
fs.mkdir(WEB_BINDINGS_DIRECTORY, { recursive: true })

const COMPONENT_PREFIX = 'leo'
const SVELTE_WEB_WRAPPER_PATH = '../shared/svelte-web.js'

const getFileContents = async (svelteFilePath) => {
  const fileName = path.basename(svelteFilePath)
  const extension = path.extname(fileName)
  const fileNameWithoutExtension = fileName.substring(
    0,
    fileName.length - extension.length
  )
  const componentName =
    fileNameWithoutExtension[0].toUpperCase() +
    fileNameWithoutExtension.substring(1)

    const binding = `
import SvelteWeb from '${SVELTE_WEB_WRAPPER_PATH}'
import ${componentName} from '../shared/${fileNameWithoutExtension}.js'
export default SvelteWeb(${componentName}, {
    name: '${COMPONENT_PREFIX}-${fileNameWithoutExtension.toLowerCase()}',
    mode: 'open'
});

// Reexport everything from our component, so consumers can do anything the base
// component can do.
export * from '../shared/${fileNameWithoutExtension}.js'
    `.trim()

  return binding
}

const createBinding = async (svelteFilePath) => {
  const filename = path.basename(svelteFilePath, '.svelte')

  const binding = await getFileContents(svelteFilePath)
  await fs.writeFile(
    path.join(WEB_BINDINGS_DIRECTORY, `${filename}.js`),
    binding
  )
}

const createBindings = async (rootDir) => {
  for await (const sveltePath of getSvelteFiles(
    rootDir,
    /*includeDts=*/ false
  )) {
    console.log(`Creating Web Component Binding for ${sveltePath}`)
    await createBinding(sveltePath)
  }
}

module.exports = createBindings

if (require.main == module) {
  createBindings('./src/components')
}
