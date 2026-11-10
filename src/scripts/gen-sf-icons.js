/**
 * Generates SF Symbols (for iOS) from the icons in /icons, written to
 * /icons-sf as `leo.<name>.svg`. Run as part of `pnpm run build`, and shipped
 * in the published package.
 *
 * paper.js needs the `canvas` native module in Node, which is why this used to
 * live in the separate brave/leo-sf-symbols repository.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import paper from 'paper'

const { CompoundPath } = paper
paper.setup()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const TEMPLATE_PATH = path.join(dirname, 'icons', 'sf-icon.svg.tmpl')
const ICONS_FOLDER =
  process.env['ICONS_FOLDER'] || path.join(dirname, '../../icons')
const OUTPUT_FOLDER = process.env['OUTPUT_FOLDER'] || 'icons-sf'

// Colour icons don't work as SF Symbols.
const isSupported = (icon) =>
  icon.endsWith('.svg') && !icon.includes('color') && !icon.includes('country-')

// e.g. `arrow-small-down.svg` => `leo.arrow.small-down.svg`. Only the first
// dash is replaced, and consumers reference these names, so don't change it.
const outputName = (icon) => `leo.${icon.replace('-', '.')}`

function processIcon(template, svgContents) {
  // Parse with paper's own DOM: nodes from a different jsdom instance can't be
  // imported into it.
  const paperSVG = paper.project.importSVG(svgContents)
  for (const path of paperSVG.getItems({ class: CompoundPath })) {
    path.reorient()
  }

  const resultSVG = paperSVG.exportSVG()
  paperSVG.remove()

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

const template = await fs.readFile(TEMPLATE_PATH, { encoding: 'utf-8' })
const icons = (await fs.readdir(ICONS_FOLDER)).filter(isSupported).sort()

// Start clean so icons removed from Leo don't linger in the output.
await fs.rm(OUTPUT_FOLDER, { recursive: true, force: true })
await fs.mkdir(OUTPUT_FOLDER, { recursive: true })

for (const icon of icons) {
  const svgContent = await fs.readFile(path.join(ICONS_FOLDER, icon), {
    encoding: 'utf8'
  })
  await fs.writeFile(
    path.join(OUTPUT_FOLDER, outputName(icon)),
    processIcon(template, svgContent)
  )
}

console.log(`Generated ${icons.length} SF Symbols in ${OUTPUT_FOLDER}`)

export { processIcon }
