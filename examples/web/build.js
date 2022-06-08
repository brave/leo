/* eslint-disable @typescript-eslint/no-var-requires */
const webConfig = require('../../src/web')
const filterWeb = require('../../src/web/filterWeb')
const StyleDictionary = require('style-dictionary')

// PATHS
const basePath = './'
const buildPath = basePath + 'examples/build/'

const StyleDictionaryExtended = StyleDictionary.extend({
  // adding imported configs
  ...webConfig,
  source: [basePath + 'tokens/*.json'],
  platforms: {
    'web': {
      transformGroup: [
        'custom/css'
      ],
      buildPath: buildPath + 'web/',
      files: [
        {
          destination: 'styles.css',
          filter: filterWeb,
          format: 'custom/css'
        }
      ]
    }
  }
})

StyleDictionaryExtended.buildAllPlatforms()
