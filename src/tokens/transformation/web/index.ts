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
  filter: filterWeb
})

// Transforms
StyleDictionary.registerTransform(sizePx)
StyleDictionary.registerTransform(webShadows)
StyleDictionary.registerTransform(webRadius)
StyleDictionary.registerTransform(webSize)
StyleDictionary.registerTransform(webPadding)
StyleDictionary.registerTransform(webFont)
StyleDictionary.registerTransform(webGradient)
StyleDictionary.registerTransform(webColor)

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: StyleDictionary.hooks.transformGroups.css.concat([
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
  format: formatCss
})

StyleDictionary.registerFormat({
  name: 'custom/cssJS',
  format: formatCssAsJs
})
