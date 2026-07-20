import { Config } from 'style-dictionary'
import leoParser from './transformation/common/leoParser'

function formatLayerPathPart(
  layers: string[],
  { prefix, suffix }: { prefix?: string; suffix?: string } = {}
) {
  if (layers.length === 1 && layers.at(0) !== 'universal') {
    return [prefix, layers, suffix].join('')
  } else return ''
}

export default function getConfig(layers: string[]) {
  return {
    source: layers.map((layer) => `src/tokens/${layer}*.json`),
    parsers: [leoParser],
    platforms: {
      tailwind: {
        transformGroup: 'tailwind/css',
        buildPath: 'tokens/tailwind/',
        preset: formatLayerPathPart(layers),
        files: [
          {
            destination: `${formatLayerPathPart(layers, {
              suffix: '/'
            })}variables.css`,
            format: 'tailwind/css',
            filter: 'tw/filterTokens',
            options: {
              showFileHeader: false,
              prefix: `tw`
            }
          },
          {
            destination: `${formatLayerPathPart(layers, {
              suffix: '/'
            })}tokens.js`,
            format: 'tailwind/tokens',
            filter: 'tw/filterTokens',
            options: {
              showFileHeader: false
            }
          },
          {
            destination: `${formatLayerPathPart(layers, {
              suffix: '/'
            })}plugins/typography.js`,
            format: 'tailwind/fonts',
            filter: 'tw/filterFonts',
            options: {
              showFileHeader: false
            }
          }
        ],
        actions: [
          'tailwind/copy_static_files',
          'tailwind/convert_css_to_js',
          'tailwind/extract_component_styles'
        ]
      },
      'tailwind-email': {
        transformGroup: 'tailwind/css',
        buildPath: 'tokens/tailwind-email/',
        preset: formatLayerPathPart(layers),
        files: [
          {
            destination: 'tokens.js',
            format: 'tailwind/tokens',
            filter: 'tw/filterTokens',
            options: {
              showFileHeader: false
            }
          },
          {
            destination: 'plugins/typography.js',
            format: 'tailwind/fonts',
            filter: 'tw/filterFonts',
            options: {
              showFileHeader: false
            }
          }
        ],
        actions: ['tailwind/copy_static_files']
      },
      css: {
        transformGroup: 'custom/css',
        buildPath: 'tokens/css/',
        files: [
          {
            destination: `variables${formatLayerPathPart(layers, {
              prefix: '-'
            })}.css`,
            format: 'custom/css',
            filter: 'filterWeb',
            options: {
              showFileHeader: true
            }
          },
          {
            destination: `variables${formatLayerPathPart(layers, {
              prefix: '-'
            })}.ts`,
            format: 'custom/cssJS',
            filter: 'filterWeb'
          }
        ]
      },
      'json-flat': {
        transformGroup: 'js',
        buildPath: 'tokens/json/',
        files: [
          {
            destination: `styles${formatLayerPathPart(layers, {
              prefix: '-'
            })}.json`,
            format: 'json/flat'
          }
        ]
      },
      skia: {
        transformGroup: 'skia',
        buildPath: 'tokens/skia/',
        files: [
          {
            destination: 'nala_color_id.h',
            format: 'skia/nala_color_id.h',
            filter: {
              type: 'color'
            }
          },
          {
            destination: 'nala_color_mixer.h',
            format: 'skia/nala_color_mixer.h',
            filter: {
              type: 'color'
            }
          },
          {
            destination: 'nala_color_mixer.cc',
            format: 'skia/nala_color_mixer.cc',
            filter: {
              type: 'color'
            }
          },
          {
            destination: 'spacing.h',
            format: 'skia/spacing.h',
            filter: {
              type: 'number'
            }
          },
          {
            destination: 'radius.h',
            format: 'skia/radius.h',
            filter: {
              type: 'number'
            }
          }
        ]
      },
      ios: {
        transformGroup: 'ios',
        buildPath: 'tokens/ios-swift/',
        files: [
          {
            destination: 'Gradients.swift',
            format: 'ios/gradients',
            filter: {
              type: 'custom-gradient'
            }
          },
          {
            destination: 'ColorSetAccessors.swift',
            format: 'ios/colorSetAccessors',
            filter: {
              type: 'color'
            }
          }
        ],
        actions: ['ios/colorSets']
      },
      android: {
        transformGroup: 'android',
        buildPath: 'tokens/android/',
        files: [
          {
            destination: 'values/styles.xml',
            filter: 'android/filterFontStyle',
            format: 'android/formatFontStyle'
          },
          {
            destination: 'values/dimens.xml',
            filter: 'android/filterFontStyle',
            format: 'android/formatDimenStyle'
          },
          {
            destination: 'values/colors.xml',
            filter: 'android/filterLightColor',
            format: 'android/formatColorStyle'
          },
          {
            destination: 'values-night/colors.xml',
            filter: 'android/filterDarkColor',
            format: 'android/formatColorStyle'
          }
        ]
      }
    }
  } as Config
}
