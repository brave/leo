const StyleDictionary = require('style-dictionary')
const _template = require('lodash/template')
const fs = require('fs')
const changeCase = require('change-case')

module.exports = {
  transform: {},
  format: {},
  action: {
    'ios/colorSets': require('./colorsets'),
    'ios/fontStyles': require('./fontStyles')
  }
}

StyleDictionary.registerFormat({
  name: 'ios/gradients',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/Gradients.swift.template')
    )

    const gradients = {
      linear: dictionary.allTokens
        .filter(
          (token) =>
            token.type === 'custom-gradient' &&
            token.value.gradientType === 'linear'
        )
        .map((token) => {
          token.name = changeCase.camelCase(token.path.pop())
          return token
        })
    }

    return template({ gradients, options, file })
  }
})

StyleDictionary.registerFormat({
  name: 'ios/colorSetAccessors',
  formatter: ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ColorSetAccessors.swift.template')
    )

    const colors = {}
    dictionary.allTokens
      .filter((token) => token.type === 'color')
      .forEach((token) => {
        if (token.name === 'ColorBlack' || token.name === 'ColorWhite') {
          // The system already provides these and will conflict with the names
          return
        }
        const name = changeCase.snakeCase(
          token.path
            .filter(
              (path) => path !== 'dark' && path !== 'light' && path !== 'color'
            )
            .join(' ')
        )
        colors[name] = changeCase.camelCase(name).replace('_', '') // Xcode 15 accessors generate without underscores
      })
    return template({ colors, options, file })
  }
})

StyleDictionary.registerAction({
  name: 'ios/colorSets',
  do: require('./colorsets').do,
  undo: require('./colorsets').undo
})
