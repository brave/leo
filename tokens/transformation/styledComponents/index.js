const StyleDictionary = require('style-dictionary')

// Formats
StyleDictionary.registerFormat({
  name: 'custom/styledComponentsTheme',
  formatter: require('./formatStyledComponentsTheme')
})
