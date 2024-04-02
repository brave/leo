const { getSvelteFiles, componentDetails } = require('./common')
const path = require('path')
const fs = require('fs/promises')

const checkForEvents = async (sveltePath) => {
  const pathToType = path.join(
    __dirname,
    '../../',
    'types',
    path.relative('./', sveltePath + '.d.ts')
  )
  const fileContents = await fs.readFile(pathToType)

  const typeRegex = /\s+([a-zA-Z0-9]+): (CustomEvent<((.|\n)*?)>)/gm

  const componentEventNames = [
    ...fileContents.toString().matchAll(typeRegex)
  ].map((match) => ({
    eventName: match[1],
    detailType: match[2]
  }))

  if (componentEventNames.length) {
    const { componentName } = componentDetails(sveltePath)
    throw new Error(`The following event types are forwarded from ${componentName}
${componentEventNames.map((c) => `- ${c.eventName}`).join('\n')}
Using on: prefixed events is deprecated and should be avoided. Instead, add a callback as a prop, as you would in React.`)
  }
}

const auditComponents = async (rootDir) => {
  for await (const sveltePath of getSvelteFiles(rootDir, false)) {
    await checkForEvents(sveltePath)
  }
}

if (require.main == module) {
  auditComponents('./src/components')
}
