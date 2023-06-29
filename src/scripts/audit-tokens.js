const fs = require('fs/promises')
const path = require('path')
const { getSvelteFiles } = require('./common')

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
 * Returns a set of all available Leo tokens
 * @returns {Promise<Set<string>>}
 */
const getAvailableTokens = async () => {
    const available = new Set();

    // Include all variables from out tokens file
    for (const v of await extractTokensFromFile(CSS_VARIABLES))
        available.add(v)

    // Include all variables used to customize components
    for await (const svelteFile of getSvelteFiles(COMPONENTS_FOLDER)) {
        const variables = await extractTokensFromFile(svelteFile)
        for (const v of variables)
            available.add(v)
    }

    return available
}

getAvailableTokens().then((tokens) => {
    console.log(Array.from(tokens).join('\n'))
    console.log(tokens.size)
})
