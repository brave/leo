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
StyleDictionary.registerFilter(twFilterTokens)
StyleDictionary.registerFilter(twFilterFonts)

// Transforms
StyleDictionary.registerTransform(sizePx)
StyleDictionary.registerTransform(twShadows)
StyleDictionary.registerTransform(webRadius)
StyleDictionary.registerTransform(webSize)
StyleDictionary.registerTransform(webPadding)
StyleDictionary.registerTransform(twFont)
StyleDictionary.registerTransform(webGradient)
StyleDictionary.registerTransform(colorToRgbPartial)

StyleDictionary.registerTransformGroup({
  name: 'tailwind/css',
  transforms: StyleDictionary.hooks.transformGroups.css.concat([
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
StyleDictionary.registerFormat(formatCssVars)
StyleDictionary.registerFormat(formatTokens)
StyleDictionary.registerFormat(formatFonts)

// Actions
StyleDictionary.registerAction(copyStaticFiles)
StyleDictionary.registerAction(convertCssToJs)
StyleDictionary.registerAction(extractComponentStyles)
