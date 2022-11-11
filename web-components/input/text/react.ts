import SvelteToReact, { ReactProps } from "../../svelte-react";
import TextInput from './text.svelte'
import type { TextInputEvents, TextInputProps } from './text.svelte'

// Prop types for a svelte component are not able to be inferred at compile-time,
// only at dev time in typescript plugins, so we must duplicate it here, manually.
// TODO: have this type definition be auto-generated in the bundler.

export default SvelteToReact<ReactProps<TextInputProps, TextInputEvents>>('leo-text-input', TextInput)
