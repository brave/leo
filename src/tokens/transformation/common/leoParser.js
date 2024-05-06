// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
const { applyToTokens, removeKeyFromObject } = require('../../utils')
const universalVariables = require('../../universal.variables.json')
const { TinyColor } = require('@ctrl/tinycolor')

/**
 * Transforms an effect to use variable references, rather than a hardcoded
 * color. Unfortunately we need to do this because style-dictionary won't
 * export variable references in effects.
 * At the moment, we just whitelist a few color groups.
 * @param {*} layerVariables
 * @returns {Array}
 */
function getEffectColorsFromLayer(layerVariables) {
  const allowedGroups = ['elevation', 'primary', 'secondary']
  return allowedGroups
    .map((g) =>
      Object.entries(layerVariables.color?.['---light']?.[g] || {}).map(
        ([key, value]) => [
          `${g}.${key}`,
          new TinyColor(value.value).toHex8String()
        ]
      )
    )
    .flat()
}

module.exports = {
  pattern: /\.json$/,
  parse: ({ filePath, contents }) => {
    let layerVariables = {}
    try {
      layerVariables = require(`${filePath.split('.')[0]}.variables.json`)
    } catch {}

    // Replace emojies, e.g. '🌚 dark' :-)
    contents = contents
      .replace(
        /([\uE000-\uF8FF]|\uD83C|[\uDC00-\uDFFF]|\uD83D|[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E|[\uDD10-\uDDFF]|\uFE0F|\u20E3)\s?/gm,
        ''
      )
      .replaceAll(/-{2,}/g, '')
    contents = JSON.parse(contents)

    // Remove gradient|extended|gradient key repetition (do this before we remove 'extended'
    // since we would end up with the path gradient|gradient and `removeKeyFromObject` would
    // end up deleting everything under gradient).
    if (contents.gradient?.gradient)
      contents.gradient = contents.gradient.gradient

    // Get variable references for effects, rather than hardcoded colors
    const universalEffectColors = getEffectColorsFromLayer(universalVariables)
    const layerEffectColors = getEffectColorsFromLayer(layerVariables)

    const transformEffect = (effect) => {
      const value = Array.isArray(effect.value) ? effect.value : [effect.value]
      for (const entry of value) {
        // Some entries are null in the style-dictionary export.
        if (!entry) continue
        const color = new TinyColor(entry.color).toHex8String()
        /**
         * When matching token names with values, we first need to check
         * to see if the value exists in the layer specific variables
         * and then look in the universal variables.
         */
        const match =
          layerEffectColors.find(([key, value]) => value === color) ||
          universalEffectColors.find(([key, value]) => value === color)
        if (match) {
          entry.color = `$color.${match[0]}`
        }
      }
    }
    applyToTokens(contents.effect, 'custom-shadow', transformEffect)

    /**
     * Convert layers from multiple tokens to single token with array of values.
     *
     * Figma exports named gradients (e.g. gradient-gradient-04) with
     * layered gradients as individual tokens (e.g. gradient-gradient-04-01,
     * gradient-gradient-02, etc.). This parser converts those layers to an
     * array of values within the parent token (gradient-gradient-04).
     */
    const categories = Object.entries(contents)
    for (const [category, categoryValue] of categories) {
      const types = Object.entries(categoryValue)

      for (const [type, typeValue] of types) {
        const items = Object.entries(typeValue)

        /**
         * Focus state is not as deeply nested, and is therefore tested
         * at this level.
         */
        if (
          [
            'focus state',
            'notificationbackdrop',
            'url bar shadow',
            'active tab shadow',
            'stroke+shadow'
          ].includes(type) &&
          typeValue &&
          !typeValue.type
        ) {
          contents[category][type] = groupValues(typeValue)
        }

        if (['elevation'].includes(type)) {
          for (const elevationToken in typeValue) {
            contents[category][type][elevationToken] = groupValues(
              typeValue[elevationToken]
            )
          }
        }

        for (const [item, itemValue] of items) {
          // Combine items where figma splits a single-value to multiple values
          // NOTE: ideal scenario here would be to programmatically determine if values should be grouped or not, instead of manually managing a list.
          if (['gradient'].includes(type) && itemValue && !itemValue.type) {
            contents[category][type][item] = groupValues(itemValue)
          }
        }

        // Remove token types which shouldn't be included in final names
        const tokenPrefixesToStrip = ['desktop', 'browser', 'marketing']
        if (tokenPrefixesToStrip.includes(type)) {
          contents[category] = removeKeyFromObject(contents[category], type)
        }
      }
    }

    return contents
  }
}

function groupValues(tokenValue) {
  // Make sure we filter out null items, or we won't set the type properly.
  const subitems = Object.values(tokenValue).filter((si) => si)
  tokenValue = {
    ...subitems[0],
    extensions: tokenValue.extensions
  }

  // Reverses token values in order to
  // reflect proper order from Figma
  tokenValue.value = subitems
    .filter((v) => v && v.value)
    .map((v) => v.value)
    .reverse()

  return tokenValue
}
