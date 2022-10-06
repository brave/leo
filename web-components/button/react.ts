import SvelteToReact, { ReactProps } from '../svelte-react';
import Button from './button.svelte';
import type { ButtonEvents, ButtonProps } from './button.svelte';

export default SvelteToReact<ReactProps<ButtonProps, ButtonEvents>>('leo-button', Button);