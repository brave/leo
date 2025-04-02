import fs from 'fs/promises'
import path from 'path'
import { getSvelteFiles, isModuleMain } from './common.js'

const WEB_BINDINGS_DIRECTORY = 'web-components/'
fs.mkdir(WEB_BINDINGS_DIRECTORY, { recursive: true })

const COMPONENT_PREFIX = 'leo'
const SVELTE_WEB_WRAPPER_PATH = '../shared/svelte-web.js'

const getFileContents = async (svelteFilePath) => {
  const containingFolder = path.relative(
    './src/components',
    path.resolve(svelteFilePath, '../')
  )

  const fileName = path.basename(svelteFilePath)
  const extension = path.extname(fileName)
  const fileNameWithoutExtension = fileName.substring(
    0,
    fileName.length - extension.length
  )
  const componentName =
    fileNameWithoutExtension[0].toUpperCase() +
    fileNameWithoutExtension.substring(1)

  const elementName = `${COMPONENT_PREFIX}-${fileNameWithoutExtension.toLowerCase()}`

  const binding = `
import SvelteWeb from '${SVELTE_WEB_WRAPPER_PATH}'
import ${componentName} from '../shared/${fileNameWithoutExtension}.js'
export default SvelteWeb(${componentName}, {
    name: '${elementName}',
    mode: 'open'
});

// Reexport everything from our component, so consumers can do anything the base
// component can do.
export * from '../shared/${fileNameWithoutExtension}.js'
    `.trim()

  const typeDefinitions = `
export default undefined
export * from '../types/src/components/${containingFolder}/${fileName}'
`

  return [binding, typeDefinitions]
}

const createBinding = async (svelteFilePath) => {
  const filename = path.basename(svelteFilePath, '.svelte')

  const [binding, typeDefinitions] = await getFileContents(svelteFilePath)
  await fs.writeFile(
    path.join(WEB_BINDINGS_DIRECTORY, `${filename}.js`),
    binding
  )
  await fs.writeFile(
    path.join(WEB_BINDINGS_DIRECTORY, `${filename}.d.ts`),
    typeDefinitions
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

export default createBindings

// Check if this module is being run directly
if (isModuleMain(import.meta.url)) {
  createBindings('./src/components')
}
