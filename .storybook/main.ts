import path from 'path'
import sveltePreprocess from 'svelte-preprocess'

export default {
  stories: [
    '../src/tokens/**/*.stories.svelte',
    '../src/components/**/*.stories.svelte',
    '../src/components/**/*.stories.js'
  ],

  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-scss',
    '@storybook/addon-storysource'
  ],
  framework: { name: '@storybook/svelte-vite' },
  staticDirs: [
    {
      from: '../icons',
      to: '/icons'
    },
    {
      from: '../tokens/css',
      to: '/css'
    }
  ]
}
