import type { Transform } from 'style-dictionary/types'

const notDefault = (value, defaultValue) =>
  value !== defaultValue ? value : ''

const fontFamily = (
  { fontFamily },
  { fontFamilies }: { fontFamilies?: { [key: string]: string } } = {}
) =>
  fontFamilies && fontFamilies[fontFamily]
    ? fontFamilies[fontFamily]
    : fontFamily

export default {
  name: 'web/font',
  type: 'value',
  filter: function (token) {
    return token.type === 'custom-fontStyle'
  },
  transform: function ({ value: font }, platform) {
    // font: font-style font-variant font-weight font-size/line-height font-family;
    return `${notDefault(font.fontStretch, 'normal')} ${notDefault(
      font.fontStyle,
      'normal'
    )} ${font.fontWeight} ${font.fontSize}px/${font.lineHeight}px ${fontFamily(
      font,
      platform?.options as any
    )}`.trim()
  }
} as Transform
