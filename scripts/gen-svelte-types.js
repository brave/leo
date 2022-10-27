const svelte2tsx = require('svelte2tsx');
const fs = require('fs/promises');
const path = require('path');

const tmpFolder = `build/tmp/web-component-types`;

async function* walk(dir) {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

const genTypes = async (options = {}) => {
    const { basePath = './', outputDir = './', genDefinition = (path) => true } = options;

    await fs.mkdir(tmpFolder, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    await svelte2tsx.emitDts({
        libRoot: basePath,
        declarationDir: tmpFolder,
        svelteShimsPath: require.resolve('svelte2tsx/svelte-shims.d.ts')
    })

    for await (const tmpFile of walk(tmpFolder)) {
        const relativePath = path.relative(tmpFolder, tmpFile);
        if (!genDefinition(relativePath)) continue

        const destination = path.join(outputDir, relativePath);
        const destinationDir = path.dirname(destination);
        await fs.mkdir(destinationDir, { recursive: true });
        await fs.copyFile(tmpFile, destination);
    }

    await fs.rm(tmpFolder, { recursive: true, force: true });
}

// Export this, so other scripts can wait for it to complete.
module.exports = genTypes({
    basePath: './',
    outputDir: './web-components',
    genDefinition: path => path.includes('.svelte') && !path.includes('.stories.svelte')
});
