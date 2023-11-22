const fs = require('fs/promises')
const path = require('path')
const { getSvelteFiles } = require('./common')

const REACT_BINDINGS_DIRECTORY = 'react/'
fs.mkdir(REACT_BINDINGS_DIRECTORY, { recursive: true })

const COMPONENT_PREFIX = 'leo'
const SVELTE_REACT_WRAPPER_PATH = '../shared/svelte-react.js'

const getEventsTypeDefinition = (
  componentName,
  componentEventNames,
  svelteFilePath
) => `
export type ${componentName}EventProps = EventProps<{
${componentEventNames
  .map(
    ({ eventName, detailType }) =>
      `  ${eventName}?: (event: ${detailType}) => void`
  )
  .join(';\n')}
}>
`

const findEventsTypeDefinition = async (svelteFilePath, componentName) => {
  const pathToType = path.join(
    __dirname,
    '../../',
    'types',
    path.relative('./', svelteFilePath + '.d.ts')
  )
  const fileContents = await fs.readFile(pathToType)

  const typeRegex = /\s+([a-zA-Z0-9]+): (CustomEvent<((.|\n)*?)>)/gm

  const componentEventNames = [
    ...fileContents.toString().matchAll(typeRegex)
  ].map((match) => ({
    eventName: `on${match[1]}`,
    detailType: match[2]
  }))

  if (componentEventNames.length > 0) {
    return getEventsTypeDefinition(
      componentName,
      componentEventNames,
      svelteFilePath
    )
  }

  return ''
}

const getComponentGenerics = async (svelteFilePath, componentName) => {
  const relativePath = path.relative('./src/components', svelteFilePath)
  const typingsPath =
    path.join('./types/src/components', relativePath) + '.d.ts'
  const typingsContents = await fs.readFile(typingsPath)
  const genericsMatcher = new RegExp(
    `${componentName}<(.*)> extends SvelteComponentTyped`,
    'gm'
  )

  const result = genericsMatcher.exec(typingsContents)
  if (!result) return []

  return (
    result[1]
      // Note: This will break if we have multiple, nested generic type arguments.
      .split(',')
      .map((param) => {
        const constraintStart = ' extends '
        const constraintIndex = param.indexOf(constraintStart)
        if (constraintIndex === -1) return { name: param }

        const name = param.substring(0, constraintIndex).trim()
        const constraint = param
          .substring(constraintIndex + constraintStart.length)
          .trim()
        return { name, constraint }
      })
  )
}

const getReactFileContents = async (svelteFilePath) => {
  // for example:
  // ./src/components/button/button.svelte ==> button
  // ./src/components/button/big-button/big.svelte ==> button/big-button
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
  const generics = await getComponentGenerics(svelteFilePath, componentName)
  const eventTypeDefinition = await findEventsTypeDefinition(
    svelteFilePath,
    componentName
  )
  const hasGenerics = !!generics.length
  const funcConstraints = hasGenerics
    ? `<${generics.map((g) => `${g.name} extends ${g.constraint}`).join(', ')}>`
    : ''
  const propParams = hasGenerics
    ? `<${generics.map((g) => g.name).join(', ')}>`
    : ''

  const binding = `
import SvelteToReact from '${SVELTE_REACT_WRAPPER_PATH}'
import ${componentName} from '../web-components/${fileNameWithoutExtension}.js'
export default SvelteToReact('${COMPONENT_PREFIX}-${fileNameWithoutExtension.toLowerCase()}', ${componentName});

// Reexport everything from our component, so React consumers can do anything
// the base component can do.
export * from '../web-components/${fileNameWithoutExtension}.js'
    `.trim()

  const typeDef = `
import type * as React from 'react'
import type { ReactProps, EventProps } from '../src/components/svelte-react'
import type { ${componentName}Events as SvelteEvents, ${componentName}Props as SvelteProps } from '../types/src/components/${containingFolder}/${fileName}';
${eventTypeDefinition && eventTypeDefinition}
export type ${componentName}Props${funcConstraints} = ${
    eventTypeDefinition && `${componentName}EventProps &`
  } ReactProps<SvelteProps${propParams}, SvelteEvents${propParams}>;
export default function ${componentName}React${funcConstraints}(props: React.PropsWithChildren<${componentName}Props${propParams}>): JSX.Element

// As we don't currently have type definitions for the web components, export
// the Type Definitions from the Svelte component.
export * from '../types/src/components/${containingFolder}/${fileName}'
    `.trim()

  return [binding, typeDef]
}

const createReactBinding = async (svelteFilePath) => {
  const filename = path.basename(svelteFilePath, '.svelte')

  const [binding, typeDef] = await getReactFileContents(svelteFilePath)
  await fs.writeFile(
    path.join(REACT_BINDINGS_DIRECTORY, `${filename}.js`),
    binding
  )
  await fs.writeFile(
    path.join(REACT_BINDINGS_DIRECTORY, `${filename}.d.ts`),
    typeDef
  )
}

const createReactBindings = async (rootDir) => {
  for await (const sveltePath of getSvelteFiles(
    rootDir,
    /*includeDts=*/ false
  )) {
    console.log(`Creating React Binding for ${sveltePath}`)
    await createReactBinding(sveltePath)
  }
}

module.exports = createReactBindings

if (require.main == module) {
  createReactBindings('./src/components')
}
