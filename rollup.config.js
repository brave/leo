// rollup.config.js
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import themePlugin from './src/postcss/theme.js'
import path from 'path'
import genTypes from './src/scripts/gen-types.js'
import genWebBindings from './src/scripts/gen-web-bindings.js'
import genReactBindings from './src/scripts/gen-react-bindings.js'
import { getSvelteFiles } from './src/scripts/common.js'
import { onwarn } from './svelte.config.js'
// Entry points are all our Svelte components + the react bindings for those
// components.
const COMPONENTS_FOLDER = path.resolve('./', 'src', 'components')
const inputs = []

for await (const file of getSvelteFiles(COMPONENTS_FOLDER, false)) {
  inputs.push(file)
}

inputs.push('./src/components/svelte-react.ts')
inputs.push('./src/components/svelte-web.ts')
inputs.push('./src/components/applyTheme.ts')
inputs.push('./src/components/dialogHelpers.ts')

export default {
  input: inputs,
  // Note we output in ESM & AMD formats to make it easier to consume Leo from
  // different places.
  output: {
    sourcemap: true,
    dir: './',
    chunkFileNames: 'shared/[hash].js',
    entryFileNames: ({ name }) => `shared/${name}.js`,
    format: 'esm'
  },
  // React is external - Leo doesn't need it but its React bindings do. We'll
  // use whatever version of React the consumer is using, but we don't want it
  // to be a peer dependency.
  external: ['react'],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: './types',
      sourceMap: true
    }),
    // Emit type declarations for non-component helpers to the shared folder.
    typescript({
      declaration: true,
      emitDeclarationOnly: true,
      declarationDir: './shared',
      include: ['src/components/**/*.ts']
    }),
    svelte({
      include: 'src/components/**/*.svelte',
      preprocess: vitePreprocess({
        script: true,
        postcss: {
          plugins: [
            themePlugin({
              wrapSelector: (selector) => `:global(:host-context(${selector}))`
            })
          ]
        }
      }),
      // Don't emit CSS - it doesn't work properly with Web Components.
      emitCss: false,
      compilerOptions: {
        customElement: false,
        css: 'injected',
        accessors: true
      },
      onwarn
    }),
    resolve({ browser: true }),
    {
      name: 'postBuildCopySvelteTypesAndGenerateBindings',
      buildEnd: {
        async handler() {
          // To get the type definitions working properly for consumers we create
          // a copy of the type definitions in the types folder.
          await genTypes({
            baseDir: './',
            outputDir: './types'
          })

          // Generate Web Components
          await genWebBindings('./src/components')

          // Once we have the type definitions, we can generate the React
          // wrapper.
          await genReactBindings('./src/components')
        }
      }
    }
  ]
}
