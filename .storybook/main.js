const path = require('path')
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  "stories": [
    "../web-components/**/*.stories.svelte",
    "../web-components/**/*.stories.js",
  ],
  "addons": [
    '@storybook/addon-svelte-csf',
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/preset-scss'
  ],
  "framework": "@storybook/svelte",
  svelteOptions: {
    preprocess: sveltePreprocess({
      postcss: {
        plugins: [require('../postcss/theme')({ useGlobal: true })]
      }
    }),
    customElement: true,
  },
  staticDirs: [{
    from: '../icons',
    to: '/icons'
  }],
  // svelteOptions: {
  //   preprocess: preprocess(), // or `preprocess: [svelteTS()]` in your case
  //  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        svelte: path.resolve("node_modules", "svelte"),
      },
      // Make sure we compile stories.svelte files
      extensions: [...config.resolve.extensions, ".svelte"],
      mainFields: ["svelte", ...config.resolve.mainFields],
    };

    // Return the altered config
    return config;
  },
}
