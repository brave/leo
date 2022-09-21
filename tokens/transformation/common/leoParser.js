// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
const merge = require('lodash.merge')

/**
 * Removes a key and puts the children of that key in the key's parent
 *  e.g. remove "extended" in the path color|extended|primary-10.
 * Note: This cannot merge keys where a child has the same key as the parent,
 * e.g. we cannot remove the duplication of the path gradient|gradient|xyz.
 */
function removeKeyFromObject(contents, keyToRemove, recurse=true) {
  // Don't need to work on types without keys
  if (typeof contents !== 'object') {
    return contents
  }
  for (key in contents) {
    if (key === keyToRemove) {
      // Put matching children in their parent
      // Parent may already have same key, so recursively merge
      contents = merge(contents, contents[key])
      delete contents[key]
      // No more recursion - we are assuming that matching values
      // will not also have descendent items with matching keys.
    } else {
      // Recurse
      if (recurse) {
        contents[key] = removeKeyFromObject(contents[key], keyToRemove, true)
      }
    }
  }
  return contents
}

module.exports = {
	pattern: /\.json$/,
	parse: ({ filePath, contents }) => {
    // Replace emojies, e.g. '🌚 dark' :-)
    contents = contents.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])\s?/gm, "")
		contents = JSON.parse(contents);

    // Remove gradient|extended|gradient key repetition (do this before we remove 'extended'
    // since we would end up with the path gradient|gradient and `removeKeyFromObject` would
    // end up deleting everything under gradient).
    contents = removeKeyFromObject(contents, 'gradient', false)
    // Replace extended e.g. color|extended|primary-10
    contents = removeKeyFromObject(contents, 'extended')
    /**
     * Convert layers from multiple tokens to single token with array of values.
     * 
     * Figma exports named gradients (e.g. gradient-gradient-04) with
     * layered gradients as individual tokens (e.g. gradient-gradient-04-01, 
     * gradient-gradient-02, etc.). This parser converts those layers to an
     * array of values within the parent token (gradient-gradient-04).
     */
    const categories = Object.entries(contents);
    for (const [category, categoryValue] of categories) {
			const types = Object.entries(categoryValue);

			for (const [type, typeValue] of types) {
				const items = Object.entries(typeValue);

				for (const [item, itemValue] of items) {
          // Combine items where figma splits a single-value to multiple values
					if (["gradient", "elevation"].includes(type) && itemValue && !itemValue.type) {
						const subitems = Object.values(itemValue);
						contents[category][type][item] = {
							...subitems[0],
							extensions: itemValue.extensions,
						};

						contents[category][type][item].value = subitems.filter((v) => v && v.value).map((v) => v.value);
					}
				}
			}
		}
		return contents;
	},
};
