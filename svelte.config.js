import themePlugin from './src/postcss/theme.js'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const IGNORE_WARNINGS = [
  'a11y-no-static-element-interactions',
  'a11y-click-events-have-key-events'
]

export const onwarn = (warning, handler) => {
  if (IGNORE_WARNINGS.includes(warning.code)) return
  handler(warning)
}

// Note: This is the default Svelte config. At the moment, it is only used for
// Storybook, as the WebComponents compile is slightly different.
export default {
  extensions: ['.svelte'],
  preprocess: vitePreprocess({
    script: true,
    postcss: {
      plugins: [
        themePlugin({
          wrapSelector: (selector) => `:global(${selector})`
        })
      ]
    }
  }),
  onwarn
}
