import React, { useRef, useEffect } from "react"
import type { SvelteComponent, SvelteComponentTyped } from "svelte"

const eventRegex = /on([A-Z]{1,}[a-zA-Z]*)/
const watchRegex = /watch([A-Z]{1,}[a-zA-Z]*)/

/**
 * Type Utility for inferring the prop types of a Svelte component.
 */
export type SvelteProps<T> = T extends SvelteComponentTyped<infer Props, any, any> ? Props : {};

/**
 * Type utility for inferring event types of a Svelte component.
 */
export type SvelteEvents<T> = T extends SvelteComponentTyped<any, infer Events, any> ? Events : {};

/**
 * Type utility for getting the React props of a Svelte component. This is all
 * the Svelte props and the events mapped to the React `onEventName` format.
 *
 * For example, the event `click` would be mapped to `onClick`.
 */
export type SvelteToReactProps<SvelteComponent> = SvelteProps<SvelteComponent> & {
  [Prop in keyof SvelteEvents<SvelteComponent> as `on${Capitalize<Prop & string>}`]?: SvelteEvents<SvelteComponent>[Prop];
}


// TODO(petemill): 
// When web-components are supported in react (currently only in experimental version), then we can 
// directly use the web-component and define it's availability as a global jsx element, 
// avoiding `SvelteWebComponentToReact`, via:
//
// type CustomElement<T> = Partial<T & React.DOMAttributes<T> & { children: any }>
//
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       ['leo-button']: CustomElement<Props>
//     }
//   }
// }

/**
 * 
 * @param tag custom element tag name for svelte component
 * @param component The imported svelte component itself. This is not used, but ensures that the component's code has been included in the bundle.
 * @returns A react component
 */
export default function SvelteWebComponentToReact<Component extends SvelteComponent>(tag: string, component: { new(...args: any[]): Component }) {
  return function ReactSvelteWebComponent(props: React.PropsWithChildren<SvelteToReactProps<Component>>) {
    const component = useRef<SvelteComponent>()

    const setRef = React.useCallback((ref: SvelteComponent) => {
      if (!ref) {
        console.error('No component for tag', tag)
        return
      }
      if (component.current) {
        console.warn('Component replaced, this should not be common', tag, component.current, ref)
        component.current.$destroy()
      }
      // Make sure we actually made a svelte component. This can
      // go wrong if the custom-element tag name is changed.
      if (!ref.$on) {
        console.error(`Creating element with tag name "${tag}" did not result in a Svelte component! Please make sure the tag name is correct and the component code is included on the page.`)
        return
      }
      component.current = ref

      // Events fire callbacks when the event is dispatched
      // from the svelte component.
      // Watchers fire callbacks when the variable (aka property or attribute)
      // of the svelte component is changed.
      const watchers: [string, Function][] = []
      for (const key in props) {
        if (typeof props[key] !== 'function') {
          continue
        }
        const eventHandler: (event: any) => void = props[key]
        // It's either an event or a watch
        const eventMatch = key.match(eventRegex)
        if (eventMatch) {
          ref.$on(
            `${eventMatch[1][0].toLowerCase()}${eventMatch[1].slice(1)}`,
            eventHandler
          )
          continue
        }
        const watchMatch = key.match(watchRegex)
        if (watchMatch) {
          watchers.push([
            `${watchMatch[1][0].toLowerCase()}${watchMatch[1].slice(1)}`,
            eventHandler,
          ])
        }
      }

      if (watchers.length) {
        const update = component.current.$$.update
        component.current.$$.update = function (...updateArgs) {
          watchers.forEach(([name, callback]) => {
            if (component.current) {
              const index = component.current.$$.props[name]
              callback(component.current.$$.ctx[index])
            }
          })
          update.apply(null, updateArgs)
        }
      }
    }, [])

    useEffect(() => {
      if (component.current) {
        component.current.$set(props)
      }
    }, [props])

    useEffect(() => {
      return () => {
        if (component.current) {
          // component.current.$destroy()
        }
      }
    }, [])

    return React.createElement(tag, { ref: setRef, children: props.children })
  }
}
