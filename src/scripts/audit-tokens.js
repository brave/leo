#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { walk } = require('./common')

const tokenRegex = /--leo-([a-zA-Z0-9]|-)+/gi
const ROOT_FOLDER = path.join(__dirname, '..', '..')
const CSS_VARIABLES = path.join(ROOT_FOLDER, 'tokens', 'css', 'variables.css')
const COMPONENTS_FOLDER = path.join(ROOT_FOLDER, 'src', 'components')
const DEFAULT_EXTENSIONS_TO_CHECK = [
  '.css',
  '.scss',
  '.sass',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.less',
  '.lss',
  '.svelte'
]
const IGNORE = ['node_modules']

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
 * @param {string[]} ignore Path segments which should be skipped, like |node_modules|
 * @returns {Promise<string[]>} Not deduplicated
 */
const extractTokensFromFolder = async (folder, extensions, ignore = []) => {
  const result = []
  for await (const file of await walk(folder, (name) =>
    ignore.some((i) => i === name)
  )) {
    if (extensions && !extensions.some((e) => file.endsWith(e))) {
      continue
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
  const available = new Set()

  // Include all variables from out tokens file
  for (const v of await extractTokensFromFile(CSS_VARIABLES)) available.add(v)

  // Include all variables used to customize components
  for (const v of await extractTokensFromFolder(COMPONENTS_FOLDER, ['.svelte']))
    available.add(v)

  return available
}

/**
 * Checks a folder to see if any files in it reference non-existent Leo tokens
 * @param {string} folder The folder to check for unknown Leo tokens
 */
const checkFolder = async (folder) => {
  const availableTokens = await getAvailableTokens()
  const usedTokens = await extractTokensFromFolder(
    folder,
    DEFAULT_EXTENSIONS_TO_CHECK,
    IGNORE
  )

  const missingTokens = usedTokens.filter((t) => !availableTokens.has(t))
  if (missingTokens.length) {
    console.error(`Found ${missingTokens.length} invalid tokens`)
    console.error(missingTokens.map((t) => `  ${t}`).join('\n'))
    console.error(
      'The above tokens are not present in Leo, and may have been used by mistake.'
    )
    process.exit(1)
  }
  console.log('Success!')
}

checkFolder(process.cwd())
