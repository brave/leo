type Handler = (e: Event) => void

export default function clickOutside(
  node: HTMLUnknownElement,
  handler: Handler
) {
  let lastHandler: Handler
  const attachHandler = (handler: Handler) => {
    if (lastHandler) {
      document.removeEventListener('click', lastHandler)
      window.removeEventListener('blur', lastHandler)
    }

    lastHandler = (e: Event) => {
      const path = e.composedPath()
      if (path.includes(node)) return

      if (handler) handler(e)
    }

    document.addEventListener('click', lastHandler)
    window.addEventListener('blur', lastHandler)
  }
  attachHandler(handler)

  return {
    destroy() {
      document.removeEventListener('click', lastHandler)
      window.removeEventListener('blur', lastHandler)
    },
    update(handler: Handler) {
      attachHandler(handler)
    }
  }
}
