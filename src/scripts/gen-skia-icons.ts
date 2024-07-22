import fs from 'fs/promises'
import path from 'path'
import skiafy from './icons/skiafy.js'

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
        .replaceAll('-', '_')}.icon`
      await fs.writeFile(path.join(OUTPUT_FOLDER, outputFileName), skiaContent)
    })
  )
