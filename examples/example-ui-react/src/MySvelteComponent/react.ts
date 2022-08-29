import SvelteToReact from "../../../../web-components/svelte-react";
import Button from './button.svelte'

// Prop types for a svelte component are not able to be inferred at compile-time,
// only at dev time in typescript plugins, so we must duplicate it here, manually.
// TODO: have this type definition be auto-generated in the bundler.

export interface HelloEvent extends CustomEvent<{
  text: string
}> {}

export type Props = {
  button_text: string
  onHello: (e: HelloEvent) => unknown
}
export default SvelteToReact('leo-demo-button', Button)
