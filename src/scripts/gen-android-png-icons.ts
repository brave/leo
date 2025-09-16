import fs from 'fs/promises'
import path from 'path'
import program from 'commander'
import sharp from 'sharp'

const ICONS_FOLDER = 'icons/'

async function svgToAndroidDrawablePngs(
  svgFileName,
  newColor,
  newFileBaseName,
  targetDirectory
) {
  const densities = {
    mdpi: 24,
    hdpi: 36,
    xhdpi: 48,
    xxhdpi: 72,
    xxxhdpi: 96
  }

  for (const [bucket, size] of Object.entries(densities)) {
    await fs.mkdir(`${targetDirectory}/drawable-${bucket}/`, {
      recursive: true
    })

    const outputFileName = newFileBaseName
      ? newFileBaseName
      : svgFileName.replaceAll('-', '_') + '.png'

    let svgContent = await fs.readFile(
      path.join(ICONS_FOLDER, svgFileName + '.svg'),
      {
        encoding: 'utf8'
      }
    )

    if (newColor) {
      svgContent = svgContent.replace(
        /fill="#[0-9A-Fa-f]{6}"/,
        `fill="#${newColor}"`
      )
    }

    await sharp(Buffer.from(svgContent, 'utf-8'))
      .resize(size, size)
      .png()
      .toFile(`${targetDirectory}/drawable-${bucket}/${outputFileName}`)
  }
}

program.requiredOption('--svg-icon-name <source_icon.svg>', 'svg icon name')
program.option('--new-color <new_color_hex>', 'new icon color')
program.option('--new-file-base-name <target_icon.png>', 'new file base name')
program.option(
  '--target-directory <target_directory>',
  'path to a directory where drawable-*dpi folders will be created'
)

program.parse(process.argv)
const options = program.opts()

let svgFileName = options.svgIconName
if (svgFileName.endsWith('.svg')) {
  svgFileName = svgFileName.substring(0, svgFileName.length - 4)
}
await svgToAndroidDrawablePngs(
  svgFileName,
  options.newColor,
  options.newFileBaseName,
  options.targetDirectory
)
