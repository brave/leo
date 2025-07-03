import { Window } from 'happy-dom'

const globals = new Window()

global.window = globals.window as any
global.document = globals.document as any
global.customElements = globals.customElements as any
global.HTMLElement = globals.HTMLElement as any
global.MutationObserver = globals.MutationObserver as any

/**
 * Renders custom elements to the DOM, so they render before JavaScript is
 * loaded. Elements which require JavaScript for interactivity will **NOT**
 * work until the JavaScript loads.
 * @param html The HTML to render
 * @param imports The custom elements to load - these must be imported
 * dynamically so HappyDOM can load before they are imported.
 * @returns The rendered HTML
 */
export async function render(
  html: string,
  imports: (() => Promise<unknown>)[] = []
) {
  await Promise.all(imports.map((init) => init()))

  const document = globals.document
  document.documentElement.innerHTML = html

  await globals.happyDOM.waitUntilComplete()

  return document.documentElement.getHTML({ serializableShadowRoots: true })
}
