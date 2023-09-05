// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
const { removeKeyFromObject } = require('../../utils')

module.exports = {
  pattern: /\.json$/,
  parse: ({ filePath, contents }) => {
    // Replace emojies, e.g. '🌚 dark' :-)
    contents = contents.replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E|[\uDD10-\uDDFF]|\uFE0F|\u20E3)\s?/gm,
      ''
    )
    contents = JSON.parse(contents)

    // Remove gradient|extended|gradient key repetition (do this before we remove 'extended'
    // since we would end up with the path gradient|gradient and `removeKeyFromObject` would
    // end up deleting everything under gradient).
    if (contents.gradient) contents.gradient = contents.gradient.gradient

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
        if (['focus state'].includes(type) && typeValue && !typeValue.type) {
          contents[category][type] = groupValues(typeValue)
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
  const subitems = Object.values(tokenValue)
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
