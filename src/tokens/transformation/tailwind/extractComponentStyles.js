import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import postcss from 'postcss'
import postcssJs from 'postcss-js'
import sortMediaQueries from 'postcss-sort-media-queries'
import preprocess from 'svelte-preprocess'
import * as svelte from 'svelte/compiler'
import { fileURLToPath } from 'url'
import theme from '../../../postcss/theme.js'
import { walk } from '../../../scripts/common'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const writePlugin = async (contents, name, dir) => {
  const fnName = name === 'link' ? 'addBase' : 'addComponents'

  try {
    await writeFile(
      path.join(dir, `${name}Component.js`),
      `const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ ${fnName}, theme }) {
${fnName}(${JSON.stringify(contents, null, 2)});
});`
    )
  } catch (e) {
    if (e.code === 'ENOENT') {
      await mkdir(dir, { recursive: true })
      await writePlugin(contents, name, dir)
    } else {
      console.error(e)
    }
  }
}

export default {
  do: async function (dictionary, config) {
    for await (const file of await walk(
      path.join(dirname, '../../../components')
    )) {
      const fileParts = path.parse(file)
      if (!file.includes('.stories.') && fileParts.ext === '.svelte') {
        const componentFile = await readFile(file, 'utf-8')
        const { code: Component } = await svelte.preprocess(
          componentFile,
          [
            preprocess({
              postcss: {
                plugins: [theme, sortMediaQueries()]
              }
            })
          ],
          {
            filename: 'App.svelte'
          }
        )

        const svelteOutput = svelte.compile(Component, {
          generate: 'ssr',
          cssHash: () => 'REMOVE_ME'
        })

        const rawCSS = svelteOutput?.css?.code;

        if (rawCSS) {
          const css = rawCSS.replace(/:where\(\.REMOVE_ME\)|\.REMOVE_ME/g, '');
          const root = postcss.parse(css)

          // Remove disallowed selectors/rules
          const disallowedSelectors = [':host']
          root.walkRules((rule) => {
            if (!disallowedSelectors.some((ds) => rule.selector.includes(ds))) {
              return
            }
            rule.selectors = rule.selectors.filter(
              (s) => !disallowedSelectors.some((ds) => s.includes(ds))
            )
            if (!rule.selector) rule.remove()
          })

          // Prevent at-rule merging by making each unique
          const atRuleCounters = {}
          root.walkAtRules((atRule) => {
            const ruleName = atRule.name
            if (!atRuleCounters[ruleName]) {
              atRuleCounters[ruleName] = 0
            }
            if (atRuleCounters[ruleName] > 0) {
              atRule.params =
                atRule.params + ` /* ${atRuleCounters[ruleName]} */`
            }
            atRuleCounters[ruleName]++
          })

          const cssAsJs = postcssJs.objectify(root)
          const pluginDir = path.join(config.buildPath, 'plugins/components')

          await writePlugin(cssAsJs, fileParts.name, pluginDir)
        }
      }
    }
  },
  undo: function () {}
}
