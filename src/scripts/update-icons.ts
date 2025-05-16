import { figmaApiExporter } from 'figma-api-exporter'
import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import { optimize } from 'svgo'
import { TinyColor } from '@ctrl/tinycolor'
import { setGlobalDispatcher, Agent } from 'undici'

// Set the timeout to be 10 minutes.
setGlobalDispatcher(new Agent({ connect: { timeout: 600000 } }))

const RAW_FOLDER = './icons-raw'
const FINAL_FOLDER = './icons'

// Delete all the icons so we definitely catch removed icons.
fs.rmSync(FINAL_FOLDER, { force: true, recursive: true })

fs.mkdirSync(RAW_FOLDER, { recursive: true })
fs.mkdirSync(FINAL_FOLDER, { recursive: true })

if (!process.env.FIGMA_API_TOKEN) {
  throw new Error(
    `In order to work, this script requires a figma API token to be set in the 'FIGMA_API_TOKEN' environment variable. You can get one from here https://www.figma.com/developers/api#access-tokens and set it with 'export FIGMA_API_TOKEN=<YOUR_API_TOKEN>'`
  )
}

/**
 * Determines whether a color is allowed in monochrome icons. All other colors
 * will be replaced with our Perfect Gray :D
 * @param {string} color The color currently being used
 * @returns {boolean} whether the color is allowed
 */
const isAllowedColor = (color: string) => {
  const allowedColors = ['FFFFFF', '000000', 'none', 'transparent']

  if (allowedColors.includes(color)) return true
  if (allowedColors.includes(new TinyColor(color).toHex().toUpperCase()))
    return true

  return false
}

const getFlag = (iconName) => {
  const regionRegex = /Country=Region - ((\w|\s)+).svg/
  let match = regionRegex.exec(iconName)
  if (match) {
    return `${match[1]}`
  }

  const countryRegex = /Country=(\w\w\w?).*\.svg/
  match = countryRegex.exec(iconName)
  if (!match) return false

  return match[1]?.toUpperCase()
}

/**
 * Determines whether an icon is probably color, based on its name
 * @param {string} name
 * @returns {boolean} Whether the icon is probably color
 */
const isProbablyColor = (name) =>
  name.endsWith('-color.svg') || getFlag(name) || name.startsWith('social')

const getMutatedIconName = (iconName) => {
  const flag = getFlag(iconName)
  const name = flag ? `Country-${flag}.svg` : iconName
  return name.toLowerCase().replace(/[^a-zA-Z0-9\.]+/g, '-')
}

const mutateIcon = (iconName) => {
  const closingTag = '</svg>'
  let iconContent = fs.readFileSync(path.join(RAW_FOLDER, iconName)).toString()
  // Note: Sometimes Figma includes an additional closing tag, which kills our parser.
  iconContent = iconContent.substring(
    0,
    iconContent.indexOf(closingTag) + closingTag.length
  )

  const {
    window: { document }
  } = new JSDOM(iconContent, { contentType: 'image/svg+xml' })
  const svg = document.querySelector('svg')
  if (!svg) {
    console.error(`Icon ${iconName} has no SVG element`)
    return
  }

  // Sometimes, we change the default icon color in Figma - we don't really want
  // that to trigger an update of all our icons though, so we just always use
  // this nice gray.
  if (!isProbablyColor(iconName)) {
    const idealColor = '#62757E'
    for (const filled of document.querySelectorAll('[fill]')) {
      if (isAllowedColor(filled.getAttribute('fill')!)) continue
      filled.setAttribute('fill', idealColor)
    }

    for (const stroked of document.querySelectorAll('[stroke]')) {
      if (isAllowedColor(stroked.getAttribute('stroke')!)) continue
      stroked.setAttribute('stroke', idealColor)
    }
  }

  const outputName = getMutatedIconName(iconName)

  const rejectReasons = new Set()
  const result = optimize(svg.outerHTML, {
    multipass: true,
    plugins: [
      'preset-default',
      'removeDimensions',
      {
        name: 'banRasterImageElement',
        fn: () => ({
          element: {
            enter: (node) => {
              if (
                node.name === 'image' &&
                node.attributes['xlink:href'] != null &&
                /(\.|image\/)(jpg|png|gif)/.test(node.attributes['xlink:href'])
              ) {
                rejectReasons.add('has a raster image element')
              }
            }
          }
        })
      },
      'removeOffCanvasPaths',
      'removeScriptElement'
    ]
  })

  // If we have any reason to reject the icon don't copy it to the output directory.
  if (rejectReasons.size) {
    console.log(
      `Ignoring icon ${outputName} because:\n${Array.from(rejectReasons)
        .map((r) => `- ${r}`)
        .join('\n')}`
    )
    return
  }
  fs.writeFileSync(path.join(FINAL_FOLDER, outputName), result.data)
}

const mutateIcons = () => {
  const iconNames = fs.readdirSync(RAW_FOLDER)
  for (const icon of iconNames) {
    if (!icon.endsWith('.svg')) continue
    mutateIcon(icon)
  }
}

const generateMeta = () => {
  const icons = fs
    .readdirSync(FINAL_FOLDER)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => path.basename(f, '.svg'))
    .reduce((prev, next) => ({ ...prev, [next]: next }), {})
  const meta = {
    updatedAt: Date.now(),
    icons
  }

  const stringified = JSON.stringify(meta, null, 2)

  // Write meta.js
  fs.writeFileSync(
    path.join(FINAL_FOLDER, 'meta.js'),
    `export default ${stringified}`
  )

  // Write meta.d.ts
  fs.writeFileSync(
    path.join(FINAL_FOLDER, 'meta.d.ts'),
    `import { StringWithAutoComplete } from '../src/types/string'

const meta = ${stringified} as const
export type Meta = typeof meta
export default meta
export type IconName = StringWithAutoComplete<keyof Meta['icons']>`
  )
}

const exporter = figmaApiExporter(process.env.FIGMA_API_TOKEN)
const fileId = 'g8Z0q6TMPYDq6zXh9Y7LWD'
exporter
  .getSvgs({
    fileId,
    canvas: '🔮 Icons'
  })
  .then(async (svgsData) => {
    const map = new Map()
    for (const svg of svgsData.svgs) {
      if (!map.has(svg.name)) map.set(svg.name, [])
      map.get(svg.name).push(svg)
    }

    let duplicatesWarning = ''
    for (const [name, entries] of map.entries()) {
      if (entries.length === 1) continue
      duplicatesWarning += `Found icon with duplicated name '${name}'x${
        entries.length
      }
${entries.map(
  (e) => `- https://www.figma.com/file/${fileId}/?node-id=${e.id}\n`
)}`
    }

    // Note: This string is used as the Github PR body, so it should be valid markdown.
    if (duplicatesWarning) {
      console.warn(`### Duplicate Icons:

${duplicatesWarning}`)
    }

    await exporter.downloadSvgs({
      saveDirectory: RAW_FOLDER,
      svgsData: svgsData.svgs,
      clearDirectory: true,
      lastModified: svgsData.lastModified
    })
  })
  .then(mutateIcons)
  .then(generateMeta)
