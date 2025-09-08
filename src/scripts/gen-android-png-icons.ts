import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const ICONS_FOLDER = 'icons/'

async function svgToAndroidDrawablePngs(
  svgFileName,
  newColor,
  newFileBaseName
) {
  const densities = {
    mdpi: 24,
    hdpi: 36,
    xhdpi: 48,
    xxhdpi: 72,
    xxxhdpi: 96
  }

  for (const [bucket, size] of Object.entries(densities)) {
    await fs.mkdir(`./tokens/android/drawable-${bucket}/`, { recursive: true })

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
      .toFile(`./tokens/android/drawable-${bucket}/${outputFileName}`)
  }
}

if (process.argv.length < 3) {
  console.error(
    'Usage: npm run android-png-icons -- <icon_name.svg> [new_color] [new_file_base_name]'
  )
} else {
  let svgFileName = process.argv[2]
  if (svgFileName.endsWith('.svg')) {
    svgFileName = svgFileName.substring(0, svgFileName.length - 4)
  }
  const newColor = process.argv.length >= 3 ? process.argv[3] : undefined
  const newFileBaseName = process.argv.length >= 4 ? process.argv[4] : undefined
  await svgToAndroidDrawablePngs(svgFileName, newColor, newFileBaseName)
}
