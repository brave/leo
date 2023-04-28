import { tick } from 'svelte'

export default function clickOutside(
  node: HTMLUnknownElement,
  handler: (e: MouseEvent) => void
) {
  const isClickOutside = (e: MouseEvent) => {
    const path = e.composedPath()
    if (path.includes(node)) return

    handler(e)
  }

  setTimeout(() => document.addEventListener('click', isClickOutside))

  return {
    destroy() {
      document.removeEventListener('click', isClickOutside)
    }
  }
}
