const svelte = require('svelte/compiler')
const { readdirSync, statSync } = require('fs')
const { writeFile, readFile } = require('fs/promises')
const { join, parse } = require('path')
const preprocess = require('svelte-preprocess')
const postcssJs = require('postcss-js')
const postcss = require('postcss')
const sortMediaQueries = require('postcss-sort-media-queries')()
const theme = require('../../../postcss/theme')
const { walk } = require('../../../scripts/common')

module.exports = {
  do: async function (dictionary, config) {
    for await (const file of await walk(
      join(__dirname, '../../../components')
    )) {
      const fileParts = parse(file)
      if (!file.includes('.stories.') && fileParts.ext === '.svelte') {
        const componentFile = await readFile(file, 'utf-8')
        const { code: Component } = await svelte.preprocess(
          componentFile,
          [
            preprocess({
              postcss: {
                plugins: [theme, sortMediaQueries]
              }
            })
          ],
          {
            filename: 'App.svelte'
          }
        )

        const {
          css: { code: rawCSS }
        } = svelte.compile(Component, {
          generate: 'ssr',
          cssHash: () => 'REMOVE_ME'
        })

        if (rawCSS) {
          const css = rawCSS.replace(/\.REMOVE_ME/g, '')
          const root = postcss.parse(css)
          let cssAsJs = postcssJs.objectify(root)

          const fnName = fileParts.name === 'link' ? 'addBase' : 'addComponents'

          await writeFile(
            join(config.buildPath, 'plugins', `${fileParts.name}Component.js`),
            `const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ ${fnName}, theme }) {
	${fnName}(${JSON.stringify(cssAsJs, null, 2)});
});`
          )
        }
      }
    }
  },
  undo: function () {}
}
