import type { SvelteComponent } from 'svelte'

interface Options {
    mode: 'open' | 'closed'
    name: string
    attributes: string
}

const reflectToAttributes = new Set([
    'string',
    'number',
    'boolean'
])

export default function registerWebComponent(component: any, { name, mode }: Options) {
    const c = new component({ target: document.createElement('div') }) as any
    const props = Object.keys(c.$$.props)
    const attributePropMap = new Map<string, string>();
    for (const prop of props) {
        attributePropMap.set(prop.toLowerCase(), prop);
    }
    const attributes = Array.from(attributePropMap.keys())

    class SvelteWrapper extends HTMLElement {
        component: SvelteComponent

        static get observedAttributes() {
            return attributes;
        }

        constructor() {
            super()

            const shadow = this.attachShadow({ mode })
            this.component = new component({
                target: shadow
            })

            // For some reason setting this on |SvelteWrapper| doesn't work properly.
            for (const prop of props) {
                Object.defineProperty(this, prop, {
                    enumerable: true,
                    get() {
                        const contextIndex = c.$$.props[prop]
                        return this.component.$$.ctx[contextIndex]
                    },
                    set(value) {
                        if (reflectToAttributes.has(typeof value)) {
                            this.setAttribute(prop, value)
                        }
                        this.component.$$set({ [prop]: value })
                    }
                })
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return
            this[name] = newValue
        }

        addEventListener(event: string, callback: (...args) => void, options: any) {
            this.component.$on(event, callback)

            // TODO: We could do this but we don't know if the event is handled
            // by the component or not so we could end up triggering the event
            // twice (i.e. in the case of 'click')
            // super.addEventListener(event, callback, options)
        }
    }

    customElements.define(name, SvelteWrapper)
}
