const fs = require('fs/promises');
const path = require('path');
const { getSvelteFiles } = require('./common');

const COMPONENT_PREFIX = 'leo';
const SVELTE_REACT_WRAPPER_PATH = path.resolve(__dirname, '../web-components/svelte-react');
const REACT_FILE_NAME = 'react.ts';

const getComponentGenerics = async (svelteFilePath, componentName) => {
    const typingsPath = svelteFilePath += '.d.ts'
    const typingsContents = await fs.readFile(typingsPath);
    const genericsMatcher = new RegExp(`${componentName}<(.*)> extends SvelteComponentTyped`, 'gm')

    const result = genericsMatcher.exec(typingsContents)
    if (!result) return []

    return result[1]
        // Note: This will break if we have multiple, nested generic type arguments.
        .split(',')
        .map(param => {
            const constraintStart = ' extends '
            const constraintIndex = param.indexOf(constraintStart)
            if (constraintIndex === -1) return { name: param }

            const name = param.substring(0, constraintIndex).trim()
            const constraint = param.substring(constraintIndex + constraintStart.length).trim()
            return { name, constraint }
        })


}

const getReactFileContents = async (svelteFilePath) => {
    const fileDir = path.dirname(svelteFilePath);
    const svelteReactWrapperRelativePath = path.relative(fileDir, SVELTE_REACT_WRAPPER_PATH);

    const fileName = path.basename(svelteFilePath);
    const extension = path.extname(fileName);
    const fileNameWithoutExtension = fileName.substring(0, fileName.length - extension.length);
    const componentName = fileNameWithoutExtension[0].toUpperCase() + fileNameWithoutExtension.substring(1);
    const generics = await getComponentGenerics(svelteFilePath, componentName)
    const hasGenerics = !!generics.length
    const funcConstraints = hasGenerics
        ? `<${generics.map(g => `${g.name} extends ${g.constraint}`).join(', ')}>`
        : ''
    const propParams = hasGenerics
        ? `<${generics.map(g => g.name).join(', ')}>`
        : ''

    const fileContents = `
import type * as React from 'react';
import SvelteToReact, { type ReactProps } from '${svelteReactWrapperRelativePath}';
import ${componentName} from './${fileName}';
import type { ${componentName}Events as SvelteEvents, ${componentName}Props as SvelteProps } from './${fileName}';

export type ${componentName}Props = ReactProps<SvelteProps${propParams}, SvelteEvents${propParams}>;
export type ${componentName}Ref = HTMLElement & ${componentName}Props;
const Untyped = SvelteToReact('${COMPONENT_PREFIX}-${fileNameWithoutExtension}', ${componentName});
export default function ${componentName}React${funcConstraints}(props: React.PropsWithChildren<${componentName}Props>) {
    return Untyped(props)
}
    `.trim();

    return fileContents
}

const createReactBinding = async (svelteFilePath) => {
    const contents = await getReactFileContents(svelteFilePath);
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
