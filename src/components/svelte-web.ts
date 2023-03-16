interface Options {
    mode: 'open' | 'closed'
    name: string
    attributes: string
}

export default function registerWebComponent(component: ConstructorOfATypedSvelteComponent, { name, mode }: Options) {
    class SvelteWrapper extends HTMLElement {
        constructor() {
            super()

            const shadow = this.attachShadow({ mode })
            new component({
                target: shadow
            })
        }
    }

    customElements.define(name, SvelteWrapper)
}
