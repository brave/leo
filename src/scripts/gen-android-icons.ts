import fs from 'fs/promises'
import path from 'path'
import svg2vectordrawable from 'svg2vectordrawable'

const ICONS_FOLDER = 'icons/'
const OUTPUT_FOLDER = './tokens/android/drawable/'

fs.mkdir(OUTPUT_FOLDER, { recursive: true })
  .then(() => fs.readdir(ICONS_FOLDER))
  .then((icons) => icons.filter((i) => i.endsWith('.svg')))
  .then((icons) =>
    icons.map(async (icon) => {
      const svgContent = await fs.readFile(path.join(ICONS_FOLDER, icon), {
        encoding: 'utf8'
      })
      svg2vectordrawable(svgContent).then((vectorContent) => {
        const outputFileName = `ic_${path
          .basename(icon, '.svg')
          .replaceAll('-', '_')}.xml`
        fs.writeFile(path.join(OUTPUT_FOLDER, outputFileName), vectorContent)
      })
    })
  )
