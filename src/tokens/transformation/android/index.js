const StyleDictionary = require('style-dictionary')
const changeCase = require('change-case')

StyleDictionary.registerTransform({
  name: 'android/color',
  ...require('../common/colorToHex8')
})

StyleDictionary.registerTransform({
  name: 'android/colorName',
  ...require('./colorName')
})

StyleDictionary.registerTransform({
  name: 'android/fontSize',
  ...require('./fontSizeToSp')
})

StyleDictionary.registerTransform({
  name: 'android/pxToDp',
  ...require('./pxToDp')
})

StyleDictionary.registerFormat({
  name: 'android/fontStyle',
  formatter: require('./formatFontStyle')
})

StyleDictionary.registerFormat({
  name: 'android/dimenStyle',
  formatter: require('./formatDimenStyle')
})

StyleDictionary.registerFormat({
  name: 'android/resourcesSorted',
  formatter: require('./formatResourcesSorted')
})

StyleDictionary.registerAction({
  name: 'android/copy_fileOrFolder',
  do: require('../common/copyFileOrFolder').do,
  undo: require('../common/copyFileOrFolder').undo
})

StyleDictionary.registerTransformGroup({
  name: 'android',
  transforms: StyleDictionary.transformGroup.android.concat([
    'android/fontSize',
    'android/pxToDp'
  ])
})
