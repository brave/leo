import StyleDictionary from 'style-dictionary'

import twFilterTokens from './twFilterTokens'
import twFilterFonts from './twFilterFonts'

import sizePx from '../web/sizePx'
import twShadows from './twShadows'
import webRadius from '../web/webRadius'
import webSize from '../web/webSize'
import webPadding from '../web/webPadding'
import twFont from './twFont'
import webGradient from '../web/webGradient'
import colorToRgbPartial from './colorToRgbPartial'
import formatCssVars from './formatCssVars'
import formatTokens from './formatTokens'
import formatFonts from './formatFonts'

import copyStaticFiles from './copyStaticFiles'
import convertCssToJs from './convertCssToJs'
import extractComponentStyles from './extractComponentStyles'

// Filters
StyleDictionary.registerFilter({
  name: 'tw/filterTokens',
  matcher: twFilterTokens
})

StyleDictionary.registerFilter({
  name: 'tw/filterFonts',
  matcher: twFilterFonts
})

// Transforms
StyleDictionary.registerTransform({
  name: 'size/px',
  ...sizePx
})
StyleDictionary.registerTransform({
  name: 'tw/shadow',
  ...twShadows
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
  name: 'tw/font',
  ...twFont
})
StyleDictionary.registerTransform({
  name: 'web/gradient',
  ...webGradient
})
StyleDictionary.registerTransform({
  name: 'color/hex8ToRgbPartial',
  ...colorToRgbPartial
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
  formatter: formatCssVars
})

StyleDictionary.registerFormat({
  name: 'tailwind/tokens',
  formatter: formatTokens
})

StyleDictionary.registerFormat({
  name: 'tailwind/fonts',
  formatter: formatFonts
})

// Actions
StyleDictionary.registerAction({
  name: 'tailwind/copy_static_files',
  do: copyStaticFiles.do,
  undo: copyStaticFiles.undo
})

StyleDictionary.registerAction({
  name: 'tailwind/convert_css_to_js',
  do: convertCssToJs.do,
  undo: convertCssToJs.undo
})

StyleDictionary.registerAction({
  name: 'tailwind/extract_component_styles',
  do: extractComponentStyles.do,
  undo: extractComponentStyles.undo
})
