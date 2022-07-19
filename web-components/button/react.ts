import SvelteToReact from "../svelte-react";
import Button from './button.svelte'
import type * as PropTypes from './props'

// Prop types for a svelte component are not able to be inferred at compile-time,
// only at dev time in typescript plugins, so we must duplicate it here, manually.
// TODO: have this type definition be auto-generated in the bundler.

export type Props = {
  kind: PropTypes.ButtonKind
  size: PropTypes.ButtonSize,
  isDisabled: boolean
  isLoading: boolean
  onClick: () => unknown
}

export default SvelteToReact<Props>('leo-button', Button)
