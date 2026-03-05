const SYSTEM_UI_STACK =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export const isSFPro = (name: string) =>
  /^(SF Pro|SFPro|San Francisco|SF Pro Display|SF Pro Text|SF Pro Rounded)$/i.test(
    name
  )

export const isSFMono = (name: string) =>
  /^(SF Mono|SFMono)$/i.test(name)

export const fontFamily = (
  { fontFamily },
  { fontFamilies }: { fontFamilies?: { [key: string]: string } } = {}
) => {
  const resolved = fontFamilies?.[fontFamily] ?? fontFamily
  return isSFPro(resolved) ? SYSTEM_UI_STACK : resolved
}

export const androidFontFamily = ({ fontFamily: name }: { fontFamily: string }) => {
  if (isSFPro(name)) return 'Google Sans Flex'
  if (isSFMono(name)) return 'Google Sans Code'
  return name
}
