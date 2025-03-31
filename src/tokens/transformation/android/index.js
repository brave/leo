import StyleDictionary from 'style-dictionary'
import colorName from './colorName'
import fontSizeToSp from './fontSizeToSp'
import fontStyleFormatter from './formats/fontStyle'
import colorStyleFormatter from './formats/colorStyle'
import dimenStyleFormatter from './formats/dimenStyle'
import fontStyleFilter from './filters/fontStyle'
import darkColorFilter from './filters/darkColor'
import lightColorFilter from './filters/lightColor'

// Transforms
StyleDictionary.registerTransform({
  name: 'android/transformColorName',
  ...colorName
})

StyleDictionary.registerTransform({
  name: 'android/transformFontSizeToSp',
  ...fontSizeToSp
})

// Formats
StyleDictionary.registerFormat({
  name: 'android/formatFontStyle',
  formatter: fontStyleFormatter
})

StyleDictionary.registerFormat({
  name: 'android/formatColorStyle',
  formatter: colorStyleFormatter
})

StyleDictionary.registerFormat({
  name: 'android/formatDimenStyle',
  formatter: dimenStyleFormatter
})

// Filters
StyleDictionary.registerFilter({
  name: 'android/filterFontStyle',
  matcher: fontStyleFilter
})

StyleDictionary.registerFilter({
  name: 'android/filterDarkColor',
  matcher: darkColorFilter
})

StyleDictionary.registerFilter({
  name: 'android/filterLightColor',
  matcher: lightColorFilter
})

// TransformGroup
StyleDictionary.registerTransformGroup({
  name: 'android',
  transforms: StyleDictionary.transformGroup.android.concat([
    'android/transformColorName',
    'android/transformFontSizeToSp'
  ])
})
