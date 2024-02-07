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
          filter: 'tw/filterTokens',
          options: {
            showFileHeader: false,
            prefix: `tw`
          }
        },
        {
          destination: 'tokens.ts',
          format: 'tailwind/tokens',
          filter: 'tw/filterTokens',
          options: {
            showFileHeader: false
          }
        },
        {
          destination: 'plugins/typography.ts',
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
      files: [{
        destination: 'values/styles.xml',
        filter: (token) => token.attributes.category === 'font' && token.attributes.type === 'android',
        format: 'android/fontStyle'
      },{
        destination: 'values/dimens.xml',
        filter: (token) => token.attributes.category === 'font' && token.attributes.type === 'android',
        format: 'android/dimenStyle'
      }]
    }
  }
}
