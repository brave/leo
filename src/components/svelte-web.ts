import type { SvelteComponent } from 'svelte'

interface Options {
  mode: 'open' | 'closed'
  name: string
}

// Properties with these types should be reflected to attributes.
const reflectToAttributes = new Set(['string', 'number', 'boolean'])

/**
 * This function creates a faux Svelte component which forwards WebComponent
 * slots into a Svelte slot.
 * @param name The name of the slot
 * @returns A Svelte "component" representing the slot.
 */
const createSlot = (name?: string) => {
  let slot: HTMLElement
  return {
    // Create
    c() {
      slot = document.createElement('slot')
      if (name) {
        slot.setAttribute('name', name)
      }
    },

    // Mount
    m(target, anchor) {
      target.insertBefore(slot, anchor || null)
    },

    // Props changed
    p() {},

    // Detach
    d(detaching) {
      if (detaching && slot.parentNode) {
        slot.parentNode.removeChild(slot)
      }
    }
  }
}

export default function registerWebComponent(
  component: any,
  { name, mode }: Options
) {
  if (!globalThis.customElements) {
    console.log(
      `Component ${name} not registered as there is no customElements in this environment. Perhaps this is an SSR compile, which is not supported for Leo components yet.`
    )
    return
  }

  if (customElements.get(name)) {
    console.log(`Attempted to register ${name} component multiple times.`)
    return
  }

  // Create & mount a dummy component. We use this to work out what props are
  // available and generate a list of available properties.
  const c = new component({ target: document.createElement('div') })

  // The names of all properties on our Svelte component.
  const props = Object.keys(c.$$.props)

  // A mapping of 'attributename' to 'propertyName', as attributes are
  // lowercase, while Svelte components are generally 'camelCase'.
  const attributePropMap = props.reduce((prev, next) => {
    prev.set(next.toLowerCase(), next)
    return prev
  }, new Map<string, string>())

  // We need to handle boolean attributes specially, as the presence/absence of the attribute indicates the value.
  const boolProperties = new Set<string>(
    props.filter((p) => typeof c.$$.ctx[c.$$.props[p]] === 'boolean')
  )

  // Heuristics for determining if a property is a boolean.
  const isBooleanProperty = (prop: string, value: any) =>
    typeof value === 'boolean' ||
    boolProperties.has(prop) ||
    // This check is a bit scary - not sure if there's a better way of doing
    // this though
    (value === '' && prop.startsWith('is'))

  type Callback = (...args: any[]) => void
  class SvelteWrapper extends HTMLElement {
    // A map of event name to a map of an event listener to a function for
    // removing that listener.
    // For example
    // this.listenerRemovers.get('click').get(myCallback)() will remove
    // |myCallback| from the click event.
    listenerRemovers = new Map<string, Map<Callback, Callback>>()
    #component: SvelteComponent
    get component() {
      return this.#component
    }

    set component(value) {
      // We need to make sure that when we recreate the component (as in the
      // case of slots changing) that we copy over all of the event listeners.
      this.#component = value
      for (const [event, listeners] of this.listenerRemovers.entries()) {
        for (const [callback, remover] of listeners.entries()) {
          remover()
          this.addEventListener(event, callback)
        }
      }
    }

    // We store the Svelte props in a sub object. Static props are available
    // directly on the element for ease of use, but they're getters/setters
    // forwarded to this.
    // We need this so we can proxy $$restProps to the Svelte element without
    // forwarding every conceivable property on the HTMLElement to the Svelte
    // component.
    svelteProps: { [key: string]: any }

    constructor() {
      super()

      // Mount shadow - this is where we're going to render our Component.
      // Note: In some rare cases, the shadow root might already exist,
      // especially when being rendered inside a Polymer dom-if. In this case,
      // we need to also clear the contents of the node, to ensure we don't
      // duplicate content.
      const shadow = this.shadowRoot ?? this.attachShadow({ mode })
      shadow.replaceChildren()

      let lastSlots = new Set()
      const updateSlots = () => {
        const slotsNames = Array.from(this.children).map((c) =>
          c.getAttribute('slot')
        )
        // Add default slot
        if (this.childNodes.length) slotsNames.push(undefined)

        // Slots didn't change, so nothing to do here.
        // The component needs to get created, at least once
        if (
          this.component &&
          // If the size is the same, and every one of our last slots
          // is present, then nothing has changed, and we don't need
          // to do anything here.
          lastSlots.size === slotsNames.length &&
          slotsNames.every((s) => lastSlots.has(s))
        ) {
          return
        }

        // Update the last slots we have, so if they change we know to update them.
        lastSlots = new Set(slotsNames)

        // Create a dictionary of the slotName: <slot name={slotName}/>
        const slots = slotsNames.reduce(
          (prev, next) => ({
            ...prev,
            [next ?? 'default']: [() => createSlot(next)]
          }),
          {}
        )

        // If we've already created the component, we might have some
        // existing props. We need to create a snapshot of the component
        // so we can recreate it as faithfully as possible.
        // Note: We might be able to do some additional hackery here
        // to copy over even more information from $$.ctx and exactly
        // maintain the component state!
        const existingProps = Object.keys(this.component?.$$.props ?? {})
          .map((k) => [k, this[k]])
          .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {})

        // If the component already exists, destroy it. This is,
        // unfortunately, necessary as there is no way to update slotted
        // content in the output Svelte compiles to. This is a problem
        // even when not doing crazy things:
        // https://github.com/sveltejs/svelte/issues/5312
        if (this.component) {
          this.component.$destroy()
        }

        // Finally, we actually create the component
        this.component = new component({
          // Target this shadowDOM, so we get nicely encapsulated
          // styles
          target: shadow,
          props: {
            // Copy over existing props (there might be none, if
            // this is our first render).
            ...existingProps,
            // Create WebComponent slots for each Svelte slot we
            // have content for. This has to be done at render or
            // Svelte won't support fallback content.
            $$slots: slots,
            // Not sure what this is needed for but Svelte crashes
            // without it. I think this might be related to slot
            // props:
            // https://svelte.dev/tutorial/slot-props
            $$scope: { ctx: [] }
          }
        })
      }

      // Unfortunately we need a DOMMutationObserver to let us know when
      // slotted content changes because we dynamically create & remove
      // slots. This is for two reasons:
      // 1) At runtime, we don't know what slots our Svelte component has
      // 2) Even if we did, if we generated all of the slots at mount time
      //    then Svelte would never render any of the fallback content,
      //    event if the slot was empty.
      new MutationObserver(updateSlots).observe(this, {
        childList: true,
        attributes: false,
        attributeOldValue: false,
        subtree: false,
        characterData: false,
        characterDataOldValue: false
      })

      // Update slots on create.
      updateSlots()

      const el = this
      this.svelteProps = new Proxy(
        {},
        {
          get(target, prop) {
            const contentIndex = el.component.$$.props[prop]
            return el.component.$$.ctx[contentIndex] ?? target[prop]
          },
          set(target, prop, value) {
            if (typeof prop === 'symbol')
              throw new Error('Symbol properties are not supported')
            target[prop] = value

            if (reflectToAttributes.has(typeof value)) {
              // Boolean attributes are special - presence/absence indicates
              // value, rather than actual value.
              if (isBooleanProperty(prop, value)) {
                if (value) el.setAttribute(prop, '')
                else el.removeAttribute(prop)
              } else el.setAttribute(prop, value)
            }

            // |.$set| updates the value of a prop. Note: This only works for
            // props, not slotted content.
            el.component.$set({ [prop]: value })
            return true
          }
        }
      )

      // For some reason setting this on |SvelteWrapper| doesn't work properly.
      for (const prop of props) {
        Object.defineProperty(this, prop, {
          enumerable: true,
          get() {
            // $$.props is { [propertyName: string]: number } where the number
            // is the array index into $$.ctx that the value is stored in.
            return this.svelteProps[prop]
          },
          set(value) {
            this.svelteProps[prop] = value
          }
        })
      }

      // Unfortunately we can't use observedAttributes, like normal citizens of
      // the web because we need to support $$restProps, which are dynamic. Thus
      // we end up in this weird situation where we need:
      // 1. A MutationObserver to tell us when props change
      // 2. To manually initialize the props from the attributes (as the
      // MutationObserver) won't fire until we've connected.
      const applyAttribute = (attr, value) => {
        const prop = attributePropMap.get(attr) ?? attr
        this.svelteProps[prop] = isBooleanProperty(prop, value)
          ? value !== null
          : value
      }

      new MutationObserver((m) => {
        for (const mutation of m) {
          const value = this.getAttribute(mutation.attributeName)
          if (value === mutation.oldValue) continue
          applyAttribute(mutation.attributeName, value)
        }
      }).observe(this, {
        childList: false,
        attributes: true,
        attributeOldValue: true,
        subtree: false,
        characterData: false,
        characterDataOldValue: false
      })

      for (const attr of this.getAttributeNames()) {
        applyAttribute(attr, this.getAttribute(attr))
      }
    }

    addEventListener(event: string, callback: Callback) {
      if (!this.listenerRemovers.has(event)) {
        this.listenerRemovers.set(event, new Map())
      }

      // Note: $on(<event>, callback) returns a function which removes the
      // callback from the event.
      const remover = this.component.$on(event, callback)

      // We store the remover so we can look it up in |removeEventListener|.
      this.listenerRemovers.get(event).set(callback, remover)

      // TODO: We could do this but we don't know if the event is handled
      // by the component or not so we could end up triggering the event
      // twice (i.e. in the case of 'click')
      // super.addEventListener(event, callback, options)
    }

    removeEventListener(event: string, callback: Callback) {
      this.listenerRemovers.get(event)?.get(callback)?.()
      this.listenerRemovers.get(event)?.delete(callback)
    }
  }

  customElements.define(name, SvelteWrapper)
}
