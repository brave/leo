const StyleDictionary = require('style-dictionary')

// Transforms
StyleDictionary.registerTransform({
  name: 'android/transformColorName',
  ...require('./colorName')
})

StyleDictionary.registerTransform({
  name: 'android/transformFontSizeToSp',
  ...require('./fontSizeToSp')
})

// Formats
StyleDictionary.registerFormat({
  name: 'android/formatFontStyle',
  formatter: require('./formats/fontStyle')
})

StyleDictionary.registerFormat({
  name: 'android/formatColorStyle',
  formatter: require('./formats/colorStyle')
})

StyleDictionary.registerFormat({
  name: 'android/formatDimenStyle',
  formatter: require('./formats/dimenStyle')
})

// Filters
StyleDictionary.registerFilter({
  name: 'android/filterFontStyle',
  matcher: require('./filters/fontStyle')
})

StyleDictionary.registerFilter({
  name: 'android/filterDarkColor',
  matcher: require('./filters/darkColor')
})

StyleDictionary.registerFilter({
  name: 'android/filterLightColor',
  matcher: require('./filters/lightColor')
})

// TransformGroup
StyleDictionary.registerTransformGroup({
  name: 'android',
  transforms: StyleDictionary.transformGroup.android.concat([
    'android/transformColorName',
    'android/transformFontSizeToSp'
  ])
})
