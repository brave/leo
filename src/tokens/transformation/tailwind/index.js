const StyleDictionary = require('style-dictionary')

// Filters
StyleDictionary.registerFilter({
  name: 'tw/filterTokens',
  matcher: require('./twFilterTokens')
})

StyleDictionary.registerFilter({
  name: 'tw/filterFonts',
  matcher: require('./twFilterFonts')
})

// Transforms
StyleDictionary.registerTransform({
  name: 'size/px',
  ...require('../web/sizePx')
})
StyleDictionary.registerTransform({
  name: 'tw/shadow',
  ...require('./twShadows')
})
StyleDictionary.registerTransform({
  name: 'web/radius',
  ...require('../web/webRadius')
})
StyleDictionary.registerTransform({
  name: 'web/size',
  ...require('../web/webSize')
})
StyleDictionary.registerTransform({
  name: 'web/padding',
  ...require('../web/webPadding')
})
StyleDictionary.registerTransform({
  name: 'tw/font',
  ...require('./twFont')
})
StyleDictionary.registerTransform({
  name: 'web/gradient',
  ...require('../web/webGradient')
})
StyleDictionary.registerTransform({
  name: 'color/hex8ToRgbPartial',
  ...require('../common/colorToRgbPartial')
})

StyleDictionary.registerTransformGroup({
  name: 'tailwind/css',
  transforms: StyleDictionary.transformGroup.css.concat([
    'size/px',
    'tw/shadow',
    'web/radius',
    'web/size',
    'web/padding',
    'tw/font',
    'web/gradient',
    'color/hex8ToRgbPartial'
  ])
})

// Formats
StyleDictionary.registerFormat({
  name: 'tailwind/css',
  formatter: require('./formatCssVars')
})

StyleDictionary.registerFormat({
  name: 'tailwind/tokens',
  formatter: require('./formatTokens')
})

StyleDictionary.registerFormat({
  name: 'tailwind/fonts',
  formatter: require('./formatFonts')
})

// Actions
StyleDictionary.registerAction({
  name: 'tailwind/copy_static_files',
  do: require('./copyStaticFiles').do,
  undo: require('./copyStaticFiles').undo
})

StyleDictionary.registerAction({
  name: 'tailwind/convert_css_to_js',
  do: require('./convertCssToJs').do,
  undo: require('./convertCssToJs').undo
})

StyleDictionary.registerAction({
  name: 'tailwind/extract_component_styles',
  do: require('./extractComponentStyles').do,
  undo: require('./extractComponentStyles').undo
})
