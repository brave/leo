const fs = require('fs/promises');
const path = require('path');
const { getSvelteFiles } = require('./common');

const COMPONENT_PREFIX = 'leo';
const SVELTE_REACT_WRAPPER_PATH = path.resolve(__dirname, '../web-components/svelte-react');
const REACT_FILE_NAME = 'react.ts';

const getReactFileContents = (svelteFilePath) => {
    const fileDir = path.dirname(svelteFilePath);
    const svelteReactWrapperRelativePath = path.relative(fileDir, SVELTE_REACT_WRAPPER_PATH);

    const fileName = path.basename(svelteFilePath);
    const extension = path.extname(fileName);
    const fileNameWithoutExtension = fileName.substring(0, fileName.length - extension.length);
    const componentName = fileNameWithoutExtension[0].toUpperCase() + fileNameWithoutExtension.substring(1);
    const fileContents = `
import SvelteToReact, { type ReactProps } from '${svelteReactWrapperRelativePath}';
import ${componentName} from './${fileName}';
import type { ${componentName}Events, ${componentName}Props } from './${fileName}';

export default SvelteToReact<ReactProps<${componentName}Props, ${componentName}Events>>('${COMPONENT_PREFIX}-${fileNameWithoutExtension}', ${componentName});
    `.trim();

    return fileContents
}

const createReactBinding = async (svelteFilePath) => {
    const contents = getReactFileContents(svelteFilePath);
    const reactFilePath = path.join(path.dirname(svelteFilePath), REACT_FILE_NAME);

    await fs.writeFile(reactFilePath, contents);
}

const createReactBindings = async (rootDir) => {
    for await (const sveltePath of getSvelteFiles(rootDir, /*includeDts=*/false)) {
        console.log(`Creating React Binding for ${sveltePath}`);
        await createReactBinding(sveltePath);
    }
}

createReactBindings('./web-components')
