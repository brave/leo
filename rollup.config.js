import svelteTypes from 'rollup-plugin-svelte-types'
import sveltePreprocess from 'svelte-preprocess'
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'

export default {
    external: [
        'react',
        'react-dom'
    ],
    input: [
        './web-components/button/button.svelte',
        './web-components/svelte-react.ts'
    ],
    output: {
        dir: 'build',
        entryFileNames: source => {
            const relativePath = path.relative('.', path.resolve(source.facadeModuleId, '..'));
            return path.join(relativePath, '[name].js')
        },
        sourcemap: true
    },
    plugins: [
        svelteTypes(),
        svelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                customElement: true
            },
            include: 'web-components/**/*.svelte'
        }),
        resolve({ browser: true }),
        typescript(),
    ]
}
