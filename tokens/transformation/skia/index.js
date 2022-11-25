const StyleDictionary = require('style-dictionary')
const _template = require('lodash/template')
const fs = require('fs')

StyleDictionary.registerTransformGroup({
  name: 'skia',
  transforms: StyleDictionary.transformGroup.css.concat([
    'color/hex8ToRgbaPartial'
  ])
})

const filteredTokens = (dictionary, filterFn) => {
  let filtered = dictionary.allTokens;
  if (typeof filterFn === "function") {
    filtered = dictionary.allTokens.filter(token => filterFn(token))
  }

  filtered = filtered.map(tokens => {
    // convert to hex
    const value = tokens.value.split(',')
    .map(s => '0x' + Number(s).toString(16).padStart(2, '0').toUpperCase())
    // convert to chromium's pascalCase convention
    const name = 'k' + tokens.name.split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join('')
      .replace('Light', '')
      .replace('Dark', '')
    return { ...tokens, name, value }
  })

  return {
    ...dictionary,
    ...{
      allProperties: filtered,
      allTokens: filtered
    }
  }
}

StyleDictionary.registerFormat({
  name: 'skia/colors.h',
  formatter: ({dictionary, options, file}) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/colors.h.template')
    );
    
    const groupedTokens = {
      // Note: Here we check includes because the light/dark part of the token
      // could be 2nd (for normal colors) or 3rd (for legacy colors).
      light: filteredTokens(dictionary, (token) => token.path.includes('light')),
      dark: filteredTokens(dictionary, (token) => token.path.includes('dark')),
      rest: filteredTokens(dictionary)
    }

    return template({ groupedTokens, options, file });
  }  
})
