import {
  createElement,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  type ForwardedRef,
  type PropsWithChildren,
  useState
} from 'react'
import type { SvelteComponentTyped } from 'svelte'

const eventRegex = /on([A-Z]{1,}[a-zA-Z]*)/

export type IntrinsicProps =
  | 'className'
  | 'id'
  | 'hidden'
  | 'role'
  | 'style'
  | 'tabIndex'

export type SvelteProps<T> = T extends SvelteComponentTyped<
  infer Props,
  any,
  any
>
  ? Props
  : {}
export type SvelteEvents<T> = T extends SvelteComponentTyped<
  any,
  infer Events,
  any
>
  ? Events
  : {}
export type ReactProps<Props, Events> = Props & {
  ref?: ForwardedRef<Partial<Props & HTMLElement> | undefined>
} & {
  // Note: The div here isn't important because all props in intrinsicProps are
  // available on all elements. We just want to make sure we have the correct
  // React name/value for them.
  [P in IntrinsicProps]?: JSX.IntrinsicElements['div'][P]
}

const useEventHandlers = (props: any) => {
  const [el, setEl] = useState<HTMLElement>()
  const lastValue = useRef<{ [key: string]: (...args: any[]) => any }>({})

  // Handle updating event listeners when props change
  useEffect(() => {
    if (!el) return
    for (const [key, listener] of Object.entries(props) as [
      string,
      (...args: any[]) => any
    ][]) {
      const match = eventRegex.exec(key)
      if (!match) continue

      const event = match[1].toLowerCase()
      const oldListener = lastValue.current[event]
      if (listener === oldListener) continue

      if (oldListener) el.removeEventListener(event, oldListener)
      el.addEventListener(event, listener)

      // Keep track of the last value, so we're able to add/remove it.
      lastValue.current[event] = listener
    }

    // Remove any listeners which are no longer present
    for (const removed of Object.keys(lastValue).filter(
      (k) => !props[`on${k}`]
    )) {
      el.removeEventListener(removed, lastValue.current[removed])
      delete lastValue.current[removed]
    }
  }, [props, el])

  const setElement = useCallback((el: HTMLElement | undefined) => {
    lastValue.current = {}
    setEl((oldValue) => {
      if (oldValue) {
        // Cleanup
        for (const [event, listener] of Object.entries(lastValue.current)) {
          oldValue.removeEventListener(event, listener)
        }
      }
      return el
    })
  }, [])

  return {
    setElement
  }
}

/**
 *
 * @param tag custom element tag name for svelte component
 * @param component The imported svelte component itself. This is not used, but ensures that the component's code has been included in the bundle.
 * @returns A react component
 */
export default function SvelteWebComponentToReact<
  T extends Record<string, any>
>(tag: string, component: typeof HTMLElement) {
  return forwardRef(
    (props: PropsWithChildren<T>, forwardedRef: ForwardedRef<HTMLElement>) => {
      const component = useRef<HTMLElement>()
      const { setElement } = useEventHandlers(props)

      const setRef = useCallback(
        (ref: HTMLElement) => {
          setElement(ref)

          if (!ref) {
            // Note: This will happen when the component unmounts.
            return
          }

          component.current = ref
          if (forwardedRef) {
            if (typeof forwardedRef === 'function') forwardedRef(ref)
            else forwardedRef.current = ref
          }
        },
        [setElement]
      )

      useEffect(() => {
        if (!component.current) return
        // Create a dictionary of all our properties without events. If we pass an
        // onClick prop through to Svelte, we could inadvertently set it on the
        // HTMLElement if we use <el {...$restProps}/>, which causes a Svelte to
        // setAttribute('onClick', props['onClick']). This can lead to unexpected
        // behavior, and triggers a TrustedTypes error.
        for (const [key, value] of Object.entries(props)) {
          if (eventRegex.test(key) || key === 'children') continue
          ;(component.current as any)[key] = value
        }
      }, [props])

      return createElement(tag, {
        ref: setRef,
        children: props.children
      })
    }
  )
}
