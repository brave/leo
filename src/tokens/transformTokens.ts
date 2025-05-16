import StyleDictionary from 'style-dictionary'
import getConfig from './config'

// Register transforms
import './transformation/web'
import './transformation/tailwind'
import './transformation/skia'
import './transformation/ios'
import './transformation/android'

// Register Global transforms
StyleDictionary.registerTransform({
  name: 'size/percent',
  type: 'value',
  filter: (token) => {
    return token.unit === 'percent' && token.value !== 0
  },
  transform: (token) => {
    return `${token.value}%`
  }
})

/**
 * Some platforms don't have distinct layers, so we bundle
 * all of the relevant tokens together in one.
 */
for (const platform of ['android', 'ios', 'skia']) {
  const StyleDictionaryExtended = new StyleDictionary(
    getConfig(['universal', platform, 'browser'])
  )
  await StyleDictionaryExtended.hasInitialized
  await StyleDictionaryExtended.buildPlatform(platform)
}

/**
 * The remaining platforms have distinct layers so we build
 * them individually so that consuming applications can
 * cascade them as appropriate.
 */
const layers = [
  'universal',
  'browser',
  'android',
  'ios',
  'marketing',
  'search',
  'news',
  'newtab',
  'web3'
]
for (const layer of layers) {
  const StyleDictionaryExtended = new StyleDictionary(getConfig([layer]))

  await StyleDictionaryExtended.hasInitialized

  await StyleDictionaryExtended.buildPlatform('css')
  await StyleDictionaryExtended.buildPlatform('json-flat')
  await StyleDictionaryExtended.buildPlatform('tailwind')
}
