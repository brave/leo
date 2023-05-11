export default function clickOutside(
  node: HTMLUnknownElement,
  handler: (e: MouseEvent) => void
) {
  const isClickOutside = (e: MouseEvent) => {
    const path = e.composedPath()
    if (path.includes(node)) return

    handler(e)
  }

  // Note: This needs to be inside a `setTimeout` so when this is added via a
  // click it doesn't handle that same click.
  setTimeout(() => document.addEventListener('click', isClickOutside))

  return {
    destroy() {
      document.removeEventListener('click', isClickOutside)
    }
  }
}
