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
StyleDictionary.registerTransform(colorName)

StyleDictionary.registerTransform(fontSizeToSp)

// Formats
StyleDictionary.registerFormat({
  name: 'android/formatFontStyle',
  format: fontStyleFormatter
})

StyleDictionary.registerFormat({
  name: 'android/formatColorStyle',
  format: colorStyleFormatter
})

StyleDictionary.registerFormat({
  name: 'android/formatDimenStyle',
  format: dimenStyleFormatter
})

// Filters
StyleDictionary.registerFilter({
  name: 'android/filterFontStyle',
  filter: fontStyleFilter
})

StyleDictionary.registerFilter({
  name: 'android/filterDarkColor',
  filter: darkColorFilter
})

StyleDictionary.registerFilter({
  name: 'android/filterLightColor',
  filter: lightColorFilter
})

// TransformGroup
StyleDictionary.registerTransformGroup({
  name: 'android',
  transforms: StyleDictionary.hooks.transformGroups.android.concat([
    'android/transformColorName',
    'android/transformFontSizeToSp'
  ])
})
