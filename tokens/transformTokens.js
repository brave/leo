const StyleDictionary = require('style-dictionary')
const baseConfig = require('./config')

// Register Web transforms
require('./transformation/web')
require('./transformation/tailwind')

// Register Global transforms
StyleDictionary.registerTransform({
  name: 'size/percent',
  type: 'value',
  matcher: token => {
    return token.unit === 'percent' && token.value !== 0
  },
  transformer: token => {
    return `${token.value}%`
  }
})

const StyleDictionaryExtended = StyleDictionary.extend(baseConfig)

StyleDictionaryExtended.buildAllPlatforms()