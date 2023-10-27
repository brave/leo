const svelte = require('svelte/compiler')
const { writeFile, readFile, mkdir } = require('fs/promises')
const { join, parse } = require('path')
const preprocess = require('svelte-preprocess')
const postcssJs = require('postcss-js')
const postcss = require('postcss')
const sortMediaQueries = require('postcss-sort-media-queries')()
const theme = require('../../../postcss/theme')
const { walk } = require('../../../scripts/common')

const writePlugin = async (contents, name, dir) => {
  const fnName = name === 'link' ? 'addBase' : 'addComponents'

  try {
    await writeFile(
      join(dir, `${name}Component.js`),
      `const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ ${fnName}, theme }) {
${fnName}(${JSON.stringify(contents, null, 2)});
});`
    )
  } catch (e) {
    if (e.code === 'ENOENT') {
      await mkdir(dir)
      await writePlugin(contents, name, dir)
    } else {
      console.error(e)
    }
  }
}

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
          const cssAsJs = postcssJs.objectify(root)
          const pluginDir = join(config.buildPath, 'plugins/components')

          await writePlugin(cssAsJs, fileParts.name, pluginDir)
        }
      }
    }
  },
  undo: function () {}
}
