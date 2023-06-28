type Handler = (e: MouseEvent) => void

export default function clickOutside(
  node: HTMLUnknownElement,
  handler: Handler
) {
  let lastHandler: Handler
  const attachHandler = (handler: Handler) => {
    if (lastHandler) document.removeEventListener('click', lastHandler)

    lastHandler = (e: MouseEvent) => {
      const path = e.composedPath()
      if (path.includes(node)) return

      if (handler) handler(e)
    }

    document.addEventListener('click', lastHandler)
  }
  attachHandler(handler)

  return {
    destroy() {
      document.removeEventListener('click', lastHandler)
    },
    update(handler: Handler) {
      attachHandler(handler)
    }
  }
}
