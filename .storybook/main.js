const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  "stories": [
    "../web-components/**/*.story.svelte",
    "../web-components/**/*.story.js",
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/preset-scss'
  ],
  "framework": "@storybook/svelte",
  svelteOptions: {
    preprocess: sveltePreprocess(),
    customElement: true,
  },
  // svelteOptions: {
  //   preprocess: preprocess(), // or `preprocess: [svelteTS()]` in your case
  //  },
}