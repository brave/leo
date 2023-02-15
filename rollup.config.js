// rollup.config.js
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import sveltePreprocess from 'svelte-preprocess'
import themePlugin from './src/postcss/theme.js'
import fs from 'fs/promises'
import path from 'path'
import genTypes from './src/scripts/gen-svelte-types.js'
import genBindings from './src/scripts/gen-react-bindings.js'
import { getSvelteFiles } from './src/scripts/common.js'

// Entry points are all our Svelte components + the react bindings for those
// components.
const COMPONENTS_FOLDER = path.resolve('./', 'src', 'components')
const inputs = []

for await (const file of getSvelteFiles(COMPONENTS_FOLDER, false)) {
  inputs.push(file)
}

inputs.push('./src/components/svelte-react.ts')

export default {
  input: inputs,
  // Note we output in ESM & AMD formats to make it easier to consume Leo from
  // different places.
  output: {
    sourcemap: true,
    dir: './',
    chunkFileNames: 'shared/[hash].js',
    entryFileNames: ({ facadeModuleId, name }) => {
      // Web component
      if (facadeModuleId.endsWith('.svelte')) {
        return `web-components/${name}.js`
      }

      // Util files for Svelte, like svelte-react
      return `svelte/[name].js`
    },
    format: 'esm'
  },
  // React is external - Leo doesn't need it but its React bindings do. We'll
  // use whatever version of React the consumer is using, but we don't want it
  // to be a peer dependency.
  external: ['react'],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: './svelte',
      sourceMap: true
    }),
    svelte({
      include: 'src/components/**/*.svelte',
      preprocess: sveltePreprocess({
        postcss: {
          plugins: [themePlugin({ useGlobal: true })]
        }
      }),
      // Don't emit CSS - it doesn't work properly with Web Components.
      emitCss: false,
      compilerOptions: {
        customElement: true
      }
    }),
    resolve({ browser: true }),
    {
      name: 'postBuildCopySvelteTypesAndGenerateBindings',
      buildEnd: {
        async handler() {
          // To get the type definitions working properly for consumers we create
          // a copy of the Svelte component type definitions in the svelte folder.
          await genTypes({
            baseDir: './',
            outputDir: './svelte'
          })

          // Once we have the type definitions, we can generate the React
          // wrapper.
          await genBindings('./src/components')
        }
      }
    }
  ]
}
