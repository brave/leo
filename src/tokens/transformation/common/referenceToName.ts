/**
 * Converts a referencedVariable to the same format that style-dictionary uses for variable names
 * $primary.10 ==> color-primary-10
 */
export default function referenceToName(reference: string) {
  return `color.${reference.substring(1)}`.split('.').join('-')
}
