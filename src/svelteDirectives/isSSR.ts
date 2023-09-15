export default (function isSSR(): boolean {
  try {
    return typeof document === 'undefined'
  } catch (e) {
    return true
  }
})()
