import { TinyColor } from '@ctrl/tinycolor'
import { snakeCase } from 'change-case'
import fs from 'fs-extra'
import type { Action } from 'style-dictionary/types'

const contents = {
  info: {
    author: 'xcode',
    version: 1
  }
}

const percentageToFloat = (percentageString) => {
  return (
    parseInt(percentageString.substring(0, percentageString.length - 1)) / 100
  )
}

const ratioRgb = (color) => {
  const colorObj = new TinyColor(color)
  const percentages = colorObj.toPercentageRgb()

  return {
    red: `${percentageToFloat(percentages.r).toFixed(3)}`,
    green: `${percentageToFloat(percentages.g).toFixed(3)}`,
    blue: `${percentageToFloat(percentages.b).toFixed(3)}`,
    alpha: `${percentages.a.toFixed(3)}`
  }
}

type Color = {
  idiom: string
  color: {
    'color-space': string
    components: {
      red: string
      green: string
      blue: string
      alpha: string
    }
  }
  appearances?: Array<{
    appearance: string
    value: string
  }>
}

/**
 * This action will iterate over all the colors in the Style Dictionary
 * and for each one write a colorset with light and (optional) dark
 * mode versions.
 */
export default {
  name: 'ios/colorSets',
  // This is going to run once per theme.
  do: (dictionary, platform) => {
    const assetPath = `${platform.buildPath}/Colors.xcassets`
    fs.emptyDirSync(assetPath)
    fs.writeFileSync(
      `${assetPath}/Contents.json`,
      JSON.stringify(contents, null, 2)
    )

    dictionary.allTokens
      .filter((token) => token.type === 'color')
      .forEach((token) => {
        if (token.name === 'ColorBlack' || token.name === 'ColorWhite') {
          // The system already provides these and will conflict with the names
          return
        }
        const colorsetPath = `${assetPath}/${snakeCase(
          token.path
            .filter(
              (path) => path !== 'dark' && path !== 'light' && path !== 'color'
            )
            .join(' ')
        )}.colorset`
        fs.ensureDirSync(colorsetPath)

        // The colorset might already exist because Style Dictionary is run multiple
        // times with different configurations. If the colorset already exists we want
        // to modify it rather than writing over it.
        const colorset = fs.existsSync(`${colorsetPath}/Contents.json`)
          ? fs.readJsonSync(`${colorsetPath}/Contents.json`)
          : { ...contents, colors: [] }

        const color: Color = {
          idiom: 'universal',
          color: {
            'color-space': 'srgb',
            components: ratioRgb(token.original.value)
          }
        }

        if (token.path.includes('dark')) {
          color.appearances = [
            {
              appearance: 'luminosity',
              value: 'dark'
            }
          ]
        }

        colorset.colors.push(color)

        fs.writeFileSync(
          `${colorsetPath}/Contents.json`,
          JSON.stringify(colorset, null, 2)
        )
      })
  },
  undo: function (dictionary, platform) {
    // no undo
  }
} as Action
