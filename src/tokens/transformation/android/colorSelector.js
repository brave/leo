import isComposedColor from '../common/composedColor'

/**
 * Figma's root-level color variables (`$white`, `$black`) are plain literals:
 * they are the only references that name a variable rather than a path into a
 * group, they have no light/dark variants, and nothing resolves through them.
 *
 * Unlike CSS and Skia, Android pays a real cost for an indirection - every
 * ColorStateList needs its own file, because a CSL's filename *is* its resource
 * name - and `values/colors.xml` deliberately carries only the light theme plus
 * the primitives, so a `@color/white` reference has nothing to resolve against
 * and fails `aapt2 link`. Inline these references instead: a literal composed
 * with a fixed opacity is a constant, so it belongs in the `values` colour files as
 * an ordinary `#AARRGGBB` entry rather than in a file of its own.
 *
 * @param {string} referencedVariable e.g. `$white`, `$primitive.neutral.50`
 */
export const isRootColorReference = (referencedVariable) =>
  !referencedVariable.includes('.')

/**
 * Whether a token has to be emitted as a ColorStateList under `color/` rather
 * than as a `<color>` entry in the `values` colour files. Only composed colors whose
 * referenced variable is itself an overridable resource need one; the rest
 * resolve to a constant and can be inlined.
 *
 * @param {any} token The token
 */
export const needsColorSelector = (token) =>
  isComposedColor(token) &&
  !token.name.includes('ios_browser') &&
  !isRootColorReference(token.referencedVariable)
