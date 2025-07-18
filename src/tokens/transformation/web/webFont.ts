import { Transform } from 'style-dictionary'

const notDefault = (value, defaultValue) =>
  value !== defaultValue ? value : ''

const SYSTEM_UI_STACK =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const isSFPro = (name: string) =>
  /^(SF Pro|SFPro|San Francisco|SF Pro Display|SF Pro Text|SF Pro Rounded)$/i.test(
    name
  )

const fontFamily = (
  { fontFamily },
  { fontFamilies }: { fontFamilies?: { [key: string]: string } } = {}
) => {
  const resolved =
    fontFamilies && fontFamilies[fontFamily]
      ? fontFamilies[fontFamily]
      : fontFamily
  return isSFPro(resolved) ? SYSTEM_UI_STACK : resolved
}

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-fontStyle'
  },
  transformer: function ({ value: font }, platform) {
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
