module.exports = {
  source: ['src/tokens/*.json'],
  parsers: [require('./transformation/common/leoParser')],
  platforms: {
    tailwind: {
      transformGroup: 'tailwind/css',
      buildPath: 'tokens/tailwind/',
      files: [
        {
          destination: 'variables.css',
          format: 'tailwind/css',
          filter: 'filterWeb',
          options: {
            showFileHeader: false,
            prefix: `tw`
          }
        },
        {
          destination: 'tokens.ts',
          format: 'tailwind/tokens',
          filter: 'filterWeb',
          options: {
            showFileHeader: false
          }
        }
      ],
      actions: ['tailwind/copy_static_files', 'tailwind/convert_css_to_js']
    },
    css: {
      transformGroup: 'custom/css',
      buildPath: 'tokens/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'custom/css',
          filter: 'filterWeb',
          options: {
            showFileHeader: true
          }
        },
        {
          destination: 'index.ts',
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
          destination: 'styles.json',
          format: 'json/flat'
        }
      ]
    },
    skia: {
      transformGroup: 'skia',
      buildPath: 'tokens/skia/',
      files: [
        {
          destination: 'colors.h',
          format: 'skia/colors.h',
          filter: {
            type: 'color'
          }
        },
        {
          destination: 'spacing.h',
          format: 'skia/spacing.h',
          filter: {
            type: 'custom-spacing'
          }
        },
        {
          destination: 'radius.h',
          format: 'skia/radius.h',
          filter: {
            type: 'custom-radius'
          }
        }
      ]
    },
    ios: {
      transformGroup: 'ios',
      buildPath: 'tokens/ios/',
      files: [
        {
          destination: 'StyleDictionaryColor.h',
          format: 'ios/colors.h',
          filter: {
            type: 'color'
          }
        },
        {
          destination: 'StyleDictionaryColor.m',
          format: 'ios/colors.m',
          className: 'StyleDictionaryColor',
          type: 'StyleDictionaryColorName',
          filter: {
            type: 'color'
          }
        },
        {
          destination: 'StyleDictionarySize.h',
          format: 'ios/static.h',
          className: 'StyleDictionarySize',
          type: 'float',
          filter: {
            type: 'number'
          }
        },
        {
          destination: 'StyleDictionarySize.m',
          format: 'ios/static.m',
          className: 'StyleDictionarySize',
          type: 'float',
          filter: {
            type: 'number'
          }
        }
      ]
    },
    'ios-swift': {
      transformGroup: 'ios-swift',
      buildPath: 'tokens/ios-swift/',
      files: [
        {
          destination: 'StyleDictionary.swift',
          format: 'ios-swift/class.swift',
          className: 'StyleDictionary',
          filter: {}
        }
      ]
    },
    'ios-swift-separate-enums': {
      transformGroup: 'ios-swift-separate',
      buildPath: 'tokens/ios-swift/',
      files: [
        {
          destination: 'StyleDictionaryColor.swift',
          format: 'ios-swift/enum.swift',
          className: 'StyleDictionaryColor',
          filter: {
            type: 'color'
          }
        },
        {
          destination: 'StyleDictionarySize.swift',
          format: 'ios-swift/enum.swift',
          className: 'StyleDictionarySize',
          type: 'float',
          filter: {
            type: 'number'
          }
        }
      ]
    }
  }
}
