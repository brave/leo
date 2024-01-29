// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
const { removeKeyFromObject, applyToTokens } = require('../../utils')
const fs = require('fs')
const variables = require('../../universal.variables.json')
const { TinyColor } = require('@ctrl/tinycolor')

module.exports = {
  pattern: /\.json$/,
  parse: ({ filePath, contents }) => {
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

    // Transforms an effect to use variable references, rather than a hardcoded
    // color. Unfortunately we need to do this because style-dictionary won't
    // export variable references in effects.
    // At the moment, we just whitelist a few color groups.
    const allowedGroups = ['elevation', 'primary', 'secondary']
    const effectColors = allowedGroups
      .map((g) =>
        Object.entries(variables.color['---light'][g]).map(([key, value]) => [
          `${g}.${key}`,
          new TinyColor(value.value).toHex8String()
        ])
      )
      .flat()

    const transformEffect = (effect) => {
      const value = Array.isArray(effect.value) ? effect.value : [effect.value]
      for (const entry of value) {
        // Some entries are null in the style-dictionary export.
        if (!entry) continue
        const color = new TinyColor(entry.color).toHex8String()
        const match = effectColors.find(([key, value]) => value === color)
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
          ['focus state', 'notificationbackdrop'].includes(type) &&
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
