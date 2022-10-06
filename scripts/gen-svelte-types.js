const svelte2tsx = require('svelte2tsx');
const fs = require('fs/promises');
const path = require('path');
const { getSvelteFiles } = require('./common');

const tmpFolder = `build/tmp/web-component-types`;

const genTypes = async (options = {}) => {
    const { basePath = './', outputDir = './' } = options;

    await fs.mkdir(tmpFolder, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    await svelte2tsx.emitDts({
        libRoot: basePath,
        declarationDir: tmpFolder,
        svelteShimsPath: require.resolve('svelte2tsx/svelte-shims.d.ts')
    })
    for await (const tmpFile of getSvelteFiles(tmpFolder)) {
        const relativePath = path.relative(tmpFolder, tmpFile);
        console.log(`Generating Svelte types for ${relativePath}`)

        const destination = path.join(outputDir, relativePath);
        const destinationDir = path.dirname(destination);
        await fs.mkdir(destinationDir, { recursive: true });
        await fs.copyFile(tmpFile, destination);
    }

    await fs.rm(tmpFolder, { recursive: true, force: true });
}

genTypes({
    basePath: './',
    outputDir: './web-components',
}).then(() => console.log('Done'));
