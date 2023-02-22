const fs = require('fs/promises')
const path = require('path')
const skiafy = require('./icons/skiafy')

const ICONS_FOLDER = 'icons/'
const OUTPUT_FOLDER = 'icons-skia/'

fs.mkdir(OUTPUT_FOLDER, { recursive: true })
  .then(() => fs.readdir(ICONS_FOLDER))
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
      await fs.writeFile(path.join(OUTPUT_FOLDER, outputFileName), skiaContent)
    })
  )
