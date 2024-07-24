import StyleDictionary from 'style-dictionary'

import filterWeb from './filterWeb'
import sizePx from './sizePx'
import webShadows from './webShadows'
import webRadius from './webRadius'
import webSize from './webSize'
import webPadding from './webPadding'
import webGradient from './webGradient'
import webFont from './webFont'
import webColor from './color'

import formatCss from './formatCss'
import formatCssAsJs from './formatCssAsJs'

// Filters
StyleDictionary.registerFilter({
  name: 'filterWeb',
  matcher: filterWeb
})

// Transforms
StyleDictionary.registerTransform({
  name: 'size/px',
  ...sizePx
})
StyleDictionary.registerTransform({
  name: 'web/shadow',
  ...webShadows
})
StyleDictionary.registerTransform({
  name: 'web/radius',
  ...webRadius
})
StyleDictionary.registerTransform({
  name: 'web/size',
  ...webSize
})
StyleDictionary.registerTransform({
  name: 'web/padding',
  ...webPadding
})
StyleDictionary.registerTransform({
  name: 'web/font',
  ...webFont
})
StyleDictionary.registerTransform({
  name: 'web/gradient',
  ...webGradient
})
StyleDictionary.registerTransform({
  name: 'web/color',
  ...webColor
})

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: StyleDictionary.transformGroup.css.concat([
    'size/px',
    'web/shadow',
    'web/radius',
    'web/padding',
    'web/size',
    'web/font',
    'web/gradient',
    'web/color'
  ])
})

// Formats
StyleDictionary.registerFormat({
  name: 'custom/css',
  formatter: formatCss
})

StyleDictionary.registerFormat({
  name: 'custom/cssJS',
  formatter: formatCssAsJs
})
