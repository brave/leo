const fs = require('fs')

describe('JS tokens exist as CSS variables', () => {
  const css = fs.readFileSync('./tokens/css/variables.css', 'utf-8')
  const tokenExists = (token) => css.includes(` ${token}:`)

  // Unfortunately because the variables JS is an ESModule we can't just
  // import it here.
  const variables = fs.readFileSync('./tokens/css/variables.ts', 'utf-8')
  const tokenRegex = /var\((.*?)\)/gi

  const matches = variables.matchAll(tokenRegex)

  for (const match of matches) {
    it(`${match[1]} is a real CSS variable in variables.css`, () => {
      expect(tokenExists(match[1])).toBe(true)
    })
  }
})
