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

const createSlot = (name?: string) => {
    let slot: HTMLElement;
    return {
        c() {
            slot = document.createElement("slot");
            if (name) {
                slot.setAttribute('name', name)
            }
        },
        m(target, anchor) {
            target.insertBefore(slot, anchor || null);
        },
        p(ctx, dirty) {
            console.log("Updated slot", ctx, dirty)
            // if (dirty & /*isOpen*/ 2 && t_value !== (t_value = (/*isOpen*/ ctx[1] ? 'open' : 'closed') + "")) set_data(t, t_value);
        },
        d(detaching) {
            if (detaching && slot.parentNode) {
                slot.parentNode.removeChild(slot);
            }
        }
    }
}
window['createSlot'] = createSlot

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
            const node = createSlot()
            this.component = new component({
                target: shadow,
                props: {
                    $$slots: {
                        // default: [() => node]
                    },
                    $$scope: { ctx: [] }
                }
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

            // for (const slot of shadow.querySelectorAll('slot')) {
            //     slot.addEventListener('slotchange', this.onSlotChanged)
            // }

            const updateSlots = () => {
                const slotsNames = Array.from(this.children).map(c => c.getAttribute('slot'))
                // Add default slot
                if (this.childNodes.length) slotsNames.push('');
                const slots = slotsNames
                    .reduce((prev, next) => ({ ...prev, [next]: [createSlot(next)] }), {})
                console.log("Found slots:", Object.keys(slots))
                this.component.$$set({ $$slots: slots })
            }
            new MutationObserver(updateSlots).observe(this, {
                childList: true,
                attributes: false,
                attributeOldValue: false,
                subtree: false,
                characterData: false,
                characterDataOldValue: false,
            })
            updateSlots()

            this.component.$$.bound[9] = console.log
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

        onSlotChanged(event: Event) {
            console.log('slot changed', event.target)
        }
    }

    customElements.define(name, SvelteWrapper)
}
