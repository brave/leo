const StyleDictionary = require('style-dictionary')
const getConfig = require('./config')

// Register transforms
require('./transformation/web')
require('./transformation/tailwind')
require('./transformation/skia')
require('./transformation/ios')
require('./transformation/android')

// Register Global transforms
StyleDictionary.registerTransform({
  name: 'size/percent',
  type: 'value',
  matcher: (token) => {
    return token.unit === 'percent' && token.value !== 0
  },
  transformer: (token) => {
    return `${token.value}%`
  }
})

/**
 * Some platforms don't have distinct layers, so we bundle
 * all of the relevant tokens together in one.
 */
for (const platform of ['android', 'ios', 'skia']) {
  const StyleDictionaryExtended = StyleDictionary.extend(
    getConfig(['universal', platform])
  )
  StyleDictionaryExtended.buildPlatform(platform)
}

/**
 * The remaining platforms have distinct layers so we build
 * them individually so that consuming applications can
 * cascade them as appropriate.
 */
const layers = ['universal', 'browser']
for (const layer of layers) {
  const StyleDictionaryExtended = StyleDictionary.extend(getConfig([layer]))

  StyleDictionaryExtended.buildPlatform('css')
  StyleDictionaryExtended.buildPlatform('json-flat')
  StyleDictionaryExtended.buildPlatform('tailwind')
}
