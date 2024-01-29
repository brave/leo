const merge = require('lodash.merge')

/**
 * Removes a key and puts the children of that key in the key's parent
 *  e.g. remove "extended" in the path color|extended|primary-10.
 * Note: This cannot merge keys where a child has the same key as the parent,
 * e.g. we cannot remove the duplication of the path gradient|gradient|xyz.
 */
function removeKeyFromObject(contents, keyToRemove, recurse = true) {
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

/**
 * Applies a function to all token nodes of a type
 * @param {*} root The root node
 * @param {*} type The type of node to apply the function to
 * @param {*} apply The applicator
 */
function applyToTokens(root, type, apply) {
  if (!root || typeof root !== "object") return

  if (root.type === type) {
    apply(root)
    return
  }

  const children = Object.values(root)
  for (const child of children) {
    applyToTokens(child, type, apply)
  }
}

module.exports = {
  removeKeyFromObject,
  applyToTokens
}
