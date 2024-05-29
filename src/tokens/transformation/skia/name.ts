// convert to chromium's pascalCase convention
/**
 * @param {{ name: string }} Token
 * @returns The transformed name for the token
 */
export const transformName = ({ name }: { name: string }) =>
  `k${name
    .split(/,|\-/)
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join('')
    .replace('Light', '')
    .replace('Dark', '')}`
