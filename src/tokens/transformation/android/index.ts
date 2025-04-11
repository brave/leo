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
StyleDictionary.registerFormat(fontStyleFormatter)
StyleDictionary.registerFormat(colorStyleFormatter)
StyleDictionary.registerFormat(dimenStyleFormatter)

// Filters
StyleDictionary.registerFilter(fontStyleFilter)
StyleDictionary.registerFilter(darkColorFilter)
StyleDictionary.registerFilter(lightColorFilter)

// TransformGroup
StyleDictionary.registerTransformGroup({
  name: 'android',
  transforms: StyleDictionary.hooks.transformGroups.android.concat([
    'android/transformColorName',
    'android/transformFontSizeToSp'
  ])
})
