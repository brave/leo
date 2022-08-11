const svelte = require('svelte/compiler')
const { readdirSync, statSync } = require('fs')
const { writeFile, readFile } = require('fs/promises')
const { join, parse } = require('path')
const preprocess = require('svelte-preprocess')
const postcssJs = require('postcss-js')
const postcss = require('postcss')
const sortMediaQueries = require('postcss-sort-media-queries')()

module.exports = {
  do: async function (dictionary, config) {
    getAllFiles(join(__dirname, '../../../components'))
      .filter((file) => {
        const fileParts = parse(file)
        return !file.includes('.stories.') && fileParts.ext === '.svelte'
      })
      .map(async (file) => {
        const fileParts = parse(file)
        const componentFile = await readFile(file, 'utf-8')
        const { code: Component } = await svelte.preprocess(
          componentFile,
          [
            preprocess({
              postcss: {
                plugins: [sortMediaQueries]
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

          return writeFile(
            join(config.buildPath, 'plugins', `${fileParts.name}Component.js`),
            `const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addComponents }) {
	addComponents(${JSON.stringify(cssAsJs, null, 2)});
});`
          )
        } else {
          return Promise.resolve()
        }
      })
  },
  undo: function () {}
}

// HT: https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
function getAllFiles(dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles)
    } else {
      arrayOfFiles.push(join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}
