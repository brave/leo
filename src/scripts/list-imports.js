const fs = require('fs')
const path = require('path')

const OUTPUT_FILE = 'sources.gni'

const COMPONENT_FOLDERS = [
    'shared',
    'web-components',
    'react'
]

for (const folder of COMPONENT_FOLDERS) {
    const files = []
    const dir = fs.readdirSync(folder)
    for (const file of dir) {
        if (!file.endsWith('.js')) continue
        files.push(path.join(folder, file))
    }
    fs.writeFileSync(path.join(folder, OUTPUT_FILE), `leo_${folder.replace('-', '_')}_sources = ${JSON.stringify(files, null, 2)}`)
}


