import { TransformedTokens } from 'style-dictionary'

const dynamicName = 'dynamic'
const defaultsName = 'static'

/**
 * To work better in Figma, we have a default value for the MUI tokens in `Static`
 * and an example 'Dynamic' override in the `Dynamic` property. To make this work
 * in Nala we remove the dynamic value and convert
 *
 * static.primitive.X
 * to
 * color.primitive.X
 *
 * When consumers override the theme, they will be doing it by directly setting
 * the primitive colors.
 * @param contents The contents of the tokens JSON
 */
export default function (contents: TransformedTokens) {
  const defaults = { ...contents[defaultsName] }

  delete contents[dynamicName]
  delete contents[defaultsName]

  for (const [color, value] of Object.entries(defaults)) {
    contents.color[color] = value
  }
}
