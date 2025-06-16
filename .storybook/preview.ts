import Layout from './global.svelte'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { getNonStyleArgs, getStyleFromArgs } from './argHelper'

export const parameters = {
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
  () => Layout,
  withThemeByDataAttribute({
    themes: {
      system: 'system',
      light: 'light',
      dark: 'dark'
    },
    defaultTheme: 'system',
    attributeName: 'data-theme'
  })
]
export const tags = ['autodocs']
