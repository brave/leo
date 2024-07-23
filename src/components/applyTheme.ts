import {
  themeFromSourceColor,
  argbFromHex,
  hexFromArgb
} from '@material/material-color-utilities'

const copyOver = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'neutralVariant',
  'error'
]

const tones = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100
]

const formatColor = (name: string, tone: number, value: number) =>
  `--leo-color-primitive-${name}-${tone}: ${hexFromArgb(value)};`

const sheet = new CSSStyleSheet()
export const applyTheme = (primaryColor: string) => {
  const theme = themeFromSourceColor(argbFromHex(primaryColor), [])

  const variables = []

  for (const colorName of copyOver) {
    const color = theme.palettes[colorName]
    for (const tone of tones) {
      variables.push(formatColor(colorName, tone, color.tone(tone)))
    }
  }

  sheet.replaceSync(`:root {
        ${variables.join('\n')}
    }`)

  if (!document.adoptedStyleSheets.includes(sheet)) {
    document.adoptedStyleSheets.push(sheet)
  }
}

window['applyTheme'] = applyTheme
