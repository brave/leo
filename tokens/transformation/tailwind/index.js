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
  name: 'tw/font',
  ...require('./twFont')
})
StyleDictionary.registerTransform({
  name: 'web/gradient',
  ...require('./webGradient')
})
StyleDictionary.registerTransform({
  name: 'color/hex8ToRgbaPartial',
  ...require('../common/colorToRgbaPartial')
})

StyleDictionary.registerTransformGroup({
  name: 'tailwind/css',
  transforms: StyleDictionary.transformGroup.css.concat([
    'size/px',
    'web/shadow',
    'web/radius',
    'web/padding',
    'tw/font',
    'web/gradient',
    'color/hex8ToRgbaPartial'
  ])
})

// Formats
StyleDictionary.registerFormat({
  name: 'tailwind/css',
  formatter: require('./formatCss')
})

StyleDictionary.registerFormat({
  name: 'tailwind/tokens',
  formatter: require('./formatTokens')
})

// Formats
StyleDictionary.registerAction({
  name: 'tailwind/copy_static_files',
  do: require('./copyStaticFiles').do,
  undo: require('./copyStaticFiles').undo
})