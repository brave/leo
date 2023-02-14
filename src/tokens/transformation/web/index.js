const StyleDictionary = require('style-dictionary')

// Filters
StyleDictionary.registerFilter({
  name: 'filterWeb',
  matcher: require('./filterWeb')
})

// Transforms
StyleDictionary.registerTransform({
  name: 'size/px',
  ...require('./sizePx')
})
StyleDictionary.registerTransform({
  name: 'web/shadow',
  ...require('./webShadows')
})
StyleDictionary.registerTransform({
  name: 'web/radius',
  ...require('./webRadius')
})
StyleDictionary.registerTransform({
  name: 'web/padding',
  ...require('./webPadding')
})
StyleDictionary.registerTransform({
  name: 'web/font',
  ...require('./webFont')
})
StyleDictionary.registerTransform({
  name: 'web/gradient',
  ...require('./webGradient')
})
StyleDictionary.registerTransform({
  name: 'color/hex8ToRgba',
  ...require('../common/colorToRgbaString')
})

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: StyleDictionary.transformGroup.css.concat([
    'size/px',
    'web/shadow',
    'web/radius',
    'web/padding',
    'web/font',
    'web/gradient',
    'color/hex8ToRgba'
  ])
})

// Formats
StyleDictionary.registerFormat({
  name: 'custom/css',
  formatter: require('./formatCss')
})

StyleDictionary.registerFormat({
  name: 'custom/cssJS',
  formatter: require('./formatCssAsJs')
})
