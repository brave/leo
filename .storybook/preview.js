import Layout from './global.svelte'
import { getNonStyleArgs, getStyleFromArgs } from './argHelper'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  layout: 'fullscreen'
}

export const decorators = [
  (story, context) => {
    const args = context.args
    const style = getStyleFromArgs(args)
    context.args = getNonStyleArgs(args)
    context.canvasElement.style = style
    return story()
  },
  () => Layout
]
