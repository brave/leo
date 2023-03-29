# Components

Leo's components are written in Svelte and compiled/wrapped into other formats.

Currently, the supported formats are:
- Web Components (via the wrapper in [svelte-web.ts](svelte-web.ts))
- React (via the wrapper in [svelte-react.ts](svelte-react.ts))

## Component Creation

To create a new component, simply add a new subfolder to `components`. Any non
story Svelte file will be treated as a component. Most folders contain just a
single component (`button`, `label`) but others may contain multiple (`progress`
has a `ring` and a `bar` component).

When compiled, all components are lifted up to the same folder, so names should
be unique between folders. This is to make imports nicer, as you can import your
preferred component from `@brave/leo/react/button` instead of `@brave/leo/react/button/button`.

### Example Component

```svelte
<!-- in src/components/my-cool-component/my-cool-component.svelte -->
<script lang="ts">
    // Svelte knows this is a string, and our type definitions will be
    // generated in `/svelte/my-cool-component/my-cool-component.svelte.d.ts`.
    export let greeting = "Hello";
</script>

<div class="greet">
    <!-- Slots let us pass in child elements. See the Svelte docs for detail -->
    {greeting}, <slot>world</slot>!
</div>

<style>
    .greet { color: red; /* all the best text is red */ }
</style>
```

Now we've finished our super useful component, we should build our component

    npm run build

alternatively, if you're working on a component you can use the `dev` command,
which will automatically recompile changes:

    npm run dev


Our new component can now be used from any of our supported platforms:

```svelte
<!-- svelte -->
<script lang="ts">
    import MyCoolComponent from 'src/component/my-cool-component/my-cool-component.svelte'
</script>

<MyCoolComponent greeting="Kia ora">NZ</MyCoolComponent>
```

```html
<!-- Plain HTML -->
<leo-my-cool-component greeting="Kia ora">NZ</leo-my-cool-component>
<script type="module">
    import 'web-components/my-cool-component.js'
</script>
<!-- or alternatively -->
<script type="module" src="web-components/my-cool-component.js>
```

```jsx
// react
import MyCoolComponent from 'react/my-cool-component'

export default function Component() {
    return <MyCoolComponent greeting="Kia ora">NZ</MyCoolComponent>
}
```

## Web Component Caveats
- Only `string`/`boolean`/`number` props are reflected to attributes
- Events do not bubble up from the component, like normal HTML events do
- Changing the value of the `slotted` content will cause an unmount/mount of
    the component. This is a limitation of Svelte (but it may get fixed in V4).
    This means it is possible to lose internal component state while
    adding/removing props (though I suspect in future we'll have a workaround
    for this 2023-03-29).

## React Components
- React Components are a wrapper around the web components.
- properties with a `on` prefix are converted into event handlers, in an effort
    to provide more seamless interop with React
- Some intrinsic props (such as `className`, `id`, `hidden` and the like) are
    set directly on the customElement, rather than being passed through as a
    prop. Again, this is to try and behave more like a native component.
- `refs` are supported, if you need a ref to the underlying web component.

Both web components & react components forward all `<script context="module">`
exports, so they should be available as non-default imports.
