import StyleDictionary from 'style-dictionary'
import _template from 'lodash/template'
import fs from 'fs'
import { camelCase, snakeCase } from 'change-case'
import colorsets from './colorsets'
import fontStyles from './fontStyles'

export default {
  hooks: {
    actions: {
      'ios/colorSets': colorsets,
      'ios/fontStyles': fontStyles
    },
    formats: {},
    transforms: {}
  }
}

StyleDictionary.registerFormat({
  name: 'ios/gradients',
  format: async ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(
        new URL('./templates/Gradients.swift.template', import.meta.url)
      )
    )

    const gradients = {
      linear: dictionary.allTokens
        .filter(
          (token) =>
            token.type === 'custom-gradient' &&
            token.value.gradientType === 'linear'
        )
        .map((token) => {
          token.name = camelCase(token.path.pop() || '')
          return token
        })
    }

    return template({ gradients, options, file })
  }
})

StyleDictionary.registerFormat({
  name: 'ios/colorSetAccessors',
  format: async ({ dictionary, options, file }) => {
    const template = _template(
      fs.readFileSync(
        new URL('./templates/ColorSetAccessors.swift.template', import.meta.url)
      )
    )

    const colors = {}
    dictionary.allTokens
      .filter((token) => token.type === 'color')
      .forEach((token) => {
        if (token.name === 'ColorBlack' || token.name === 'ColorWhite') {
          // The system already provides these and will conflict with the names
          return
        }
        const name = snakeCase(
          token.path
            .filter(
              (path) => path !== 'dark' && path !== 'light' && path !== 'color'
            )
            .join(' ')
        )
        colors[name] = camelCase(name).replace('_', '') // Xcode 15 accessors generate without underscores
      })
    return template({ colors, options, file })
  }
})

StyleDictionary.registerAction({
  name: 'ios/colorSets',
  do: colorsets.do,
  undo: colorsets.undo
})
