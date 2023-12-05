import Layout from './global.svelte'
import { getNonStyleArgs, getStyleFromArgs } from './argHelper'

import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource-variable/inter'

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
