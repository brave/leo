const fs = require('fs/promises')
const path = require('path')

const ICONS_FOLDER = 'icons/'
const OUTPUT_FOLDER = 'icons-skia/'

import('skiafy').then(async ({ default: skiafy }) => {
  await fs.mkdir(OUTPUT_FOLDER, { recursive: true })

  const skiafyPromise = await fs
    .readdir(ICONS_FOLDER)
    .then((icons) => icons.filter((i) => i.endsWith('.svg')))
    .then((icons) =>
      icons.map(async (icon) => {
        const svgContent = await fs.readFile(path.join(ICONS_FOLDER, icon), {
          encoding: 'utf8'
        })
        const skiaContent = skiafy(svgContent)
        const outputFileName = `leo_${path
          .basename(icon, '.svg')
          .replace('-', '_')}.icon`
        await fs.writeFile(
          path.join(OUTPUT_FOLDER, outputFileName),
          skiaContent
        )
      })
    )

  await Promise.all(skiafyPromise)
})
