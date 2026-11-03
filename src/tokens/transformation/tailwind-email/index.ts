import StyleDictionary from 'style-dictionary'

import twFilterTokens from '../tailwind/twFilterTokens'
import twFilterFonts from '../tailwind/twFilterFonts'

import sizePx from '../web/sizePx'
import twShadows from '../tailwind/twShadows'
import webRadius from '../web/webRadius'
import webSize from '../web/webSize'
import webPadding from '../web/webPadding'
import twFont from '../tailwind/twFont'
import webGradient from '../web/webGradient'
import formatFonts from '../tailwind/formatFonts'

import formatTokens from './formatTokens'
import copyStaticFiles from './copyStaticFiles'

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

StyleDictionary.registerTransformGroup({
  name: 'tailwind/css',
  transforms: StyleDictionary.transformGroup.css.concat([
    'size/px',
    'tw/shadow',
    'web/radius',
    'web/size',
    'web/padding',
    'tw/font',
    'web/gradient'
  ])
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
