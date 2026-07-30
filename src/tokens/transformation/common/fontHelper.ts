const SYSTEM_UI_STACK =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const MONOSPACE_STACK = 'ui-monospace, monospace'

const isSFPro = (name: string) =>
  /^(SF Pro|SFPro|San Francisco|SF Pro Display|SF Pro Text|SF Pro Rounded)$/i.test(
    name
  )

const isSFMono = (name: string) =>
  /^(SF Mono|SFMono|San Francisco Mono|SF Mono Regular|SF Mono Italic)$/i.test(
    name
  )

export const fontFamily = (
  { fontFamily }: { fontFamily: string },
  { fontFamilies }: { fontFamilies?: { [key: string]: string } } = {}
) => {
  const resolved = fontFamilies?.[fontFamily] ?? fontFamily
  if (isSFPro(resolved)) {
    return SYSTEM_UI_STACK
  }
  if (isSFMono(resolved)) {
    return MONOSPACE_STACK
  }
  return resolved
}
