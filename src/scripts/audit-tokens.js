const fs = require('fs/promises')
const path = require('path')
const { getSvelteFiles, walk } = require('./common')

const tokenRegex = /--leo-([a-zA-Z0-9]|-)+/gi
const ROOT_FOLDER = path.join(__dirname, '..', '..')
const CSS_VARIABLES = path.join(ROOT_FOLDER, 'tokens', 'css', 'variables.css')
const COMPONENTS_FOLDER = path.join(ROOT_FOLDER, 'src', 'components')

/**
 * Extracts all Leo tokens from a piece of text
 * @param {string} text
 * @returns {string[]} All the Leo CSS variables in the source text. Not deduplicated
 */
const extractTokens = (text) => {
    return Array.from(text.matchAll(tokenRegex)).map(([v]) => v)
}

/**
 * Extracts all Leo tokens from a file
 * @param {string} file The path of the file
 * @returns {string[]}
 */
const extractTokensFromFile = async (file) => {
    const text = await fs.readFile(file, 'utf-8')
    return extractTokens(text)
}

/**
 * Extracts all tokens from subfiles in a folder with the provided extensions
 * @param {string} folder The folder to search for tokens
 * @param {string[]} extensions The file extensions to check. If undefined, all files will be checked.
 * @returns {Promise<string[]>} Not deduplicated
 */
const extractTokensFromFolder = async (folder, extensions) => {
    console.log(folder)
    const result = []
    for await (const file of await walk(folder)) {
        console.log(file)
        if (extensions && !extensions.some(e => file.endsWith(e))) {
            continue;
        }

        const tokens = await extractTokensFromFile(file)
        result.push(...tokens)
    }
    return result
}

/**
 * Returns a set of all available Leo tokens
 * @returns {Promise<Set<string>>}
 */
const getAvailableTokens = async () => {
    const available = new Set();

    // Include all variables from out tokens file
    for (const v of await extractTokensFromFile(CSS_VARIABLES))
        available.add(v)

    // Include all variables used to customize components
    for (const v of await extractTokensFromFolder(COMPONENTS_FOLDER, ['.svelte']))
        available.add(v)

    return available
}

getAvailableTokens().then((tokens) => {
    console.log(Array.from(tokens).join('\n'))
    console.log(tokens.size)
})
