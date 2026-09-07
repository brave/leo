import { DesignToken } from 'style-dictionary'

/**
 * Figma tags colors which are composed from another variable and an opacity
 * with this expression function.
 */
export const composeColorExpression = 'COMPOSE_COLOR'

/**
 * A composed color is a color Figma derives from another variable
 * (`referencedVariable`) at a given `opacity`, so it needs to stay dynamic
 * instead of being flattened to a literal value.
 */
export default function isComposedColor(token: DesignToken) {
  return token.expressionFunction === composeColorExpression
}
