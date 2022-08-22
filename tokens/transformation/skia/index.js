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
      .replace('LightMode', '')
      .replace('DarkMode', '')
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
      // if you export the prefixes use token.path[0] instead of [1]
      light: filteredTokens(dictionary, (token) => token.path[2]?.toLowerCase() === 'light-mode'),
      dark: filteredTokens(dictionary, (token) => token.path[2]?.toLowerCase() === 'dark-mode'),
      rest: filteredTokens(dictionary)
    }

    return template({ groupedTokens, options, file });
  }  
})
