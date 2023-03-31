const fs = require('fs/promises')
const path = require('path')
const { JSDOM } = require('jsdom')
const paper = require('paper-jsdom')
const { CompoundPath } = paper
paper.setup()

const TEMPLATE_PATH = path.join(__dirname, 'icons', 'sf-icon.svg.tmpl')
const ICONS_FOLDER = 'icons/'
const OUTPUT_FOLDER = 'icons-sf/'

function processIcon(template, svgContents) {
  const {
    window: { document }
  } = new JSDOM(svgContents)

  const paperSVG = paper.project.importSVG(document.querySelector('svg'))
  for (const path of paperSVG.getItems({ class: CompoundPath })) {
    path.reorient()
  }

  const resultSVG = paperSVG.exportSVG()
  for (const path of resultSVG.querySelectorAll('path')) {
    if (path.hasAttribute('fill-rule'))
      path.setAttribute('fill-rule', 'nonzero')
  }

  const paths = resultSVG.querySelectorAll('svg > *')
  const pathContents = Array.from(paths)
    .map((p) => p.outerHTML)
    .join('\n')
  return template.replaceAll('<!-- SVGPATH -->', pathContents)
}

fs.mkdir(OUTPUT_FOLDER, { recursive: true })
  .then(() => fs.readdir(ICONS_FOLDER))
  .then((icons) => icons.filter((i) => i.endsWith('.svg')))
  .then(async (icons) => {
    const template = await fs.readFile(TEMPLATE_PATH, { encoding: 'utf-8' })

    // Filter out color icons - they don't work with SF Symbols
    icons
      .filter((i) => !i.includes('color') && !i.includes('Country='))
      .map(async (icon) => {
        const svgContent = await fs.readFile(path.join(ICONS_FOLDER, icon), {
          encoding: 'utf8'
        })
        const skiaContent = processIcon(template, svgContent)
        const outputFileName = `leo.${icon.replace('-', '.')}`
        await fs.writeFile(
          path.join(OUTPUT_FOLDER, outputFileName),
          skiaContent
        )
      })
  })
