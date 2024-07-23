/**
 * Converts a referencedVariable to the same format that style-dictionary uses for variable names
 * $primary.10 ==> color-primary-10
 * @param {string} reference
 * @returns {string}
 */
export default function referenceToName(reference) {
  return `color.${reference.substring(1)}`.split('.').join('-')
}
